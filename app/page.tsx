"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useMiniKit } from "@/components/minikit-provider"
import { Bug } from "lucide-react"
import { verifyWorldId } from "@/app/actions/verify-world-id"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle } from "lucide-react"

// World ID App ID provided by the user
const WORLD_ID_APP_ID = "app_7a9639a92f85fcf27213f982eddb5064"

export default function Home() {
  const { isWorldApp, isLoading, error: miniKitError } = useMiniKit()
  const [showDebug, setShowDebug] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationError, setVerificationError] = useState<string | null>(null)
  const [isVerified, setIsVerified] = useState(false)
  const router = useRouter()

  const handleGetStarted = async () => {
    // If already verified, go to signup
    if (isVerified) {
      router.push("/signup")
      return
    }

    setIsVerifying(true)
    setVerificationError(null)

    try {
      // Access the global MiniKit object
      const MiniKit = (window as any).MiniKit

      if (!MiniKit) {
        throw new Error("MiniKit is not available. Please ensure you're using the World App.")
      }

      console.log("Calling MiniKit.verify with app_id:", WORLD_ID_APP_ID)

      // Call the verify method
      const result = await MiniKit.verify({
        app_id: WORLD_ID_APP_ID,
        action: "world-music-signin",
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
          setIsVerified(true)
          // Store verification status
          localStorage.setItem("worldIdVerified", "true")
          // Redirect to signup
          router.push("/signup")
        } else {
          setVerificationError("Server verification failed. Please try again.")
        }
      } else {
        throw new Error(result.error || "Verification failed")
      }
    } catch (err) {
      console.error("Verification error:", err)
      setVerificationError(
        err instanceof Error ? err.message : "An error occurred during verification. Please try again.",
      )
    } finally {
      setIsVerifying(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src="/placeholder.svg?height=32&width=32&query=world%20logo"
              alt="World Logo"
              width={32}
              height={32}
            />
            <span className="text-xl font-bold">World Music</span>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="container py-12 md:py-24 lg:py-32">
          <div className="mx-auto flex max-w-[980px] flex-col items-center gap-4 text-center">
            <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:text-6xl lg:leading-[1.1]">
              Discover music with verified humans
            </h1>
            <p className="max-w-[750px] text-lg text-muted-foreground sm:text-xl">
              Join our community of Orb-verified music lovers. Share your preferences, discover new artists, and connect
              with others.
            </p>

            {verificationError && (
              <Alert className="max-w-md bg-red-50 border-red-200">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <AlertDescription className="text-red-800 ml-2">{verificationError}</AlertDescription>
              </Alert>
            )}

            {isVerified && (
              <Alert className="max-w-md bg-green-50 border-green-200">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <AlertDescription className="text-green-800 ml-2">
                  Successfully verified with World ID! Redirecting...
                </AlertDescription>
              </Alert>
            )}

            <div className="flex flex-col gap-4 sm:flex-row">
              <Button size="lg" onClick={handleGetStarted} disabled={isVerifying || isLoading}>
                {isVerifying ? "Verifying..." : "Get Started with World ID"}
              </Button>
            </div>

            <p className="text-sm text-muted-foreground max-w-md">
              By clicking "Get Started", you'll be asked to verify your identity with World ID to ensure you're a unique
              human.
            </p>
          </div>
        </section>
        <section className="container py-12 md:py-24 lg:py-32">
          <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Orb Verified</h2>
                <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform uses World ID to ensure every user is a unique human, creating a trusted community for
                  music lovers.
                </p>
              </div>
            </div>
            <div className="flex justify-center">
              <Image
                src="/placeholder.svg?height=400&width=400&query=orb%20verification%20device"
                alt="Orb Verification"
                width={400}
                height={400}
                className="rounded-lg object-cover"
              />
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} World Music. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
              Terms
            </a>
            <a href="#" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
              Privacy
            </a>
            <button
              onClick={() => setShowDebug(!showDebug)}
              className="text-sm text-muted-foreground underline-offset-4 hover:underline flex items-center gap-1"
            >
              <Bug className="h-3 w-3" />
              {showDebug ? "Hide Debug" : "Debug"}
            </button>
          </div>
        </div>

        {/* Debug information - only shown when debug mode is enabled */}
        {showDebug && (
          <div className="container mt-4 p-4 border border-gray-200 rounded-md bg-gray-50">
            <h3 className="text-sm font-medium flex items-center gap-1">
              <Bug className="h-4 w-4" /> Debug Information
            </h3>
            <p className="text-xs mt-1">World App: {isWorldApp ? "Yes" : "No"}</p>
            <p className="text-xs">Environment: {process.env.NODE_ENV}</p>
            <p className="text-xs">
              MiniKit Available: {typeof (window as any).MiniKit !== "undefined" ? "Yes" : "No"}
            </p>
            {miniKitError && <p className="text-xs text-red-600 mt-1">MiniKit Error: {miniKitError}</p>}
          </div>
        )}
      </footer>
    </div>
  )
}
