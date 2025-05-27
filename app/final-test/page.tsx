"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, X, AlertTriangle, RefreshCw, Zap, Globe } from "lucide-react"
import { MiniKit, ResponseEvent } from "@worldcoin/minikit-js"

export default function FinalTestPage() {
  const [configStatus, setConfigStatus] = useState<any>(null)
  const [verificationStatus, setVerificationStatus] = useState<string>("ready")
  const [verificationResult, setVerificationResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [debugLogs, setDebugLogs] = useState<string[]>([])

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    const logMessage = `[${timestamp}] ${message}`
    setDebugLogs((prev) => [...prev, logMessage])
    console.log(logMessage)
  }

  useEffect(() => {
    checkConfiguration()
    initializeMiniKit()
  }, [])

  const checkConfiguration = async () => {
    try {
      addLog("Checking configuration...")
      const response = await fetch("/api/worldid/test-api-key")
      const result = await response.json()
      setConfigStatus(result)
      addLog(`Configuration check: ${result.success ? "✓ Success" : "✗ Failed"}`)
    } catch (error) {
      addLog(`Configuration check failed: ${error}`)
      setConfigStatus({ success: false, error: "Failed to check configuration" })
    }
  }

  const initializeMiniKit = () => {
    if (typeof window !== "undefined") {
      try {
        addLog("Initializing MiniKit...")
        MiniKit.install()
        addLog(`MiniKit installed: ${MiniKit.isInstalled()}`)

        if (MiniKit.isInstalled()) {
          // Subscribe to verification events
          MiniKit.subscribe(ResponseEvent.MiniAppVerifyAction, handleVerificationResponse)
          addLog("MiniKit event subscription set up")
        } else {
          addLog("⚠️ MiniKit not available - app must be opened in World App")
        }
      } catch (err: any) {
        addLog(`MiniKit initialization failed: ${err.message}`)
      }
    }
  }

  const handleVerificationResponse = async (response: any) => {
    addLog(`Verification response received: ${JSON.stringify(response)}`)

    if (response.status === "success" && response.payload) {
      setIsLoading(true)
      setVerificationStatus("verifying")
      addLog("Sending verification to backend...")

      try {
        const verificationResponse = await fetch("/api/worldid/verify-with-api-key", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nullifier_hash: response.payload.nullifier_hash,
            merkle_root: response.payload.merkle_root,
            proof: response.payload.proof,
            verification_level: response.payload.verification_level,
            action: process.env.NEXT_PUBLIC_WORLDCOIN_ACTION || "signin",
            signal: "final_test_" + Date.now(),
          }),
        })

        const verificationResult = await verificationResponse.json()
        addLog(`Backend verification result: ${JSON.stringify(verificationResult)}`)

        if (verificationResult.success) {
          setVerificationStatus("success")
          setVerificationResult(verificationResult)
          setError(null)
          addLog("🎉 VERIFICATION SUCCESSFUL!")
        } else {
          throw new Error(verificationResult.error || "Backend verification failed")
        }
      } catch (err: any) {
        addLog(`Backend verification error: ${err.message}`)
        setVerificationStatus("error")
        setError(`Backend verification failed: ${err.message}`)
      } finally {
        setIsLoading(false)
      }
    } else {
      addLog(`MiniKit verification failed: ${response.error?.message || "Unknown error"}`)
      setVerificationStatus("error")
      setError(`MiniKit verification failed: ${response.error?.message || "Unknown error"}`)
    }
  }

  const startVerification = () => {
    if (!MiniKit.isInstalled()) {
      setError("This app must be opened in the World App")
      addLog("❌ Verification failed: Not in World App")
      return
    }

    if (!configStatus?.success) {
      setError("Configuration check failed - please verify your API key")
      addLog("❌ Verification failed: Configuration not ready")
      return
    }

    setIsLoading(true)
    setError(null)
    setVerificationStatus("starting")
    addLog("🚀 Starting World ID verification...")

    const appId = process.env.NEXT_PUBLIC_WORLDCOIN_APP_ID
    const action = process.env.NEXT_PUBLIC_WORLDCOIN_ACTION || "signin"

    try {
      addLog(`Using App ID: ${appId}`)
      addLog(`Using Action: ${action}`)

      MiniKit.commands.verify({
        action: action,
        app_id: appId!,
        verification_level: "device",
        signal: "final_test_" + Date.now(),
      })

      addLog("✓ Verification command sent to MiniKit")
      setVerificationStatus("waiting")
    } catch (err: any) {
      addLog(`❌ Verification command failed: ${err.message}`)
      setIsLoading(false)
      setVerificationStatus("error")
      setError(`Verification command failed: ${err.message}`)
    }
  }

  const clearLogs = () => {
    setDebugLogs([])
    setVerificationResult(null)
    setError(null)
    setVerificationStatus("ready")
  }

  const envVars = [
    {
      name: "NEXT_PUBLIC_WORLDCOIN_APP_ID",
      value: process.env.NEXT_PUBLIC_WORLDCOIN_APP_ID,
      required: true,
    },
    {
      name: "NEXT_PUBLIC_WORLDCOIN_ACTION",
      value: process.env.NEXT_PUBLIC_WORLDCOIN_ACTION,
      required: true,
    },
    {
      name: "WORLDCOIN_API_KEY",
      value: configStatus?.config?.hasApiKey ? "Set" : "Not Set",
      required: true,
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-800"
      case "error":
        return "bg-red-100 text-red-800"
      case "waiting":
      case "verifying":
      case "starting":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-6 h-6 text-yellow-600" />
              World ID Final Integration Test
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <Badge className={getStatusColor(verificationStatus)}>
                  Status: {verificationStatus.charAt(0).toUpperCase() + verificationStatus.slice(1)}
                </Badge>
                <p className="text-sm text-gray-600 mt-1">
                  Complete integration test with your API key and environment variables
                </p>
              </div>
              <div className="space-x-2">
                <Button onClick={startVerification} disabled={isLoading || !configStatus?.success} size="lg">
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      {verificationStatus === "starting" && "Starting..."}
                      {verificationStatus === "waiting" && "Waiting for World ID..."}
                      {verificationStatus === "verifying" && "Verifying..."}
                    </>
                  ) : (
                    <>
                      <Globe className="w-4 h-4 mr-2" />
                      Start World ID Verification
                    </>
                  )}
                </Button>
                <Button onClick={clearLogs} variant="outline">
                  Clear Logs
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Configuration Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  Configuration Status
                  <Button onClick={checkConfiguration} size="sm" variant="outline">
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Environment Variables */}
              <div>
                <h4 className="font-medium mb-3">Environment Variables</h4>
                <div className="space-y-2">
                  {envVars.map((envVar) => (
                    <div key={envVar.name} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center gap-2">
                        {envVar.value && envVar.value !== "Not Set" ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <X className="w-4 h-4 text-red-600" />
                        )}
                        <span className="text-sm font-mono">{envVar.name}</span>
                      </div>
                      <Badge variant={envVar.value && envVar.value !== "Not Set" ? "secondary" : "destructive"}>
                        {envVar.value || "Missing"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              {/* API Key Status */}
              {configStatus && (
                <div>
                  <h4 className="font-medium mb-3">API Key Status</h4>
                  <div className={`p-3 rounded-lg ${configStatus.success ? "bg-green-50" : "bg-red-50"}`}>
                    <div className="flex items-center gap-2 mb-2">
                      {configStatus.success ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <X className="w-4 h-4 text-red-600" />
                      )}
                      <span className={`font-medium ${configStatus.success ? "text-green-900" : "text-red-900"}`}>
                        {configStatus.success ? "API Key Valid" : "API Key Error"}
                      </span>
                    </div>
                    {configStatus.config && (
                      <div className="text-xs space-y-1">
                        <p>Key Preview: {configStatus.config.keyPreview}</p>
                        <p>API Connectivity: {configStatus.config.apiConnectivity}</p>
                      </div>
                    )}
                    {configStatus.error && <p className="text-sm text-red-700">{configStatus.error}</p>}
                  </div>
                </div>
              )}

              {/* MiniKit Status */}
              <div>
                <h4 className="font-medium mb-3">MiniKit Status</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm">MiniKit Installed</span>
                    <Badge
                      variant={typeof window !== "undefined" && MiniKit.isInstalled() ? "secondary" : "destructive"}
                    >
                      {typeof window !== "undefined" && MiniKit.isInstalled() ? "✓" : "✗"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm">In World App</span>
                    <Badge
                      variant={typeof window !== "undefined" && MiniKit.isInstalled() ? "secondary" : "destructive"}
                    >
                      {typeof window !== "undefined" && MiniKit.isInstalled() ? "✓" : "✗"}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Verification Result */}
          <Card>
            <CardHeader>
              <CardTitle>Verification Result</CardTitle>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="bg-red-50 p-4 rounded-lg mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <span className="font-medium text-red-900">Error</span>
                  </div>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {verificationResult && (
                <div className="bg-green-50 p-4 rounded-lg mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="font-medium text-green-900">Verification Successful!</span>
                  </div>
                  <div className="text-sm text-green-700 space-y-1">
                    <p>Nullifier Hash: {verificationResult.nullifier_hash?.slice(0, 20)}...</p>
                    <p>Verification Level: {verificationResult.verification_level}</p>
                    <p>Message: {verificationResult.message}</p>
                  </div>
                </div>
              )}

              {verificationStatus === "ready" && !error && !verificationResult && (
                <div className="text-center py-8 text-gray-500">
                  <Globe className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Ready to start World ID verification</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Debug Logs */}
        <Card>
          <CardHeader>
            <CardTitle>Debug Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-black text-green-400 p-4 rounded font-mono text-sm h-64 overflow-y-auto">
              {debugLogs.map((log, index) => (
                <div key={index}>{log}</div>
              ))}
              {debugLogs.length === 0 && <div className="text-gray-500">No logs yet...</div>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
