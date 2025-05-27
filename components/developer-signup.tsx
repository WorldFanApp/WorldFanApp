"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, User, Search, X } from "lucide-react"

interface DeveloperSignupProps {
  onSuccess: (userData: any) => void
  onBack?: () => void
}

export function DeveloperSignup({ onSuccess, onBack }: DeveloperSignupProps) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    genres: [] as string[],
    cities: [] as string[],
    favoriteArtists: "",
    ticketStruggles: "",
    priceRange: "$50-150",
    notifications: true,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [genreSearch, setGenreSearch] = useState("")
  const [citySearch, setCitySearch] = useState("")

  const availableGenres = [
    "Pop",
    "Rock",
    "Hip Hop",
    "R&B",
    "Country",
    "Electronic",
    "Jazz",
    "Classical",
    "Indie",
    "Alternative",
    "Folk",
    "Reggae",
    "Blues",
    "Punk",
    "Metal",
    "Funk",
    "Soul",
    "Gospel",
    "Latin",
    "World",
    "Ambient",
    "House",
    "Techno",
    "Dubstep",
  ]

  const availableCities = [
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
    "Albuquerque",
    "Tucson",
    "Fresno",
    "Sacramento",
    "Kansas City",
    "Mesa",
    "Atlanta",
    "Omaha",
    "Colorado Springs",
    "Raleigh",
    "Miami",
    "Oakland",
    "Minneapolis",
    "Tulsa",
    "Cleveland",
    "Wichita",
    "Arlington",
    "Tampa",
    "New Orleans",
    "Honolulu",
    "Anaheim",
    "Santa Ana",
    "St. Louis",
    "Riverside",
    "Corpus Christi",
    "Lexington",
    "Pittsburgh",
    "Anchorage",
    "Stockton",
    "Cincinnati",
    "St. Paul",
    "Toledo",
    "Greensboro",
    "Newark",
    "Plano",
    "Henderson",
    "Lincoln",
    "Buffalo",
    "Jersey City",
    "Chula Vista",
    "Orlando",
    "Norfolk",
    "Chandler",
    "Laredo",
    "Madison",
    "Durham",
    "Lubbock",
    "Winston-Salem",
    "Garland",
    "Glendale",
    "Hialeah",
    "Reno",
    "Baton Rouge",
    "Irvine",
    "Chesapeake",
    "Irving",
    "Scottsdale",
    "North Las Vegas",
    "Fremont",
    "Gilbert",
    "San Bernardino",
    "Boise",
    "Birmingham",
  ]

  const filteredGenres = availableGenres.filter((genre) => genre.toLowerCase().includes(genreSearch.toLowerCase()))

  const filteredCities = availableCities.filter((city) => city.toLowerCase().includes(citySearch.toLowerCase()))

  const toggleGenre = (genre: string) => {
    setFormData((prev) => ({
      ...prev,
      genres: prev.genres.includes(genre) ? prev.genres.filter((g) => g !== genre) : [...prev.genres, genre],
    }))
  }

  const toggleCity = (city: string) => {
    setFormData((prev) => ({
      ...prev,
      cities: prev.cities.includes(city) ? prev.cities.filter((c) => c !== city) : [...prev.cities, city],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/user/create-developer-account", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (result.success) {
        onSuccess(result.userData)
      } else {
        alert(`Error: ${result.error}`)
      }
    } catch (error) {
      console.error("Developer signup error:", error)
      alert("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <CardHeader>
        <div className="flex items-center gap-3">
          {onBack && (
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
          )}
          <div>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Create Developer Account
            </CardTitle>
            <CardDescription>Set up your account to test World Fan features</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="username">Username *</Label>
              <Input
                id="username"
                placeholder="musiclover123"
                value={formData.username}
                onChange={(e) => setFormData((prev) => ({ ...prev, username: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
              />
            </div>
          </div>

          {/* Genres */}
          <div>
            <Label>Music Genres *</Label>
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search genres..."
                value={genreSearch}
                onChange={(e) => setGenreSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
              {filteredGenres.map((genre) => (
                <Badge
                  key={genre}
                  variant={formData.genres.includes(genre) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleGenre(genre)}
                >
                  {genre}
                  {formData.genres.includes(genre) && <X className="w-3 h-3 ml-1" />}
                </Badge>
              ))}
            </div>
            <p className="text-sm text-gray-600 mt-2">Selected: {formData.genres.length} genres</p>
          </div>

          {/* Cities */}
          <div>
            <Label>Cities *</Label>
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search cities..."
                value={citySearch}
                onChange={(e) => setCitySearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
              {filteredCities.map((city) => (
                <Badge
                  key={city}
                  variant={formData.cities.includes(city) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleCity(city)}
                >
                  {city}
                  {formData.cities.includes(city) && <X className="w-3 h-3 ml-1" />}
                </Badge>
              ))}
            </div>
            <p className="text-sm text-gray-600 mt-2">Selected: {formData.cities.length} cities</p>
          </div>

          {/* Free Form Inputs */}
          <div>
            <Label htmlFor="artists">Favorite Artists</Label>
            <Textarea
              id="artists"
              placeholder="Taylor Swift, Radiohead, Kendrick Lamar..."
              value={formData.favoriteArtists}
              onChange={(e) => setFormData((prev) => ({ ...prev, favoriteArtists: e.target.value }))}
              className="min-h-[80px]"
            />
          </div>

          <div>
            <Label htmlFor="struggles">Ticket Buying Struggles</Label>
            <Textarea
              id="struggles"
              placeholder="Tell us about times you couldn't get tickets..."
              value={formData.ticketStruggles}
              onChange={(e) => setFormData((prev) => ({ ...prev, ticketStruggles: e.target.value }))}
              className="min-h-[80px]"
            />
          </div>

          <div>
            <Label htmlFor="price-range">Typical Ticket Budget</Label>
            <Input
              id="price-range"
              placeholder="$50-150"
              value={formData.priceRange}
              onChange={(e) => setFormData((prev) => ({ ...prev, priceRange: e.target.value }))}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="notifications"
              checked={formData.notifications}
              onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, notifications: checked as boolean }))}
            />
            <Label htmlFor="notifications" className="text-sm">
              Get notified about new features and exclusive drops
            </Label>
          </div>

          <Button
            type="submit"
            disabled={isLoading || !formData.username || formData.genres.length === 0 || formData.cities.length === 0}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Creating Account...
              </>
            ) : (
              "Create Developer Account"
            )}
          </Button>
        </form>
      </CardContent>
    </>
  )
}
