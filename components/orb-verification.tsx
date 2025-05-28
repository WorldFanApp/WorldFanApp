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

interface OrbVerificationProps {
  onVerified: () => void
  isVerified: boolean
}

export function OrbVerification({ onVerified, isVerified }: OrbVerificationProps) {
  const [isVerifying, setIsVerifying] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showDebug, setShowDebug] = useState(false)
  const { isWorldApp, isInitialized, isLoading } = useMiniKit()

  const handleVerify = async () => {
    if (isLoading) {
      setError("Still initializing. Please wait a moment and try again.")
      return
    }

    setIsVerifying(true)
    setError(null)

    try {
      // Access the global MiniKit object
      const MiniKit = (window as any).MiniKit

      if (!MiniKit) {
        throw new Error("MiniKit is not available")
      }

      console.log("Calling MiniKit.verify with app_id:", WORLD_ID_APP_ID)

      // Call the verify method
      const result = await MiniKit.verify({
        app_id: WORLD_ID_APP_ID,
        action: "world-music-signup",
        verification_level: "orb",
      })

      console.log("Verification result:", result)

      if (result.success) {
        // Send the proof to your backend for verification
        const verificationResult = await verifyWorldId({
          proof: result.proof,
          merkle_root: result.merkle_root,
          nullifier_hash: result.nullifier_hash,
          verification_level: result.verification_level,
        })

        if (verificationResult.success) {
          onVerified()
        } else {
          setError("Server verification failed. Please try again.")
        }
      } else {
        throw new Error(result.error || "Verification failed")
      }
    } catch (err) {
      console.error("Verification error:", err)
      setError(err instanceof Error ? err.message : "An error occurred during verification. Please try again.")
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

  if (isLoading) {
    return (
      <div className="flex flex-col items-center space-y-6 py-4">
        <div className="text-center space-y-2">
          <h3 className="text-lg font-medium">Initializing...</h3>
          <p className="text-muted-foreground">Please wait while we connect to World ID.</p>
        </div>
      </div>
    )
  }

  // In development mode, we'll allow verification even if not in World App
  const allowVerification = isWorldApp || process.env.NODE_ENV === "development"

  if (!allowVerification) {
    return (
      <div className="flex flex-col items-center space-y-6 py-4">
        <Alert className="bg-yellow-50 border-yellow-200">
          <AlertCircle className="h-5 w-5 text-yellow-600" />
          <AlertDescription className="text-yellow-800 ml-2">
            Orb verification requires the World App. Please open this application in the World App to continue.
          </AlertDescription>
        </Alert>

        <p className="text-center text-muted-foreground">
          Please download and open this application in the World App for the full experience.
        </p>

        <Button asChild variant="outline" className="flex items-center gap-2">
          <a href="https://worldcoin.org/download" target="_blank" rel="noopener noreferrer">
            Download World App <ExternalLink className="h-4 w-4" />
          </a>
        </Button>

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
              <li>World App: {isWorldApp ? "Yes" : "No"}</li>
              <li>Initialized: {isInitialized ? "Yes" : "No"}</li>
              <li>Environment: {process.env.NODE_ENV}</li>
              <li>Error: {error || "None"}</li>
              <li>MiniKit Available: {typeof (window as any).MiniKit !== "undefined" ? "Yes" : "No"}</li>
            </ul>
          </div>
        )}
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

        {process.env.NODE_ENV === "development" && !isWorldApp && (
          <Alert className="mt-4 bg-blue-50 border-blue-200">
            <AlertCircle className="h-5 w-5 text-blue-600" />
            <AlertDescription className="text-blue-800 ml-2">
              Development mode: Using mock verification since you're not in the World App.
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
            <li>World App: {isWorldApp ? "Yes" : "No"}</li>
            <li>Initialized: {isInitialized ? "Yes" : "No"}</li>
            <li>Environment: {process.env.NODE_ENV}</li>
            <li>MiniKit Available: {typeof (window as any).MiniKit !== "undefined" ? "Yes" : "No"}</li>
          </ul>
        </div>
      )}
    </div>
  )
}
