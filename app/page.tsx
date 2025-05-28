"use client"

import { useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { AuthButton } from "@/components/auth-button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield } from "lucide-react"

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
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
  }, [status, router])

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
              Join our exclusive community of Orb-verified music lovers. Share your preferences, discover new artists,
              and connect with real people.
            </p>

            <div className="flex flex-col gap-4 items-center mt-4">
              <Alert className="max-w-md bg-blue-50 border-blue-200">
                <Shield className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  This application requires World ID Orb verification to ensure every member is a unique human. No bots,
                  no fake accounts.
                </AlertDescription>
              </Alert>

              <AuthButton callbackUrl="/signup" className="px-8" />
            </div>

            <p className="text-sm text-muted-foreground max-w-md mt-4">
              By signing in, you agree to verify your identity with World ID. Only Orb-verified users can access this
              platform.
            </p>
          </div>
        </section>

        <section className="container py-12 md:py-24 lg:py-32">
          <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">100% Human Verified</h2>
                <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  World ID Orb verification guarantees that every member of our community is a real person. No
                  duplicates, no bots, just authentic music lovers sharing their passion.
                </p>
              </div>
            </div>
            <div className="flex justify-center">
              <Image
                src="/placeholder.svg?height=400&width=400&query=world%20id%20orb%20device"
                alt="World ID Orb Device"
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
          </div>
        </div>
      </footer>
    </div>
  )
}
