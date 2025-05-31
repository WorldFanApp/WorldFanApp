"use client"

import { signIn, signOut, useSession } from "next-auth/react"
import { useRouter } from "next/navigation";
import { useState } from "react"; // Added useState
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
  const [debugMessages, setDebugMessages] = useState<string[]>([]);
  const [showProceedButton, setShowProceedButton] = useState<boolean>(false);

  const addDebugMessage = (message: string, data?: any) => {
    const fullMessage = data ? `${message} ${JSON.stringify(data, null, 2)}` : message;
    setDebugMessages(prev => [...prev, fullMessage]);
    // Also log to console for traditional debugging
    if (message.toLowerCase().includes("error") || message.toLowerCase().includes("warn")) {
      console.warn(fullMessage, data);
    } else {
      console.log(fullMessage, data);
    }
  };

  // Adjusted to accept ISuccessResult from MiniKit and send the new payload structure
  const handleVerification = async (miniKitPayload: ISuccessResult) => {
    addDebugMessage("[AuthButton] handleVerification called with payload:", miniKitPayload);

    if (!miniKitPayload.proof || !miniKitPayload.merkle_root || !miniKitPayload.nullifier_hash) {
      addDebugMessage("[AuthButton] Error: Incomplete proof data received from MiniKit.", miniKitPayload);
      return;
    }

    try {
      addDebugMessage("[AuthButton] Calling /api/verify with payload:", { payload: miniKitPayload, action: "worldfansignup", signal: undefined });
      const response = await fetch("/api/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          payload: miniKitPayload,
          action: "worldfansignup",
          signal: undefined,
        }),
      });

      const data = await response.json();
      addDebugMessage("[AuthButton] /api/verify response:", data);

      const performSignIn = async (reason: string) => {
        if (!miniKitPayload.nullifier_hash) {
          addDebugMessage("[AuthButton] Error: Nullifier hash is missing in miniKitPayload. Cannot sign in.", miniKitPayload);
          return;
        }
        addDebugMessage(`[AuthButton] ${reason}. Attempting to sign in with NextAuth Credentials...`);
        const signInResult = await signIn('credentials', {
          redirect: false,
          nullifier_hash: miniKitPayload.nullifier_hash,
          // Potentially pass credential_type if needed by CredentialsProvider's authorize or for user object
          // credential_type: miniKitPayload.credential_type // Assuming ISuccessResult might have it
        });
        addDebugMessage("[AuthButton] NextAuth signIn('credentials') result:", signInResult);

        // Regardless of signInResult, show the proceed button.
        // The success/failure is logged in debugMessages for the user to see.
        setShowProceedButton(true);

        // Log whether sign-in was successful or not for clarity in debug.
        if (signInResult && signInResult.ok && !signInResult.error) {
          addDebugMessage("[AuthButton] NextAuth Credentials sign-in was successful (enable Proceed button).");
        } else {
          addDebugMessage("[AuthButton] Error: NextAuth Credentials sign-in failed (enable Proceed button). Result:", signInResult);
        }
      };

      if (response.ok && data.success) {
        await performSignIn("World ID verified successfully via MiniKit!");
      } else if (response.ok && data.success === false && data.code === "max_verifications_reached") {
        await performSignIn(`Backend verification indicated 'max_verifications_reached' (Code: ${data.code}). Treating as success for UI flow.`);
      } else {
        addDebugMessage("[AuthButton] Error: MiniKit Backend Verification failed. Details:", data.error || data.detail || data.code || "Unknown error from /api/verify", data);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      addDebugMessage(`[AuthButton] Exception during /api/verify call: ${errorMessage}`);
    }
  };

  const initiateMiniAppVerify = async () => {
    addDebugMessage("[AuthButton] initiateMiniAppVerify called");

    const isMiniKitInstalled = MiniKit.isInstalled();
    addDebugMessage("[AuthButton] MiniKit.isInstalled():", isMiniKitInstalled);

    if (!isMiniKitInstalled) {
      addDebugMessage("[AuthButton] Warn: MiniKit not detected as installed. Verification cannot proceed.");
      return;
    }

    const verifyPayload: VerifyCommandInput = {
      action: "worldfansignup",
      verification_level: VerificationLevel.Orb,
    };
    addDebugMessage("[AuthButton] Preparing verifyPayload:", verifyPayload);

    let result;
    try {
      addDebugMessage("[AuthButton] Calling MiniKit.commandsAsync.verify...");
      result = await MiniKit.commandsAsync.verify(verifyPayload);
      addDebugMessage("[AuthButton] MiniKit.commandsAsync.verify returned (raw):", result);

      // The primary indicator of a successful proof generation is the presence of finalPayload
      // and its internal status being 'success'.
      if (result.finalPayload) {
        addDebugMessage("[AuthButton] finalPayload received:", result.finalPayload);
        if (result.finalPayload.status === 'success') {
          addDebugMessage("[AuthButton] MiniApp verification success (finalPayload.status is 'success'), proceeding to handleVerification.");
          // Ensure ISuccessResult fields (proof, merkle_root, nullifier_hash) are present before casting
          if (result.finalPayload.proof && result.finalPayload.merkle_root && result.finalPayload.nullifier_hash) {
            handleVerification(result.finalPayload as ISuccessResult);
          } else {
            addDebugMessage("[AuthButton] Error: finalPayload.status is 'success', but essential proof fields are missing.", result.finalPayload);
          }
        } else if (result.finalPayload.status === 'error') {
          // This case might occur if the MiniApp itself encounters an issue generating the proof
          // and reports that error within the finalPayload structure.
          addDebugMessage(`[AuthButton] Error: MiniApp verification failed (finalPayload.status is '${result.finalPayload.status}'). Full finalPayload:`, result.finalPayload);
        } else {
          // Handles cases where finalPayload.status is neither 'success' nor 'error'
          addDebugMessage(`[AuthButton] Warn: finalPayload received, but its status is unexpected ('${result.finalPayload.status}'). Full finalPayload:`, result.finalPayload);
        }
      } else if (result.status === 'error') {
        // This 'error' status is at the top level of the 'result' object from commandsAsync.verify.
        // It usually indicates an issue before or during the attempt to generate a proof,
        // such as the user cancelling, or a problem with the MiniApp interaction itself.
        const errorMsg = result.errorToast?.message || JSON.stringify(result.error || "Unknown error from MiniKit verify");
        addDebugMessage(`[AuthButton] Error: MiniKit.commandsAsync.verify reported top-level error (result.status is 'error'): ${errorMsg}`);
      }
       else {
        // Catch-all for other unexpected structures of 'result'.
        addDebugMessage("[AuthButton] Warn: MiniKit.commandsAsync.verify returned an unexpected result structure (no finalPayload and result.status is not 'error'). Full result:", result);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      addDebugMessage(`[AuthButton] Exception during MiniKit.commandsAsync.verify call itself: ${errorMessage}`);
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

  // When no session, show the sign-in button and debug logs
  return (
    <div className="flex flex-col items-center space-y-4">
      {!showProceedButton && (
        <Button onClick={initiateMiniAppVerify} className={className} size="lg">
          Sign In with World ID
        </Button>
      )}
      {showProceedButton && (
        <Button onClick={() => router.push("/signup")} className={className} size="lg" variant="default">
          Proceed to Signup
        </Button>
      )}
      {debugMessages.length > 0 && (
        <div className="w-full max-w-md p-4 mt-4 border border-gray-300 rounded-md bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">On-Page Debug Log:</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDebugMessages([])}
              className="text-xs"
            >
              Clear Log
            </Button>
          </div>
          <div className="max-h-48 overflow-y-auto text-xs text-gray-600 dark:text-gray-400 space-y-1 bg-white dark:bg-gray-900 p-2 rounded">
            {debugMessages.map((msg, index) => (
              <div key={index} className="whitespace-pre-wrap break-words">
                {msg}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
