"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Music, Users, Ticket, Shield, Check } from "lucide-react"
import { Dashboard } from "@/components/dashboard"
import { WorldIDMiniKitAuth } from "@/components/worldid-minikit-auth"
import Image from "next/image"

export default function HomePage() {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem("worldfan_user")
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        console.error("Failed to parse saved user:", error)
        localStorage.removeItem("worldfan_user")
      }
    }
    setIsLoading(false)
  }, [])

  const handleAuthSuccess = (userData: any) => {
    console.log("Authentication successful:", userData)
    setUser(userData)
    localStorage.setItem("worldfan_user", JSON.stringify(userData))
  }

  const handleSignOut = () => {
    setUser(null)
    localStorage.removeItem("worldfan_user")
  }

  const handleDeveloperMode = () => {
    const devUser = {
      id: `dev_${Date.now()}`,
      name: "Developer User",
      email: "dev@worldfan.app",
      image: "",
      worldcoin: {
        verification_level: "device",
        nullifier_hash: `dev_nullifier_${Date.now()}`,
        verified_at: new Date().toISOString(),
      },
    }
    handleAuthSuccess(devUser)
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Show dashboard if authenticated
  if (user) {
    return <Dashboard user={user} onSignOut={handleSignOut} />
  }

  // Show sign-in page
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-4">
            <Image
              src="/images/world-fan-logo-hq.png"
              alt="World Fan Logo"
              width={60}
              height={60}
              className="object-contain"
            />
            <h1 className="text-3xl font-bold text-black">World Fan</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            The future of music fan experiences on Worldcoin. Get early access to exclusive vinyl drops, fair-priced
            tickets, and connect with artists you love.
          </p>
        </header>

        {/* Sign In Card */}
        <div className="max-w-md mx-auto mb-16">
          <Card className="border-0 shadow-xl">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <CardTitle>Sign in with World ID</CardTitle>
              <p className="text-gray-600">
                Secure authentication for accessing fair-priced tickets and exclusive vinyl drops
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <Shield className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium text-green-900">Secure & Private</p>
                    <p className="text-sm text-green-700">Your identity stays protected</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <Check className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-blue-900">Human Verified</p>
                    <p className="text-sm text-blue-700">Proof you're a real person, not a bot</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                  <Users className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="font-medium text-purple-900">Exclusive Access</p>
                    <p className="text-sm text-purple-700">Fair tickets and limited vinyl releases</p>
                  </div>
                </div>
              </div>

              <WorldIDMiniKitAuth onSuccess={handleAuthSuccess} onDeveloperMode={handleDeveloperMode} />

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

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ticket className="w-5 h-5 text-purple-600" />
                Fair Ticket Access
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                No more bot-inflated prices. World ID verification ensures real fans get tickets at fair prices.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Music className="w-5 h-5 text-purple-600" />
                Exclusive Vinyl Drops
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Get first access to limited edition vinyl releases from your favorite artists.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-600" />
                Artist Connections
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Direct communication channels with artists and exclusive fan experiences.</p>
            </CardContent>
          </Card>
        </div>

        {/* Stats Section */}
        <div className="text-center mb-16">
          <h3 className="text-2xl font-bold mb-8">The Problem We're Solving</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="text-4xl font-bold text-red-600 mb-2">300%</div>
              <p className="text-gray-600">Average ticket markup by scalpers</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-red-600 mb-2">80%</div>
              <p className="text-gray-600">Of fans can't afford concert tickets</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-red-600 mb-2">90%</div>
              <p className="text-gray-600">Of vinyl releases sell out to bots</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
