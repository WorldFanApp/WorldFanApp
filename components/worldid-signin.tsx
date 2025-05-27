"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Check, AlertCircle, Globe } from "lucide-react"

interface WorldIDSignInProps {
  onSuccess: (worldId: string, userInfo: any) => void
}

export function WorldIDSignIn({ onSuccess }: WorldIDSignInProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Listen for World ID verification responses
    const handleMessage = (event: MessageEvent) => {
      console.log("Received World ID message:", event.data)

      // Handle successful verification
      if (event.data && event.data.command === "verify" && event.data.success) {
        const payload = event.data.payload
        setIsVerified(true)
        setIsLoading(false)

        setTimeout(() => {
          onSuccess(payload.nullifier_hash, {
            nullifier_hash: payload.nullifier_hash,
            verification_level: payload.verification_level,
            timestamp: new Date().toISOString(),
            platform: "world_app",
          })
        }, 1000)
      }
      // Handle verification error
      else if (event.data && event.data.command === "verify" && !event.data.success) {
        setIsLoading(false)
        setError(event.data.error || "World ID verification failed")
      }
    }

    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [onSuccess])

  const handleWorldIDSignIn = async () => {
    setIsLoading(true)
    setError(null)

    try {
      console.log("Initiating World ID verification...")

      // Send World ID verification request
      const verificationRequest = {
        command: "verify",
        payload: {
          app_id: "app_7a9639a92f85fcf27213f982eddb5064",
          action: "world_fan_signup",
        },
      }

      console.log("Sending verification request:", verificationRequest)

      // Send to World App parent window
      if (window.parent && window.parent !== window) {
        window.parent.postMessage(verificationRequest, "*")
      } else {
        // Fallback: send to current window
        window.postMessage(verificationRequest, "*")
      }

      // Set timeout for verification
      setTimeout(() => {
        if (isLoading) {
          setIsLoading(false)
          setError("World ID verification timeout. Please try again or contact support if the issue persists.")
        }
      }, 30000)
    } catch (err: any) {
      console.error("World ID verification error:", err)
      setIsLoading(false)
      setError("World ID verification failed. Please try again.")
    }
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
              disabled={isLoading}
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
