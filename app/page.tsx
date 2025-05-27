"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Music, Globe, Users, Ticket, Smartphone } from "lucide-react"
import { OnboardingFlow } from "@/components/onboarding-flow"
import Image from "next/image"
import Link from "next/link"

export default function HomePage() {
  const [showOnboarding, setShowOnboarding] = useState(false)

  if (showOnboarding) {
    return <OnboardingFlow />
  }

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

        {/* Hero Section */}
        <div className="max-w-4xl mx-auto mb-16">
          <Card className="border-0 shadow-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-3xl font-bold mb-4">Join the Music Revolution</h2>
                  <p className="text-purple-100 mb-6">
                    Be among the first to experience fair ticket pricing, exclusive vinyl releases, and direct artist
                    connections powered by Worldcoin's verified identity.
                  </p>
                  <div className="space-y-3">
                    <Button
                      size="lg"
                      className="bg-white text-purple-600 hover:bg-gray-100 w-full md:w-auto"
                      onClick={() => setShowOnboarding(true)}
                    >
                      Get Early Access with World ID
                    </Button>
                    <div className="md:ml-4 space-x-2">
                      <Link href="/test-worldid">
                        <Button variant="outline" size="sm" className="text-white border-white hover:bg-white/10">
                          Test World ID Integration
                        </Button>
                      </Link>
                      <Link href="/world-app-instructions">
                        <Button variant="outline" size="sm" className="text-white border-white hover:bg-white/10">
                          <Smartphone className="w-4 h-4 mr-1" />
                          World App Setup
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-center">
                    <Ticket className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-sm">Fair Ticket Pricing</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-center">
                    <Music className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-sm">Exclusive Vinyl</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-center">
                    <Globe className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-sm">Global Access</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-center">
                    <Users className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-sm">Artist Direct</p>
                  </div>
                </div>
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

        {/* CTA Section */}
        <Card className="border-0 shadow-xl bg-gray-50">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Ready to Change Music Forever?</h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Join thousands of music fans who are building the future of fair, accessible music experiences. Your World
              ID ensures you're a real fan, not a bot.
            </p>
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              onClick={() => setShowOnboarding(true)}
            >
              Start Your Journey with World ID
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
