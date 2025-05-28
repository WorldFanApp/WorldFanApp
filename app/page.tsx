"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useMiniKit } from "@/components/minikit-provider"
import { WorldAppQR } from "@/components/world-app-qr"
import { Bug } from "lucide-react"
import { useState } from "react"

export default function Home() {
  const { isWorldApp, isLoading, error } = useMiniKit()
  const [showDebug, setShowDebug] = useState(false)

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src="/placeholder.svg?height=32&width=32&query=world%20logo"
              alt="World Logo"
              width={32}
              height={32}
            />
            <span className="text-xl font-bold">World Music</span>
          </div>
        </div>
      </header>

      {!isLoading && !isWorldApp && (
        <div className="container mt-4">
          <WorldAppQR />
        </div>
      )}

      <main className="flex-1">
        <section className="container py-12 md:py-24 lg:py-32">
          <div className="mx-auto flex max-w-[980px] flex-col items-center gap-4 text-center">
            <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:text-6xl lg:leading-[1.1]">
              Discover music with verified humans
            </h1>
            <p className="max-w-[750px] text-lg text-muted-foreground sm:text-xl">
              Join our community of Orb-verified music lovers. Share your preferences, discover new artists, and connect
              with others.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/signup">Get Started</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href="https://worldcoin.org/download" target="_blank" rel="noopener noreferrer">
                  Download World App
                </a>
              </Button>
            </div>
          </div>
        </section>
        <section className="container py-12 md:py-24 lg:py-32">
          <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Orb Verified</h2>
                <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform uses World ID to ensure every user is a unique human, creating a trusted community for
                  music lovers.
                </p>
              </div>
            </div>
            <div className="flex justify-center">
              <Image
                src="/placeholder.svg?height=400&width=400&query=orb%20verification%20device"
                alt="Orb Verification"
                width={400}
                height={400}
                className="rounded-lg object-cover"
              />
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} World Music. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="#" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
              Terms
            </Link>
            <Link href="#" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
              Privacy
            </Link>
            <button
              onClick={() => setShowDebug(!showDebug)}
              className="text-sm text-muted-foreground underline-offset-4 hover:underline flex items-center gap-1"
            >
              <Bug className="h-3 w-3" />
              {showDebug ? "Hide Debug" : "Debug"}
            </button>
          </div>
        </div>

        {/* Debug information - only shown when debug mode is enabled */}
        {showDebug && (
          <div className="container mt-4 p-4 border border-gray-200 rounded-md bg-gray-50">
            <h3 className="text-sm font-medium flex items-center gap-1">
              <Bug className="h-4 w-4" /> Debug Information
            </h3>
            <p className="text-xs mt-1">World App: {isWorldApp ? "Yes" : "No"}</p>
            <p className="text-xs">Environment: {process.env.NODE_ENV}</p>
            <p className="text-xs">
              MiniKit Available: {typeof (window as any).MiniKit !== "undefined" ? "Yes" : "No"}
            </p>
            {error && <p className="text-xs text-red-600 mt-1">Error: {error}</p>}
          </div>
        )}
      </footer>
    </div>
  )
}
