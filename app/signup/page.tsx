"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation" // Added useSearchParams
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
import { toast } from "sonner"; // Added toast import

// Define SpotifyArtist and UserData interfaces for type safety
interface SpotifyArtist {
  id: string;
  name: string;
  images?: { url: string }[]; // Minimal structure, align with what MusicPreferencesForm provides
}

interface UserData {
  country: string;
  city: string;
  artists: SpotifyArtist[]; // Use the SpotifyArtist interface
  genres: string[];
  createAccount: boolean;
  email: string;
  phone: string;
  username: string;
}

const steps = [
  { id: "location", title: "Location" },
  { id: "music-preferences", title: "Music Preferences" },
  { id: "notification-preferences", title: "Notification Preferences" },
]

export default function SignupPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session, status } = useSession()

  // Determine initial state based on query parameters
  const getInitialStep = () => {
    const editMode = searchParams.get("edit") === "true";
    const stepQueryParam = searchParams.get('step');
    if (editMode && stepQueryParam) {
      const stepIndex = steps.findIndex(s => s.id === stepQueryParam || steps.indexOf(s).toString() === stepQueryParam);
      if (stepIndex !== -1) {
        return stepIndex;
      }
    }
    return 0;
  };

  const getInitialUserData = (): UserData => {
    const editMode = searchParams.get("edit") === "true";
    if (editMode) {
      const storedData = localStorage.getItem("userData");
      if (storedData) {
        try {
          // TODO: Potentially merge with session data if that's ever fresher for certain fields
          // For now, local storage is king in edit mode.
          const parsedData = JSON.parse(storedData);
           // Ensure all fields of UserData are present, merging with defaults if not
          return {
            country: parsedData.country || "",
            city: parsedData.city || "",
            artists: parsedData.artists || [],
            genres: parsedData.genres || [],
            createAccount: parsedData.createAccount || false,
            email: parsedData.email || "",
            phone: parsedData.phone || "",
            username: parsedData.username || "",
          };
        } catch (e) {
          console.error("Failed to parse userData from localStorage for edit mode", e);
        }
      }
    }
    return {
      country: "", city: "", artists: [], genres: [],
      createAccount: false, email: "", phone: "", username: "",
    };
  };

  const [currentStep, setCurrentStep] = useState(getInitialStep());
  const [userData, setUserData] = useState<UserData>(getInitialUserData());

  // This effect handles initial authentication check and potential updates if query params change
  // (though for this use case, query params are typically set on initial load).
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
      return; // Early exit if not authenticated
    }

    // Re-check and set initial state if query params lead (e.g. direct navigation with params)
    // This might be redundant if useState initializers are sufficient, but good for robustness
    // if component re-renders and searchParams instance changes.
    const editMode = searchParams.get("edit") === "true";
    if (editMode) {
      const storedData = localStorage.getItem("userData");
      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData);
          setUserData(prev => ({
            ...prev, // keep any already set data if component re-rendered quickly
            ...parsedData,
            artists: parsedData.artists || [], // ensure array fields are defaulted
            genres: parsedData.genres || []
          }));
        } catch (e) {
          console.error("Failed to parse userData from localStorage in useEffect for edit mode", e);
        }
      }
      const stepQueryParam = searchParams.get('step');
      if (stepQueryParam) {
        const stepIndex = steps.findIndex(s => s.id === stepQueryParam || steps.indexOf(s).toString() === stepQueryParam);
        if (stepIndex !== -1 && stepIndex !== currentStep) { // only set if different to avoid loop
          setCurrentStep(stepIndex);
        }
      }
    }
  }, [status, router, searchParams, currentStep]); // Added currentStep to deps of one useEffect, ensure this is intentional

  const progress = ((currentStep + 1) / steps.length) * 100;
  const editMode = searchParams.get("edit") === "true"; // Get it once for use in handleNext

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    } else {
      // Save data
      const userDataWithSession = {
        ...userData,
        worldId: session?.user?.id || "", // This is the nullifier_hash from Credentials provider
        // email and name might be from session (OAuth) or from userData form (if createAccount is true)
        email: userData.createAccount ? userData.email : (session?.user?.email || ""),
        name: userData.createAccount ? userData.username : (session?.user?.name || "Verified Fan"),
        worldcoin_credential_type: session?.user?.worldcoin_credential_type || "orb", // Default to orb if not set
      };
      localStorage.setItem("userData", JSON.stringify(userDataWithSession));

      if (editMode) {
        toast.success("Preferences Updated!", {
          description: "Your changes have been saved successfully.",
        });
        router.push("/dashboard/favorites"); // Or /dashboard, or wherever is appropriate after edit
      } else {
        toast.success("Welcome to World Fan!", {
          description: "Your account has been created successfully.",
        });
        router.push("/dashboard");
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      window.scrollTo(0, 0)
    }
  }

  const updateUserData = (data: Partial<UserData>) => { // Use UserData for partial type
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
    </div>
  )
}
