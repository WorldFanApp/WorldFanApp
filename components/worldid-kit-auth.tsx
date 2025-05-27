"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Globe, Shield, Check, AlertCircle } from "lucide-react"
import { IDKitWidget, VerificationLevel, type ISuccessResult } from "@worldcoin/idkit"

interface WorldIDKitAuthProps {
  onSuccess: (worldId: string, userInfo: any) => void
}

export function WorldIDKitAuth({ onSuccess }: WorldIDKitAuthProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleVerify = async (proof: ISuccessResult) => {
    setIsLoading(true)
    setError(null)

    try {
      console.log("Received World ID proof:", proof)

      // Send proof to backend for verification
      const response = await fetch("/api/worldid/verify-proof", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          proof: proof.proof,
          merkle_root: proof.merkle_root,
          nullifier_hash: proof.nullifier_hash,
          verification_level: proof.verification_level,
        }),
      })

      const result = await response.json()

      if (result.success) {
        setIsVerified(true)
        setIsLoading(false)

        setTimeout(() => {
          onSuccess(result.nullifier_hash, {
            nullifier_hash: result.nullifier_hash,
            verification_level: result.verification_level,
            timestamp: new Date().toISOString(),
            verified: true,
          })
        }, 1000)
      } else {
        throw new Error(result.error || "Verification failed")
      }
    } catch (err: any) {
      console.error("Verification error:", err)
      setIsLoading(false)
      setError(err.message || "Verification failed. Please try again.")
    }
  }

  const onError = (error: any) => {
    console.error("World ID verification error:", error)
    setError("World ID verification failed. Please try again.")
  }

  return (
    <>
      <CardHeader className="text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Globe className="w-8 h-8 text-white" />
        </div>
        <CardTitle>Verify with World ID</CardTitle>
        <CardDescription>
          You must verify your identity with World ID to join World Fan and access exclusive music experiences.
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
              <p className="font-medium text-blue-900">Required Verification</p>
              <p className="text-sm text-blue-700">WorldID verification is required to prevent bots and scalpers</p>
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

        <div className="text-center">
          {!isVerified ? (
            <IDKitWidget
              app_id="app_7a9639a92f85fcf27213f982eddb5064"
              action="world_fan_signup"
              onSuccess={handleVerify}
              onError={onError}
              verification_level={VerificationLevel.Orb}
            >
              {({ open }) => (
                <Button
                  onClick={open}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
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
              )}
            </IDKitWidget>
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
          <p className="mb-2">
            <strong>WorldID verification is required.</strong>
          </p>
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
