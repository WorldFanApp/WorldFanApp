"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, X, AlertTriangle, RefreshCw, ExternalLink } from "lucide-react"

export function WorldIDTroubleshooter() {
  const [debugResult, setDebugResult] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  const runDebugTest = async () => {
    setIsLoading(true)
    try {
      // Test with mock data to see what happens
      const mockVerificationData = {
        nullifier_hash: "0x1234567890abcdef1234567890abcdef12345678",
        merkle_root: "0xabcdef1234567890abcdef1234567890abcdef12",
        proof: "0x" + "0".repeat(512), // Mock proof
        verification_level: "device",
        action: "signin",
        signal: "debug_test_" + Date.now(),
      }

      const response = await fetch("/api/worldid/debug-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(mockVerificationData),
      })

      const result = await response.json()
      setDebugResult(result)
    } catch (error: any) {
      setDebugResult({
        success: false,
        error: `Debug test failed: ${error.message}`,
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    runDebugTest()
  }, [])

  const issues = [
    {
      title: "App Configuration",
      description: "Your app might not be properly configured in Worldcoin Developer Portal",
      solution: "Check that your app is enabled for Mini Apps and has the 'signin' action registered",
      link: "https://developer.worldcoin.org/",
    },
    {
      title: "Action Registration",
      description: "The 'signin' action might not be registered or approved",
      solution: "Verify the action exists and is approved in your Worldcoin app settings",
      link: "https://developer.worldcoin.org/",
    },
    {
      title: "API Key Issues",
      description: "Your API key might be invalid or have insufficient permissions",
      solution: "Regenerate your API key and ensure it has verification permissions",
      link: "https://developer.worldcoin.org/",
    },
    {
      title: "Mini App Integration",
      description: "Your app might not be properly configured as a Mini App",
      solution: "Ensure your app is registered as a Mini App with correct callback URLs",
      link: "https://developer.worldcoin.org/",
    },
  ]

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-yellow-600" />
          World ID Troubleshooter
          <Button onClick={runDebugTest} disabled={isLoading} size="sm" variant="outline" className="ml-auto">
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Run Debug Test
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Debug Results */}
        {debugResult && (
          <div>
            <h3 className="font-semibold mb-3">Debug Test Results</h3>
            <div className={`p-4 rounded-lg ${debugResult.success ? "bg-green-50" : "bg-red-50"}`}>
              <div className="flex items-center gap-2 mb-2">
                {debugResult.success ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <X className="w-4 h-4 text-red-600" />
                )}
                <span className={`font-medium ${debugResult.success ? "text-green-900" : "text-red-900"}`}>
                  {debugResult.success ? "Debug Test Passed" : "Debug Test Failed"}
                </span>
              </div>
              {debugResult.error && <p className="text-sm text-red-700 mb-2">{debugResult.error}</p>}
              {debugResult.last_error && (
                <details className="text-sm">
                  <summary className="cursor-pointer font-medium">Last Error Details</summary>
                  <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
                    {JSON.stringify(debugResult.last_error, null, 2)}
                  </pre>
                </details>
              )}
              {debugResult.debug_info && (
                <details className="text-sm">
                  <summary className="cursor-pointer font-medium">Debug Information</summary>
                  <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
                    {JSON.stringify(debugResult.debug_info, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          </div>
        )}

        {/* Common Issues */}
        <div>
          <h3 className="font-semibold mb-4">Common Issues & Solutions</h3>
          <div className="grid gap-4">
            {issues.map((issue, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium">{issue.title}</h4>
                  <Badge variant="outline">Common</Badge>
                </div>
                <p className="text-sm text-gray-600 mb-2">{issue.description}</p>
                <p className="text-sm font-medium mb-3">{issue.solution}</p>
                <Button size="sm" variant="outline" asChild>
                  <a href={issue.link} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-3 h-3 mr-1" />
                    Open Developer Portal
                  </a>
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">Immediate Recommendations:</h4>
          <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
            <li>Use Development Mode to continue testing your app functionality</li>
            <li>Contact Worldcoin support with your App ID: app_7a9639a92f85fcf27213f982eddb5064</li>
            <li>Verify your app configuration in the Worldcoin Developer Portal</li>
            <li>Check if your app needs approval for the "signin" action</li>
            <li>Consider using a different action name if "signin" is reserved</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  )
}
