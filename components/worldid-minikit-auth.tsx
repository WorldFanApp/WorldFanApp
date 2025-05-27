"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Check, AlertCircle, Globe } from "lucide-react"
import { MiniKit, VerificationLevel, type MiniAppVerifyActionPayload } from "@worldcoin/minikit-js"

interface WorldIDMiniKitAuthProps {
  onSuccess: (worldId: string, userInfo: any) => void
}

export function WorldIDMiniKitAuth({ onSuccess }: WorldIDMiniKitAuthProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isMiniKitReady, setIsMiniKitReady] = useState(false)

  useEffect(() => {
    // Initialize MiniKit
    if (!MiniKit.isInstalled()) {
      setError("This app must be opened in the World App")
      return
    }

    // Install MiniKit
    MiniKit.install()
    setIsMiniKitReady(true)

    console.log("MiniKit installed successfully")
  }, [])

  const handleWorldIDSignIn = async () => {
    if (!isMiniKitReady) {
      setError("MiniKit is not ready. Please ensure you're using the World App.")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      console.log("Starting World ID verification with MiniKit...")

      const verifyPayload: MiniAppVerifyActionPayload = {
        action: "world_fan_signup",
        signal: "world_fan_user_" + Date.now(),
        verification_level: VerificationLevel.Orb,
      }

      console.log("Verification payload:", verifyPayload)

      const verifyResponse = await MiniKit.commandsAsync.verify(verifyPayload)

      console.log("MiniKit verify response:", verifyResponse)

      if (verifyResponse.success) {
        // Verify the proof on the server
        const serverResponse = await fetch("/api/worldid/verify-minikit", {
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

        const serverResult = await serverResponse.json()

        if (serverResult.success) {
          setIsVerified(true)
          setIsLoading(false)

          setTimeout(() => {
            onSuccess(serverResult.nullifier_hash, {
              nullifier_hash: serverResult.nullifier_hash,
              verification_level: serverResult.verification_level,
              timestamp: new Date().toISOString(),
              platform: "minikit",
            })
          }, 1000)
        } else {
          throw new Error(serverResult.error || "Server verification failed")
        }
      } else {
        throw new Error(verifyResponse.error || "World ID verification failed")
      }
    } catch (err: any) {
      console.error("World ID verification error:", err)
      setIsLoading(false)
      setError(err.message || "World ID verification failed. Please try again.")
    }
  }

  if (!isMiniKitReady && !error) {
    return (
      <>
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Globe className="w-8 h-8 text-white" />
          </div>
          <CardTitle>Initializing World ID</CardTitle>
          <CardDescription>Setting up MiniKit for World ID verification...</CardDescription>
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
          <Globe className="w-8 h-8 text-white" />
        </div>
        <CardTitle>Sign in with World ID</CardTitle>
        <CardDescription>
          Verify your identity with World ID to access World Fan's exclusive music experiences
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4">
          <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
            <Shield className="w-5 h-5 text-green-600" />
            <div>
              <p className="font-medium text-green-900">Privacy Protected</p>
              <p className="text-sm text-green-700">Your identity stays private, we only verify you're human</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
            <Check className="w-5 h-5 text-blue-600" />
            <div>
              <p className="font-medium text-blue-900">Anti-Bot Protection</p>
              <p className="text-sm text-blue-700">Prevents scalpers and bots from accessing fair-priced tickets</p>
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

        <div className="text-center">
          {!isVerified ? (
            <Button
              onClick={handleWorldIDSignIn}
              disabled={isLoading || !isMiniKitReady}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              size="lg"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Verifying with World ID...
                </>
              ) : (
                <>
                  <Globe className="w-4 h-4 mr-2" />
                  Sign in with World ID
                </>
              )}
            </Button>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-green-600 font-medium">World ID Verification Complete!</p>
              <p className="text-sm text-gray-600">Welcome to World Fan...</p>
            </div>
          )}
        </div>

        <div className="text-xs text-gray-500 text-center">
          <p>
            By signing in with World ID, you agree to our{" "}
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
