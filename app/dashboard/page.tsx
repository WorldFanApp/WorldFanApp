"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Music,
  MapPin,
  User,
  Settings,
  Bell,
  Heart,
  Ticket,
  DiscAlbumIcon as Vinyl,
  Globe,
  Search,
  Plus,
  X,
  Save,
} from "lucide-react"
import Image from "next/image"

export default function DashboardPage() {
  const [user, setUser] = useState({
    username: "musiclover123",
    email: "user@example.com",
    worldIdVerified: true,
    verificationLevel: "orb",
    joinDate: "2024-01-15",
  })

  const [preferences, setPreferences] = useState({
    genres: ["Pop", "Rock", "Hip Hop", "Electronic"],
    cities: ["New York", "Los Angeles", "Chicago"],
    notifications: true,
    priceRange: "$50-150",
  })

  const [availableGenres] = useState([
    "Pop",
    "Rock",
    "Hip Hop",
    "R&B",
    "Country",
    "Electronic",
    "Jazz",
    "Classical",
    "Folk",
    "Reggae",
    "Blues",
    "Punk",
    "Metal",
    "Alternative",
    "Indie",
    "Funk",
    "Soul",
    "Gospel",
    "Latin",
    "World",
    "Ambient",
    "House",
    "Techno",
    "Dubstep",
    "Trap",
    "Drill",
    "Afrobeats",
    "K-Pop",
    "J-Pop",
    "Reggaeton",
  ])

  const [availableCities] = useState([
    "New York",
    "Los Angeles",
    "Chicago",
    "Houston",
    "Phoenix",
    "Philadelphia",
    "San Antonio",
    "San Diego",
    "Dallas",
    "San Jose",
    "Austin",
    "Jacksonville",
    "Fort Worth",
    "Columbus",
    "Charlotte",
    "San Francisco",
    "Indianapolis",
    "Seattle",
    "Denver",
    "Washington DC",
    "Boston",
    "Nashville",
    "Detroit",
    "Portland",
    "Las Vegas",
    "Memphis",
    "Louisville",
    "Baltimore",
    "Milwaukee",
    "Atlanta",
    "Miami",
    "Oakland",
    "Minneapolis",
  ])

  const [genreSearch, setGenreSearch] = useState("")
  const [citySearch, setCitySearch] = useState("")

  const filteredGenres = availableGenres.filter(
    (genre) => genre.toLowerCase().includes(genreSearch.toLowerCase()) && !preferences.genres.includes(genre),
  )

  const filteredCities = availableCities.filter(
    (city) => city.toLowerCase().includes(citySearch.toLowerCase()) && !preferences.cities.includes(city),
  )

  const addGenre = (genre: string) => {
    setPreferences((prev) => ({
      ...prev,
      genres: [...prev.genres, genre],
    }))
    setGenreSearch("")
  }

  const removeGenre = (genre: string) => {
    setPreferences((prev) => ({
      ...prev,
      genres: prev.genres.filter((g) => g !== genre),
    }))
  }

  const addCity = (city: string) => {
    setPreferences((prev) => ({
      ...prev,
      cities: [...prev.cities, city],
    }))
    setCitySearch("")
  }

  const removeCity = (city: string) => {
    setPreferences((prev) => ({
      ...prev,
      cities: prev.cities.filter((c) => c !== city),
    }))
  }

  const savePreferences = () => {
    // Here you would save to your backend
    console.log("Saving preferences:", preferences)
    alert("Preferences saved successfully!")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Image
              src="/images/world-fan-logo-hq.png"
              alt="World Fan Logo"
              width={40}
              height={40}
              className="object-contain"
            />
            <div>
              <h1 className="text-2xl font-bold text-black">World Fan Dashboard</h1>
              <p className="text-gray-600">Manage your music preferences</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1 bg-green-100 rounded-full">
              <Globe className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-800">WorldID Verified</span>
            </div>
          </div>
        </header>

        {/* User Info Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Welcome back, {user.username}!
            </CardTitle>
            <CardDescription>Your World Fan account is verified and ready</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <Globe className="w-8 h-8 text-green-600" />
                <div>
                  <p className="font-semibold text-green-900">WorldID Verified</p>
                  <p className="text-sm text-green-700">Level: {user.verificationLevel}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <Music className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="font-semibold text-blue-900">{preferences.genres.length} Genres</p>
                  <p className="text-sm text-blue-700">Music preferences set</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                <MapPin className="w-8 h-8 text-purple-600" />
                <div>
                  <p className="font-semibold text-purple-900">{preferences.cities.length} Cities</p>
                  <p className="text-sm text-purple-700">Event locations tracked</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs defaultValue="genres" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="genres" className="flex items-center gap-2">
              <Music className="w-4 h-4" />
              Genres
            </TabsTrigger>
            <TabsTrigger value="cities" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Cities
            </TabsTrigger>
            <TabsTrigger value="alerts" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Alerts
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Genres Tab */}
          <TabsContent value="genres">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Music className="w-5 h-5" />
                  Music Genres
                </CardTitle>
                <CardDescription>Select the music genres you love to get personalized recommendations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Selected Genres */}
                <div>
                  <Label className="text-base font-semibold">Your Favorite Genres ({preferences.genres.length})</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {preferences.genres.map((genre) => (
                      <Badge key={genre} variant="default" className="flex items-center gap-1 px-3 py-1">
                        {genre}
                        <X className="w-3 h-3 cursor-pointer hover:text-red-500" onClick={() => removeGenre(genre)} />
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Add Genres */}
                <div>
                  <Label htmlFor="genre-search">Add More Genres</Label>
                  <div className="relative mt-2">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="genre-search"
                      placeholder="Search for genres..."
                      value={genreSearch}
                      onChange={(e) => setGenreSearch(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mt-3 max-h-40 overflow-y-auto">
                    {filteredGenres.slice(0, 20).map((genre) => (
                      <Button
                        key={genre}
                        variant="outline"
                        size="sm"
                        onClick={() => addGenre(genre)}
                        className="justify-start text-left"
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        {genre}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Cities Tab */}
          <TabsContent value="cities">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Cities & Locations
                </CardTitle>
                <CardDescription>Choose cities where you'd like to attend concerts and events</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Selected Cities */}
                <div>
                  <Label className="text-base font-semibold">Your Cities ({preferences.cities.length})</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {preferences.cities.map((city) => (
                      <Badge key={city} variant="default" className="flex items-center gap-1 px-3 py-1">
                        {city}
                        <X className="w-3 h-3 cursor-pointer hover:text-red-500" onClick={() => removeCity(city)} />
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Add Cities */}
                <div>
                  <Label htmlFor="city-search">Add More Cities</Label>
                  <div className="relative mt-2">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="city-search"
                      placeholder="Search for cities..."
                      value={citySearch}
                      onChange={(e) => setCitySearch(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mt-3 max-h-40 overflow-y-auto">
                    {filteredCities.slice(0, 20).map((city) => (
                      <Button
                        key={city}
                        variant="outline"
                        size="sm"
                        onClick={() => addCity(city)}
                        className="justify-start text-left"
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        {city}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Alerts Tab */}
          <TabsContent value="alerts">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Ticket className="w-5 h-5" />
                    Ticket Alerts
                  </CardTitle>
                  <CardDescription>Get notified when tickets go on sale for your favorite artists</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Ticket className="w-5 h-5 text-purple-600" />
                        <div>
                          <p className="font-medium">Fair Price Tickets</p>
                          <p className="text-sm text-gray-600">Get alerts for verified fair-price ticket releases</p>
                        </div>
                      </div>
                      <Badge variant="secondary">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Heart className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="font-medium">Favorite Artists</p>
                          <p className="text-sm text-gray-600">Notifications for artists you follow</p>
                        </div>
                      </div>
                      <Badge variant="secondary">Active</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Vinyl className="w-5 h-5" />
                    Vinyl Drops
                  </CardTitle>
                  <CardDescription>Be first to know about limited edition vinyl releases</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Vinyl className="w-5 h-5 text-green-600" />
                        <div>
                          <p className="font-medium">Limited Editions</p>
                          <p className="text-sm text-gray-600">Exclusive vinyl drops from your favorite genres</p>
                        </div>
                      </div>
                      <Badge variant="secondary">Active</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Account Settings
                </CardTitle>
                <CardDescription>Manage your World Fan account preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4">
                  <div>
                    <Label htmlFor="username">Username</Label>
                    <Input id="username" value={user.username} readOnly className="bg-gray-50" />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" value={user.email} readOnly className="bg-gray-50" />
                  </div>
                  <div>
                    <Label htmlFor="price-range">Preferred Ticket Price Range</Label>
                    <Input
                      id="price-range"
                      value={preferences.priceRange}
                      onChange={(e) => setPreferences((prev) => ({ ...prev, priceRange: e.target.value }))}
                      placeholder="e.g., $50-150"
                    />
                  </div>
                </div>

                <div className="border-t pt-6">
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="font-medium">WorldID Verification</p>
                        <p className="text-sm text-gray-600">
                          Verified with {user.verificationLevel} level verification
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Verified
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Save Button */}
        <div className="flex justify-center mt-8">
          <Button onClick={savePreferences} size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600">
            <Save className="w-4 h-4 mr-2" />
            Save Preferences
          </Button>
        </div>
      </div>
    </div>
  )
}
