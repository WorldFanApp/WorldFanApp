"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Globe } from "lucide-react"

interface WorldIDDevelopmentBypassProps {
  onSuccess: (result: any) => void
}

export function WorldIDDevelopmentBypass({ onSuccess }: WorldIDDevelopmentBypassProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleBypass = async () => {
    setIsLoading(true)

    // Simulate authentication delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const mockResult = {
      worldId: `bypass_${Date.now()}`,
      worldIdData: {
        nullifier_hash: `bypass_${Date.now()}`,
        verification_level: "device",
        platform: "development_bypass",
        test_mode: true,
      },
      username: "DevUser",
      email: "dev@worldfan.app",
      genres: ["Pop", "Rock"],
      cities: ["New York", "Los Angeles"],
      favoriteArtists: "Sample artists",
      ticketStruggles: "Sample struggles",
      priceRange: "$50-150",
      notifications: true,
      createdAt: new Date().toISOString(),
    }

    setIsLoading(false)
    onSuccess(mockResult)
  }

  return (
    <>
      <CardHeader className="text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-orange-600 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8 text-white" />
        </div>
        <CardTitle>World ID Development Mode</CardTitle>
        <CardDescription>
          Since World ID verification is currently experiencing issues, you can continue in development mode
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-yellow-900">Development Mode Notice</h4>
              <p className="text-sm text-yellow-800 mt-1">
                This bypasses World ID verification for testing purposes. In production, users would need valid World ID
                verification.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Button
            onClick={handleBypass}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
            size="lg"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Authenticating...
              </>
            ) : (
              <>
                <Globe className="w-4 h-4 mr-2" />
                Continue with Development Mode
              </>
            )}
          </Button>
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-500">This will create a temporary account for testing purposes</p>
        </div>
      </CardContent>
    </>
  )
}
