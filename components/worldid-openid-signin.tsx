"use client"

import { useState, useEffect } from "react"
import { useSession, signIn, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Check, AlertCircle, Globe, LogOut, User } from "lucide-react"

interface WorldIDOpenIDSignInProps {
  onSuccess: (worldId: string, userInfo: any) => void
  onDeveloperMode: () => void
}

export function WorldIDOpenIDSignIn({ onSuccess, onDeveloperMode }: WorldIDOpenIDSignInProps) {
  const { data: session, status } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Handle successful session
  useEffect(() => {
    if (session?.user?.worldcoin) {
      console.log("Session established with World ID:", session.user.worldcoin)

      const userData = {
        worldId: session.user.worldcoin.nullifier_hash,
        nullifierHash: session.user.worldcoin.nullifier_hash,
        verificationLevel: session.user.worldcoin.verification_level,
        isHumanVerified: true,
        verifiedAt: new Date().toISOString(),
        platform: "worldid_openid",
        // User profile data
        username: session.user.name || `worldfan_${session.user.worldcoin.nullifier_hash?.slice(-6)}`,
        email: session.user.email || "",
        // Default preferences
        genres: [],
        cities: [],
        favoriteArtists: "",
        ticketStruggles: "",
        priceRange: "$50-150",
        notifications: true,
        session: session,
      }

      onSuccess(session.user.worldcoin.nullifier_hash, userData)
    }
  }, [session, onSuccess])

  const handleSignIn = async () => {
    setIsLoading(true)
    setError(null)

    try {
      console.log("Starting World ID OpenID Connect sign-in...")

      const result = await signIn("worldcoin", {
        redirect: false,
        callbackUrl: "/dashboard",
      })

      console.log("Sign-in result:", result)

      if (result?.error) {
        throw new Error(result.error)
      }

      // Success will be handled by the useEffect when session updates
    } catch (err: any) {
      console.error("Sign-in error:", err)
      setError(`Sign-in failed: ${err.message}`)
      setIsLoading(false)
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
              <p>
                <strong>Name:</strong> {session.user.name}
              </p>
              <p>
                <strong>Email:</strong> {session.user.email}
              </p>
              {session.user.worldcoin && (
                <>
                  <p>
                    <strong>Verification Level:</strong> {session.user.worldcoin.verification_level}
                  </p>
                  <p>
                    <strong>Nullifier Hash:</strong> {session.user.worldcoin.nullifier_hash?.slice(0, 20)}...
                  </p>
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
        <CardDescription>Use OpenID Connect to securely authenticate with your World ID</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4">
          <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
            <Shield className="w-5 h-5 text-green-600" />
            <div>
              <p className="font-medium text-green-900">Secure Authentication</p>
              <p className="text-sm text-green-700">OpenID Connect standard with World ID verification</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
            <Check className="w-5 h-5 text-blue-600" />
            <div>
              <p className="font-medium text-blue-900">Privacy Protected</p>
              <p className="text-sm text-blue-700">Your identity stays private, we only verify you're human</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
            <User className="w-5 h-5 text-purple-600" />
            <div>
              <p className="font-medium text-purple-900">Unique Human</p>
              <p className="text-sm text-purple-700">Prevents bots and ensures fair access to tickets</p>
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

          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">Having issues with World ID?</p>
            <Button onClick={onDeveloperMode} variant="outline" size="sm">
              <User className="w-4 h-4 mr-2" />
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
