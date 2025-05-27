"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Check, AlertCircle, Globe } from "lucide-react"
import { MiniKit, ResponseEvent } from "@worldcoin/minikit-js"

interface WorldIDMiniKitSignInProps {
  onSuccess: (worldId: string, userInfo: any) => void
}

export function WorldIDMiniKitSignIn({ onSuccess }: WorldIDMiniKitSignInProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userData, setUserData] = useState<any>(null)

  useEffect(() => {
    // Initialize MiniKit
    MiniKit.install()

    // Listen for World ID sign-in response
    MiniKit.subscribe(ResponseEvent.MiniAppSignIn, (response) => {
      console.log("MiniKit sign-in response:", response)

      if (response.status === "success") {
        setIsVerified(true)
        setIsLoading(false)
        setUserData(response.payload)

        setTimeout(() => {
          onSuccess(response.payload.nullifier_hash || "minikit_user_" + Date.now(), {
            nullifier_hash: response.payload.nullifier_hash,
            verification_level: response.payload.verification_level,
            timestamp: new Date().toISOString(),
            platform: "minikit_signin",
            payload: response.payload,
          })
        }, 1000)
      } else {
        console.error("Sign-in failed:", response.error)
        setIsLoading(false)
        setError(response.error || "World ID sign-in failed")
      }
    })

    // Cleanup subscription on unmount
    return () => {
      MiniKit.unsubscribe(ResponseEvent.MiniAppSignIn)
    }
  }, [onSuccess])

  const handleSignIn = () => {
    if (MiniKit.isInstalled()) {
      setIsLoading(true)
      setError(null)

      console.log("Starting MiniKit sign-in...")

      MiniKit.commands.signIn({
        action: "world_fan_signup", // Action name from Worldcoin Developer Portal
        app_id: "app_7a9639a92f85fcf27213f982eddb5064", // Your app_id
      })
    } else {
      setError("Please open this app in the World App to sign in.")
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
              <p className="font-medium text-red-900">Sign-in Error</p>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Debug info for development */}
        {userData && (
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs font-medium text-gray-700 mb-2">Verification Data:</p>
            <pre className="text-xs text-gray-600 overflow-auto">{JSON.stringify(userData, null, 2)}</pre>
          </div>
        )}

        <div className="text-center">
          {!isVerified ? (
            <Button
              onClick={handleSignIn}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              size="lg"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Signing in with World ID...
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
              <p className="text-green-600 font-medium">World ID Sign-in Complete!</p>
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
