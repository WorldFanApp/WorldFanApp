"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface NotificationPreferencesFormProps {
  userData: {
    createAccount: boolean
    email: string
    phone: string
    username: string
  }
  updateUserData: (
    data: Partial<{
      createAccount: boolean
      email: string
      phone: string
      username: string
    }>,
  ) => void
}

export function NotificationPreferencesForm({ userData, updateUserData }: NotificationPreferencesFormProps) {
  const [activeTab, setActiveTab] = useState<string>(userData.createAccount ? "account" : "anonymous")

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    updateUserData({ createAccount: value === "account" })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Would you like to create an account?</Label>
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="account">Create Account</TabsTrigger>
            <TabsTrigger value="anonymous">Stay Anonymous</TabsTrigger>
          </TabsList>
          <TabsContent value="account" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username (optional)</Label>
              <Input
                id="username"
                placeholder="Enter a username"
                value={userData.username}
                onChange={(e) => updateUserData({ username: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email (optional)</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={userData.email}
                onChange={(e) => updateUserData({ email: e.target.value })}
              />
              <p className="text-sm text-muted-foreground">For email notifications about new music and events</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number (optional)</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter your phone number"
                value={userData.phone}
                onChange={(e) => updateUserData({ phone: e.target.value })}
              />
              <p className="text-sm text-muted-foreground">
                For text notifications about ticket drops and special events
              </p>
            </div>
          </TabsContent>
          <TabsContent value="anonymous" className="space-y-4 mt-4">
            <div className="rounded-lg border p-4 bg-muted/50">
              <h3 className="font-medium mb-2">Anonymous Mode</h3>
              <p className="text-sm text-muted-foreground">
                You've chosen to stay anonymous. Your World ID verification will be used only to ensure you're a unique
                human, but we won't store any personal information.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                You can always create an account later from your dashboard.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
