"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, ExternalLink } from "lucide-react"
import { useMiniKit } from "@/components/minikit-provider"
import { verifyWorldId } from "@/app/actions/verify-world-id"

// World ID App ID provided by the user
const WORLD_ID_APP_ID = "app_7a9639a92f85fcf27213f982eddb5064"

// Mock MiniKit for development/testing outside World App
const mockVerification = async () => {
  // Simulate verification delay
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // Return a mock successful verification
  return {
    finalPayload: {
      status: "success",
      proof: "mock_proof",
      merkle_root: "mock_merkle_root",
      nullifier_hash: "mock_nullifier_hash",
      verification_level: "orb",
    },
  }
}

interface OrbVerificationProps {
  onVerified: () => void
  isVerified: boolean
}

export function OrbVerification({ onVerified, isVerified }: OrbVerificationProps) {
  const [isVerifying, setIsVerifying] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showDebug, setShowDebug] = useState(false)
  const { isAvailable, isInstalled, isInitialized, isInitializing } = useMiniKit()

  const handleVerify = async () => {
    if (isInitializing) {
      setError("MiniKit is still initializing. Please wait a moment and try again.")
      return
    }

    setIsVerifying(true)
    setError(null)

    try {
      let verificationResult

      if (isAvailable && isInstalled) {
        // We're in the World App, use real verification
        console.log("Using real World ID verification with app ID:", WORLD_ID_APP_ID)

        // Access MiniKit safely
        // @ts-ignore - MiniKit might not be defined
        const MiniKit = window.MiniKit

        const { finalPayload } = await MiniKit.commandsAsync.verify({
          app_id: WORLD_ID_APP_ID,
          action: "world-music-signup",
          verification_level: "orb",
        })

        if (finalPayload.status === "success") {
          // Send the proof to your backend for verification
          verificationResult = await verifyWorldId({
            proof: finalPayload.proof,
            merkle_root: finalPayload.merkle_root,
            nullifier_hash: finalPayload.nullifier_hash,
            verification_level: finalPayload.verification_level,
          })
        } else {
          throw new Error(finalPayload.error_message || "Verification failed")
        }
      } else {
        // We're not in the World App, use mock verification for development
        console.log("Using mock verification (not in World App)")
        const { finalPayload } = await mockVerification()

        // Send the mock proof to your backend
        verificationResult = await verifyWorldId({
          proof: finalPayload.proof,
          merkle_root: finalPayload.merkle_root,
          nullifier_hash: finalPayload.nullifier_hash,
          verification_level: finalPayload.verification_level,
        })
      }

      if (verificationResult.success) {
        onVerified()
      } else {
        setError("Server verification failed. Please try again.")
      }
    } catch (err) {
      console.error("Verification error:", err)
      setError("An error occurred during verification. Please try again.")
    } finally {
      setIsVerifying(false)
    }
  }

  if (isVerified) {
    return (
      <Alert className="bg-green-50 border-green-200">
        <CheckCircle className="h-5 w-5 text-green-600" />
        <AlertDescription className="text-green-800 ml-2">
          Your identity has been successfully verified with World ID.
        </AlertDescription>
      </Alert>
    )
  }

  if (isInitializing) {
    return (
      <div className="flex flex-col items-center space-y-6 py-4">
        <div className="text-center space-y-2">
          <h3 className="text-lg font-medium">Initializing World ID...</h3>
          <p className="text-muted-foreground">Please wait while we connect to World ID.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center space-y-6 py-4">
      <Image
        src="/placeholder.svg?height=200&width=200&query=world%20id%20orb"
        alt="World ID Orb"
        width={200}
        height={200}
        className="rounded-full"
      />

      <div className="text-center space-y-2">
        <h3 className="text-lg font-medium">Verify with World ID</h3>
        <p className="text-muted-foreground">
          To continue, you need to verify your identity using World ID. This ensures you're a unique human.
        </p>

        {!isAvailable && !showDebug && (
          <Alert className="mt-4 bg-yellow-50 border-yellow-200">
            <AlertCircle className="h-5 w-5 text-yellow-600" />
            <AlertDescription className="text-yellow-800 ml-2">
              For the best experience, please open this app in the World App.
              {process.env.NODE_ENV === "development" && " Using mock verification for development."}
            </AlertDescription>
          </Alert>
        )}

        {isAvailable && !isInstalled && !showDebug && (
          <Alert className="mt-4 bg-yellow-50 border-yellow-200">
            <AlertCircle className="h-5 w-5 text-yellow-600" />
            <AlertDescription className="text-yellow-800 ml-2">
              Please open this app in the World App for real verification.
              <a
                href="https://worldcoin.org/download"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 underline mt-1"
              >
                Download World App <ExternalLink className="h-3 w-3" />
              </a>
            </AlertDescription>
          </Alert>
        )}
      </div>

      <Button onClick={handleVerify} disabled={isVerifying} className="w-full max-w-xs">
        {isVerifying ? "Verifying..." : "Verify with World ID"}
      </Button>

      {error && (
        <Alert className="mt-4 bg-red-50 border-red-200">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <AlertDescription className="text-red-800 ml-2">{error}</AlertDescription>
        </Alert>
      )}

      <p className="text-sm text-muted-foreground text-center">
        By verifying, you agree to the World ID{" "}
        <a href="https://worldcoin.org/terms" className="underline" target="_blank" rel="noopener noreferrer">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="https://worldcoin.org/privacy" className="underline" target="_blank" rel="noopener noreferrer">
          Privacy Policy
        </a>
        .
      </p>

      <button
        onClick={() => setShowDebug(!showDebug)}
        className="text-xs text-muted-foreground underline-offset-4 hover:underline mt-4"
      >
        {showDebug ? "Hide Debug Info" : "Show Debug Info"}
      </button>

      {showDebug && (
        <div className="w-full p-4 border border-gray-200 rounded-md bg-gray-50 text-xs">
          <h4 className="font-medium">Debug Information:</h4>
          <ul className="mt-2 space-y-1">
            <li>App ID: {WORLD_ID_APP_ID}</li>
            <li>MiniKit Available: {isAvailable ? "Yes" : "No"}</li>
            <li>World App: {isInstalled ? "Yes" : "No"}</li>
            <li>Initialized: {isInitialized ? "Yes" : "No"}</li>
            <li>Environment: {process.env.NODE_ENV}</li>
          </ul>
        </div>
      )}
    </div>
  )
}
