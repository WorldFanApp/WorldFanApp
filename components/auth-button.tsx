"use client"

import { signIn, signOut, useSession } from "next-auth/react"
import { MiniKit, VerifyCommandInput, VerificationLevel, ISuccessResult } from '@worldcoin/minikit-js'
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface AuthButtonProps {
  callbackUrl?: string
  className?: string
}

export function AuthButton({ callbackUrl = "/signup", className }: AuthButtonProps) {
  const { data: session, status } = useSession()

  const handleSignIn = async () => {
    if (!MiniKit.isInstalled()) {
      console.warn("MiniKit not available");
      return;
    }

    const verifyPayload: VerifyCommandInput = {
      action: 'your-action-id', // Placeholder
      signal: 'user-specific-signal', // Placeholder
      verification_level: VerificationLevel.Orb,
    };

    try {
      const { finalPayload } = await MiniKit.commandsAsync.verify(verifyPayload);

      if (finalPayload.status === 'error') {
        console.error('World ID verification error:', finalPayload);
        return;
      }

      // Send verification result to backend
      const response = await fetch('/api/minikit-verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          payload: finalPayload as ISuccessResult,
          action: verifyPayload.action,
          signal: verifyPayload.signal,
        }),
      });

      const backendResponse = await response.json();
      console.log('Backend verification response:', backendResponse);

      // Original signIn call removed for now
      // signIn("worldcoin", { callbackUrl }) 
    } catch (error) {
      console.error('Error during MiniKit verification or backend call:', error);
    }
  }

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" })
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
            <span>Verified as {session.user?.name || "World ID User"}</span>
            {session.user?.worldcoin_credential_type && (
              <Badge className={getCredentialBadgeColor(session.user.worldcoin_credential_type)}>
                {session.user.worldcoin_credential_type === "orb"
                  ? "Orb Verified"
                  : session.user.worldcoin_credential_type}
              </Badge>
            )}
          </AlertDescription>
        </Alert>
        <Button onClick={handleSignOut} className={className}>
          Sign Out
        </Button>
      </div>
    )
  }

  return (
    <Button onClick={handleSignIn} className={className} size="lg">
      Sign In with World ID
    </Button>
  )
}
