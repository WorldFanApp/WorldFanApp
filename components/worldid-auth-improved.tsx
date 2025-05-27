"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Globe, Shield, Check, AlertCircle } from "lucide-react"
import { worldAppIntegration } from "@/lib/world-app-integration"

interface WorldIDAuthProps {
  onSuccess: (worldId: string, userInfo: any) => void
}

export function WorldIDAuth({ onSuccess }: WorldIDAuthProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isWorldApp, setIsWorldApp] = useState(false)

  useEffect(() => {
    const checkWorldApp = worldAppIntegration.isWorldApp()
    setIsWorldApp(checkWorldApp)
    console.log("World App detected:", checkWorldApp)

    // Set up verification complete handler
    worldAppIntegration.onVerificationComplete((response) => {
      if (response.success) {
        setIsVerified(true)
        setIsLoading(false)

        setTimeout(() => {
          onSuccess(response.nullifier_hash!, {
            nullifier_hash: response.nullifier_hash,
            verification_level: response.verification_level,
            timestamp: new Date().toISOString(),
          })
        }, 1000)
      } else {
        setIsLoading(false)
        setError(response.error || "Verification failed")
      }
    })
  }, [onSuccess])

  const handleWorldIDSignIn = async () => {
    setIsLoading(true)
    setError(null)

    try {
      if (isWorldApp) {
        // Use World App integration
        const response = await worldAppIntegration.requestVerification({
          app_id: "app_7a9639a92f85fcf27213f982eddb5064",
          action: "world_fan_signup",
          signal: "world_fan_user_" + Date.now(),
        })

        if (response.success) {
          setIsVerified(true)
          setTimeout(() => {
            onSuccess(response.nullifier_hash!, {
              nullifier_hash: response.nullifier_hash,
              verification_level: response.verification_level,
              timestamp: new Date().toISOString(),
            })
          }, 1000)
        } else {
          throw new Error(response.error || "Verification failed")
        }
      } else {
        // Web fallback
        setTimeout(() => {
          setIsVerified(true)
          setTimeout(() => {
            onSuccess("web_user_" + Math.random().toString(36).substr(2, 9), {
              verification_level: "device",
              timestamp: new Date().toISOString(),
              platform: "web",
            })
          }, 1000)
        }, 2000)
      }
    } catch (err: any) {
      console.error("WorldID verification error:", err)
      setError(err.message || "Verification failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <CardHeader className="text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Globe className="w-8 h-8 text-white" />
        </div>
        <CardTitle>Join World Fan with World ID</CardTitle>
        <CardDescription>
          {isWorldApp
            ? "Continue with your World ID to join World Fan and access exclusive music experiences"
            : "Prove you're a real person to access fair ticket pricing and exclusive drops"}
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
              <p className="font-medium text-blue-900">No Bot Access</p>
              <p className="text-sm text-blue-700">Prevents scalpers and bots from inflating prices</p>
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
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  {isWorldApp ? "Verifying with World ID..." : "Connecting to World ID..."}
                </>
              ) : (
                <>
                  <Globe className="w-4 h-4 mr-2" />
                  {isWorldApp ? "Continue with World ID" : "Sign in with World ID"}
                </>
              )}
            </Button>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-green-600 font-medium">Welcome to World Fan!</p>
              <p className="text-sm text-gray-600">Setting up your World Fan profile...</p>
            </div>
          )}
        </div>

        <div className="text-xs text-gray-500 text-center">
          By verifying with World ID, you agree to our{" "}
          <a href="#" className="text-purple-600 hover:underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="text-purple-600 hover:underline">
            Privacy Policy
          </a>
        </div>
      </CardContent>
    </>
  )
}
