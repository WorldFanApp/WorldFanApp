"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Bug } from "lucide-react"
import { AuthButton } from "@/components/auth-button"
import { DebugAuth } from "@/components/debug-auth"

export default function Home() {
  const [showDebug, setShowDebug] = useState(false)
  const { data: session, status } = useSession()
  const router = useRouter()

  // If user is authenticated, redirect to signup or dashboard
  if (status === "authenticated") {
    // Check if user has completed signup
    const userData = localStorage.getItem("userData")
    if (userData) {
      router.push("/dashboard")
    } else {
      router.push("/signup")
    }
  }

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
              <AuthButton callbackUrl="/signup" className="px-8" />
            </div>

            <p className="text-sm text-muted-foreground max-w-md">
              By clicking "Sign In with World ID", you'll be asked to verify your identity with World ID to ensure
              you're a unique human.
            </p>

            <DebugAuth />
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
            <a href="#" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
              Terms
            </a>
            <a href="#" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
              Privacy
            </a>
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
            <p className="text-xs mt-1">Session Status: {status}</p>
            <p className="text-xs">Environment: {process.env.NODE_ENV}</p>
            <p className="text-xs">
              World ID Client: {process.env.WORLDCOIN_CLIENT_ID ? "Configured" : "app_7a9639a92f85fcf27213f982eddb5064"}
            </p>
            {session && (
              <div className="mt-2">
                <p className="text-xs font-medium">Session Data:</p>
                <pre className="text-xs mt-1 bg-gray-100 p-2 rounded overflow-auto max-h-40">
                  {JSON.stringify(session, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
      </footer>
    </div>
  )
}
