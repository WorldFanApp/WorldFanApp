"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, AlertCircle, Zap, CheckCircle } from "lucide-react"

declare global {
  interface Window {
    MiniKit: any
  }
}

export default function HomePage() {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isVerifying, setIsVerifying] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<any>(null)

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem("worldfan_user")
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        localStorage.removeItem("worldfan_user")
      }
    }

    // Initialize MiniKit
    const initMiniKit = () => {
      if (typeof window !== "undefined" && window.MiniKit) {
        try {
          window.MiniKit.install({
            appId: "app_7a9639a92f85fcf27213f982eddb5064",
          })
          console.log("MiniKit installed successfully")
        } catch (error) {
          console.error("MiniKit installation error:", error)
        }
      }
    }

    // Load MiniKit script if not already loaded
    if (!window.MiniKit) {
      const script = document.createElement("script")
      script.src = "https://cdn.worldcoin.org/minikit/v1/minikit.js"
      script.async = true
      script.onload = initMiniKit
      document.head.appendChild(script)
    } else {
      initMiniKit()
    }

    setIsLoading(false)
  }, [])

  const getDebugInfo = () => {
    if (!window.MiniKit) return null

    const commands = window.MiniKit.commands || {}
    return {
      isInstalled: window.MiniKit.isInstalled?.() || false,
      hasWorldApp: navigator.userAgent.includes("WorldApp"),
      inIframe: window.self !== window.top,
      url: window.location.href,
      userAgent: navigator.userAgent,
      appId: "app_7a9639a92f85fcf27213f982eddb5064",
      availableCommands: Object.keys(commands),
      hasSignIn: typeof commands.signIn === "function",
      hasVerify: typeof commands.verify === "function",
    }
  }

  const handleSignIn = async () => {
    setIsVerifying(true)
    setError(null)

    try {
      const debug = getDebugInfo()
      setDebugInfo(debug)
      console.log("Debug Info:", debug)

      if (!window.MiniKit || !window.MiniKit.isInstalled()) {
        throw new Error("MiniKit is not installed. Please open this app in the World App.")
      }

      const commands = window.MiniKit.commands
      if (!commands) {
        throw new Error("MiniKit commands not available")
      }

      let result = null

      // Try signIn first (preferred method)
      if (typeof commands.signIn === "function") {
        console.log("Using signIn command...")
        result = await commands.signIn({
          action: "signin",
          signal: "worldfan_signin_" + Date.now(),
        })
      }
      // Fallback to verify if signIn not available
      else if (typeof commands.verify === "function") {
        console.log("Using verify command as fallback...")
        result = await commands.verify({
          action: "signin",
          signal: "worldfan_verify_" + Date.now(),
          verification_level: "device",
        })
      } else {
        throw new Error("Neither signIn nor verify commands are available")
      }

      console.log("Authentication result:", result)

      if (result && (result.nullifier_hash || result.finalPayload?.nullifier_hash)) {
        const nullifierHash = result.nullifier_hash || result.finalPayload?.nullifier_hash
        const verificationLevel = result.verification_level || result.finalPayload?.verification_level || "device"

        const userData = {
          id: `worldid_${Date.now()}`,
          name: "World ID User",
          nullifier_hash: nullifierHash,
          verification_level: verificationLevel,
          verified_at: new Date().toISOString(),
          method: typeof commands.signIn === "function" ? "signIn" : "verify",
        }

        setUser(userData)
        localStorage.setItem("worldfan_user", JSON.stringify(userData))
      } else {
        throw new Error("Authentication failed: No nullifier hash returned")
      }
    } catch (err: any) {
      console.error("Authentication error:", err)
      setError(err.message || "Authentication failed. Please try again.")
    } finally {
      setIsVerifying(false)
    }
  }

  const handleDeveloperMode = () => {
    const devUser = {
      id: `dev_${Date.now()}`,
      name: "Developer User",
      nullifier_hash: `dev_${Date.now()}`,
      verification_level: "device",
      verified_at: new Date().toISOString(),
      method: "developer",
    }
    setUser(devUser)
    localStorage.setItem("worldfan_user", JSON.stringify(devUser))
  }

  const handleSignOut = () => {
    setUser(null)
    localStorage.removeItem("worldfan_user")
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading World Fan...</p>
        </div>
      </div>
    )
  }

  // Show dashboard if authenticated
  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-xl">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl">Welcome to World Fan!</CardTitle>
              <p className="text-gray-600">You are successfully signed in with World ID</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium mb-3">Your World ID Details</h3>
                <div className="space-y-2 text-sm">
                  <p>
                    <strong>User:</strong> {user.name}
                  </p>
                  <p>
                    <strong>Nullifier:</strong>{" "}
                    <code className="bg-gray-200 px-1 rounded text-xs">{user.nullifier_hash}</code>
                  </p>
                  <p>
                    <strong>Verification Level:</strong> {user.verification_level}
                  </p>
                  <p>
                    <strong>Method Used:</strong> {user.method}
                  </p>
                  <p>
                    <strong>Verified At:</strong> {new Date(user.verified_at).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="grid gap-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2">🎵 Music Features Available</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Fair-priced concert tickets</li>
                    <li>• Exclusive vinyl releases</li>
                    <li>• Direct artist connections</li>
                    <li>• Anti-bot protection</li>
                  </ul>
                </div>
              </div>

              <Button onClick={handleSignOut} variant="outline" className="w-full">
                Sign Out
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Show sign-in page
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="max-w-md mx-auto">
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl">World Fan</CardTitle>
            <p className="text-gray-600">Sign in with World ID to access exclusive music experiences</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <Shield className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-900">Human Verified</p>
                  <p className="text-sm text-green-700">Proof you're a real person, not a bot</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-900">Fair Access</p>
                  <p className="text-sm text-blue-700">No scalpers, fair prices for real fans</p>
                </div>
              </div>
            </div>

            <Button
              onClick={handleSignIn}
              disabled={isVerifying}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              size="lg"
            >
              {isVerifying ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Signing in with World ID...
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4 mr-2" />
                  Sign in with World ID
                </>
              )}
            </Button>

            {error && (
              <div className="space-y-3">
                <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-red-900">Sign In Error</p>
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleSignIn} variant="outline" size="sm" className="flex-1">
                    Try Again
                  </Button>
                  <Button onClick={handleDeveloperMode} variant="outline" size="sm" className="flex-1">
                    Developer Mode
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
                  <p>Has WorldApp: {debugInfo.hasWorldApp ? "✓" : "✗"}</p>
                  <p>In iframe: {debugInfo.inIframe ? "✓" : "✗"}</p>
                  <p>URL: {debugInfo.url}</p>
                  <p>User Agent: {debugInfo.userAgent.slice(0, 50)}...</p>
                  <p>App ID: {debugInfo.appId}</p>
                  <p>
                    <strong>MiniKit Commands:</strong>
                  </p>
                  <p>Available Commands: {debugInfo.availableCommands.join(", ")}</p>
                  <p>Has signIn: {debugInfo.hasSignIn ? "✓" : "✗"}</p>
                  <p>Has verify: {debugInfo.hasVerify ? "✓" : "✗"}</p>
                </div>
              </details>
            )}

            <div className="text-center">
              <Button onClick={handleDeveloperMode} variant="ghost" size="sm" className="text-xs">
                <Zap className="w-3 h-3 mr-1" />
                Continue with Development Mode (Testing)
              </Button>
            </div>

            <div className="text-xs text-gray-500 text-center">
              <p>
                By signing in with World ID, you agree to our{" "}
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
        </Card>
      </div>
    </div>
  )
}
