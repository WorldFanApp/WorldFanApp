"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Check, AlertCircle, Globe } from "lucide-react"
import { MiniKit, ResponseEvent } from "@worldcoin/minikit-js"

interface WorldIDMiniKitFixedProps {
  onSuccess: (worldId: string, userInfo: any) => void
}

export function WorldIDMiniKitFixed({ onSuccess }: WorldIDMiniKitFixedProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userData, setUserData] = useState<any>(null)
  const [debugInfo, setDebugInfo] = useState<any>({})

  useEffect(() => {
    // Only run on client side
    if (typeof window !== "undefined") {
      try {
        // Install MiniKit
        MiniKit.install()
        console.log("MiniKit installed successfully")

        // Collect debug information
        const debug = {
          miniKitInstalled: MiniKit.isInstalled(),
          userAgent: navigator.userAgent,
          url: window.location.href,
          hasWorldApp: typeof (window as any).WorldApp !== "undefined",
          isIframe: window.self !== window.top,
          timestamp: new Date().toISOString(),
        }
        setDebugInfo(debug)
        console.log("Debug info:", debug)

        // Subscribe to sign-in events with enhanced logging
        MiniKit.subscribe(ResponseEvent.MiniAppSignIn, (response) => {
          console.log("Full sign-in response:", response)

          if (response.status === "success") {
            console.log("Sign-in successful:", response.payload)
            setIsVerified(true)
            setIsLoading(false)
            setUserData(response.payload)
            setError(null)

            setTimeout(() => {
              onSuccess(response.payload.nullifier_hash || "signin_user_" + Date.now(), {
                nullifier_hash: response.payload.nullifier_hash,
                verification_level: response.payload.verification_level,
                timestamp: new Date().toISOString(),
                platform: "minikit_signin_fixed",
                payload: response.payload,
              })
            }, 1000)
          } else {
            console.error("Sign-in failed:", response.error)
            setIsLoading(false)
            setError(`Sign-in failed: ${response.error?.message || response.error || "Unknown error"}`)
          }
        })
      } catch (err: any) {
        console.error("MiniKit initialization failed:", err)
        setError(`Failed to initialize MiniKit: ${err.message}`)
      }

      // Cleanup subscription on unmount
      return () => {
        try {
          MiniKit.unsubscribe(ResponseEvent.MiniAppSignIn)
        } catch (err) {
          console.log("Cleanup error:", err)
        }
      }
    }
  }, [onSuccess])

  const handleSignIn = () => {
    setIsLoading(true)
    setError(null)

    try {
      console.log("Checking MiniKit installation...")

      if (MiniKit.isInstalled()) {
        console.log("MiniKit is installed, attempting sign-in...")

        // Use environment variable or fallback to hardcoded app_id
        const appId = process.env.NEXT_PUBLIC_WORLDCOIN_APP_ID || "app_7a9639a92f85fcf27213f982eddb5064"

        console.log("Sign-in parameters:", {
          action: "signin",
          app_id: appId,
        })

        MiniKit.commands.signIn({
          action: "signin", // Changed from 'world_fan_signup' to 'signin'
          app_id: appId,
        })

        console.log("Sign-in command sent successfully")
      } else {
        console.error("MiniKit is not installed")
        setIsLoading(false)
        setError("Please open this app in the World App to sign in.")
      }
    } catch (err: any) {
      console.error("Sign-in command failed:", err)
      setIsLoading(false)
      setError(`Sign-in command failed: ${err.message}`)
    }
  }

  return (
    <>
      <CardHeader className="text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Globe className="w-8 h-8 text-white" />
        </div>
        <CardTitle>World Fan Sign-In</CardTitle>
        <CardDescription>Sign in with World ID to access World Fan's exclusive music experiences</CardDescription>
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

        {/* Enhanced Debug Information */}
        <details className="bg-gray-50 p-3 rounded-lg">
          <summary className="text-xs font-medium text-gray-700 cursor-pointer">
            Debug Information (Click to expand)
          </summary>
          <div className="text-xs text-gray-600 mt-2 space-y-1">
            <p>
              <strong>Environment:</strong>
            </p>
            <p>MiniKit Installed: {debugInfo.miniKitInstalled ? "✓" : "✗"}</p>
            <p>Has WorldApp: {debugInfo.hasWorldApp ? "✓" : "✗"}</p>
            <p>In iframe: {debugInfo.isIframe ? "✓" : "✗"}</p>
            <p>URL: {debugInfo.url}</p>
            <p>User Agent: {debugInfo.userAgent?.slice(0, 80)}...</p>
            <p>App ID: {process.env.NEXT_PUBLIC_WORLDCOIN_APP_ID || "app_7a9639a92f85fcf27213f982eddb5064"}</p>
            <p>Action: signin</p>
            {userData && (
              <div className="mt-2">
                <p>
                  <strong>Response Data:</strong>
                </p>
                <pre className="text-xs overflow-auto bg-white p-2 rounded">{JSON.stringify(userData, null, 2)}</pre>
              </div>
            )}
          </div>
        </details>

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
              <p className="text-green-600 font-medium">Successfully Verified!</p>
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
