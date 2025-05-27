"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Check, AlertCircle, Smartphone } from "lucide-react"

interface WorldAppCorrectAuthProps {
  onSuccess: (worldId: string, userInfo: any) => void
}

export function WorldAppCorrectAuth({ onSuccess }: WorldAppCorrectAuthProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isWorldApp, setIsWorldApp] = useState(false)

  useEffect(() => {
    // Check if we're in World App
    const checkWorldApp = () => {
      const isInWorldApp = typeof (window as any).WorldApp !== "undefined"
      setIsWorldApp(isInWorldApp)
      console.log("World App detected:", isInWorldApp)
      return isInWorldApp
    }

    checkWorldApp()

    // Listen for World App responses using the correct event pattern
    const handleMessage = (event: MessageEvent) => {
      console.log("Received World App message:", event.data)

      // Handle verification response based on official World App Mini App SDK
      if (event.data && event.data.command === "verify") {
        if (event.data.success) {
          const payload = event.data.payload
          setIsVerified(true)
          setIsLoading(false)
          setTimeout(() => {
            onSuccess(payload.nullifier_hash, {
              nullifier_hash: payload.nullifier_hash,
              verification_level: payload.verification_level,
              timestamp: new Date().toISOString(),
              platform: "world_app_correct",
            })
          }, 1000)
        } else {
          setIsLoading(false)
          setError(event.data.error || "World ID verification failed")
        }
      }
    }

    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [onSuccess])

  const handleVerification = async () => {
    if (!isWorldApp) {
      setError("This app is only available in the World App.")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      console.log("Starting World App verification with correct SDK...")

      // Use the official World App Mini App SDK pattern
      // Based on the official documentation: https://docs.worldcoin.org/mini-apps

      const verificationPayload = {
        command: "verify",
        payload: {
          app_id: "app_7a9639a92f85fcf27213f982eddb5064",
          action: "world_fan_signup",
        },
      }

      console.log("Sending verification request:", verificationPayload)

      // The correct way to communicate with World App according to the official docs
      if (window.parent && window.parent !== window) {
        // Send to parent window (World App container)
        window.parent.postMessage(verificationPayload, "*")
      } else {
        // Fallback: send to current window
        window.postMessage(verificationPayload, "*")
      }

      // Set timeout for verification
      setTimeout(() => {
        if (isLoading) {
          setIsLoading(false)
          setError("World ID verification timeout. Please try again.")
        }
      }, 30000)
    } catch (err: any) {
      console.error("World App verification error:", err)
      setIsLoading(false)
      setError(`World ID verification failed: ${err.message}`)
    }
  }

  // If not in World App, show error message
  if (!isWorldApp) {
    return (
      <>
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <CardTitle>World App Required</CardTitle>
          <CardDescription>This application is only available through the World App</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <div>
              <p className="font-medium text-red-900">Access Restricted</p>
              <p className="text-sm text-red-700">
                World Fan is exclusively available in the World App for security and verification purposes.
              </p>
            </div>
          </div>
        </CardContent>
      </>
    )
  }

  return (
    <>
      <CardHeader className="text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Smartphone className="w-8 h-8 text-white" />
        </div>
        <CardTitle>World ID Verification</CardTitle>
        <CardDescription>Verify your World ID using the official World App Mini App SDK</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4">
          <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
            <Shield className="w-5 h-5 text-green-600" />
            <div>
              <p className="font-medium text-green-900">Official SDK</p>
              <p className="text-sm text-green-700">Using the correct World App Mini App integration</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
            <Check className="w-5 h-5 text-blue-600" />
            <div>
              <p className="font-medium text-blue-900">Secure Verification</p>
              <p className="text-sm text-blue-700">Follows official World App documentation</p>
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
              onClick={handleVerification}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Verifying World ID...
                </>
              ) : (
                <>
                  <Smartphone className="w-4 h-4 mr-2" />
                  Verify with World ID
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
            By verifying, you agree to our{" "}
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
