"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { OrbVerification } from "@/components/orb-verification"
import { LocationForm } from "@/components/location-form"
import { MusicPreferencesForm } from "@/components/music-preferences-form"
import { NotificationPreferencesForm } from "@/components/notification-preferences-form"
import { Progress } from "@/components/ui/progress"
import { WorldAppRequired } from "@/components/world-app-required"
import { useWorldApp } from "@/hooks/use-world-app"
import { Bug } from "lucide-react"

const steps = [
  { id: "orb-verification", title: "Orb Verification" },
  { id: "location", title: "Location" },
  { id: "music-preferences", title: "Music Preferences" },
  { id: "notification-preferences", title: "Notification Preferences" },
]

export default function SignupPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [userData, setUserData] = useState({
    isOrbVerified: false,
    country: "",
    city: "",
    artists: [],
    genres: [],
    createAccount: false,
    email: "",
    phone: "",
    username: "",
  })
  const [showDebug, setShowDebug] = useState(false)
  const router = useRouter()
  const { isWorldApp, isAvailable, isLoading, error } = useWorldApp()

  const progress = ((currentStep + 1) / steps.length) * 100

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
      window.scrollTo(0, 0)
    } else {
      // Save data and redirect to dashboard
      localStorage.setItem("userData", JSON.stringify(userData))
      router.push("/dashboard")
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      window.scrollTo(0, 0)
    }
  }

  const updateUserData = (data: Partial<typeof userData>) => {
    setUserData({ ...userData, ...data })
  }

  // Show loading state while checking World App status
  if (isLoading) {
    return (
      <div className="container max-w-4xl py-10 flex items-center justify-center min-h-[50vh]">
        <p>Loading...</p>
      </div>
    )
  }

  // If not in World App and we're on the verification step, show the World App required message
  // But only if we're not in development mode or MiniKit is not available at all
  if (!isWorldApp && currentStep === 0 && (!isAvailable || process.env.NODE_ENV !== "development")) {
    return (
      <div className="container max-w-4xl py-10">
        <div className="mb-8 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/placeholder.svg?height=32&width=32&query=world%20logo"
              alt="World Logo"
              width={32}
              height={32}
            />
            <span className="text-xl font-bold">World Music</span>
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold">Sign Up</h1>
          <p className="text-muted-foreground">Complete the steps below to create your account</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Orb Verification Required</CardTitle>
            <CardDescription>You need to verify your identity with World ID to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <WorldAppRequired
              message="Orb verification requires the World App. Please open this application in the World App to continue."
              showMockMessage={true}
            />
          </CardContent>
        </Card>

        {/* Debug button at the bottom */}
        <div className="mt-8 text-center">
          <button
            onClick={() => setShowDebug(!showDebug)}
            className="text-xs text-muted-foreground underline-offset-4 hover:underline flex items-center gap-1 mx-auto"
          >
            <Bug className="h-3 w-3" />
            {showDebug ? "Hide Debug Info" : "Show Debug Info"}
          </button>

          {showDebug && error && (
            <div className="mt-2 p-2 border border-gray-200 rounded-md bg-gray-50 text-xs text-left">
              <p className="text-red-600">{error}</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl py-10">
      <div className="mb-8 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/placeholder.svg?height=32&width=32&query=world%20logo" alt="World Logo" width={32} height={32} />
          <span className="text-xl font-bold">World Music</span>
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold">Sign Up</h1>
        <p className="text-muted-foreground">Complete the steps below to create your account</p>
      </div>

      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`text-sm ${index <= currentStep ? "text-primary font-medium" : "text-muted-foreground"}`}
            >
              {step.title}
            </div>
          ))}
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{steps[currentStep].title}</CardTitle>
          <CardDescription>
            {currentStep === 0 && "Verify your identity with World ID"}
            {currentStep === 1 && "Tell us where you're from"}
            {currentStep === 2 && "Share your music preferences"}
            {currentStep === 3 && "Set up your notification preferences"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {currentStep === 0 && (
            <OrbVerification
              onVerified={() => updateUserData({ isOrbVerified: true })}
              isVerified={userData.isOrbVerified}
            />
          )}
          {currentStep === 1 && <LocationForm userData={userData} updateUserData={updateUserData} />}
          {currentStep === 2 && <MusicPreferencesForm userData={userData} updateUserData={updateUserData} />}
          {currentStep === 3 && <NotificationPreferencesForm userData={userData} updateUserData={updateUserData} />}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleBack} disabled={currentStep === 0}>
            Back
          </Button>
          <Button
            onClick={handleNext}
            disabled={
              (currentStep === 0 && !userData.isOrbVerified) ||
              (currentStep === 1 && (!userData.country || !userData.city)) ||
              (currentStep === 2 && (!userData.artists.length || !userData.genres.length))
            }
          >
            {currentStep < steps.length - 1 ? "Next" : "Complete"}
          </Button>
        </CardFooter>
      </Card>

      {/* Debug button at the bottom */}
      {error && (
        <div className="mt-8 text-center">
          <button
            onClick={() => setShowDebug(!showDebug)}
            className="text-xs text-muted-foreground underline-offset-4 hover:underline flex items-center gap-1 mx-auto"
          >
            <Bug className="h-3 w-3" />
            {showDebug ? "Hide Debug Info" : "Show Debug Info"}
          </button>

          {showDebug && (
            <div className="mt-2 p-2 border border-gray-200 rounded-md bg-gray-50 text-xs text-left">
              <p className="text-red-600">{error}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
