"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, ArrowLeft, ExternalLink } from "lucide-react"

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)
  const [errorDescription, setErrorDescription] = useState<string | null>(null)

  useEffect(() => {
    const errorParam = searchParams.get("error")
    if (errorParam) {
      setError(errorParam)

      // Set World ID specific error descriptions
      switch (errorParam) {
        case "Configuration":
          setErrorDescription(
            "There is a configuration issue with World ID. Please ensure your World ID app is properly configured.",
          )
          break
        case "AccessDenied":
          setErrorDescription("Access was denied. Please ensure you have completed Orb verification in the World App.")
          break
        case "OAuthSignin":
        case "OAuthCallback":
          setErrorDescription(
            "There was an error connecting to World ID. Please ensure your World App is up to date and try again.",
          )
          break
        case "CLIENT_FETCH_ERROR":
          setErrorDescription(
            "Unable to connect to World ID servers. This may be due to network issues or World ID service availability. Please try again later.",
          )
          break
        default:
          setErrorDescription("An error occurred during World ID authentication. Please try again.")
      }
    }
  }, [searchParams])

  return (
    <div className="container flex items-center justify-center min-h-screen py-10">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>World ID Authentication Error</CardTitle>
          <CardDescription>There was a problem verifying your World ID</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{error || "Authentication Error"}</AlertTitle>
            <AlertDescription>
              {errorDescription || "An error occurred during World ID authentication. Please try again."}
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            <h3 className="font-medium text-sm">Troubleshooting Steps:</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
              <li>Ensure you have the World App installed on your device</li>
              <li>Verify you have completed Orb verification</li>
              <li>Check your internet connection</li>
              <li>Try signing in again</li>
            </ol>
          </div>

          <div className="pt-2">
            <Button asChild variant="outline" size="sm" className="w-full">
              <a
                href="https://worldcoin.org/download"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1"
              >
                Download World App <ExternalLink className="h-3 w-3" />
              </a>
            </Button>
          </div>
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
