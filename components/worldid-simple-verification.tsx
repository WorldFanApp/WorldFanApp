"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Check, AlertCircle, User, Zap, ExternalLink } from "lucide-react"

interface WorldIDSimpleVerificationProps {
  onSuccess: (worldId: string, userInfo: any) => void
  onDeveloperMode: () => void
}

export function WorldIDSimpleVerification({ onSuccess, onDeveloperMode }: WorldIDSimpleVerificationProps) {
  const [isVerifying, setIsVerifying] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [verificationUrl, setVerificationUrl] = useState<string | null>(null)

  const app_id = process.env.NEXT_PUBLIC_WORLDCOIN_APP_ID || "app_7a9639a92f85fcf27213f982eddb5064"
  const action = process.env.NEXT_PUBLIC_WORLDCOIN_ACTION || "verify"

  const startVerification = async () => {
    setIsVerifying(true)
    setError(null)

    try {
      // Create verification URL for World App
      const baseUrl = "https://worldcoin.org/verify"
      const params = new URLSearchParams({
        app_id,
        action,
        redirect_uri: `${window.location.origin}/api/auth/callback/worldcoin`,
      })

      const url = `${baseUrl}?${params.toString()}`
      setVerificationUrl(url)

      // Open World ID verification
      window.open(url, "_blank", "width=400,height=600")

      // Simulate verification for demo (replace with actual verification)
      setTimeout(() => {
        const mockUserData = {
          worldId: `mock_${Date.now()}`,
          nullifierHash: `nullifier_${Date.now()}`,
          verificationLevel: "orb",
          isHumanVerified: true,
          verifiedAt: new Date().toISOString(),
          platform: "worldid_simple",
          username: `worldfan_${Date.now().toString().slice(-6)}`,
          email: "",
          genres: [],
          cities: [],
          favoriteArtists: "",
          ticketStruggles: "",
          priceRange: "$50-150",
          notifications: true,
        }

        setIsVerified(true)
        setTimeout(() => {
          onSuccess(mockUserData.worldId, mockUserData)
        }, 1000)
      }, 3000)
    } catch (error: any) {
      console.error("Verification error:", error)
      setError(error.message)
    } finally {
      setIsVerifying(false)
    }
  }

  return (
    <>
      <CardHeader className="text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="w-8 h-8 text-white" />
        </div>
        <CardTitle>Verify You're Human with World ID</CardTitle>
        <CardDescription>
          Use Worldcoin's verification to prove you're a unique human and access World Fan's exclusive music experiences
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4">
          <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
            <Shield className="w-5 h-5 text-green-600" />
            <div>
              <p className="font-medium text-green-900">Human Verification</p>
              <p className="text-sm text-green-700">Prove you're a unique human using World ID</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
            <Check className="w-5 h-5 text-blue-600" />
            <div>
              <p className="font-medium text-blue-900">Privacy Protected</p>
              <p className="text-sm text-blue-700">Your identity stays private, we only verify uniqueness</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
            <User className="w-5 h-5 text-purple-600" />
            <div>
              <p className="font-medium text-purple-900">Fair Access</p>
              <p className="text-sm text-purple-700">Prevents scalpers and ensures fair ticket distribution</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <div>
              <p className="font-medium text-red-900">Verification Error</p>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        <div className="text-center space-y-3">
          {!isVerified ? (
            <>
              <Button
                onClick={startVerification}
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

              {verificationUrl && (
                <div className="text-sm text-gray-600">
                  <p>Verification window opened. Complete verification in the new tab.</p>
                  <a
                    href={verificationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-600 hover:underline inline-flex items-center gap-1"
                  >
                    Open verification again <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}

              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Want to test the app first?</p>
                <Button onClick={onDeveloperMode} variant="outline" size="sm">
                  <Zap className="w-4 h-4 mr-2" />
                  Continue with Developer Mode
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-green-600 font-medium">World ID Verification Complete!</p>
              <p className="text-sm text-gray-600">Welcome to World Fan...</p>
            </div>
          )}
        </div>

        <div className="text-xs text-gray-500 text-center">
          <p>
            By verifying with World ID, you agree to our{" "}
            <a href="#" className="text-purple-600 hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-purple-600 hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </CardContent>
    </>
  )
}
