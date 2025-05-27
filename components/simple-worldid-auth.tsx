"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Globe, Shield, Check } from "lucide-react"

interface SimpleWorldIDAuthProps {
  onSuccess: (worldId: string, userInfo: any) => void
}

export function SimpleWorldIDAuth({ onSuccess }: SimpleWorldIDAuthProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isVerified, setIsVerified] = useState(false)

  const handleContinue = () => {
    setIsLoading(true)

    // Simulate verification process
    setTimeout(() => {
      setIsVerified(true)
      setIsLoading(false)

      setTimeout(() => {
        onSuccess("world_fan_user_" + Date.now(), {
          verification_level: "orb",
          timestamp: new Date().toISOString(),
          app_id: "app_7a9639a92f85fcf27213f982eddb5064",
        })
      }, 1000)
    }, 2000)
  }

  return (
    <>
      <CardHeader className="text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Globe className="w-8 h-8 text-white" />
        </div>
        <CardTitle>Join World Fan</CardTitle>
        <CardDescription>
          Welcome to World Fan! Continue to access exclusive music experiences and fair ticket pricing.
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

        <div className="text-center">
          {!isVerified ? (
            <Button
              onClick={handleContinue}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Setting up your account...
                </>
              ) : (
                <>
                  <Globe className="w-4 h-4 mr-2" />
                  Continue to World Fan
                </>
              )}
            </Button>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-green-600 font-medium">Welcome to World Fan!</p>
              <p className="text-sm text-gray-600">Setting up your profile...</p>
            </div>
          )}
        </div>

        <div className="text-xs text-gray-500 text-center">
          By continuing, you agree to our{" "}
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
