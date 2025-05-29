"use client"

"use client"

import { signOut, useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
// Alert, AlertDescription, CheckCircle, Badge removed as they were World ID specific
import { Loader2 } from "lucide-react"

interface AuthButtonProps {
  // callbackUrl is no longer used for sign-in
  className?: string
}

export function AuthButton({ className }: AuthButtonProps) {
  const { data: session, status } = useSession()

  // handleSignIn is removed as it was World ID specific.
  // If other sign-in methods were to be added, they would go here.

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" }) // Default callback to root
  }

  // getCredentialBadgeColor removed as it was World ID specific

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
      // Removed the Alert displaying World ID verification status
      <Button onClick={handleSignOut} className={className}>
        Sign Out
      </Button>
    )
  }

  // No session and no sign-in method left in this component.
  // Render null or a placeholder if desired, but per instructions,
  // if it becomes empty, it might be eligible for removal.
  // For now, it will render nothing if there's no session.
  return null
}
