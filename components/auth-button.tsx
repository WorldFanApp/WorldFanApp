"use client"

import { signIn, signOut, useSession } from "next-auth/react"
import { useRouter } from "next/navigation";
import { MiniKit, VerifyCommandInput, VerificationLevel, ISuccessResult } from '@worldcoin/minikit-js';
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

  // Adjusted to accept ISuccessResult from MiniKit and send the new payload structure
  const handleVerification = async (miniKitPayload: ISuccessResult) => {
    console.log("MiniKit verification payload:", miniKitPayload);

    // The MiniKit ISuccessResult directly contains proof, merkle_root, nullifier_hash
    if (!miniKitPayload.proof || !miniKitPayload.merkle_root || !miniKitPayload.nullifier_hash) {
      console.error("Incomplete proof data received from MiniKit:", miniKitPayload);
      return;
    }

    try {
      const response = await fetch("/api/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          payload: miniKitPayload, // Send the whole payload as per new backend expectation
          action: "worldfansignup", // The action ID used for verification
          signal: undefined, // Adjust if signal is used
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        console.log("World ID verified successfully via MiniKit!");
        router.push("/signup");
      } else {
        console.error("MiniKit Backend Verification failed:", data.error || "Unknown error from /api/verify");
      }
    } catch (error) {
      console.error("Error calling /api/verify with MiniKit payload:", error);
    }
  };

  const initiateMiniAppVerify = async () => {
    console.log("[AuthButton] initiateMiniAppVerify called");

    const isMiniKitInstalled = MiniKit.isInstalled();
    console.log("[AuthButton] MiniKit.isInstalled():", isMiniKitInstalled);

    if (!isMiniKitInstalled) {
      console.warn("[AuthButton] MiniKit not detected as installed. Verification cannot proceed.");
      // Optionally: guide user to install World App or open a fallback URL
      // window.open("https://worldcoin.org/download", "_blank");
      return;
    }

    const verifyPayload: VerifyCommandInput = {
      action: "worldfansignup", // Use your specific action ID
      verification_level: VerificationLevel.Orb, // Or VerificationLevel.Device
    };
    console.log("[AuthButton] Preparing verifyPayload:", verifyPayload);

    let result; // Declare result outside try to log it in broader scope if needed, though primarily used within try
    try {
      console.log("[AuthButton] Calling MiniKit.commandsAsync.verify...");
      result = await MiniKit.commandsAsync.verify(verifyPayload);
      console.log("[AuthButton] MiniKit.commandsAsync.verify returned:", result);

      if (result.status === 'error') {
        console.error('[AuthButton] MiniApp verification error after successful call (result.status is error):', result.errorToast?.message || result.error);
        // Display error to user, e.g., using a toast notification
      } else if (result.status === 'success' && result.finalPayload) {
        console.log("[AuthButton] MiniApp verification success, proceeding to handleVerification.");
        // The type assertion here assumes finalPayload matches ISuccessResult structure
        handleVerification(result.finalPayload as ISuccessResult);
      } else {
        console.warn("[AuthButton] MiniKit.commandsAsync.verify returned success but finalPayload is missing or status is unexpected:", result);
      }
    } catch (error) {
      console.error('[AuthButton] Error during MiniKit.commandsAsync.verify call itself:', error);
      // Handle unexpected errors during the verify call
    }
  };

  // This handleSignIn might be fully replaced by initiateMiniAppVerify
  const handleSignIn = () => {
    // This function is likely no longer needed if MiniKit is the primary sign-in method
    // For now, let's keep it but it might be removed later.
    // initiateMiniAppVerify(); // Or call signIn("worldcoin") if that's still a separate path
    console.log("Legacy handleSignIn called, consider removing or integrating with MiniKit flow.");
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
    // IDKitWidget removed, Button now directly calls initiateMiniAppVerify
    <Button onClick={initiateMiniAppVerify} className={className} size="lg">
      Sign In with World ID
    </Button>
  )
}
