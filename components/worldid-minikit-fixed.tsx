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
  const [verificationAttempts, setVerificationAttempts] = useState(0)

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

        // Subscribe to verification events (this is the main one we need)
        MiniKit.subscribe(ResponseEvent.MiniAppVerifyAction, (response) => {
          console.log("Full verification response:", response)
          handleVerificationResponse(response)
        })

        // Also subscribe to sign-in events as backup
        MiniKit.subscribe(ResponseEvent.MiniAppSignIn, (response) => {
          console.log("Sign-in response:", response)
          handleVerificationResponse(response)
        })
      } catch (err: any) {
        console.error("MiniKit initialization failed:", err)
        setError(`Failed to initialize MiniKit: ${err.message}`)
      }

      return () => {
        try {
          MiniKit.unsubscribe(ResponseEvent.MiniAppVerifyAction)
          MiniKit.unsubscribe(ResponseEvent.MiniAppSignIn)
        } catch (err) {
          console.log("Cleanup error:", err)
        }
      }
    }
  }, [onSuccess])

  const handleVerificationResponse = (response: any) => {
    console.log("Processing verification response:", response)
    setIsLoading(false)

    if (response.status === "success" && response.payload) {
      console.log("Verification successful:", response.payload)
      setIsVerified(true)
      setUserData(response.payload)
      setError(null)

      setTimeout(() => {
        onSuccess(response.payload.nullifier_hash || "verified_user_" + Date.now(), {
          nullifier_hash: response.payload.nullifier_hash,
          verification_level: response.payload.verification_level,
          timestamp: new Date().toISOString(),
          platform: "minikit_verify_success",
          payload: response.payload,
        })
      }, 1000)
    } else {
      console.error("Verification failed:", response)
      const errorMessage = response.error?.message || response.error || response.errorMessage || "Verification failed"
      setError(`Verification failed: ${errorMessage}`)

      // Add more detailed error information
      if (response.error) {
        console.error("Detailed error:", response.error)
        setError(`Verification failed: ${JSON.stringify(response.error)}`)
      }
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
    setVerificationAttempts((prev) => prev + 1)

    const appId = process.env.NEXT_PUBLIC_WORLDCOIN_APP_ID || "app_7a9639a92f85fcf27213f982eddb5064"

    try {
      console.log("Starting verification with MiniKit.commands.verify")
      console.log("App ID:", appId)
      console.log("Verification attempt:", verificationAttempts + 1)

      // Use the verify command since it's available
      MiniKit.commands.verify({
        action: "signin", // Keep the action as "signin"
        app_id: appId,
        verification_level: VerificationLevel.Device, // Use Device level for easier verification
      })

      console.log("Verify command sent successfully")

      // Set a timeout to handle cases where no response comes back
      setTimeout(() => {
        if (isLoading) {
          setIsLoading(false)
          setError("Verification timeout. The World ID verification took too long. Please try again.")
        }
      }, 60000) // 60 second timeout
    } catch (err: any) {
      console.error("Verification command failed:", err)
      setIsLoading(false)
      setError(`Verification command failed: ${err.message}`)
    }
  }

  const handleDevelopmentMode = () => {
    // For testing purposes
    setIsLoading(true)
    setError(null)

    setTimeout(() => {
      setIsVerified(true)
      setIsLoading(false)
      setUserData({ development: true, verification_level: "device" })

      setTimeout(() => {
        onSuccess("dev_user_" + Date.now(), {
          nullifier_hash: "dev_user_" + Date.now(),
          verification_level: "device",
          timestamp: new Date().toISOString(),
          platform: "development_mode",
          note: "Development mode for testing",
        })
      }, 1000)
    }, 2000)
  }

  const openWorldAppInstructions = () => {
    window.open("https://worldcoin.org/download", "_blank")
  }

  const retryVerification = () => {
    setError(null)
    handleSignIn()
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
              <p className="font-medium text-red-900">Verification Error</p>
              <p className="text-sm text-red-700">{error}</p>
              <div className="mt-2 space-x-2">
                <Button onClick={retryVerification} variant="outline" size="sm">
                  Try Again
                </Button>
                <Button onClick={handleDevelopmentMode} variant="outline" size="sm">
                  Use Development Mode
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Success message when World ID popup appears */}
        {isLoading && (
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <div>
              <p className="font-medium text-blue-900">World ID Verification in Progress</p>
              <p className="text-sm text-blue-700">
                {verificationAttempts > 1
                  ? `Attempt ${verificationAttempts}: Please complete the verification in the popup`
                  : "Please complete the verification in the popup that appeared"}
              </p>
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
            <p>Verification Level: Device</p>
            <p>Attempts: {verificationAttempts}</p>
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
                    Verifying with World ID...
                  </>
                ) : (
                  <>
                    <Globe className="w-4 h-4 mr-2" />
                    {verificationAttempts > 0 ? "Try World ID Again" : "Sign in with World ID"}
                  </>
                )}
              </Button>

              <Button onClick={handleDevelopmentMode} variant="outline" className="w-full" size="sm">
                <Check className="w-4 h-4 mr-2" />
                Continue with Development Mode (Testing)
              </Button>
            </div>
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
