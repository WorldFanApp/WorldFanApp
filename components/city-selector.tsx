"use client"

import { useState } from "react"
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Search, X } from "lucide-react"

interface CitySelectorProps {
  selectedCities: string[]
  onCitiesChange: (cities: string[]) => void
}

const popularCities = [
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
]

export function CitySelector({ selectedCities, onCitiesChange }: CitySelectorProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredCities = popularCities.filter(
    (city) => city.toLowerCase().includes(searchTerm.toLowerCase()) && !selectedCities.includes(city),
  )

  const addCity = (city: string) => {
    if (!selectedCities.includes(city)) {
      onCitiesChange([...selectedCities, city])
    }
  }

  const removeCity = (city: string) => {
    onCitiesChange(selectedCities.filter((c) => c !== city))
  }

  const addCustomCity = () => {
    if (searchTerm && !selectedCities.includes(searchTerm)) {
      onCitiesChange([...selectedCities, searchTerm])
      setSearchTerm("")
    }
  }

  return (
    <>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Your Cities
        </CardTitle>
        <CardDescription>Select cities where you'd like to attend concerts and events</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search for a city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
            onKeyPress={(e) => e.key === "Enter" && addCustomCity()}
          />
          {searchTerm && !popularCities.includes(searchTerm) && (
            <Button
              size="sm"
              variant="outline"
              onClick={addCustomCity}
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
            >
              Add "{searchTerm}"
            </Button>
          )}
        </div>

        {/* Selected Cities */}
        {selectedCities.length > 0 && (
          <div>
            <h4 className="font-medium mb-2">Selected Cities ({selectedCities.length})</h4>
            <div className="flex flex-wrap gap-2">
              {selectedCities.map((city) => (
                <Badge key={city} variant="default" className="flex items-center gap-1">
                  {city}
                  <X className="w-3 h-3 cursor-pointer hover:text-red-500" onClick={() => removeCity(city)} />
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Popular Cities */}
        <div>
          <h4 className="font-medium mb-2">Popular Cities</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-60 overflow-y-auto">
            {filteredCities.slice(0, 30).map((city) => (
              <Button
                key={city}
                variant="outline"
                size="sm"
                onClick={() => addCity(city)}
                className="justify-start text-left"
              >
                {city}
              </Button>
            ))}
          </div>
        </div>

        {selectedCities.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-4">Select at least one city to continue</p>
        )}
      </CardContent>
    </>
  )
}
