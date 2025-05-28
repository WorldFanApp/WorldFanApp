"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, ArrowLeft, Bug } from "lucide-react"

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)
  const [errorDescription, setErrorDescription] = useState<string | null>(null)
  const [showDebug, setShowDebug] = useState(false)

  useEffect(() => {
    const errorParam = searchParams.get("error")
    if (errorParam) {
      setError(errorParam)

      // Set a more user-friendly error description based on the error code
      switch (errorParam) {
        case "Configuration":
          setErrorDescription("There is a problem with the server configuration. Please contact support.")
          break
        case "AccessDenied":
          setErrorDescription("You do not have permission to sign in.")
          break
        case "Verification":
          setErrorDescription("The verification process failed. Please try again.")
          break
        case "OAuthSignin":
          setErrorDescription("Error in the OAuth sign-in process. Please try again.")
          break
        case "OAuthCallback":
          setErrorDescription("Error in the OAuth callback process. Please try again.")
          break
        case "OAuthCreateAccount":
          setErrorDescription("Could not create an OAuth account. Please try again.")
          break
        case "EmailCreateAccount":
          setErrorDescription("Could not create an email account. Please try again.")
          break
        case "Callback":
          setErrorDescription("The callback process failed. Please try again.")
          break
        case "OAuthAccountNotLinked":
          setErrorDescription("This account is already linked to another profile.")
          break
        case "EmailSignin":
          setErrorDescription("The email sign-in process failed. Please try again.")
          break
        case "CredentialsSignin":
          setErrorDescription("The credentials you provided were invalid. Please try again.")
          break
        case "SessionRequired":
          setErrorDescription("You must be signed in to access this page.")
          break
        case "Default":
          setErrorDescription("An error occurred during authentication. Please try again.")
          break
        case "CLIENT_FETCH_ERROR":
          setErrorDescription(
            "There was a problem connecting to the authentication server. This might be due to network issues or incorrect configuration.",
          )
          break
        default:
          setErrorDescription("An unknown error occurred. Please try again.")
      }
    }
  }, [searchParams])

  return (
    <div className="container flex items-center justify-center min-h-screen py-10">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Authentication Error</CardTitle>
          <CardDescription>There was a problem signing you in</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{error || "Error"}</AlertTitle>
            <AlertDescription>
              {errorDescription || "An error occurred during authentication. Please try again."}
            </AlertDescription>
          </Alert>

          <div className="mt-4 text-sm text-muted-foreground">
            <p>If this problem persists, please contact support or try again later.</p>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="mt-4 text-xs flex items-center gap-1"
            onClick={() => setShowDebug(!showDebug)}
          >
            <Bug className="h-3 w-3" />
            {showDebug ? "Hide Debug Info" : "Show Debug Info"}
          </Button>

          {showDebug && (
            <div className="mt-2 p-2 border rounded text-xs">
              <p>
                <strong>Error:</strong> {error}
              </p>
              <p>
                <strong>Description:</strong> {errorDescription}
              </p>
              <p>
                <strong>URL:</strong> {typeof window !== "undefined" ? window.location.href : ""}
              </p>
              <p>
                <strong>Callback URL:</strong>{" "}
                {typeof window !== "undefined"
                  ? `${window.location.origin}/api/auth/callback/worldcoin`
                  : "/api/auth/callback/worldcoin"}
              </p>
              <p>
                <strong>Client ID:</strong> app_7a9639a92f85fcf27213f982eddb5064
              </p>
              <p>
                <strong>Environment:</strong> {process.env.NODE_ENV}
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" asChild>
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Return to Home
            </Link>
          </Button>
          <Button asChild>
            <Link href="/">Try Again</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
