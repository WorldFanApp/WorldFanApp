"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Smartphone, Download, Globe, ArrowRight, ExternalLink } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function WorldAppInstructionsPage() {
  const currentUrl = typeof window !== "undefined" ? window.location.origin : "https://your-app.vercel.app"

  const copyUrl = () => {
    navigator.clipboard.writeText(currentUrl)
    alert("URL copied to clipboard!")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
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
          <h2 className="text-2xl font-bold mb-4">How to Access World Fan in the World App</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            World Fan requires the World App to enable World ID verification. Follow these steps to access the full
            experience.
          </p>
        </div>

        {/* Step-by-step instructions */}
        <div className="grid gap-6">
          {/* Step 1 */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <Download className="w-6 h-6 text-purple-600" />
                Download the World App
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                The World App is available for free on iOS and Android. Download it from your device's app store.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <Button
                  onClick={() => window.open("https://apps.apple.com/app/worldcoin/id1560859847", "_blank")}
                  className="w-full"
                  variant="outline"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Download for iOS
                </Button>
                <Button
                  onClick={() =>
                    window.open("https://play.google.com/store/apps/details?id=com.worldcoin.worldapp", "_blank")
                  }
                  className="w-full"
                  variant="outline"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Download for Android
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Step 2 */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <Smartphone className="w-6 h-6 text-purple-600" />
                Open Mini Apps in World App
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                Once you have the World App installed, open it and navigate to the "Mini Apps" section. This is usually
                found in the main menu or dashboard.
              </p>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Tip:</strong> Look for a "Mini Apps" or "Apps" tab in the World App interface. Some versions
                  may have it under a "Discover" or "Browse" section.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Step 3 */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <Globe className="w-6 h-6 text-purple-600" />
                Enter World Fan URL
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                In the Mini Apps section, look for an option to enter a custom URL or "Add Mini App". Enter the World
                Fan URL:
              </p>
              <div className="bg-gray-100 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <code className="text-sm font-mono break-all">{currentUrl}</code>
                  <Button onClick={copyUrl} size="sm" variant="outline">
                    Copy URL
                  </Button>
                </div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-800">
                  <strong>Note:</strong> Make sure to enter the complete URL including "https://" for proper loading.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Step 4 */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                  4
                </div>
                <ArrowRight className="w-6 h-6 text-purple-600" />
                Start Using World Fan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                Once World Fan loads in the World App, you'll be able to use World ID sign-in and access all features:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-purple-900 mb-2">✅ Available Features</h4>
                  <ul className="text-sm text-purple-800 space-y-1">
                    <li>• World ID verification</li>
                    <li>• Fair ticket access</li>
                    <li>• Exclusive vinyl drops</li>
                    <li>• Artist connections</li>
                  </ul>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">🔒 Security Benefits</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Bot protection</li>
                    <li>• Privacy preserved</li>
                    <li>• Verified human identity</li>
                    <li>• Anti-scalping measures</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Troubleshooting */}
        <Card className="border-0 shadow-lg bg-yellow-50">
          <CardHeader>
            <CardTitle className="text-yellow-800">Troubleshooting</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold text-yellow-900">Can't find Mini Apps section?</h4>
                <p className="text-sm text-yellow-800">
                  Try updating your World App to the latest version. The Mini Apps feature may not be available in older
                  versions.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-yellow-900">App won't load?</h4>
                <p className="text-sm text-yellow-800">
                  Ensure you have a stable internet connection and that the URL is entered correctly with "https://".
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-yellow-900">World ID verification not working?</h4>
                <p className="text-sm text-yellow-800">
                  Make sure you're accessing World Fan through the World App, not through a regular browser like Chrome
                  or Safari.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Back to app */}
        <div className="text-center">
          <Link href="/">
            <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
              Back to World Fan
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
