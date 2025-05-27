"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Check, AlertCircle, Globe, Smartphone, ExternalLink } from "lucide-react"
import { MiniKit, ResponseEvent, VerificationLevel } from "@worldcoin/minikit-js"

interface WorldIDMiniKitFixedProps {
  onSuccess: (worldId: string, userInfo: any) => void
}

export function WorldIDMiniKitFixed({ onSuccess }: WorldIDMiniKitFixedProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userData, setUserData] = useState<any>(null)
  const [debugInfo, setDebugInfo] = useState<any>({})
  const [isClient, setIsClient] = useState(false)
  const [showInstructions, setShowInstructions] = useState(false)

  useEffect(() => {
    setIsClient(true)

    if (typeof window !== "undefined") {
      try {
        MiniKit.install()
        console.log("MiniKit installed successfully")

        const debug = {
          miniKitInstalled: MiniKit.isInstalled(),
          userAgent: navigator.userAgent,
          url: window.location.href,
          hasWorldApp: typeof (window as any).WorldApp !== "undefined",
          isIframe: window.self !== window.top,
          timestamp: new Date().toISOString(),
          isInWorldApp: MiniKit.isInstalled(),
          miniKitCommands: typeof MiniKit.commands === "object" ? Object.keys(MiniKit.commands) : "undefined",
          hasSignIn: typeof MiniKit.commands?.signIn === "function",
          hasVerify: typeof MiniKit.commands?.verify === "function",
        }
        setDebugInfo(debug)
        console.log("Debug info:", debug)

        // If not in World App, show instructions
        if (!MiniKit.isInstalled()) {
          setShowInstructions(true)
        }

        // Subscribe to sign-in events
        MiniKit.subscribe(ResponseEvent.MiniAppSignIn, (response) => {
          console.log("Sign-in response:", response)
          handleAuthResponse(response, "signin")
        })

        // Subscribe to verification events as fallback
        MiniKit.subscribe(ResponseEvent.MiniAppVerifyAction, (response) => {
          console.log("Verification response:", response)
          handleAuthResponse(response, "verify")
        })
      } catch (err: any) {
        console.error("MiniKit initialization failed:", err)
        setError(`Failed to initialize MiniKit: ${err.message}`)
      }

      return () => {
        try {
          MiniKit.unsubscribe(ResponseEvent.MiniAppSignIn)
          MiniKit.unsubscribe(ResponseEvent.MiniAppVerifyAction)
        } catch (err) {
          console.log("Cleanup error:", err)
        }
      }
    }
  }, [onSuccess])

  const handleAuthResponse = (response: any, method: string) => {
    if (response.status === "success") {
      console.log(`${method} successful:`, response.payload)
      setIsVerified(true)
      setIsLoading(false)
      setUserData(response.payload)
      setError(null)

      setTimeout(() => {
        onSuccess(response.payload.nullifier_hash || `${method}_user_` + Date.now(), {
          nullifier_hash: response.payload.nullifier_hash,
          verification_level: response.payload.verification_level,
          timestamp: new Date().toISOString(),
          platform: `minikit_${method}_fixed`,
          payload: response.payload,
        })
      }, 1000)
    } else {
      console.error(`${method} failed:`, response.error)
      setIsLoading(false)
      setError(`${method} failed: ${response.error?.message || response.error || "Unknown error"}`)
    }
  }

  const handleSignIn = () => {
    if (typeof window === "undefined") {
      setError("Window not available")
      return
    }

    if (!MiniKit.isInstalled()) {
      setShowInstructions(true)
      setError("This app must be opened in the World App to sign in with World ID.")
      return
    }

    setIsLoading(true)
    setError(null)

    const appId = process.env.NEXT_PUBLIC_WORLDCOIN_APP_ID || "app_7a9639a92f85fcf27213f982eddb5064"

    try {
      console.log("Attempting authentication with available methods...")

      // Method 1: Try signIn if available
      if (typeof MiniKit.commands?.signIn === "function") {
        console.log("Using MiniKit.commands.signIn")
        MiniKit.commands.signIn({
          action: "signin",
          app_id: appId,
        })
        console.log("Sign-in command sent successfully")
        return
      }

      // Method 2: Try verify as fallback
      if (typeof MiniKit.commands?.verify === "function") {
        console.log("Using MiniKit.commands.verify as fallback")
        MiniKit.commands.verify({
          action: "signin",
          app_id: appId,
          verification_level: VerificationLevel.Device, // Use Device level for easier testing
        })
        console.log("Verify command sent successfully")
        return
      }

      // Method 3: Try direct postMessage to World App
      console.log("Trying direct postMessage to World App")
      const message = {
        command: "verify",
        payload: {
          app_id: appId,
          action: "signin",
          verification_level: "device",
        },
      }

      if (window.parent && window.parent !== window) {
        window.parent.postMessage(message, "*")
        console.log("PostMessage sent to parent window")

        // Set up listener for response
        const handleMessage = (event: MessageEvent) => {
          if (event.data && event.data.command === "verify") {
            window.removeEventListener("message", handleMessage)
            if (event.data.success) {
              handleAuthResponse({ status: "success", payload: event.data.payload }, "postmessage")
            } else {
              setIsLoading(false)
              setError(`Verification failed: ${event.data.error || "Unknown error"}`)
            }
          }
        }

        window.addEventListener("message", handleMessage)

        // Timeout after 30 seconds
        setTimeout(() => {
          window.removeEventListener("message", handleMessage)
          if (isLoading) {
            setIsLoading(false)
            setError("Verification timeout. Please try again.")
          }
        }, 30000)

        return
      }

      throw new Error("No available authentication methods found")
    } catch (err: any) {
      console.error("Authentication failed:", err)
      setIsLoading(false)
      setError(`Authentication failed: ${err.message}`)
    }
  }

  const handleDevelopmentMode = () => {
    // For testing purposes when not in World App
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
          note: "Development mode for testing outside World App",
        })
      }, 1000)
    }, 2000)
  }

  const openWorldAppInstructions = () => {
    window.open("https://worldcoin.org/download", "_blank")
  }

  if (!isClient) {
    return (
      <>
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Globe className="w-8 h-8 text-white" />
          </div>
          <CardTitle>World Fan Sign-In</CardTitle>
          <CardDescription>Loading World ID authentication...</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto" />
        </CardContent>
      </>
    )
  }

  // Show World App instructions if not in World App
  if (showInstructions && !debugInfo.isInWorldApp) {
    return (
      <>
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Smartphone className="w-8 h-8 text-white" />
          </div>
          <CardTitle>World App Required</CardTitle>
          <CardDescription>
            To use World ID sign-in, this app must be opened in the World App on your mobile device
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-3 text-blue-900">How to access this app in the World App:</h4>
            <ol className="text-sm text-blue-800 space-y-2 list-decimal list-inside">
              <li>Download the World App on your mobile device</li>
              <li>Open the World App and navigate to "Mini Apps"</li>
              <li>
                Enter this URL: <code className="bg-blue-100 px-1 rounded text-xs">{debugInfo.url}</code>
              </li>
              <li>The app will load with World ID functionality enabled</li>
            </ol>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2 text-yellow-800">Current Environment:</h4>
            <div className="text-xs text-yellow-700 space-y-1">
              <p>• Browser: {debugInfo.userAgent?.includes("Chrome") ? "Chrome" : "Other"}</p>
              <p>• World App: {debugInfo.isInWorldApp ? "✅ Detected" : "❌ Not detected"}</p>
              <p>• MiniKit: {debugInfo.miniKitInstalled ? "✅ Available" : "❌ Not available"}</p>
            </div>
          </div>

          <div className="space-y-3">
            <Button onClick={openWorldAppInstructions} className="w-full" variant="outline">
              <ExternalLink className="w-4 h-4 mr-2" />
              Download World App
            </Button>

            <Button onClick={handleDevelopmentMode} className="w-full" variant="outline">
              <Check className="w-4 h-4 mr-2" />
              Continue with Development Mode (Testing Only)
            </Button>

            <Button onClick={() => setShowInstructions(false)} variant="ghost" className="w-full" size="sm">
              Hide Instructions
            </Button>
          </div>

          <div className="text-xs text-gray-500 text-center">
            <p>
              <strong>Note:</strong> World ID verification requires the World App environment for security and privacy.
            </p>
          </div>
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
              {!debugInfo.isInWorldApp && (
                <Button onClick={() => setShowInstructions(true)} variant="outline" size="sm" className="mt-2 text-xs">
                  Show World App Instructions
                </Button>
              )}
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
            <p>
              <strong>MiniKit Commands:</strong>
            </p>
            <p>Available Commands: {debugInfo.miniKitCommands || "undefined"}</p>
            <p>Has signIn: {debugInfo.hasSignIn ? "✓" : "✗"}</p>
            <p>Has verify: {debugInfo.hasVerify ? "✓" : "✗"}</p>
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
            <div className="space-y-3">
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

              {debugInfo.isInWorldApp && (
                <Button onClick={handleDevelopmentMode} variant="outline" className="w-full" size="sm">
                  <Check className="w-4 h-4 mr-2" />
                  Continue with Development Mode (Testing)
                </Button>
              )}
            </div>
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
