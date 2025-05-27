"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, AlertCircle, Smartphone, ExternalLink } from "lucide-react"

interface WorldAppFinalFallbackProps {
  onSuccess: (worldId: string, userInfo: any) => void
}

export function WorldAppFinalFallback({ onSuccess }: WorldAppFinalFallbackProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isVerified, setIsVerified] = useState(false)

  const handleProceedWithDevelopment = () => {
    setIsLoading(true)

    // Simulate verification for development purposes
    setTimeout(() => {
      setIsVerified(true)
      setIsLoading(false)

      setTimeout(() => {
        onSuccess("dev_world_id_" + Date.now(), {
          nullifier_hash: "dev_world_id_" + Date.now(),
          verification_level: "orb",
          timestamp: new Date().toISOString(),
          platform: "development_mode",
          note: "Using development mode due to World App integration issues",
        })
      }, 1000)
    }, 2000)
  }

  return (
    <>
      <CardHeader className="text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8 text-white" />
        </div>
        <CardTitle>World ID Integration Issue</CardTitle>
        <CardDescription>
          Multiple integration attempts have failed. Let's proceed with development mode.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4">
          <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
            <AlertCircle className="w-5 h-5 text-orange-600" />
            <div>
              <p className="font-medium text-orange-900">Integration Status</p>
              <p className="text-sm text-orange-700">
                World ID verification is not working despite multiple implementation attempts
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
            <Check className="w-5 h-5 text-blue-600" />
            <div>
              <p className="font-medium text-blue-900">Development Mode</p>
              <p className="text-sm text-blue-700">Continue building your app while resolving the integration</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold mb-2">Next Steps:</h4>
          <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
            <li>Proceed with development mode to continue building your app</li>
            <li>Contact World App support with technical details</li>
            <li>Test the integration in a different environment</li>
            <li>Consider using the World ID widget for web integration</li>
          </ol>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg">
          <h4 className="font-semibold mb-2 text-yellow-800">Technical Details for Support:</h4>
          <div className="text-xs text-yellow-700 space-y-1">
            <p>• App ID: app_7a9639a92f85fcf27213f982eddb5064</p>
            <p>• World App Version: 2088300</p>
            <p>• Device: iOS</p>
            <p>• Integration Attempts: Native API, SDK Method, Official SDK</p>
            <p>• Issue: World ID verification popup never appears</p>
            <p>• Error: Verification timeout after 30 seconds</p>
          </div>
        </div>

        <div className="text-center">
          {!isVerified ? (
            <div className="space-y-3">
              <Button
                onClick={handleProceedWithDevelopment}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Proceeding with Development Mode...
                  </>
                ) : (
                  <>
                    <Smartphone className="w-4 h-4 mr-2" />
                    Continue with Development Mode
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => window.open("https://docs.worldcoin.org/mini-apps", "_blank")}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View World App Documentation
              </Button>
            </div>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-green-600 font-medium">Development Mode Active!</p>
              <p className="text-sm text-gray-600">Continuing with app development...</p>
            </div>
          )}
        </div>

        <div className="text-xs text-gray-500 text-center">
          <p>
            <strong>Note:</strong> This is development mode. Real World ID integration will need to be resolved before
            production deployment.
          </p>
        </div>
      </CardContent>
    </>
  )
}
