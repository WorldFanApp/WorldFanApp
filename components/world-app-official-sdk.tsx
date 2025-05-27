"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Check, AlertCircle, Smartphone } from "lucide-react"

interface WorldAppOfficialSDKProps {
  onSuccess: (worldId: string, userInfo: any) => void
}

export function WorldAppOfficialSDK({ onSuccess }: WorldAppOfficialSDKProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Official World App Mini App SDK event listener
    const handleWorldAppMessage = (event: MessageEvent) => {
      console.log("World App SDK message:", event.data)

      // Official response format from World App
      if (event.data?.command === "verify") {
        if (event.data.success && event.data.payload) {
          const { nullifier_hash, verification_level } = event.data.payload
          setIsVerified(true)
          setIsLoading(false)

          setTimeout(() => {
            onSuccess(nullifier_hash, {
              nullifier_hash,
              verification_level,
              timestamp: new Date().toISOString(),
              platform: "world_app_official_sdk",
            })
          }, 1000)
        } else {
          setIsLoading(false)
          setError(event.data.error || "World ID verification failed")
        }
      }
    }

    window.addEventListener("message", handleWorldAppMessage)
    return () => window.removeEventListener("message", handleWorldAppMessage)
  }, [onSuccess])

  const triggerWorldIDVerification = () => {
    setIsLoading(true)
    setError(null)

    // Official World App Mini App SDK command structure
    const command = {
      command: "verify",
      payload: {
        app_id: "app_7a9639a92f85fcf27213f982eddb5064",
        action: "world_fan_signup",
      },
    }

    console.log("Sending World App command:", command)

    // Send command to World App parent frame
    if (window.parent) {
      window.parent.postMessage(command, "*")
    }

    // Timeout handling
    setTimeout(() => {
      if (isLoading) {
        setIsLoading(false)
        setError("Verification request timed out. Please try again.")
      }
    }, 30000)
  }

  return (
    <>
      <CardHeader className="text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Smartphone className="w-8 h-8 text-white" />
        </div>
        <CardTitle>Official World App SDK</CardTitle>
        <CardDescription>Using the official World App Mini App SDK for World ID verification</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4">
          <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
            <Shield className="w-5 h-5 text-green-600" />
            <div>
              <p className="font-medium text-green-900">Official Integration</p>
              <p className="text-sm text-green-700">Following World App Mini App documentation</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
            <Check className="w-5 h-5 text-blue-600" />
            <div>
              <p className="font-medium text-blue-900">Verified Pattern</p>
              <p className="text-sm text-blue-700">Uses documented command structure</p>
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
              onClick={triggerWorldIDVerification}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Requesting World ID Verification...
                </>
              ) : (
                <>
                  <Smartphone className="w-4 h-4 mr-2" />
                  Verify with World ID (Official SDK)
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
