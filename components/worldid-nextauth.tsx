"use client"

import { useState, useEffect } from "react"
import { useSession, signIn, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Check, AlertCircle, Globe, Smartphone, LogOut } from "lucide-react"
import { MiniKit, ResponseEvent } from "@worldcoin/minikit-js"

interface WorldIDNextAuthProps {
  onSuccess: (worldId: string, userInfo: any) => void
}

export function WorldIDNextAuth({ onSuccess }: WorldIDNextAuthProps) {
  const { data: session, status } = useSession()
  const [isLoading, setIsLoading] = useState(false)
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
          isIframe: window.self !== window.top,
          sessionStatus: status,
          hasSession: !!session,
        }
        setDebugInfo(debug)
        console.log("Debug info:", debug)

        // Subscribe to MiniKit sign-in events
        MiniKit.subscribe(ResponseEvent.MiniAppSignIn, async (response) => {
          console.log("MiniKit sign-in response:", response)

          if (response.status === "success") {
            setIsLoading(true)
            try {
              // Trigger NextAuth.js sign-in with the World ID response
              const result = await signIn("worldcoin", {
                redirect: false,
                ...response.payload,
              })

              if (result?.ok) {
                console.log("NextAuth sign-in successful")
                setError(null)
              } else {
                throw new Error(result?.error || "NextAuth sign-in failed")
              }
            } catch (err: any) {
              console.error("NextAuth sign-in error:", err)
              setError(`Authentication failed: ${err.message}`)
            } finally {
              setIsLoading(false)
            }
          } else {
            console.error("MiniKit sign-in failed:", response.error)
            setError(`World ID verification failed: ${response.error?.message || "Unknown error"}`)
          }
        })
      } catch (err: any) {
        console.error("MiniKit initialization failed:", err)
        setError(`Failed to initialize World ID: ${err.message}`)
      }

      return () => {
        try {
          MiniKit.unsubscribe(ResponseEvent.MiniAppSignIn)
        } catch (err) {
          console.log("Cleanup error:", err)
        }
      }
    }
  }, [])

  // Handle successful session
  useEffect(() => {
    if (session?.user?.worldcoin) {
      console.log("Session established with World ID:", session.user.worldcoin)
      onSuccess(session.user.worldcoin.nullifier_hash, {
        nullifier_hash: session.user.worldcoin.nullifier_hash,
        verification_level: session.user.worldcoin.verification_level,
        timestamp: new Date().toISOString(),
        platform: "nextauth_worldid",
        session: session,
      })
    }
  }, [session, onSuccess])

  const handleSignIn = () => {
    if (!MiniKit.isInstalled()) {
      setError("This app must be opened in the World App to sign in with World ID.")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      console.log("Starting World ID sign-in with MiniKit...")

      MiniKit.commands.signIn({
        action: process.env.NEXT_PUBLIC_WORLDCOIN_ACTION || "signin",
        app_id: process.env.NEXT_PUBLIC_WORLDCOIN_APP_ID!,
      })

      console.log("MiniKit sign-in command sent")
    } catch (err: any) {
      console.error("MiniKit sign-in command failed:", err)
      setIsLoading(false)
      setError(`Failed to start World ID verification: ${err.message}`)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut({ redirect: false })
      setError(null)
    } catch (err: any) {
      console.error("Sign out error:", err)
      setError(`Sign out failed: ${err.message}`)
    }
  }

  const handleDevelopmentMode = () => {
    // Simulate successful authentication for development
    onSuccess("dev_user_" + Date.now(), {
      nullifier_hash: "dev_user_" + Date.now(),
      verification_level: "orb",
      timestamp: new Date().toISOString(),
      platform: "development_mode",
      note: "Development mode for testing",
    })
  }

  // Show loading state
  if (status === "loading") {
    return (
      <>
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Globe className="w-8 h-8 text-white" />
          </div>
          <CardTitle>Loading...</CardTitle>
          <CardDescription>Checking your authentication status...</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto" />
        </CardContent>
      </>
    )
  }

  // Show authenticated state
  if (session?.user) {
    return (
      <>
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle>Welcome to World Fan!</CardTitle>
          <CardDescription>You're successfully authenticated with World ID</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold text-green-900 mb-2">Authentication Details</h4>
            <div className="text-sm text-green-800 space-y-1">
              <p>User ID: {session.user.id}</p>
              {session.user.worldcoin && (
                <>
                  <p>Verification Level: {session.user.worldcoin.verification_level}</p>
                  <p>Nullifier Hash: {session.user.worldcoin.nullifier_hash?.slice(0, 20)}...</p>
                </>
              )}
            </div>
          </div>

          <div className="text-center">
            <Button onClick={handleSignOut} variant="outline" className="w-full">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </CardContent>
      </>
    )
  }

  // Show sign-in interface
  return (
    <>
      <CardHeader className="text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Globe className="w-8 h-8 text-white" />
        </div>
        <CardTitle>Sign in with World ID</CardTitle>
        <CardDescription>
          Verify your identity with World ID to access World Fan's exclusive music experiences
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
              <p className="font-medium text-blue-900">Anti-Bot Protection</p>
              <p className="text-sm text-blue-700">Prevents scalpers and bots from accessing fair-priced tickets</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <div>
              <p className="font-medium text-red-900">Authentication Error</p>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Debug Information */}
        <details className="bg-gray-50 p-3 rounded-lg">
          <summary className="text-xs font-medium text-gray-700 cursor-pointer">
            Debug Information (Click to expand)
          </summary>
          <div className="text-xs text-gray-600 mt-2 space-y-1">
            <p>
              <strong>Environment:</strong>
            </p>
            <p>MiniKit Installed: {debugInfo.miniKitInstalled ? "✓" : "✗"}</p>
            <p>Session Status: {debugInfo.sessionStatus}</p>
            <p>Has Session: {debugInfo.hasSession ? "✓" : "✗"}</p>
            <p>App ID: {process.env.NEXT_PUBLIC_WORLDCOIN_APP_ID}</p>
            <p>Action: {process.env.NEXT_PUBLIC_WORLDCOIN_ACTION || "signin"}</p>
          </div>
        </details>

        <div className="text-center space-y-3">
          <Button
            onClick={handleSignIn}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            size="lg"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Signing in with World ID...
              </>
            ) : (
              <>
                <Globe className="w-4 h-4 mr-2" />
                Sign in with World ID
              </>
            )}
          </Button>

          {!debugInfo.miniKitInstalled && (
            <div className="bg-yellow-50 p-3 rounded-lg">
              <p className="text-sm text-yellow-800">
                <Smartphone className="w-4 h-4 inline mr-1" />
                This app must be opened in the World App for World ID verification.
              </p>
            </div>
          )}

          <Button onClick={handleDevelopmentMode} variant="outline" className="w-full" size="sm">
            <Check className="w-4 h-4 mr-2" />
            Continue with Development Mode (Testing)
          </Button>
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
