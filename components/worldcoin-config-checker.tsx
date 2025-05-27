"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, X, AlertTriangle, RefreshCw } from "lucide-react"

export function WorldcoinConfigChecker() {
  const [config, setConfig] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  const checkConfiguration = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/worldid/test-config")
      const data = await response.json()
      setConfig(data)
    } catch (error) {
      console.error("Config check failed:", error)
      setConfig({ error: "Failed to check configuration" })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    checkConfiguration()
  }, [])

  const envVars = [
    {
      name: "NEXT_PUBLIC_WORLDCOIN_APP_ID",
      value: process.env.NEXT_PUBLIC_WORLDCOIN_APP_ID,
      required: true,
      description: "Your Worldcoin App ID",
    },
    {
      name: "NEXT_PUBLIC_WORLDCOIN_ACTION",
      value: process.env.NEXT_PUBLIC_WORLDCOIN_ACTION,
      required: true,
      description: "Action name (should be 'signin')",
    },
    {
      name: "WORLDCOIN_APP_ID",
      value: process.env.WORLDCOIN_APP_ID ? "Set" : undefined,
      required: true,
      description: "Server-side Worldcoin App ID",
    },
    {
      name: "WORLDCOIN_CLIENT_SECRET",
      value: process.env.WORLDCOIN_CLIENT_SECRET ? "Set" : undefined,
      required: true,
      description: "Worldcoin Client Secret (server-side only)",
    },
    {
      name: "NEXT_PUBLIC_WORLDFAN",
      value: process.env.NEXT_PUBLIC_WORLDFAN,
      required: false,
      description: "Custom WorldFan variable",
    },
    {
      name: "NEXT_PUBLIC_WORLDFANAPP",
      value: process.env.NEXT_PUBLIC_WORLDFANAPP,
      required: false,
      description: "Custom WorldFanApp variable",
    },
  ]

  const getStatusIcon = (value: string | undefined, required: boolean) => {
    if (value) {
      return <Check className="w-4 h-4 text-green-600" />
    } else if (required) {
      return <X className="w-4 h-4 text-red-600" />
    } else {
      return <AlertTriangle className="w-4 h-4 text-yellow-600" />
    }
  }

  const getStatusBadge = (value: string | undefined, required: boolean) => {
    if (value) {
      return (
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          Set
        </Badge>
      )
    } else if (required) {
      return <Badge variant="destructive">Missing</Badge>
    } else {
      return <Badge variant="outline">Optional</Badge>
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-yellow-600" />
          Worldcoin Configuration Checker
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Environment Variables */}
        <div>
          <h3 className="font-semibold mb-4">Environment Variables</h3>
          <div className="space-y-3">
            {envVars.map((envVar) => (
              <div key={envVar.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(envVar.value, envVar.required)}
                  <div>
                    <p className="font-medium text-sm">{envVar.name}</p>
                    <p className="text-xs text-gray-600">{envVar.description}</p>
                    {envVar.value && (
                      <p className="text-xs text-gray-500 font-mono">
                        {envVar.value.length > 20 ? envVar.value.slice(0, 20) + "..." : envVar.value}
                      </p>
                    )}
                  </div>
                </div>
                {getStatusBadge(envVar.value, envVar.required)}
              </div>
            ))}
          </div>
        </div>

        {/* API Configuration Test */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">API Configuration Test</h3>
            <Button onClick={checkConfiguration} disabled={isLoading} size="sm" variant="outline">
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              Test Config
            </Button>
          </div>

          {config && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <pre className="text-xs overflow-auto">{JSON.stringify(config, null, 2)}</pre>
            </div>
          )}
        </div>

        {/* Recommendations */}
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h4 className="font-semibold text-yellow-900 mb-2">Potential Issues & Solutions:</h4>
          <ul className="text-sm text-yellow-800 space-y-2">
            <li>
              • <strong>Missing WORLDCOIN_CLIENT_SECRET:</strong> Get this from your Worldcoin Developer Portal
            </li>
            <li>
              • <strong>Action not registered:</strong> Make sure "signin" action is configured in your Worldcoin app
            </li>
            <li>
              • <strong>App not enabled for Mini Apps:</strong> Check if your app is configured for Mini App integration
            </li>
            <li>
              • <strong>Callback URLs:</strong> Ensure https://worldfan.vercel.app/api/auth/callback/worldcoin is added
            </li>
            <li>
              • <strong>App ID mismatch:</strong> Verify the App ID matches exactly in all places
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
