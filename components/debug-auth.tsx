"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bug, Copy } from "lucide-react"

export function DebugAuth() {
  const { data: session, status } = useSession()
  const [showDebug, setShowDebug] = useState(false)
  const [copied, setCopied] = useState(false)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  // Get the base URL for the application
  const baseUrl = typeof window !== "undefined" ? window.location.origin : ""
  const callbackUrl = `${baseUrl}/api/auth/callback/worldcoin`

  if (!showDebug) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="flex items-center gap-1 text-xs text-muted-foreground"
        onClick={() => setShowDebug(true)}
      >
        <Bug className="h-3 w-3" />
        Show Debug Info
      </Button>
    )
  }

  return (
    <Card className="mt-4">
      <CardHeader className="py-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-1">
            <Bug className="h-4 w-4" /> Auth Debug Information
          </CardTitle>
          <Button variant="ghost" size="sm" className="h-7 px-2" onClick={() => setShowDebug(false)}>
            Hide
          </Button>
        </div>
        <CardDescription className="text-xs">
          Session Status: <span className="font-mono">{status}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="text-xs space-y-2 py-2">
        <div>
          <p className="font-semibold mb-1">Environment:</p>
          <div className="bg-muted p-2 rounded overflow-auto">
            <p>NODE_ENV: {process.env.NODE_ENV}</p>
            <p>
              WORLDCOIN_CLIENT_ID:{" "}
              {process.env.WORLDCOIN_CLIENT_ID
                ? "***" + process.env.WORLDCOIN_CLIENT_ID.slice(-6)
                : "app_***92f85fcf27213f982eddb5064"}
            </p>
          </div>
        </div>

        {session && (
          <div>
            <p className="font-semibold mb-1">Session Data:</p>
            <pre className="bg-muted p-2 rounded overflow-auto max-h-60 whitespace-pre-wrap">
              {JSON.stringify(
                {
                  user: session.user,
                  expires: session.expires,
                },
                null,
                2,
              )}
            </pre>
          </div>
        )}

        <div className="pt-2">
          <p className="font-semibold mb-1">Callback URL:</p>
          <div className="flex items-center gap-2 bg-muted p-2 rounded">
            <code className="flex-1 break-all">{callbackUrl}</code>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 rounded-full"
              onClick={() => copyToClipboard(callbackUrl)}
            >
              <Copy className="h-3 w-3" />
              <span className="sr-only">Copy</span>
            </Button>
          </div>
          {copied && <p className="text-xs text-green-600 mt-1">Copied to clipboard!</p>}
          <p className="text-xs text-muted-foreground mt-2">
            Make sure this URL is added to your World ID application&apos;s allowed callback URLs.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
