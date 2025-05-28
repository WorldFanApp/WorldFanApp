"use client"

import { useState } from "react"
import { signIn, signOut, useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface AuthButtonProps {
  callbackUrl?: string
  className?: string
}

export function AuthButton({ callbackUrl = "/signup", className }: AuthButtonProps) {
  const { data: session, status } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSignIn = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Use redirect: false to handle errors manually
      const result = await signIn("worldcoin", { callbackUrl, redirect: false })

      if (result?.error) {
        setError(`Authentication error: ${result.error}`)
      } else if (result?.url) {
        // Manually redirect to avoid client-side navigation issues
        window.location.href = result.url
      }
    } catch (err) {
      console.error("Sign in error:", err)
      setError("An error occurred during sign in. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignOut = async () => {
    setIsLoading(true)
    try {
      await signOut({ callbackUrl: "/" })
    } catch (err) {
      console.error("Sign out error:", err)
      setIsLoading(false)
    }
  }

  // Get credential type badge color
  const getCredentialBadgeColor = (type?: string) => {
    switch (type) {
      case "orb":
        return "bg-green-100 text-green-800 border-green-200"
      case "phone":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  if (status === "loading") {
    return (
      <Button disabled className={className}>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Loading...
      </Button>
    )
  }

  if (session) {
    return (
      <div className="space-y-4">
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <AlertDescription className="text-green-800 ml-2 flex items-center justify-between w-full">
            <span>Signed in as {session.user?.name || session.user?.email || "Verified User"}</span>
            {session.user?.worldcoin_credential_type && (
              <Badge className={getCredentialBadgeColor(session.user.worldcoin_credential_type)}>
                {session.user.worldcoin_credential_type}
              </Badge>
            )}
          </AlertDescription>
        </Alert>
        <Button onClick={handleSignOut} disabled={isLoading} className={className}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Sign Out
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {error && (
        <Alert className="bg-red-50 border-red-200">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <AlertDescription className="text-red-800 ml-2">{error}</AlertDescription>
        </Alert>
      )}
      <Button onClick={handleSignIn} disabled={isLoading} className={className}>
        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        Sign In with World ID
      </Button>
    </div>
  )
}
