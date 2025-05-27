"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Check, AlertCircle, Globe } from "lucide-react"

interface WorldIDDirectCommunicationProps {
  onSuccess: (worldId: string, userInfo: any) => void
}

export function WorldIDDirectCommunication({ onSuccess }: WorldIDDirectCommunicationProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<any>({})

  useEffect(() => {
    if (typeof window !== "undefined") {
      const debug = {
        userAgent: navigator.userAgent,
        url: window.location.href,
        hasWorldApp: typeof (window as any).WorldApp !== "undefined",
        hasWorldcoin: typeof (window as any).worldcoin !== "undefined",
        isIframe: window.self !== window.top,
        hasParent: window.parent !== window,
        timestamp: new Date().toISOString(),
      }
      setDebugInfo(debug)
      console.log("Direct communication debug info:", debug)

      // Listen for messages from World App
      const handleMessage = (event: MessageEvent) => {
        console.log("Received message from World App:", event.data)

        // Handle different possible response formats
        if (event.data) {
          // Format 1: Direct verification response
          if (event.data.type === "worldid_verification_success" || event.data.success) {
            handleVerificationSuccess(event.data)
          }
          // Format 2: MiniKit style response
          else if (event.data.command === "verify" && event.data.success) {
            handleVerificationSuccess(event.data.payload || event.data)
          }
          // Format 3: Error response
          else if (event.data.type === "worldid_verification_error" || event.data.error) {
            handleVerificationError(event.data.error || event.data.message || "Verification failed")
          }
          // Format 4: Any response with nullifier_hash
          else if (event.data.nullifier_hash) {
            handleVerificationSuccess(event.data)
          }
        }
      }

      window.addEventListener("message", handleMessage)
      return () => window.removeEventListener("message", handleMessage)
    }
  }, [])

  const handleVerificationSuccess = (data: any) => {
    console.log("Verification successful:", data)
    setIsVerified(true)
    setIsLoading(false)
    setError(null)

    setTimeout(() => {
      onSuccess(data.nullifier_hash || "verified_user_" + Date.now(), {
        nullifier_hash: data.nullifier_hash,
        verification_level: data.verification_level || "device",
        timestamp: new Date().toISOString(),
        platform: "direct_communication",
        payload: data,
      })
    }, 1000)
  }

  const handleVerificationError = (errorMessage: string) => {
    console.error("Verification failed:", errorMessage)
    setIsLoading(false)
    setError(`Verification failed: ${errorMessage}`)
  }

  const handleDirectVerification = () => {
    setIsLoading(true)
    setError(null)

    const appId = process.env.NEXT_PUBLIC_WORLDCOIN_APP_ID || "app_7a9639a92f85fcf27213f982eddb5064"

    try {
      console.log("Starting direct World App communication...")

      // Method 1: Try multiple message formats
      const messages = [
        // Format 1: Standard MiniKit format
        {
          command: "verify",
          payload: {
            app_id: appId,
            action: "signin",
            verification_level: "device",
          },
        },
        // Format 2: Direct format
        {
          type: "worldid_verification_request",
          app_id: appId,
          action: "signin",
          verification_level: "device",
        },
        // Format 3: Simple format
        {
          verify: true,
          app_id: appId,
          action: "signin",
        },
        // Format 4: World App specific
        {
          worldapp_command: "verify",
          app_id: appId,
          action: "signin",
          verification_level: "device",
        },
      ]

      // Send all message formats
      messages.forEach((message, index) => {
        console.log(`Sending message format ${index + 1}:`, message)

        // Send to parent window
        if (window.parent && window.parent !== window) {
          window.parent.postMessage(message, "*")
        }

        // Send to current window
        window.postMessage(message, "*")

        // Try webkit messageHandlers (iOS)
        if ((window as any).webkit?.messageHandlers) {
          const handlers = (window as any).webkit.messageHandlers
          if (handlers.worldApp) {
            handlers.worldApp.postMessage(message)
          }
          if (handlers.verify) {
            handlers.verify.postMessage(message)
          }
        }

        // Try Android interface
        if ((window as any).Android?.verify) {
          ;(window as any).Android.verify(JSON.stringify(message))
        }

        // Dispatch custom events
        window.dispatchEvent(
          new CustomEvent("worldapp-verify", {
            detail: message,
          }),
        )
      })

      // Set timeout
      setTimeout(() => {
        if (isLoading) {
          setIsLoading(false)
          setError("Verification timeout. No response received from World App.")
        }
      }, 30000)
    } catch (err: any) {
      console.error("Direct verification failed:", err)
      setIsLoading(false)
      setError(`Direct verification failed: ${err.message}`)
    }
  }

  const handleDevelopmentMode = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsVerified(true)
      setIsLoading(false)
      setTimeout(() => {
        onSuccess("dev_user_" + Date.now(), {
          nullifier_hash: "dev_user_" + Date.now(),
          verification_level: "device",
          timestamp: new Date().toISOString(),
          platform: "development_mode",
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
        <CardTitle>World ID Direct Communication</CardTitle>
        <CardDescription>Attempting direct communication with World App (bypassing MiniKit)</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4">
          <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
            <Shield className="w-5 h-5 text-green-600" />
            <div>
              <p className="font-medium text-green-900">Direct Integration</p>
              <p className="text-sm text-green-700">Bypassing MiniKit for direct World App communication</p>
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

        {isLoading && (
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <div>
              <p className="font-medium text-blue-900">Attempting Direct Communication</p>
              <p className="text-sm text-blue-700">Trying multiple message formats with World App...</p>
            </div>
          </div>
        )}

        <details className="bg-gray-50 p-3 rounded-lg">
          <summary className="text-xs font-medium text-gray-700 cursor-pointer">
            Debug Information (Click to expand)
          </summary>
          <div className="text-xs text-gray-600 mt-2 space-y-1">
            <p>
              <strong>Environment:</strong>
            </p>
            <p>Has WorldApp: {debugInfo.hasWorldApp ? "✓" : "✗"}</p>
            <p>Has worldcoin: {debugInfo.hasWorldcoin ? "✓" : "✗"}</p>
            <p>In iframe: {debugInfo.isIframe ? "✓" : "✗"}</p>
            <p>Has parent: {debugInfo.hasParent ? "✓" : "✗"}</p>
            <p>URL: {debugInfo.url}</p>
            <p>App ID: {process.env.NEXT_PUBLIC_WORLDCOIN_APP_ID}</p>
            <p>Action: signin</p>
          </div>
        </details>

        <div className="text-center space-y-3">
          {!isVerified ? (
            <>
              <Button
                onClick={handleDirectVerification}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Attempting Direct Communication...
                  </>
                ) : (
                  <>
                    <Globe className="w-4 h-4 mr-2" />
                    Try Direct World ID Communication
                  </>
                )}
              </Button>

              <Button onClick={handleDevelopmentMode} variant="outline" className="w-full" size="sm">
                <Check className="w-4 h-4 mr-2" />
                Continue with Development Mode
              </Button>
            </>
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
