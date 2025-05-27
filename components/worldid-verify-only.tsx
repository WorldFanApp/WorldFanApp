"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Check, AlertCircle, Globe } from "lucide-react"
import { MiniKit, ResponseEvent } from "@worldcoin/minikit-js"

interface WorldIDVerifyOnlyProps {
  onSuccess: (worldId: string, userInfo: any) => void
}

export function WorldIDVerifyOnly({ onSuccess }: WorldIDVerifyOnlyProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userData, setUserData] = useState<any>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        MiniKit.install()
        console.log("MiniKit installed successfully")

        // Subscribe to verification events only
        MiniKit.subscribe(ResponseEvent.MiniAppVerifyAction, (response) => {
          console.log("Verification response:", response)
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
                platform: "minikit_verify_only",
                payload: response.payload,
              })
            }, 1000)
          } else {
            console.error("Verification failed:", response)
            const errorMessage = response.error?.message || response.error || "Verification failed"
            setError(`Verification failed: ${errorMessage}`)
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

  const handleVerify = () => {
    if (!MiniKit.isInstalled()) {
      setError("This app must be opened in the World App to verify with World ID.")
      return
    }

    setIsLoading(true)
    setError(null)

    const appId = process.env.NEXT_PUBLIC_WORLDCOIN_APP_ID || "app_7a9639a92f85fcf27213f982eddb5064"

    try {
      console.log("Starting verification with MiniKit.commands.verify")
      console.log("App ID:", appId)

      MiniKit.commands.verify({
        action: "signin",
        app_id: appId,
        verification_level: "device",
      })

      console.log("Verify command sent successfully")
    } catch (err: any) {
      console.error("Verification command failed:", err)
      setIsLoading(false)
      setError(`Verification command failed: ${err.message}`)
    }
  }

  return (
    <>
      <CardHeader className="text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Globe className="w-8 h-8 text-white" />
        </div>
        <CardTitle>World ID Verification (Verify Only)</CardTitle>
        <CardDescription>Simple World ID verification using only the verify command</CardDescription>
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
              <p className="font-medium text-blue-900">World ID Verification in Progress</p>
              <p className="text-sm text-blue-700">Please complete the verification in the popup</p>
            </div>
          </div>
        )}

        <div className="text-center">
          {!isVerified ? (
            <Button
              onClick={handleVerify}
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

        {userData && (
          <details className="bg-gray-50 p-3 rounded-lg">
            <summary className="text-xs font-medium text-gray-700 cursor-pointer">
              Verification Data (Click to expand)
            </summary>
            <pre className="text-xs text-gray-600 mt-2 overflow-auto">{JSON.stringify(userData, null, 2)}</pre>
          </details>
        )}
      </CardContent>
    </>
  )
}
