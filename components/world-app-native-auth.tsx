"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Check, AlertCircle, Smartphone } from "lucide-react"

interface WorldAppNativeAuthProps {
  onSuccess: (worldId: string, userInfo: any) => void
}

export function WorldAppNativeAuth({ onSuccess }: WorldAppNativeAuthProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isWorldApp, setIsWorldApp] = useState(false)
  const [debugInfo, setDebugInfo] = useState<any>({})

  useEffect(() => {
    // Collect debug information
    const debug = {
      userAgent: navigator.userAgent,
      url: window.location.href,
      hasParent: window.parent !== window,
      hasWorldApp: typeof (window as any).WorldApp !== "undefined",
      hasWorldcoin: typeof (window as any).worldcoin !== "undefined",
      isIframe: window.self !== window.top,
      referrer: document.referrer,
      worldAppMethods: typeof (window as any).WorldApp === "object" ? Object.keys((window as any).WorldApp || {}) : [],
      worldAppObject: typeof (window as any).WorldApp === "object" ? (window as any).WorldApp : null,
    }
    setDebugInfo(debug)
    console.log("World App Debug Info:", debug)

    // Detect if we're in World App
    const checkWorldApp = () => {
      const isInWorldApp = typeof (window as any).WorldApp !== "undefined"
      setIsWorldApp(isInWorldApp)
      console.log("World App detected:", isInWorldApp)
      return isInWorldApp
    }

    checkWorldApp()
  }, [])

  const handleWorldAppAuth = async () => {
    if (!isWorldApp) {
      setError("This app is only available in the World App.")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      console.log("Starting World App Mini App verification...")

      // Use the correct World App Mini App SDK
      if (typeof (window as any).WorldApp !== "undefined") {
        const worldApp = (window as any).WorldApp

        console.log("WorldApp object:", worldApp)
        console.log("Available methods:", Object.getOwnPropertyNames(worldApp))

        // Method 1: Try the correct Mini App SDK postMessage format
        const verificationRequest = {
          command: "verify",
          payload: {
            app_id: "app_7a9639a92f85fcf27213f982eddb5064",
            action: "world_fan_signup",
          },
        }

        console.log("Sending verification request:", verificationRequest)

        // Create a promise to handle the async response
        const verificationPromise = new Promise((resolve, reject) => {
          const timeout = setTimeout(() => {
            reject(new Error("Verification timeout after 30 seconds"))
          }, 30000)

          // Listen for the response
          const handleMessage = (event: MessageEvent) => {
            console.log("Received message:", event.data)

            // Check if this is a verification response
            if (
              event.data &&
              (event.data.command === "verify" ||
                event.data.type === "verify" ||
                event.data.nullifier_hash ||
                event.data.verification_level)
            ) {
              clearTimeout(timeout)
              window.removeEventListener("message", handleMessage)

              if (event.data.success !== false && (event.data.nullifier_hash || event.data.verification_level)) {
                resolve(event.data)
              } else {
                reject(new Error(event.data.error || "Verification failed"))
              }
            }
          }

          window.addEventListener("message", handleMessage)

          // Try different ways to send the command
          try {
            // Method A: Direct postMessage to parent
            if (window.parent && window.parent !== window) {
              console.log("Posting to parent window...")
              window.parent.postMessage(verificationRequest, "*")
            }

            // Method B: Use WorldApp postMessage if available
            if (typeof worldApp.postMessage === "function") {
              console.log("Using WorldApp.postMessage...")
              worldApp.postMessage(verificationRequest)
            }

            // Method C: Try webkit messageHandlers (iOS specific)
            if ((window as any).webkit && (window as any).webkit.messageHandlers) {
              console.log("Using webkit messageHandlers...")
              const handlers = (window as any).webkit.messageHandlers
              if (handlers.worldApp) {
                handlers.worldApp.postMessage(verificationRequest)
              }
              if (handlers.verify) {
                handlers.verify.postMessage(verificationRequest.payload)
              }
            }

            // Method D: Try Android interface
            if ((window as any).Android && (window as any).Android.verify) {
              console.log("Using Android interface...")
              ;(window as any).Android.verify(JSON.stringify(verificationRequest.payload))
            }

            // Method E: Custom event dispatch
            console.log("Dispatching custom event...")
            const customEvent = new CustomEvent("worldapp-command", {
              detail: verificationRequest,
            })
            window.dispatchEvent(customEvent)

            // Method F: Try direct method calls on WorldApp
            const methodsToTry = ["verify", "sendCommand", "executeCommand", "command"]
            for (const method of methodsToTry) {
              if (typeof worldApp[method] === "function") {
                console.log(`Trying WorldApp.${method}...`)
                try {
                  const result = worldApp[method](verificationRequest.payload)
                  if (result && typeof result.then === "function") {
                    result.then(resolve).catch(() => {
                      /* continue to next method */
                    })
                  } else if (result) {
                    resolve(result)
                    break
                  }
                } catch (methodError) {
                  console.log(`WorldApp.${method} failed:`, methodError)
                }
              }
            }
          } catch (sendError) {
            console.error("Error sending verification request:", sendError)
            reject(sendError)
          }
        })

        // Wait for the verification result
        const result = await verificationPromise
        console.log("Verification result:", result)

        if (result && (result.nullifier_hash || result.verification_level)) {
          setIsVerified(true)
          setIsLoading(false)
          setTimeout(() => {
            onSuccess(result.nullifier_hash || "world_app_verified_" + Date.now(), {
              nullifier_hash: result.nullifier_hash || "world_app_verified_" + Date.now(),
              verification_level: result.verification_level || "orb",
              timestamp: new Date().toISOString(),
              platform: "world_app",
              result: result,
            })
          }, 1000)
        } else {
          throw new Error("Invalid verification result")
        }
      } else {
        throw new Error("WorldApp not available")
      }
    } catch (err: any) {
      console.error("World App verification error:", err)
      setIsLoading(false)
      setError(`World ID verification failed: ${err.message}`)
    }
  }

  // If not in World App, show error message
  if (!isWorldApp) {
    return (
      <>
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <CardTitle>World App Required</CardTitle>
          <CardDescription>This application is only available through the World App</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <div>
              <p className="font-medium text-red-900">Access Restricted</p>
              <p className="text-sm text-red-700">
                World Fan is exclusively available in the World App for security and verification purposes.
              </p>
            </div>
          </div>
        </CardContent>
      </>
    )
  }

  return (
    <>
      <CardHeader className="text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Smartphone className="w-8 h-8 text-white" />
        </div>
        <CardTitle>World ID Verification</CardTitle>
        <CardDescription>Verify your World ID to access World Fan's exclusive features</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4">
          <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
            <Shield className="w-5 h-5 text-green-600" />
            <div>
              <p className="font-medium text-green-900">Secure & Private</p>
              <p className="text-sm text-green-700">Your World ID verification is processed securely</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
            <Check className="w-5 h-5 text-blue-600" />
            <div>
              <p className="font-medium text-blue-900">Anti-Bot Protection</p>
              <p className="text-sm text-blue-700">Prevents automated accounts and scalpers</p>
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

        {/* Debug info */}
        <details className="text-xs text-gray-500">
          <summary className="cursor-pointer font-medium">Debug Information</summary>
          <div className="mt-2 p-3 bg-gray-100 rounded space-y-1">
            <p>
              <strong>World App Environment:</strong>
            </p>
            <p>WorldApp API: {debugInfo.hasWorldApp ? "✓" : "✗"}</p>
            <p>App Version: {debugInfo.worldAppObject?.world_app_version}</p>
            <p>Device OS: {debugInfo.worldAppObject?.device_os}</p>
            <p>
              Verify Command:{" "}
              {debugInfo.worldAppObject?.supported_commands?.find((cmd: any) => cmd.name === "verify") ? "✓" : "✗"}
            </p>
            {debugInfo.worldAppObject?.supported_commands && (
              <div>
                <p>
                  <strong>Supported Commands:</strong>
                </p>
                <ul className="list-disc list-inside ml-2">
                  {debugInfo.worldAppObject.supported_commands.map((cmd: any) => (
                    <li key={cmd.name}>
                      {cmd.name} (v{cmd.supported_versions.join(", ")})
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <p>
              <strong>Available Methods:</strong>
            </p>
            <p>{debugInfo.worldAppMethods?.join(", ") || "None detected"}</p>
          </div>
        </details>

        <div className="text-center">
          {!isVerified ? (
            <Button
              onClick={handleWorldAppAuth}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Verifying World ID...
                </>
              ) : (
                <>
                  <Smartphone className="w-4 h-4 mr-2" />
                  Verify with World ID
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
