"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Check, AlertCircle, Globe, User, Zap } from "lucide-react"
import { MiniKit, VerificationLevel, type MiniAppVerifyActionPayload } from "@worldcoin/minikit-js"

interface WorldIDHumanVerificationProps {
  onSuccess: (worldId: string, userInfo: any) => void
  onDeveloperMode: () => void
}

export function WorldIDHumanVerification({ onSuccess, onDeveloperMode }: WorldIDHumanVerificationProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isMiniKitReady, setIsMiniKitReady] = useState(false)
  const [debugInfo, setDebugInfo] = useState<any>({})

  useEffect(() => {
    // Check if we're in the World App
    if (typeof window === "undefined") return

    const userAgent = navigator.userAgent
    const isWorldApp = userAgent.includes("WorldApp") || typeof (window as any).WorldApp !== "undefined"

    setDebugInfo({
      userAgent,
      isWorldApp,
      url: window.location.href,
    })

    if (!isWorldApp) {
      setError("This app must be opened in the World App for human verification")
      return
    }

    try {
      // Initialize MiniKit
      MiniKit.install()
      setIsMiniKitReady(true)
      console.log("MiniKit installed successfully")
    } catch (err: any) {
      console.error("MiniKit installation error:", err)
      setError(`MiniKit error: ${err.message}`)
    }
  }, [])

  const handleHumanVerification = async () => {
    if (!isMiniKitReady) {
      setError("MiniKit is not ready. Please ensure you're using the World App.")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      console.log("Starting World ID human verification...")

      // Use the verify command (the only one that works)
      const verifyPayload: MiniAppVerifyActionPayload = {
        action: process.env.NEXT_PUBLIC_WORLDCOIN_ACTION || "verify",
        signal: `worldfan_user_${Date.now()}`,
        verification_level: VerificationLevel.Device, // Start with device, can upgrade to Orb
      }

      console.log("Verification payload:", verifyPayload)

      // Use the verify command that actually exists
      const verifyResponse = await MiniKit.commands.verify(verifyPayload)

      console.log("MiniKit verify response:", verifyResponse)

      if (verifyResponse.success) {
        // Send to our backend for verification
        const backendResponse = await fetch("/api/worldid/verify-human", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            payload: verifyPayload,
            proof: verifyResponse.proof,
            merkle_root: verifyResponse.merkle_root,
            nullifier_hash: verifyResponse.nullifier_hash,
            verification_level: verifyResponse.verification_level,
          }),
        })

        const backendResult = await backendResponse.json()
        console.log("Backend verification result:", backendResult)

        if (backendResult.success) {
          setIsVerified(true)
          setIsLoading(false)

          // Create user data tied to World ID
          const userData = {
            worldId: backendResult.nullifier_hash,
            nullifierHash: backendResult.nullifier_hash,
            verificationLevel: backendResult.verification_level,
            isHumanVerified: true,
            verifiedAt: new Date().toISOString(),
            platform: "worldid",
            // Default preferences that can be updated in dashboard
            username: `worldfan_${backendResult.nullifier_hash.slice(-6)}`,
            email: "",
            genres: [],
            cities: [],
            favoriteArtists: "",
            ticketStruggles: "",
            priceRange: "$50-150",
            notifications: true,
          }

          setTimeout(() => {
            onSuccess(backendResult.nullifier_hash, userData)
          }, 1000)
        } else {
          throw new Error(backendResult.error || "Backend verification failed")
        }
      } else {
        throw new Error(verifyResponse.error || "World ID verification failed")
      }
    } catch (err: any) {
      console.error("Human verification error:", err)
      setIsLoading(false)
      setError(err.message || "Human verification failed. Please try again.")
    }
  }

  if (!isMiniKitReady && !error) {
    return (
      <>
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Globe className="w-8 h-8 text-white" />
          </div>
          <CardTitle>Initializing Human Verification</CardTitle>
          <CardDescription>Setting up World ID for unique human verification...</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto" />
        </CardContent>
      </>
    )
  }

  return (
    <>
      <CardHeader className="text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="w-8 h-8 text-white" />
        </div>
        <CardTitle>Verify You're Human</CardTitle>
        <CardDescription>
          Use World ID to prove you're a unique human and access World Fan's exclusive music experiences
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4">
          <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
            <Shield className="w-5 h-5 text-green-600" />
            <div>
              <p className="font-medium text-green-900">Unique Human Verification</p>
              <p className="text-sm text-green-700">Proves you're a real person, not a bot or duplicate account</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
            <Check className="w-5 h-5 text-blue-600" />
            <div>
              <p className="font-medium text-blue-900">Privacy Protected</p>
              <p className="text-sm text-blue-700">Your identity stays private, we only verify uniqueness</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
            <User className="w-5 h-5 text-purple-600" />
            <div>
              <p className="font-medium text-purple-900">Fair Access</p>
              <p className="text-sm text-purple-700">Prevents scalpers and ensures fair ticket distribution</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <div>
              <p className="font-medium text-red-900">Verification Error</p>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        <div className="text-center space-y-3">
          {!isVerified ? (
            <>
              <Button
                onClick={handleHumanVerification}
                disabled={isLoading || !isMiniKitReady}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Verifying Human...
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4 mr-2" />
                    Verify I'm Human
                  </>
                )}
              </Button>

              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Having trouble with World ID?</p>
                <Button onClick={onDeveloperMode} variant="outline" size="sm">
                  <Zap className="w-4 h-4 mr-2" />
                  Continue with Developer Mode
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-green-600 font-medium">Human Verification Complete!</p>
              <p className="text-sm text-gray-600">Welcome to World Fan...</p>
            </div>
          )}
        </div>

        <div className="text-xs text-gray-500 text-center">
          <p>
            By verifying with World ID, you agree to our{" "}
            <a href="#" className="text-purple-600 hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-purple-600 hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </CardContent>
    </>
  )
}
