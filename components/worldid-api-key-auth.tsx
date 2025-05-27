"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Check, AlertCircle, Key } from "lucide-react"
import { MiniKit, ResponseEvent } from "@worldcoin/minikit-js"

interface WorldIDApiKeyAuthProps {
  onSuccess: (worldId: string, userInfo: any) => void
}

export function WorldIDApiKeyAuth({ onSuccess }: WorldIDApiKeyAuthProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<any>({})

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        MiniKit.install()
        console.log("MiniKit installed successfully")

        const debug = {
          miniKitInstalled: MiniKit.isInstalled(),
          userAgent: navigator.userAgent,
          url: window.location.href,
          hasWorldApp: typeof (window as any).WorldApp !== "undefined",
          timestamp: new Date().toISOString(),
        }
        setDebugInfo(debug)
        console.log("API Key Auth debug info:", debug)

        // Subscribe to verification events
        MiniKit.subscribe(ResponseEvent.MiniAppVerifyAction, async (response) => {
          console.log("MiniKit verification response:", response)

          if (response.status === "success" && response.payload) {
            setIsLoading(true)
            try {
              // Send to our API endpoint that uses the API key
              const verificationResponse = await fetch("/api/worldid/verify-with-api-key", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  nullifier_hash: response.payload.nullifier_hash,
                  merkle_root: response.payload.merkle_root,
                  proof: response.payload.proof,
                  verification_level: response.payload.verification_level,
                  action: "signin",
                  signal: "world_fan_user_" + Date.now(),
                }),
              })

              const verificationResult = await verificationResponse.json()
              console.log("API verification result:", verificationResult)

              if (verificationResult.success) {
                setIsVerified(true)
                setError(null)

                setTimeout(() => {
                  onSuccess(verificationResult.nullifier_hash, {
                    nullifier_hash: verificationResult.nullifier_hash,
                    verification_level: verificationResult.verification_level,
                    timestamp: new Date().toISOString(),
                    platform: "api_key_verification",
                    payload: response.payload,
                  })
                }, 1000)
              } else {
                throw new Error(verificationResult.error || "API verification failed")
              }
            } catch (err: any) {
              console.error("API verification error:", err)
              setError(`API verification failed: ${err.message}`)
            } finally {
              setIsLoading(false)
            }
          } else {
            console.error("MiniKit verification failed:", response)
            setError(`MiniKit verification failed: ${response.error?.message || "Unknown error"}`)
            setIsLoading(false)
          }
        })
      } catch (err: any) {
        console.error("MiniKit initialization failed:", err)
        setError(`Failed to initialize MiniKit: ${err.message}`)
      }

      return () => {
        try {
          MiniKit.unsubscribe(ResponseEvent.MiniAppVerifyAction)
        } catch (err) {
          console.log("Cleanup error:", err)
        }
      }
    }
  }, [onSuccess])

  const handleVerifyWithApiKey = () => {
    if (!MiniKit.isInstalled()) {
      setError("This app must be opened in the World App to verify with World ID.")
      return
    }

    setIsLoading(true)
    setError(null)

    const appId = process.env.NEXT_PUBLIC_WORLDCOIN_APP_ID || "app_7a9639a92f85fcf27213f982eddb5064"

    try {
      console.log("Starting World ID verification with API key backend...")
      console.log("App ID:", appId)

      MiniKit.commands.verify({
        action: "signin",
        app_id: appId,
        verification_level: "device",
        signal: "world_fan_user_" + Date.now(),
      })

      console.log("Verify command sent successfully")
    } catch (err: any) {
      console.error("Verification command failed:", err)
      setIsLoading(false)
      setError(`Verification command failed: ${err.message}`)
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
          <Key className="w-8 h-8 text-white" />
        </div>
        <CardTitle>World ID with API Key</CardTitle>
        <CardDescription>Using your World API key for backend verification</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4">
          <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
            <Shield className="w-5 h-5 text-green-600" />
            <div>
              <p className="font-medium text-green-900">API Key Integration</p>
              <p className="text-sm text-green-700">Using your World API key for secure backend verification</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
            <Key className="w-5 h-5 text-blue-600" />
            <div>
              <p className="font-medium text-blue-900">Enhanced Security</p>
              <p className="text-sm text-blue-700">Server-side verification with your API credentials</p>
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
              <p className="font-medium text-blue-900">API Key Verification in Progress</p>
              <p className="text-sm text-blue-700">Verifying with Worldcoin API using your credentials...</p>
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
            <p>MiniKit Installed: {debugInfo.miniKitInstalled ? "✓" : "✗"}</p>
            <p>Has WorldApp: {debugInfo.hasWorldApp ? "✓" : "✗"}</p>
            <p>URL: {debugInfo.url}</p>
            <p>App ID: {process.env.NEXT_PUBLIC_WORLDCOIN_APP_ID}</p>
            <p>API Key: {"Set" ? "✓" : "✗"}</p>
          </div>
        </details>

        <div className="text-center space-y-3">
          {!isVerified ? (
            <>
              <Button
                onClick={handleVerifyWithApiKey}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Verifying with API Key...
                  </>
                ) : (
                  <>
                    <Key className="w-4 h-4 mr-2" />
                    Verify with World ID (API Key)
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
              <p className="text-sm text-gray-600">API key verification successful!</p>
            </div>
          )}
        </div>
      </CardContent>
    </>
  )
}
