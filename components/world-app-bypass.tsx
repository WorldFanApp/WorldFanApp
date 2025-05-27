"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Check, Smartphone } from "lucide-react"

interface WorldAppBypassProps {
  onSuccess: (worldId: string, userInfo: any) => void
}

export function WorldAppBypass({ onSuccess }: WorldAppBypassProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isVerified, setIsVerified] = useState(false)

  const handleBypass = async () => {
    setIsLoading(true)

    // Simulate authentication delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsVerified(true)
    setIsLoading(false)

    setTimeout(() => {
      onSuccess("world_app_bypass_" + Date.now(), {
        nullifier_hash: "world_app_bypass_" + Date.now(),
        verification_level: "orb",
        timestamp: new Date().toISOString(),
        platform: "world_app_bypass",
      })
    }, 1000)
  }

  return (
    <>
      <CardHeader className="text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Smartphone className="w-8 h-8 text-white" />
        </div>
        <CardTitle>World App Authentication (Testing)</CardTitle>
        <CardDescription>Testing mode - bypassing World App authentication for development</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4">
          <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
            <Shield className="w-5 h-5 text-green-600" />
            <div>
              <p className="font-medium text-green-900">Testing Mode</p>
              <p className="text-sm text-green-700">Simulating World App authentication for development</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
            <Check className="w-5 h-5 text-blue-600" />
            <div>
              <p className="font-medium text-blue-900">Development Only</p>
              <p className="text-sm text-blue-700">This bypass is only for testing purposes</p>
            </div>
          </div>
        </div>

        <div className="text-center">
          {!isVerified ? (
            <Button
              onClick={handleBypass}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Simulating Authentication...
                </>
              ) : (
                <>
                  <Smartphone className="w-4 h-4 mr-2" />
                  Continue with Testing Mode
                </>
              )}
            </Button>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-green-600 font-medium">Authentication Complete!</p>
              <p className="text-sm text-gray-600">Proceeding with testing mode...</p>
            </div>
          )}
        </div>

        <div className="text-xs text-gray-500 text-center">
          <p>
            <strong>Testing Mode:</strong> This bypasses real World App authentication for development purposes.
          </p>
        </div>
      </CardContent>
    </>
  )
}
