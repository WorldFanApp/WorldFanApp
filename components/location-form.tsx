"use client"

import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface LocationFormProps {
  userData: {
    country: string
    city: string
  }
  updateUserData: (data: Partial<{ country: string; city: string }>) => void
}

// Sample data - in a real app, this would come from an API
const countries = [
  { id: "us", name: "United States" },
  { id: "ca", name: "Canada" },
  { id: "uk", name: "United Kingdom" },
  { id: "au", name: "Australia" },
  { id: "jp", name: "Japan" },
  { id: "de", name: "Germany" },
  { id: "fr", name: "France" },
  { id: "br", name: "Brazil" },
]

const citiesByCountry: Record<string, Array<{ id: string; name: string }>> = {
  us: [
    { id: "nyc", name: "New York" },
    { id: "la", name: "Los Angeles" },
    { id: "chi", name: "Chicago" },
    { id: "hou", name: "Houston" },
    { id: "mia", name: "Miami" },
  ],
  ca: [
    { id: "tor", name: "Toronto" },
    { id: "van", name: "Vancouver" },
    { id: "mon", name: "Montreal" },
    { id: "cal", name: "Calgary" },
    { id: "ott", name: "Ottawa" },
  ],
  uk: [
    { id: "lon", name: "London" },
    { id: "man", name: "Manchester" },
    { id: "bir", name: "Birmingham" },
    { id: "gla", name: "Glasgow" },
    { id: "liv", name: "Liverpool" },
  ],
  // Add more cities for other countries as needed
  au: [
    { id: "syd", name: "Sydney" },
    { id: "mel", name: "Melbourne" },
    { id: "bri", name: "Brisbane" },
  ],
  jp: [
    { id: "tok", name: "Tokyo" },
    { id: "osa", name: "Osaka" },
    { id: "kyo", name: "Kyoto" },
  ],
  de: [
    { id: "ber", name: "Berlin" },
    { id: "mun", name: "Munich" },
    { id: "ham", name: "Hamburg" },
  ],
  fr: [
    { id: "par", name: "Paris" },
    { id: "mar", name: "Marseille" },
    { id: "lyo", name: "Lyon" },
  ],
  br: [
    { id: "rio", name: "Rio de Janeiro" },
    { id: "sao", name: "São Paulo" },
    { id: "bra", name: "Brasília" },
  ],
}

export function LocationForm({ userData, updateUserData }: LocationFormProps) {
  const [availableCities, setAvailableCities] = useState<Array<{ id: string; name: string }>>([])

  useEffect(() => {
    if (userData.country) {
      setAvailableCities(citiesByCountry[userData.country] || [])

      // Reset city if country changes
      if (!citiesByCountry[userData.country]?.some((city) => city.id === userData.city)) {
        updateUserData({ city: "" })
      }
    } else {
      setAvailableCities([])
    }
  }, [userData.country])

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="country">Country</Label>
        <Select value={userData.country} onValueChange={(value) => updateUserData({ country: value })}>
          <SelectTrigger id="country">
            <SelectValue placeholder="Select your country" />
          </SelectTrigger>
          <SelectContent>
            {countries.map((country) => (
              <SelectItem key={country.id} value={country.id}>
                {country.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="city">City</Label>
        <Select
          value={userData.city}
          onValueChange={(value) => updateUserData({ city: value })}
          disabled={!userData.country}
        >
          <SelectTrigger id="city">
            <SelectValue placeholder={userData.country ? "Select your city" : "Select a country first"} />
          </SelectTrigger>
          <SelectContent>
            {availableCities.map((city) => (
              <SelectItem key={city.id} value={city.id}>
                {city.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
