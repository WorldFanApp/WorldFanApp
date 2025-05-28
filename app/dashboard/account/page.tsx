"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function AccountPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [userData, setUserData] = useState<any>(null)
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    createAccount: false,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedData = localStorage.getItem("userData")
    if (storedData) {
      const parsedData = JSON.parse(storedData)
      setUserData(parsedData)
      setFormData({
        username: parsedData.username || "",
        email: parsedData.email || "",
        phone: parsedData.phone || "",
        createAccount: parsedData.createAccount || false,
      })
    }
    setIsLoading(false)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, createAccount: checked }))
  }

  const handleSave = () => {
    if (userData) {
      const updatedData = {
        ...userData,
        username: formData.username,
        email: formData.email,
        phone: formData.phone,
        createAccount: formData.createAccount,
      }
      localStorage.setItem("userData", JSON.stringify(updatedData))
      setUserData(updatedData)
      alert("Account settings saved successfully!")
    }
  }

  const handleDeleteAccount = () => {
    localStorage.removeItem("userData")
    router.push("/")
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!userData) {
    return <div>No user data found</div>
  }

  // Get credential type badge color
  const getCredentialBadgeColor = (type?: string) => {
    switch (type) {
      case "orb":
        return "bg-green-100 text-green-800 border-green-200"
      case "phone":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
        <p className="text-muted-foreground">Manage your account preferences and personal information</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your account settings and contact information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="createAccount">Account Status</Label>
                <p className="text-sm text-muted-foreground">
                  {formData.createAccount
                    ? "You have an active account with preferences"
                    : "You're browsing anonymously"}
                </p>
              </div>
              <Switch id="createAccount" checked={formData.createAccount} onCheckedChange={handleSwitchChange} />
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="username">Username (optional)</Label>
              <Input
                id="username"
                placeholder="Enter a username"
                value={formData.username}
                onChange={handleInputChange}
                disabled={!formData.createAccount}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email (optional)</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={!formData.createAccount}
              />
              <p className="text-sm text-muted-foreground">For email notifications about new music and events</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number (optional)</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={handleInputChange}
                disabled={!formData.createAccount}
              />
              <p className="text-sm text-muted-foreground">
                For text notifications about ticket drops and special events
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Delete All Data</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your account and remove all your data from
                  our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteAccount}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Button onClick={handleSave}>Save Changes</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>World ID Verification</CardTitle>
          <CardDescription>Your World ID verification status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-green-600"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">World ID Verified</h3>
                {session?.user?.worldcoin_credential_type && (
                  <Badge className={getCredentialBadgeColor(session.user.worldcoin_credential_type)}>
                    {session.user.worldcoin_credential_type === "orb"
                      ? "Orb Verified"
                      : session.user.worldcoin_credential_type}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">Your identity has been verified with World ID</p>
            </div>
          </div>

          {session && (
            <div className="mt-4 p-4 border rounded-md bg-gray-50">
              <h4 className="text-sm font-medium mb-2">Verification Details</h4>
              <div className="space-y-1 text-sm">
                <p>
                  <span className="font-medium">User ID:</span> {session.user?.id || "Not available"}
                </p>
                <p>
                  <span className="font-medium">Name:</span> {session.user?.name || "Not available"}
                </p>
                <p>
                  <span className="font-medium">Credential Type:</span>{" "}
                  {session.user?.worldcoin_credential_type || "Not available"}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
