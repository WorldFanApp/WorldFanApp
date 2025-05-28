"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Shield, AlertCircle } from "lucide-react"

interface WorldIDAuthProps {
  onSuccess: (userData: any) => void
}

export function WorldIDAuth({ onSuccess }: WorldIDAuthProps) {
  const [isVerifying, setIsVerifying] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleVerify = async () => {
    setIsVerifying(true)
    setError(null)

    try {
      // Simulate World ID verification
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Create mock user data
      const userData = {
        id: `worldid_${Date.now()}`,
        name: "World ID User",
        email: "user@worldfan.app",
        image: "",
        worldcoin: {
          verification_level: "orb",
          nullifier_hash: `nullifier_${Date.now()}`,
        },
      }

      onSuccess(userData)
    } catch (err) {
      setError("Verification failed. Please try again.")
    } finally {
      setIsVerifying(false)
    }
  }

  return (
    <div className="space-y-4">
      <Button
        onClick={handleVerify}
        disabled={isVerifying}
        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        size="lg"
      >
        {isVerifying ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
            Verifying with World ID...
          </>
        ) : (
          <>
            <Shield className="w-4 h-4 mr-2" />
            Verify with World ID
          </>
        )}
      </Button>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-4 h-4 text-red-600" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="text-xs text-gray-500 text-center">
        <p>This will open the World ID verification process</p>
      </div>
    </div>
  )
}
