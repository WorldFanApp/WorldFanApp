"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Check, AlertCircle, Smartphone } from "lucide-react"

interface WorldAppSDKAuthProps {
  onSuccess: (worldId: string, userInfo: any) => void
}

export function WorldAppSDKAuth({ onSuccess }: WorldAppSDKAuthProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Listen for World App responses
    const handleMessage = (event: MessageEvent) => {
      console.log("Received World App message:", event.data)

      // Handle verification success
      if (event.data.command === "verify" && event.data.success) {
        setIsVerified(true)
        setIsLoading(false)
        setTimeout(() => {
          onSuccess(event.data.payload.nullifier_hash, {
            nullifier_hash: event.data.payload.nullifier_hash,
            verification_level: event.data.payload.verification_level,
            timestamp: new Date().toISOString(),
            platform: "world_app_sdk",
          })
        }, 1000)
      }
      // Handle verification error
      else if (event.data.command === "verify" && !event.data.success) {
        setIsLoading(false)
        setError(event.data.error || "World ID verification failed")
      }
    }

    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [onSuccess])

  const handleVerification = () => {
    setIsLoading(true)
    setError(null)

    // Send verification request using World App Mini App SDK format
    const message = {
      command: "verify",
      payload: {
        app_id: "app_7a9639a92f85fcf27213f982eddb5064",
        action: "world_fan_signup",
      },
    }

    console.log("Sending World App verification request:", message)

    // Send to World App
    if (window.parent && window.parent !== window) {
      window.parent.postMessage(message, "*")
    } else {
      window.postMessage(message, "*")
    }

    // Timeout after 30 seconds
    setTimeout(() => {
      if (isLoading) {
        setIsLoading(false)
        setError("Verification timeout. Please try again.")
      }
    }, 30000)
  }

  return (
    <>
      <CardHeader className="text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Smartphone className="w-8 h-8 text-white" />
        </div>
        <CardTitle>World ID Verification (SDK)</CardTitle>
        <CardDescription>Using World App Mini App SDK for verification</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4">
          <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
            <Shield className="w-5 h-5 text-green-600" />
            <div>
              <p className="font-medium text-green-900">SDK Integration</p>
              <p className="text-sm text-green-700">Using official World App Mini App SDK</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
            <Check className="w-5 h-5 text-blue-600" />
            <div>
              <p className="font-medium text-blue-900">Simplified Flow</p>
              <p className="text-sm text-blue-700">Direct postMessage communication</p>
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
                  Requesting World ID...
                </>
              ) : (
                <>
                  <Smartphone className="w-4 h-4 mr-2" />
                  Verify with World ID (SDK)
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
      </CardContent>
    </>
  )
}
