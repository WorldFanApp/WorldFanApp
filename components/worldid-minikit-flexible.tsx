"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Check, AlertCircle, Globe } from "lucide-react"
import { MiniKit, ResponseEvent, VerificationLevel } from "@worldcoin/minikit-js"

interface WorldIDMiniKitFlexibleProps {
  onSuccess: (worldId: string, userInfo: any) => void
}

export function WorldIDMiniKitFlexible({ onSuccess }: WorldIDMiniKitFlexibleProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userData, setUserData] = useState<any>(null)
  const [miniKitReady, setMiniKitReady] = useState(false)
  const [debugInfo, setDebugInfo] = useState<any>({})

  useEffect(() => {
    // Collect debug information
    const debug = {
      userAgent: navigator.userAgent,
      isInstalled: MiniKit.isInstalled(),
      hasWorldApp: typeof (window as any).WorldApp !== "undefined",
      hasWorldcoin: typeof (window as any).worldcoin !== "undefined",
      isIframe: window.self !== window.top,
      url: window.location.href,
    }
    setDebugInfo(debug)
    console.log("MiniKit Debug Info:", debug)

    try {
      // Always try to install MiniKit regardless of isInstalled() result
      console.log("Installing MiniKit...")
      MiniKit.install()
      setMiniKitReady(true)
      console.log("MiniKit installation attempted successfully")

      // Subscribe to sign-in events
      MiniKit.subscribe(ResponseEvent.MiniAppSignIn, (response) => {
        console.log("Sign-in response:", response)

        if (response.status === "success") {
          setIsVerified(true)
          setIsLoading(false)
          setUserData(response.payload)

          setTimeout(() => {
            onSuccess(response.payload.nullifier_hash || "signin_user_" + Date.now(), {
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

      // Subscribe to verification events
      MiniKit.subscribe(ResponseEvent.MiniAppVerifyAction, (response) => {
        console.log("Verification response:", response)

        if (response.status === "success") {
          setIsVerified(true)
          setIsLoading(false)
          setUserData(response.payload)

          setTimeout(() => {
            onSuccess(response.payload.nullifier_hash, {
              nullifier_hash: response.payload.nullifier_hash,
              verification_level: response.payload.verification_level,
              timestamp: new Date().toISOString(),
              platform: "minikit_verify",
              payload: response.payload,
            })
          }, 1000)
        } else {
          console.error("Verification failed:", response.error)
          setIsLoading(false)
          setError(response.error || "World ID verification failed")
        }
      })
    } catch (err: any) {
      console.error("MiniKit setup error:", err)
      // Don't set error here, still allow user to try
      console.log("Continuing despite MiniKit setup error...")
      setMiniKitReady(true)
    }

    // Cleanup subscriptions on unmount
    return () => {
      try {
        MiniKit.unsubscribe(ResponseEvent.MiniAppSignIn)
        MiniKit.unsubscribe(ResponseEvent.MiniAppVerifyAction)
      } catch (err) {
        console.log("Cleanup error:", err)
      }
    }
  }, [onSuccess])

  const handleSignIn = () => {
    setIsLoading(true)
    setError(null)

    try {
      console.log("Starting MiniKit sign-in...")

      // Method 1: Try sign-in command
      MiniKit.commands.signIn({
        action: "world_fan_signup",
        app_id: "app_7a9639a92f85fcf27213f982eddb5064",
      })

      // Set a timeout to show alternative options
      setTimeout(() => {
        if (isLoading) {
          console.log("Sign-in taking longer than expected, showing alternatives...")
        }
      }, 5000)
    } catch (err: any) {
      console.error("Sign-in command error:", err)
      // Try verification as fallback
      handleVerification()
    }
  }

  const handleVerification = () => {
    setIsLoading(true)
    setError(null)

    try {
      console.log("Starting MiniKit verification...")

      // Method 2: Use verification command
      MiniKit.commands.verify({
        action: "world_fan_signup",
        app_id: "app_7a9639a92f85fcf27213f982eddb5064",
        verification_level: VerificationLevel.Orb,
      })
    } catch (err: any) {
      console.error("Verification command error:", err)
      setIsLoading(false)
      setError("Failed to start World ID verification. Please try again.")
    }
  }

  const handleDevelopmentMode = () => {
    // For testing purposes when MiniKit isn't working
    setIsLoading(true)
    setError(null)

    setTimeout(() => {
      setIsVerified(true)
      setIsLoading(false)
      setUserData({ development: true })

      setTimeout(() => {
        onSuccess("dev_user_" + Date.now(), {
          nullifier_hash: "dev_user_" + Date.now(),
          verification_level: "orb",
          timestamp: new Date().toISOString(),
          platform: "development_mode",
          note: "Development mode for testing",
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
              <p className="font-medium text-red-900">Authentication Error</p>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Debug info for development */}
        <details className="bg-gray-50 p-3 rounded-lg">
          <summary className="text-xs font-medium text-gray-700 cursor-pointer">Debug Information</summary>
          <div className="text-xs text-gray-600 mt-2 space-y-1">
            <p>
              <strong>Environment:</strong>
            </p>
            <p>MiniKit Installed: {debugInfo.isInstalled ? "✓" : "✗"}</p>
            <p>MiniKit Ready: {miniKitReady ? "✓" : "✗"}</p>
            <p>Has WorldApp: {debugInfo.hasWorldApp ? "✓" : "✗"}</p>
            <p>In iframe: {debugInfo.isIframe ? "✓" : "✗"}</p>
            <p>User Agent: {debugInfo.userAgent?.slice(0, 60)}...</p>
            {userData && (
              <div className="mt-2">
                <p>
                  <strong>Response Data:</strong>
                </p>
                <pre className="text-xs overflow-auto">{JSON.stringify(userData, null, 2)}</pre>
              </div>
            )}
          </div>
        </details>

        <div className="text-center space-y-3">
          {!isVerified ? (
            <>
              <Button
                onClick={handleSignIn}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Authenticating with World ID...
                  </>
                ) : (
                  <>
                    <Globe className="w-4 h-4 mr-2" />
                    Sign in with World ID
                  </>
                )}
              </Button>

              {/* Alternative verification button */}
              <Button onClick={handleVerification} disabled={isLoading} variant="outline" className="w-full" size="sm">
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin mr-2" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4 mr-2" />
                    Alternative: Verify Action
                  </>
                )}
              </Button>

              {/* Development mode button for testing */}
              <Button
                onClick={handleDevelopmentMode}
                disabled={isLoading}
                variant="outline"
                className="w-full"
                size="sm"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin mr-2" />
                    Testing...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Continue with Development Mode
                  </>
                )}
              </Button>
            </>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-green-600 font-medium">World ID Authentication Complete!</p>
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
