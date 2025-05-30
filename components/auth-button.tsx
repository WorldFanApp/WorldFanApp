"use client"

import { signIn, signOut, useSession } from "next-auth/react"
import { useRouter } from "next/navigation";
import { IDKitWidget } from "@worldcoin/idkit";
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
  const router = useRouter();

  const handleVerification = async (result: any) => {
    console.log("IDKitWidget onSuccess result:", result); // Log the raw result from IDKit

    const { proof, merkle_root, nullifier_hash } = result;

    if (!proof || !merkle_root || !nullifier_hash) {
      console.error("Incomplete proof data received from IDKitWidget:", result);
      // Optionally, display a message to the user
      return;
    }

    try {
      const response = await fetch("/api/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          proof,
          merkle_root,
          nullifier_hash,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        console.log("World ID verified successfully!");
        // It's important that the page we redirect to (`/signup`)
        // can handle the user state post-verification.
        // This might involve checking for a session or other flags.
        router.push("/signup");
      } else {
        console.error("Verification failed:", data.error || "Unknown error from /api/verify");
        // Optionally, display a message to the user
      }
    } catch (error) {
      console.error("Error calling /api/verify:", error);
      // Optionally, display a message to the user
    }
  };

  const handleSignIn = () => {
    // This function might be deprecated if IDKitWidget handles sign-in directly
    // or if handleVerification triggers it.
    signIn("worldcoin", { callbackUrl })
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
    <IDKitWidget
      app_id="app_7a9639a92f85fcf27213f982eddb5064"
      action="worldfansignup"
      onSuccess={handleVerification}
      // handleVerify={handleVerification} // As per prompt, using onSuccess for now
    >
      {({ open }) => (
        <Button onClick={open} className={className} size="lg">
          Sign In with World ID
        </Button>
      )}
    </IDKitWidget>
  )
}
