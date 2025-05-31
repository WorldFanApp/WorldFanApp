"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Music, Disc, Pencil } from "lucide-react" // Added Pencil
import { Button } from "@/components/ui/button" // Added Button
import Image from "next/image" // Added Image
import { useRouter } from "next/navigation" // Added useRouter for navigation

// Define the SpotifyArtist interface
interface SpotifyArtist {
  id: string;
  name: string;
  images?: { url: string; height?: number; width?: number }[];
}

interface UserData {
  artists: SpotifyArtist[];
  genres: string[];
  // Include other fields from userData if they are accessed directly on this page
  // For now, only artists and genres are directly used by the FavoritesPage content
}

export default function FavoritesPage() {
  const [userData, setUserData] = useState<UserData | null>(null) // Typed state
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter(); // For navigation

  useEffect(() => {
    const storedData = localStorage.getItem("userData")
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData) as UserData; // Cast to UserData
        setUserData(parsedData);
      } catch (error) {
        console.error("Error parsing userData from localStorage:", error);
        setUserData(null); // Set to null if parsing fails
        localStorage.removeItem("userData"); // Remove corrupted data
      }
    } else {
      setUserData(null); // No data found
    }
    setIsLoading(false)
  }, [])

  const handleEditArtists = () => {
    // Navigate to the music preferences step in signup, or a dedicated edit page
    console.log("Edit Artists clicked");
    router.push("/signup?step=music-preferences"); // Example: redirect to relevant step
  };

  const handleEditGenres = () => {
    console.log("Edit Genres clicked");
    router.push("/signup?step=music-preferences"); // Example: redirect to relevant step
  };

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
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Favorite Artists</CardTitle>
                <CardDescription>Artists you've selected as favorites</CardDescription>
              </div>
              <Button variant="ghost" size="icon" onClick={handleEditArtists}>
                <Pencil className="h-5 w-5" />
                <span className="sr-only">Edit Artists</span>
              </Button>
            </CardHeader>
            <CardContent>
              {/*
              {userData.artists && userData.artists.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {userData.artists.map((artist: SpotifyArtist) => {
                    const imageUrl = artist.images?.length
                      ? artist.images[artist.images.length - 1].url // Smallest image
                      : `/placeholder.svg?height=300&width=300&query=${encodeURIComponent(artist.name)}`;
                    return (
                      <Card key={artist.id} className="overflow-hidden group relative">
                        <div className="aspect-square w-full relative">
                          <Image
                            src={imageUrl}
                            alt={artist.name}
                            fill
                            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                            className="object-cover transition-transform group-hover:scale-105"
                          />
                           <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <h3 className="text-lg font-semibold text-white truncate">{artist.name}</h3>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <p>No favorite artists selected yet. <Button variant="link" onClick={handleEditArtists} className="p-0 h-auto">Add some?</Button></p>
              )}
              */}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="genres" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Favorite Genres</CardTitle>
                <CardDescription>Music genres you're interested in</CardDescription>
              </div>
              <Button variant="ghost" size="icon" onClick={handleEditGenres}>
                <Pencil className="h-5 w-5" />
                <span className="sr-only">Edit Genres</span>
              </Button>
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
                <p>No favorite genres selected yet. <Button variant="link" onClick={handleEditGenres} className="p-0 h-auto">Add some?</Button></p>
              )}
            </CardContent>
          </Card>

          {/* Recommendation card can be kept or removed based on product decision */}
          {userData.genres && userData.genres.length > 0 && (
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
