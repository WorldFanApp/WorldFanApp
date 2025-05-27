"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Check, AlertCircle, Globe, QrCode, Smartphone } from "lucide-react"

interface WorldIDWebAuthProps {
  onSuccess: (worldId: string, userInfo: any) => void
}

export function WorldIDWebAuth({ onSuccess }: WorldIDWebAuthProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showQR, setShowQR] = useState(false)
  const [verificationUrl, setVerificationUrl] = useState<string>("")

  const generateVerificationSession = async () => {
    try {
      const response = await fetch("/api/worldid/create-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          app_id: "app_7a9639a92f85fcf27213f982eddb5064",
          action: "world_fan_signup",
        }),
      })

      const data = await response.json()

      if (data.success) {
        setVerificationUrl(data.verification_url)
        return data.session_id
      } else {
        throw new Error(data.error || "Failed to create verification session")
      }
    } catch (err: any) {
      console.error("Session creation error:", err)
      throw err
    }
  }

  const pollVerificationStatus = async (sessionId: string) => {
    const maxAttempts = 60 // 5 minutes with 5-second intervals
    let attempts = 0

    const poll = async () => {
      try {
        const response = await fetch(`/api/worldid/check-status?session_id=${sessionId}`)
        const data = await response.json()

        if (data.verified) {
          setIsVerified(true)
          setIsLoading(false)
          setTimeout(() => {
            onSuccess(data.nullifier_hash, {
              nullifier_hash: data.nullifier_hash,
              verification_level: data.verification_level,
              timestamp: new Date().toISOString(),
              platform: "web_worldid",
            })
          }, 1000)
          return
        }

        if (data.error) {
          throw new Error(data.error)
        }

        attempts++
        if (attempts < maxAttempts) {
          setTimeout(poll, 5000) // Poll every 5 seconds
        } else {
          throw new Error("Verification timeout")
        }
      } catch (err: any) {
        setIsLoading(false)
        setError(err.message || "Verification failed")
      }
    }

    poll()
  }

  const handleWorldIDVerification = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const sessionId = await generateVerificationSession()
      setShowQR(true)
      await pollVerificationStatus(sessionId)
    } catch (err: any) {
      setIsLoading(false)
      setError(err.message || "Failed to start verification")
    }
  }

  const openWorldcoinApp = () => {
    if (verificationUrl) {
      window.open(verificationUrl, "_blank")
    }
  }

  return (
    <>
      <CardHeader className="text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Globe className="w-8 h-8 text-white" />
        </div>
        <CardTitle>Verify with World ID</CardTitle>
        <CardDescription>
          {showQR
            ? "Please use your World App to scan the QR code or open the verification link"
            : "Verify your identity with World ID to access World Fan's exclusive music experiences"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!showQR && (
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
        )}

        {showQR && verificationUrl && (
          <div className="text-center space-y-4">
            <div className="bg-white p-4 rounded-lg border-2 border-gray-200 inline-block">
              <div className="w-48 h-48 bg-gray-100 rounded flex items-center justify-center">
                <QrCode className="w-24 h-24 text-gray-400" />
                <div className="absolute text-xs text-gray-500 mt-32">QR Code will appear here</div>
              </div>
            </div>
            <p className="text-sm text-gray-600">Scan this QR code with your World App to verify your identity</p>
            <div className="text-center">
              <Button onClick={openWorldcoinApp} variant="outline" className="w-full">
                <Smartphone className="w-4 h-4 mr-2" />
                Open Worldcoin App
              </Button>
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <div>
              <p className="font-medium text-red-900">Verification Error</p>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        <div className="text-center">
          {!isVerified && !showQR ? (
            <Button
              onClick={handleWorldIDVerification}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              size="lg"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Starting verification...
                </>
              ) : (
                <>
                  <Globe className="w-4 h-4 mr-2" />
                  Verify with World ID
                </>
              )}
            </Button>
          ) : isVerified ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-green-600 font-medium">World ID Verification Complete!</p>
              <p className="text-sm text-gray-600">Welcome to World Fan...</p>
            </div>
          ) : (
            <div className="text-center">
              <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-sm text-gray-600">Waiting for verification...</p>
              <Button
                onClick={() => {
                  setShowQR(false)
                  setIsLoading(false)
                  setError(null)
                }}
                variant="outline"
                size="sm"
                className="mt-2"
              >
                Cancel
              </Button>
            </div>
          )}
        </div>

        <div className="text-xs text-gray-500 text-center">
          <p>
            By verifying with World ID, you agree to our{" "}
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
