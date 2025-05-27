"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, ArrowRight, Check, Globe, Music, Users, Ticket } from "lucide-react"
import { CitySelector } from "@/components/city-selector"
import { GenreSelector } from "@/components/genre-selector"
import { saveUserData } from "@/app/actions/save-user-data"
import { WorldIDNextAuth } from "@/components/worldid-nextauth"

type OnboardingStep = "auth" | "profile" | "cities" | "genres" | "artists" | "complete"

export function OnboardingFlow() {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("auth")
  const [userData, setUserData] = useState({
    worldId: "",
    worldIdData: null as any,
    username: "",
    email: "",
    cities: [] as string[],
    genres: [] as string[],
    favoriteArtists: "",
    ticketStruggles: "",
    priceRange: "",
    notifications: true,
  })

  const steps = [
    { id: "auth", title: "World ID Sign-In", icon: Globe },
    { id: "profile", title: "Profile Setup", icon: Users },
    { id: "cities", title: "Your Cities", icon: Globe },
    { id: "genres", title: "Music Taste", icon: Music },
    { id: "artists", title: "Artist Preferences", icon: Users },
    { id: "complete", title: "Complete", icon: Check },
  ]

  const currentStepIndex = steps.findIndex((step) => step.id === currentStep)

  const handleNext = () => {
    // Ensure World ID authentication is complete before proceeding
    if (currentStep === "auth" && (!userData.worldId || !userData.worldIdData)) {
      alert("World ID sign-in is required to continue.")
      return
    }

    const stepOrder: OnboardingStep[] = ["auth", "profile", "cities", "genres", "artists", "complete"]
    const currentIndex = stepOrder.indexOf(currentStep)
    if (currentIndex < stepOrder.length - 1) {
      setCurrentStep(stepOrder[currentIndex + 1])
    }
  }

  const handleBack = () => {
    const stepOrder: OnboardingStep[] = ["auth", "profile", "cities", "genres", "artists", "complete"]
    const currentIndex = stepOrder.indexOf(currentStep)
    if (currentIndex > 0) {
      setCurrentStep(stepOrder[currentIndex - 1])
    }
  }

  const handleComplete = async () => {
    // Final check for World ID authentication
    if (!userData.worldId || !userData.worldIdData) {
      alert("World ID sign-in is required. Please complete authentication first.")
      setCurrentStep("auth")
      return
    }

    try {
      const result = await saveUserData(userData)

      if (result.success) {
        alert(`Welcome to World Fan! Your World ID sign-in is confirmed.`)
        // Redirect to dashboard
        window.location.href = "/dashboard"
      } else {
        alert(`Error: ${result.error}`)
      }
    } catch (error) {
      console.error("Error completing signup:", error)
      alert("Something went wrong. Please try again.")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isActive = step.id === currentStep
              const isCompleted = index < currentStepIndex

              return (
                <div key={step.id} className="flex items-center">
                  <div
                    className={`
                    w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors
                    ${
                      isActive
                        ? "bg-purple-600 border-purple-600 text-white"
                        : isCompleted
                          ? "bg-green-600 border-green-600 text-white"
                          : "bg-white border-gray-300 text-gray-400"
                    }
                  `}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`
                      w-16 h-0.5 mx-2 transition-colors
                      ${isCompleted ? "bg-green-600" : "bg-gray-300"}
                    `}
                    />
                  )}
                </div>
              )
            })}
          </div>
          <p className="text-center text-sm text-gray-600">
            Step {currentStepIndex + 1} of {steps.length}: {steps[currentStepIndex].title}
          </p>
        </div>

        {/* Step Content */}
        <Card className="border-0 shadow-xl">
          {currentStep === "auth" && (
            <WorldIDNextAuth
              onSuccess={(worldId, userInfo) => {
                console.log("World ID sign-in successful:", { worldId, userInfo })
                setUserData((prev) => ({
                  ...prev,
                  worldId,
                  worldIdData: userInfo,
                }))
                handleNext()
              }}
            />
          )}

          {currentStep === "profile" && (
            <>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-600" />
                  World ID Verified - Setup Profile
                </CardTitle>
                <CardDescription>Your World ID sign-in is complete. Now tell us about yourself.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg mb-4">
                  <Check className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium text-green-900">World ID Verified</p>
                    <p className="text-sm text-green-700">Platform: {userData.worldIdData?.platform || "NextAuth"}</p>
                  </div>
                </div>

                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    placeholder="musiclover123"
                    value={userData.username}
                    onChange={(e) => setUserData((prev) => ({ ...prev, username: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email (optional)</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={userData.email}
                    onChange={(e) => setUserData((prev) => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="notifications"
                    checked={userData.notifications}
                    onCheckedChange={(checked) =>
                      setUserData((prev) => ({ ...prev, notifications: checked as boolean }))
                    }
                  />
                  <Label htmlFor="notifications" className="text-sm">
                    Get notified about new features and exclusive drops
                  </Label>
                </div>
              </CardContent>
            </>
          )}

          {currentStep === "cities" && (
            <CitySelector
              selectedCities={userData.cities}
              onCitiesChange={(cities) => setUserData((prev) => ({ ...prev, cities }))}
            />
          )}

          {currentStep === "genres" && (
            <GenreSelector
              selectedGenres={userData.genres}
              onGenresChange={(genres) => setUserData((prev) => ({ ...prev, genres }))}
            />
          )}

          {currentStep === "artists" && (
            <>
              <CardHeader>
                <CardTitle>Artist Preferences & Ticket Struggles</CardTitle>
                <CardDescription>Help us understand your music taste and ticket buying challenges</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="artists">Favorite Artists or Bands</Label>
                  <Textarea
                    id="artists"
                    placeholder="Taylor Swift, Radiohead, Kendrick Lamar, Arctic Monkeys..."
                    value={userData.favoriteArtists}
                    onChange={(e) => setUserData((prev) => ({ ...prev, favoriteArtists: e.target.value }))}
                    className="min-h-[100px]"
                  />
                </div>
                <div>
                  <Label htmlFor="struggles">Ticket Buying Struggles</Label>
                  <Textarea
                    id="struggles"
                    placeholder="Tell us about times you couldn't get tickets or had to pay inflated prices..."
                    value={userData.ticketStruggles}
                    onChange={(e) => setUserData((prev) => ({ ...prev, ticketStruggles: e.target.value }))}
                    className="min-h-[100px]"
                  />
                </div>
                <div>
                  <Label htmlFor="price-range">Typical ticket budget per show</Label>
                  <Input
                    id="price-range"
                    placeholder="$50-100, $100-200, etc."
                    value={userData.priceRange}
                    onChange={(e) => setUserData((prev) => ({ ...prev, priceRange: e.target.value }))}
                  />
                </div>
              </CardContent>
            </>
          )}

          {currentStep === "complete" && (
            <>
              <CardHeader>
                <CardTitle className="text-center">Welcome to World Fan! 🎵</CardTitle>
                <CardDescription className="text-center">
                  Your World ID sign-in is complete. Here's what happens next:
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <Check className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium text-green-900">World ID Verified</p>
                    <p className="text-sm text-green-700">
                      You're protected from bots and scalpers with verified human identity
                    </p>
                  </div>
                </div>

                <div className="grid gap-4">
                  <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-lg">
                    <Ticket className="w-5 h-5 text-purple-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Fair Ticket Access</h4>
                      <p className="text-sm text-gray-600">
                        Get notified when tickets for your favorite artists go on sale at fair prices
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                    <Music className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Exclusive Vinyl Drops</h4>
                      <p className="text-sm text-gray-600">Be first to know about limited edition vinyl releases</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                    <Users className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Beta Access</h4>
                      <p className="text-sm text-gray-600">Get early access to our full platform when it launches</p>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <Button
                    onClick={handleComplete}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    Complete World Fan Setup
                  </Button>
                </div>
              </CardContent>
            </>
          )}

          {/* Navigation */}
          {currentStep !== "complete" && currentStep !== "auth" && (
            <div className="flex justify-between p-6 border-t">
              <Button variant="outline" onClick={handleBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button
                onClick={handleNext}
                disabled={
                  (currentStep === "profile" && !userData.username) ||
                  (currentStep === "cities" && userData.cities.length === 0) ||
                  (currentStep === "genres" && userData.genres.length === 0)
                }
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
