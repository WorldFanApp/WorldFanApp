"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Music, Ticket, GamepadIcon, Settings } from "lucide-react"

export default function Dashboard() {
  const [userData, setUserData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedData = localStorage.getItem("userData")
    if (storedData) {
      setUserData(JSON.parse(storedData))
    }
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!userData) {
    return <div>No user data found</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome to World Music</h1>
        <p className="text-muted-foreground">
          Your music preferences dashboard. Explore your favorite artists and genres.
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
          <TabsTrigger value="drops">Drops</TabsTrigger>
          <TabsTrigger value="game">Game</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Account Status</CardTitle>
                <Settings className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userData.createAccount ? "Active" : "Anonymous"}</div>
                <p className="text-xs text-muted-foreground">
                  {userData.createAccount ? "You have an account with preferences" : "You're browsing anonymously"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Favorite Artists</CardTitle>
                <Music className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userData.artists.length}</div>
                <p className="text-xs text-muted-foreground">Artists in your collection</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Upcoming Drops</CardTitle>
                <Ticket className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Coming Soon</div>
                <p className="text-xs text-muted-foreground">Check back for ticket drops</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Game Status</CardTitle>
                <GamepadIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Coming Soon</div>
                <p className="text-xs text-muted-foreground">New features launching soon</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Location</CardTitle>
                <CardDescription>Your current location settings</CardDescription>
              </CardHeader>
              <CardContent>
                {userData.country && userData.city && (
                  <p>
                    You're currently browsing from{" "}
                    <strong>
                      {userData.city === "nyc"
                        ? "New York"
                        : userData.city === "la"
                          ? "Los Angeles"
                          : userData.city === "lon"
                            ? "London"
                            : userData.city === "tor"
                              ? "Toronto"
                              : userData.city === "syd"
                                ? "Sydney"
                                : userData.city}
                    </strong>{" "}
                    in{" "}
                    <strong>
                      {userData.country === "us"
                        ? "United States"
                        : userData.country === "ca"
                          ? "Canada"
                          : userData.country === "uk"
                            ? "United Kingdom"
                            : userData.country === "au"
                              ? "Australia"
                              : userData.country}
                    </strong>
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Manage your music preferences</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <Button variant="outline" asChild>
                  <a href="/dashboard/favorites">View Favorite Artists</a>
                </Button>
                <Button variant="outline" asChild>
                  <a href="/dashboard/account">Edit Account Settings</a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage your account preferences and settings</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Visit the Account tab to manage your settings</p>
              <Button className="mt-4" asChild>
                <a href="/dashboard/account">Go to Account Settings</a>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="favorites">
          <Card>
            <CardHeader>
              <CardTitle>Your Favorites</CardTitle>
              <CardDescription>View and manage your favorite artists and genres</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Visit the Favorites tab to see your music preferences</p>
              <Button className="mt-4" asChild>
                <a href="/dashboard/favorites">Go to Favorites</a>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="drops">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Drops</CardTitle>
              <CardDescription>Ticket and vinyl drops for your favorite artists</CardDescription>
            </CardHeader>
            <CardContent>
              <p>This feature is coming soon!</p>
              <Button className="mt-4" asChild>
                <a href="/dashboard/drops">Check Drops</a>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="game">
          <Card>
            <CardHeader>
              <CardTitle>Music Game</CardTitle>
              <CardDescription>Play games and earn rewards</CardDescription>
            </CardHeader>
            <CardContent>
              <p>This feature is coming soon!</p>
              <Button className="mt-4" asChild>
                <a href="/dashboard/game">Go to Game</a>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
