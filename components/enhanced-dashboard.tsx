"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Music,
  MapPin,
  User,
  Settings,
  Ticket,
  DiscAlbumIcon as Vinyl,
  Search,
  Plus,
  X,
  Save,
  LogOut,
  Share2,
  Copy,
  Gift,
  TrendingUp,
  Users,
  CheckCircle,
} from "lucide-react"
import Image from "next/image"

interface EnhancedDashboardProps {
  userData: any
  onSignOut: () => void
}

export function EnhancedDashboard({ userData, onSignOut }: EnhancedDashboardProps) {
  const [preferences, setPreferences] = useState({
    genres: userData.genres || [],
    cities: userData.cities || [],
    favoriteArtists: userData.favoriteArtists || "",
    ticketStruggles: userData.ticketStruggles || "",
    priceRange: userData.priceRange || "$50-150",
    notifications: userData.notifications || true,
  })

  const [referralData, setReferralData] = useState({
    referralCode: `WORLDFAN${userData.worldId?.slice(-6).toUpperCase()}`,
    referralsCount: Math.floor(Math.random() * 5),
    tokensEarned: Math.floor(Math.random() * 500),
    pendingTokens: Math.floor(Math.random() * 100),
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
  const [copied, setCopied] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  // Mock ticket data based on user preferences
  const [tickets] = useState([
    {
      id: 1,
      artist: "Taylor Swift",
      venue: "Madison Square Garden",
      date: "2024-03-15",
      price: "$125",
      status: "available",
      genre: "Pop",
      city: "New York",
    },
    {
      id: 2,
      artist: "The Weeknd",
      venue: "Staples Center",
      date: "2024-03-22",
      price: "$89",
      status: "limited",
      genre: "R&B",
      city: "Los Angeles",
    },
    {
      id: 3,
      artist: "Billie Eilish",
      venue: "United Center",
      date: "2024-04-05",
      price: "$95",
      status: "waitlist",
      genre: "Alternative",
      city: "Chicago",
    },
    {
      id: 4,
      artist: "Drake",
      venue: "American Airlines Center",
      date: "2024-04-12",
      price: "$110",
      status: "available",
      genre: "Hip Hop",
      city: "Dallas",
    },
    {
      id: 5,
      artist: "Adele",
      venue: "Chase Center",
      date: "2024-04-20",
      price: "$150",
      status: "limited",
      genre: "Pop",
      city: "San Francisco",
    },
  ])

  // Mock vinyl data based on user preferences
  const [vinyl] = useState([
    {
      id: 1,
      artist: "Arctic Monkeys",
      album: "AM",
      price: "$35",
      status: "in_stock",
      limited: true,
      genre: "Rock",
    },
    {
      id: 2,
      artist: "Frank Ocean",
      album: "Blonde",
      price: "$45",
      status: "pre_order",
      limited: true,
      genre: "R&B",
    },
    {
      id: 3,
      artist: "Kendrick Lamar",
      album: "DAMN.",
      price: "$28",
      status: "sold_out",
      limited: false,
      genre: "Hip Hop",
    },
    {
      id: 4,
      artist: "Lana Del Rey",
      album: "Norman Fucking Rockwell!",
      price: "$40",
      status: "in_stock",
      limited: true,
      genre: "Alternative",
    },
    {
      id: 5,
      artist: "Tyler, The Creator",
      album: "IGOR",
      price: "$32",
      status: "pre_order",
      limited: false,
      genre: "Hip Hop",
    },
  ])

  const filteredGenres = availableGenres.filter(
    (genre) => genre.toLowerCase().includes(genreSearch.toLowerCase()) && !preferences.genres.includes(genre),
  )

  const filteredCities = availableCities.filter(
    (city) => city.toLowerCase().includes(citySearch.toLowerCase()) && !preferences.cities.includes(city),
  )

  // Filter tickets and vinyl based on user preferences
  const relevantTickets = tickets.filter(
    (ticket) => preferences.genres.includes(ticket.genre) || preferences.cities.includes(ticket.city),
  )

  const relevantVinyl = vinyl.filter((record) => preferences.genres.includes(record.genre))

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

  const addCustomCity = () => {
    if (citySearch && !preferences.cities.includes(citySearch)) {
      addCity(citySearch)
    }
  }

  const savePreferences = async () => {
    setSaving(true)
    try {
      const response = await fetch("/api/user/save-preferences", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userData.worldId,
          preferences,
        }),
      })

      if (response.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      }
    } catch (error) {
      console.error("Error saving preferences:", error)
    } finally {
      setSaving(false)
    }
  }

  const copyReferralCode = () => {
    navigator.clipboard.writeText(referralData.referralCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareReferralCode = () => {
    if (navigator.share) {
      navigator.share({
        title: "Join World Fan",
        text: `Join me on World Fan for fair-priced tickets and exclusive vinyl! Use my referral code: ${referralData.referralCode}`,
        url: `https://worldfan.vercel.app?ref=${referralData.referralCode}`,
      })
    } else {
      copyReferralCode()
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800"
      case "limited":
        return "bg-yellow-100 text-yellow-800"
      case "waitlist":
        return "bg-blue-100 text-blue-800"
      case "in_stock":
        return "bg-green-100 text-green-800"
      case "pre_order":
        return "bg-blue-100 text-blue-800"
      case "sold_out":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
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
              <p className="text-gray-600">Welcome back, {userData.username}!</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 rounded-full">
              <User className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">
                {userData.worldIdData?.test_mode ? "Developer Mode" : "Production"}
              </span>
            </div>
            <Button onClick={onSignOut} variant="outline" size="sm">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <Music className="w-8 h-8 text-blue-600" />
              <div>
                <p className="font-semibold text-blue-900">{preferences.genres.length}</p>
                <p className="text-sm text-blue-700">Genres</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <MapPin className="w-8 h-8 text-purple-600" />
              <div>
                <p className="font-semibold text-purple-900">{preferences.cities.length}</p>
                <p className="text-sm text-purple-700">Cities</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <Users className="w-8 h-8 text-green-600" />
              <div>
                <p className="font-semibold text-green-900">{referralData.referralsCount}</p>
                <p className="text-sm text-green-700">Referrals</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <Gift className="w-8 h-8 text-orange-600" />
              <div>
                <p className="font-semibold text-orange-900">{referralData.tokensEarned}</p>
                <p className="text-sm text-orange-700">Tokens</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="preferences" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="preferences" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Preferences
            </TabsTrigger>
            <TabsTrigger value="tickets" className="flex items-center gap-2">
              <Ticket className="w-4 h-4" />
              Tickets ({relevantTickets.length})
            </TabsTrigger>
            <TabsTrigger value="vinyl" className="flex items-center gap-2">
              <Vinyl className="w-4 h-4" />
              Vinyl ({relevantVinyl.length})
            </TabsTrigger>
            <TabsTrigger value="referrals" className="flex items-center gap-2">
              <Share2 className="w-4 h-4" />
              Referrals
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Profile
            </TabsTrigger>
          </TabsList>

          {/* Preferences Tab */}
          <TabsContent value="preferences">
            <div className="grid gap-6">
              {/* Genres */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Music className="w-5 h-5" />
                    Music Genres ({preferences.genres.length})
                  </CardTitle>
                  <CardDescription>
                    Manage your favorite music genres to get personalized recommendations
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {preferences.genres.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {preferences.genres.map((genre) => (
                        <Badge key={genre} variant="default" className="flex items-center gap-1">
                          {genre}
                          <X className="w-3 h-3 cursor-pointer hover:text-red-500" onClick={() => removeGenre(genre)} />
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search genres..."
                      value={genreSearch}
                      onChange={(e) => setGenreSearch(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-h-32 overflow-y-auto">
                    {filteredGenres.slice(0, 16).map((genre) => (
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
                </CardContent>
              </Card>

              {/* Cities */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Cities ({preferences.cities.length})
                  </CardTitle>
                  <CardDescription>
                    Select cities where you'd like to attend events and receive notifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {preferences.cities.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {preferences.cities.map((city) => (
                        <Badge key={city} variant="default" className="flex items-center gap-1">
                          {city}
                          <X className="w-3 h-3 cursor-pointer hover:text-red-500" onClick={() => removeCity(city)} />
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search cities..."
                      value={citySearch}
                      onChange={(e) => setCitySearch(e.target.value)}
                      className="pl-10"
                      onKeyPress={(e) => e.key === "Enter" && addCustomCity()}
                    />
                    {citySearch && !availableCities.includes(citySearch) && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={addCustomCity}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2"
                      >
                        Add "{citySearch}"
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-h-32 overflow-y-auto">
                    {filteredCities.slice(0, 16).map((city) => (
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
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tickets Tab */}
          <TabsContent value="tickets">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Ticket className="w-5 h-5" />
                  Available Tickets
                </CardTitle>
                <CardDescription>
                  Fair-priced tickets based on your preferences • {relevantTickets.length} matches found
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {relevantTickets.length > 0 ? (
                    relevantTickets.map((ticket) => (
                      <div
                        key={ticket.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                            <Music className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{ticket.artist}</h3>
                            <p className="text-sm text-gray-600">
                              {ticket.venue} • {ticket.city}
                            </p>
                            <p className="text-sm text-gray-500">{ticket.date}</p>
                            <Badge variant="outline" className="text-xs mt-1">
                              {ticket.genre}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className={getStatusColor(ticket.status)}>{ticket.status.replace("_", " ")}</Badge>
                          <span className="font-semibold text-lg">{ticket.price}</span>
                          <Button size="sm">
                            {ticket.status === "available"
                              ? "Buy Now"
                              : ticket.status === "limited"
                                ? "Quick Buy"
                                : "Join Waitlist"}
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Ticket className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="font-semibold text-gray-900 mb-2">No tickets match your preferences</h3>
                      <p className="text-gray-600 mb-4">
                        Add more genres and cities to your preferences to see more ticket options
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => document.querySelector('[value="preferences"]')?.click()}
                      >
                        Update Preferences
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Vinyl Tab */}
          <TabsContent value="vinyl">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Vinyl className="w-5 h-5" />
                  Vinyl Collection
                </CardTitle>
                <CardDescription>
                  Limited edition vinyl releases from your favorite genres • {relevantVinyl.length} matches found
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {relevantVinyl.length > 0 ? (
                    relevantVinyl.map((record) => (
                      <div
                        key={record.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-orange-600 to-red-600 rounded-lg flex items-center justify-center">
                            <Vinyl className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{record.artist}</h3>
                            <p className="text-sm text-gray-600">{record.album}</p>
                            <div className="flex items-center gap-2 mt-1">
                              {record.limited && (
                                <Badge variant="secondary" className="text-xs">
                                  Limited Edition
                                </Badge>
                              )}
                              <Badge variant="outline" className="text-xs">
                                {record.genre}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className={getStatusColor(record.status)}>{record.status.replace("_", " ")}</Badge>
                          <span className="font-semibold text-lg">{record.price}</span>
                          <Button size="sm" disabled={record.status === "sold_out"}>
                            {record.status === "in_stock"
                              ? "Add to Cart"
                              : record.status === "pre_order"
                                ? "Pre-Order"
                                : "Sold Out"}
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Vinyl className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="font-semibold text-gray-900 mb-2">No vinyl matches your preferences</h3>
                      <p className="text-gray-600 mb-4">
                        Add more genres to your preferences to see more vinyl options
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => document.querySelector('[value="preferences"]')?.click()}
                      >
                        Update Preferences
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Referrals Tab */}
          <TabsContent value="referrals">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Share2 className="w-5 h-5" />
                    Referral Program
                  </CardTitle>
                  <CardDescription>Earn tokens by referring friends to World Fan</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-green-900">{referralData.referralsCount}</p>
                      <p className="text-sm text-green-700">Total Referrals</p>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <Gift className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-blue-900">{referralData.tokensEarned}</p>
                      <p className="text-sm text-blue-700">Tokens Earned</p>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <TrendingUp className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-orange-900">{referralData.pendingTokens}</p>
                      <p className="text-sm text-orange-700">Pending Tokens</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label>Your Referral Code</Label>
                      <div className="flex gap-2">
                        <Input value={referralData.referralCode} readOnly className="font-mono" />
                        <Button onClick={copyReferralCode} variant="outline">
                          {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>

                    <div className="p-4 bg-purple-50 rounded-lg">
                      <h4 className="font-semibold text-purple-900 mb-2">How it works:</h4>
                      <ul className="text-sm text-purple-800 space-y-1">
                        <li>• Share your referral code with friends</li>
                        <li>• Earn 100 tokens for each successful referral</li>
                        <li>• Your friends get 50 bonus tokens when they sign up</li>
                        <li>• Use tokens for exclusive ticket access and discounts</li>
                      </ul>
                    </div>

                    <Button onClick={shareReferralCode} className="w-full bg-gradient-to-r from-purple-600 to-blue-600">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share Referral Code
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Profile Settings
                </CardTitle>
                <CardDescription>Manage your account information and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4">
                  <div>
                    <Label htmlFor="username">Username</Label>
                    <Input id="username" value={userData.username} readOnly className="bg-gray-50" />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" value={userData.email} readOnly className="bg-gray-50" />
                  </div>
                  <div>
                    <Label htmlFor="favorite-artists">Favorite Artists</Label>
                    <Textarea
                      id="favorite-artists"
                      value={preferences.favoriteArtists}
                      onChange={(e) => setPreferences((prev) => ({ ...prev, favoriteArtists: e.target.value }))}
                      rows={3}
                      placeholder="Tell us about your favorite artists..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="ticket-struggles">Ticket Buying Struggles</Label>
                    <Textarea
                      id="ticket-struggles"
                      value={preferences.ticketStruggles}
                      onChange={(e) => setPreferences((prev) => ({ ...prev, ticketStruggles: e.target.value }))}
                      rows={3}
                      placeholder="What challenges do you face when buying concert tickets?"
                    />
                  </div>
                  <div>
                    <Label htmlFor="price-range">Preferred Price Range</Label>
                    <Input
                      id="price-range"
                      value={preferences.priceRange}
                      onChange={(e) => setPreferences((prev) => ({ ...prev, priceRange: e.target.value }))}
                      placeholder="e.g., $50-150"
                    />
                  </div>
                </div>

                <div className="border-t pt-6">
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-medium">
                          {userData.worldIdData?.test_mode ? "Developer Mode Account" : "Production Account"}
                        </p>
                        <p className="text-sm text-gray-600">Account ID: {userData.worldId}</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      Active
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Save Button */}
        <div className="flex justify-center mt-8">
          <Button
            onClick={savePreferences}
            disabled={saving}
            size="lg"
            className={`bg-gradient-to-r from-purple-600 to-blue-600 ${saved ? "from-green-600 to-green-700" : ""}`}
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Saving...
              </>
            ) : saved ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Saved Successfully!
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save All Changes
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
