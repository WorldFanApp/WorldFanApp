"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shield, AlertCircle, User, Zap } from "lucide-react"

interface WorldIDDevelopmentBypassProps {
  onSuccess: (worldId: string, userInfo: any) => void
}

export function WorldIDDevelopmentBypass({ onSuccess }: WorldIDDevelopmentBypassProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [testUserId, setTestUserId] = useState("")
  const [error, setError] = useState<string | null>(null)

  const handleDevelopmentBypass = () => {
    setIsLoading(true)
    setError(null)

    // Simulate verification process
    setTimeout(() => {
      const userId = testUserId || `dev_user_${Date.now()}`
      const userInfo = {
        nullifier_hash: `dev_${userId}_${Date.now()}`,
        verification_level: "device",
        timestamp: new Date().toISOString(),
        platform: "development_bypass",
        test_mode: true,
        user_id: userId,
      }

      setIsLoading(false)
      onSuccess(userId, userInfo)
    }, 2000)
  }

  const handleQuickBypass = () => {
    const quickUserId = `quick_user_${Date.now()}`
    const userInfo = {
      nullifier_hash: `quick_${quickUserId}`,
      verification_level: "device",
      timestamp: new Date().toISOString(),
      platform: "quick_bypass",
      test_mode: true,
      user_id: quickUserId,
    }

    onSuccess(quickUserId, userInfo)
  }

  return (
    <>
      <CardHeader className="text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-orange-600 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8 text-white" />
        </div>
        <CardTitle>Development Mode</CardTitle>
        <CardDescription>
          Since World ID verification is having issues, let's use development mode to continue testing the app
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4">
          <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
            <AlertCircle className="w-5 h-5 text-orange-600" />
            <div>
              <p className="font-medium text-orange-900">World ID Issues Detected</p>
              <p className="text-sm text-orange-700">
                Using development mode to bypass verification while we troubleshoot
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
            <Shield className="w-5 h-5 text-blue-600" />
            <div>
              <p className="font-medium text-blue-900">Development Features</p>
              <p className="text-sm text-blue-700">Full app functionality without World ID dependency</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <div>
              <p className="font-medium text-red-900">Error</p>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <Label htmlFor="test-user-id">Test User ID (optional)</Label>
            <Input
              id="test-user-id"
              placeholder="Enter a test user ID or leave blank for auto-generated"
              value={testUserId}
              onChange={(e) => setTestUserId(e.target.value)}
            />
            <p className="text-xs text-gray-600 mt-1">This will be used as your unique identifier in the app</p>
          </div>
        </div>

        <div className="text-center space-y-3">
          <Button
            onClick={handleDevelopmentBypass}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
            size="lg"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Setting up development mode...
              </>
            ) : (
              <>
                <User className="w-4 h-4 mr-2" />
                Continue with Development Mode
              </>
            )}
          </Button>

          <Button onClick={handleQuickBypass} variant="outline" className="w-full" size="sm">
            <Zap className="w-4 h-4 mr-2" />
            Quick Start (Auto-generated ID)
          </Button>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg">
          <h4 className="font-semibold text-yellow-900 mb-2">Next Steps for World ID:</h4>
          <ul className="text-sm text-yellow-800 space-y-1">
            <li>• Check your Worldcoin Developer Portal settings</li>
            <li>• Verify the "signin" action is properly configured</li>
            <li>• Ensure your app is enabled for Mini Apps</li>
            <li>• Contact Worldcoin support if issues persist</li>
          </ul>
        </div>
      </CardContent>
    </>
  )
}
