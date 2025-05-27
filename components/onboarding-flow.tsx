"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { WorldIDHumanVerification } from "./worldid-human-verification"
import { DeveloperSignup } from "./developer-signup"
import { EnhancedDashboard } from "./enhanced-dashboard"

export function OnboardingFlow() {
  const [currentStep, setCurrentStep] = useState<"verification" | "developer_signup" | "dashboard">("verification")
  const [userData, setUserData] = useState<any>(null)

  const handleWorldIDSuccess = async (worldId: string, userInfo: any) => {
    console.log("World ID verification successful:", { worldId, userInfo })

    // Save the World ID data
    try {
      const response = await fetch("/api/user/save-worldid-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nullifierHash: worldId,
          userData: userInfo,
        }),
      })

      if (response.ok) {
        setUserData(userInfo)
        setCurrentStep("dashboard")
      }
    } catch (error) {
      console.error("Error saving World ID data:", error)
      // Still proceed to dashboard even if save fails
      setUserData(userInfo)
      setCurrentStep("dashboard")
    }
  }

  const handleDeveloperMode = () => {
    setCurrentStep("developer_signup")
  }

  const handleDeveloperSignupSuccess = (devUserData: any) => {
    console.log("Developer signup successful:", devUserData)
    setUserData(devUserData)
    setCurrentStep("dashboard")
  }

  const handleSignOut = () => {
    setUserData(null)
    setCurrentStep("verification")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-4">
      {currentStep === "verification" && (
        <Card className="w-full max-w-md">
          <WorldIDHumanVerification onSuccess={handleWorldIDSuccess} onDeveloperMode={handleDeveloperMode} />
        </Card>
      )}

      {currentStep === "developer_signup" && (
        <Card className="w-full max-w-2xl">
          <DeveloperSignup onSuccess={handleDeveloperSignupSuccess} onBack={() => setCurrentStep("verification")} />
        </Card>
      )}

      {currentStep === "dashboard" && userData && <EnhancedDashboard userData={userData} onSignOut={handleSignOut} />}
    </div>
  )
}
