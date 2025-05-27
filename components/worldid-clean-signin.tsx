"use client"

import { useState, useEffect } from "react"
import { signIn, signOut, useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Check, AlertCircle, User, Zap, LogOut } from "lucide-react"

interface WorldIDCleanSignInProps {
  onSuccess: (worldId: string, userInfo: any) => void
  onDeveloperMode: () => void
}

export function WorldIDCleanSignIn({ onSuccess, onDeveloperMode }: WorldIDCleanSignInProps) {
  const [isSigningIn, setIsSigningIn] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { data: session, status } = useSession()

  useEffect(() => {
    if (session?.user) {
      console.log("NextAuth session established:", session)

      // Create user data from session
      const userData = {
        worldId: session.user.id || `worldid_${Date.now()}`,
        nullifierHash: session.user.id || `nullifier_${Date.now()}`,
        verificationLevel: "worldid_verified",
        isHumanVerified: true,
        verifiedAt: new Date().toISOString(),
        platform: "nextauth_worldid",
        username: session.user.name || `worldfan_${Date.now().toString().slice(-6)}`,
        email: session.user.email || "",
        image: session.user.image || "",
        // Default preferences
        genres: [],
        cities: [],
        favoriteArtists: "",
        ticketStruggles: "",
        priceRange: "$50-150",
        notifications: true,
        session: session,
      }

      onSuccess(userData.worldId, userData)
    }
  }, [session, onSuccess])

  const handleSignIn = async () => {
    setIsSigningIn(true)
    setError(null)

    try {
      console.log("Starting World ID sign-in via NextAuth...")

      const result = await signIn("worldcoin", {
        redirect: false,
        callbackUrl: "/dashboard",
      })

      console.log("NextAuth sign-in result:", result)

      if (result?.error) {
        setError(`Authentication failed: ${result.error}`)
      } else if (result?.ok) {
        console.log("Sign-in successful, waiting for session...")
      }
    } catch (error: any) {
      console.error("Sign-in error:", error)
      setError(`Sign-in failed: ${error.message}`)
    } finally {
      setIsSigningIn(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut({ redirect: false })
      setError(null)
    } catch (error: any) {
      console.error("Sign out error:", error)
    }
  }

  // Loading state
  if (status === "loading") {
    return (
      <>
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
          </div>
          <CardTitle>Loading...</CardTitle>
          <CardDescription>Checking your authentication status...</CardDescription>
        </CardHeader>
      </>
    )
  }

  // Authenticated state
  if (session?.user) {
    return (
      <>
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle>Welcome to World Fan!</CardTitle>
          <CardDescription>Successfully authenticated with World ID</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold text-green-900 mb-2">Authentication Details</h4>
            <div className="text-sm text-green-800 space-y-1">
              <p>
                <strong>Name:</strong> {session.user.name || "World ID User"}
              </p>
              <p>
                <strong>Email:</strong> {session.user.email || "Not provided"}
              </p>
              <p>
                <strong>Provider:</strong> World ID via NextAuth
              </p>
              <p>
                <strong>Status:</strong> Verified Human
              </p>
            </div>
          </div>

          <Button onClick={handleSignOut} variant="outline" className="w-full">
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </CardContent>
      </>
    )
  }

  // Sign-in interface
  return (
    <>
      <CardHeader className="text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="w-8 h-8 text-white" />
        </div>
        <CardTitle>Sign in with World ID</CardTitle>
        <CardDescription>
          Secure authentication for accessing fair-priced tickets and exclusive vinyl drops
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4">
          <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
            <Shield className="w-5 h-5 text-green-600" />
            <div>
              <p className="font-medium text-green-900">Secure & Private</p>
              <p className="text-sm text-green-700">Your identity stays protected</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
            <Check className="w-5 h-5 text-blue-600" />
            <div>
              <p className="font-medium text-blue-900">Human Verified</p>
              <p className="text-sm text-blue-700">Proof you're a real person, not a bot</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
            <User className="w-5 h-5 text-purple-600" />
            <div>
              <p className="font-medium text-purple-900">Exclusive Access</p>
              <p className="text-sm text-purple-700">Fair tickets and limited vinyl releases</p>
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

        <div className="text-center space-y-3">
          <Button
            onClick={handleSignIn}
            disabled={isSigningIn}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            size="lg"
          >
            {isSigningIn ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Signing in with World ID...
              </>
            ) : (
              <>
                <Shield className="w-4 h-4 mr-2" />
                Sign in with World ID
              </>
            )}
          </Button>

          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">Want to test the app features?</p>
            <Button onClick={onDeveloperMode} variant="outline" size="sm">
              <Zap className="w-4 h-4 mr-2" />
              Continue with Developer Mode
            </Button>
          </div>
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
