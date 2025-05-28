"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Shield, AlertCircle, Zap } from "lucide-react"
import { MiniKit, VerificationLevel } from "@minikit-js/react"

interface WorldIDMiniKitAuthProps {
  onSuccess: (userData: any) => void
  onDeveloperMode: () => void
}

export function WorldIDMiniKitAuth({ onSuccess, onDeveloperMode }: WorldIDMiniKitAuthProps) {
  const [isVerifying, setIsVerifying] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<any>(null)

  const handleVerify = async () => {
    setIsVerifying(true)
    setError(null)

    try {
      // Check if MiniKit is available
      if (!MiniKit.isInstalled()) {
        throw new Error("MiniKit is not installed. Please open this app in the World App.")
      }

      // Get debug information
      const commands = MiniKit.commands
      const debugData = {
        isInstalled: MiniKit.isInstalled(),
        commands: Object.keys(commands || {}),
        hasVerify: typeof commands?.verify === "function",
        userAgent: navigator.userAgent,
      }
      setDebugInfo(debugData)
      console.log("MiniKit Debug Info:", debugData)

      // Use the verify command
      const { finalPayload } = await MiniKit.commands.verify({
        action: "verify-human", // Use a simple action name
        signal: "worldfan-verification",
        verification_level: VerificationLevel.Device, // Start with device level
      })

      console.log("Verification successful:", finalPayload)

      // Create user data from the verification result
      const userData = {
        id: `worldid_${Date.now()}`,
        name: "World ID User",
        email: "user@worldfan.app",
        image: "",
        worldcoin: {
          verification_level: finalPayload.verification_level,
          nullifier_hash: finalPayload.nullifier_hash,
          merkle_root: finalPayload.merkle_root,
          proof: finalPayload.proof,
          verified_at: new Date().toISOString(),
        },
      }

      onSuccess(userData)
    } catch (err: any) {
      console.error("Verification error:", err)
      setError(err.message || "Verification failed. Please try again.")
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
        <div className="space-y-3">
          <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-red-900">Verification Error</p>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleVerify} variant="outline" size="sm" className="flex-1">
              Try Again
            </Button>
            <Button onClick={onDeveloperMode} variant="outline" size="sm" className="flex-1">
              Use Development Mode
            </Button>
          </div>
        </div>
      )}

      {debugInfo && (
        <details className="text-xs bg-gray-50 p-3 rounded border">
          <summary className="cursor-pointer font-medium text-gray-700 mb-2">
            Debug Information (Click to expand)
          </summary>
          <div className="space-y-1 text-gray-600">
            <p>
              <strong>Environment:</strong>
            </p>
            <p>MiniKit Installed: {debugInfo.isInstalled ? "✓" : "✗"}</p>
            <p>Has WorldApp: {navigator.userAgent.includes("WorldApp") ? "✓" : "✗"}</p>
            <p>In iframe: {window.self !== window.top ? "✓" : "✗"}</p>
            <p>URL: {window.location.href}</p>
            <p>User Agent: {debugInfo.userAgent.slice(0, 50)}...</p>
            <p>App ID: app_7a9639a92f85fcf27213f982eddb5064</p>
            <p>Action: verify-human</p>
            <p>Verification Level: Device</p>
            <p>
              <strong>MiniKit Commands:</strong>
            </p>
            <p>Available Commands: {debugInfo.commands.join(", ")}</p>
            <p>Has verify: {debugInfo.hasVerify ? "✓" : "✗"}</p>
          </div>
        </details>
      )}

      <div className="text-center">
        <Button onClick={onDeveloperMode} variant="ghost" size="sm" className="text-xs">
          <Zap className="w-3 h-3 mr-1" />
          Continue with Development Mode (Testing)
        </Button>
      </div>

      <div className="text-xs text-gray-500 text-center">
        <p>This uses the official MiniKit SDK for World ID verification</p>
      </div>
    </div>
  )
}
