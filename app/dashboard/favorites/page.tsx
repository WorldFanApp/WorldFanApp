"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Music, Disc } from "lucide-react"

export default function FavoritesPage() {
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
        <h1 className="text-3xl font-bold tracking-tight">Your Favorites</h1>
        <p className="text-muted-foreground">View and manage your favorite artists and genres</p>
      </div>

      <Tabs defaultValue="artists" className="space-y-4">
        <TabsList>
          <TabsTrigger value="artists">Artists</TabsTrigger>
          <TabsTrigger value="genres">Genres</TabsTrigger>
        </TabsList>

        <TabsContent value="artists" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Favorite Artists</CardTitle>
              <CardDescription>Artists you've selected as favorites</CardDescription>
            </CardHeader>
            <CardContent>
              {userData.artists && userData.artists.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {userData.artists.map((artist: string) => (
                    <Card key={artist} className="overflow-hidden">
                      <div className="aspect-square relative">
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />
                        <div className="absolute bottom-4 left-4 right-4">
                          <h3 className="text-lg font-semibold text-white">{artist}</h3>
                        </div>
                        <img
                          src={`/placeholder.svg?height=300&width=300&query=${encodeURIComponent(artist)}`}
                          alt={artist}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <p>No favorite artists selected yet.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="genres" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Favorite Genres</CardTitle>
              <CardDescription>Music genres you're interested in</CardDescription>
            </CardHeader>
            <CardContent>
              {userData.genres && userData.genres.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                  {userData.genres.map((genre: string) => (
                    <Badge key={genre} variant="secondary" className="px-3 py-1 text-base">
                      <Disc className="mr-1 h-4 w-4" />
                      {genre}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p>No favorite genres selected yet.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Genre Recommendations</CardTitle>
              <CardDescription>Based on your preferences, you might also like these genres</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {userData.genres && userData.genres.includes("Pop") && (
                  <div className="flex items-center gap-2 p-2 border rounded-md">
                    <Music className="h-5 w-5 text-primary" />
                    <span>Synth Pop</span>
                  </div>
                )}
                {userData.genres && userData.genres.includes("Rock") && (
                  <div className="flex items-center gap-2 p-2 border rounded-md">
                    <Music className="h-5 w-5 text-primary" />
                    <span>Alternative Rock</span>
                  </div>
                )}
                {userData.genres && userData.genres.includes("Hip-Hop") && (
                  <div className="flex items-center gap-2 p-2 border rounded-md">
                    <Music className="h-5 w-5 text-primary" />
                    <span>Trap</span>
                  </div>
                )}
                {userData.genres && userData.genres.includes("Electronic") && (
                  <div className="flex items-center gap-2 p-2 border rounded-md">
                    <Music className="h-5 w-5 text-primary" />
                    <span>House</span>
                  </div>
                )}
                {userData.genres && userData.genres.includes("Jazz") && (
                  <div className="flex items-center gap-2 p-2 border rounded-md">
                    <Music className="h-5 w-5 text-primary" />
                    <span>Neo Soul</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
