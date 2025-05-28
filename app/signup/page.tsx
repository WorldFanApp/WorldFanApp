"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { LocationForm } from "@/components/location-form"
import { MusicPreferencesForm } from "@/components/music-preferences-form"
import { NotificationPreferencesForm } from "@/components/notification-preferences-form"
import { Progress } from "@/components/ui/progress"
import { CheckCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { DebugAuth } from "@/components/debug-auth"

const steps = [
  { id: "location", title: "Location" },
  { id: "music-preferences", title: "Music Preferences" },
  { id: "notification-preferences", title: "Notification Preferences" },
]

export default function SignupPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [userData, setUserData] = useState({
    country: "",
    city: "",
    artists: [],
    genres: [],
    createAccount: false,
    email: "",
    phone: "",
    username: "",
  })
  const router = useRouter()
  const { data: session, status } = useSession()

  useEffect(() => {
    // If not authenticated, redirect to home
    if (status === "unauthenticated") {
      router.push("/")
    }
  }, [status, router])

  const progress = ((currentStep + 1) / steps.length) * 100

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
      window.scrollTo(0, 0)
    } else {
      // Save data and redirect to dashboard
      const userDataWithSession = {
        ...userData,
        worldId: session?.user?.id || "",
        email: session?.user?.email || userData.email,
        name: session?.user?.name || userData.username,
        worldcoin_credential_type: session?.user?.worldcoin_credential_type || "",
      }
      localStorage.setItem("userData", JSON.stringify(userDataWithSession))
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

  // Show loading state while checking authentication status
  if (status === "loading") {
    return (
      <div className="container max-w-4xl py-10 flex items-center justify-center min-h-[50vh]">
        <p>Loading...</p>
      </div>
    )
  }

  // If not authenticated, don't render the form
  if (status === "unauthenticated") {
    return null
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

      {session && (
        <Alert className="mb-6 bg-green-50 border-green-200">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <AlertDescription className="text-green-800 ml-2 flex items-center justify-between w-full">
            <span>Signed in as {session.user?.name || session.user?.email || "Verified User"}</span>
            {session.user?.worldcoin_credential_type && (
              <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs font-medium">
                {session.user.worldcoin_credential_type}
              </span>
            )}
          </AlertDescription>
        </Alert>
      )}

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
            {currentStep === 0 && "Tell us where you're from"}
            {currentStep === 1 && "Share your music preferences"}
            {currentStep === 2 && "Set up your notification preferences"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {currentStep === 0 && <LocationForm userData={userData} updateUserData={updateUserData} />}
          {currentStep === 1 && <MusicPreferencesForm userData={userData} updateUserData={updateUserData} />}
          {currentStep === 2 && <NotificationPreferencesForm userData={userData} updateUserData={updateUserData} />}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleBack} disabled={currentStep === 0}>
            Back
          </Button>
          <Button
            onClick={handleNext}
            disabled={
              (currentStep === 0 && (!userData.country || !userData.city)) ||
              (currentStep === 1 && (!userData.artists.length || !userData.genres.length))
            }
          >
            {currentStep < steps.length - 1 ? "Next" : "Complete"}
          </Button>
        </CardFooter>
      </Card>

      <div className="mt-8 flex justify-center">
        <DebugAuth />
      </div>
    </div>
  )
}
