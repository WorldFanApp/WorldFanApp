"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Check, ChevronsUpDown, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface MusicPreferencesFormProps {
  userData: {
    artists: string[]
    genres: string[]
  }
  updateUserData: (data: Partial<{ artists: string[]; genres: string[] }>) => void
}

// Sample data - in a real app, this would come from Spotify API
const allArtists = [
  "Taylor Swift",
  "The Weeknd",
  "Drake",
  "Billie Eilish",
  "Bad Bunny",
  "Dua Lipa",
  "BTS",
  "Ariana Grande",
  "Post Malone",
  "Justin Bieber",
  "Beyoncé",
  "Ed Sheeran",
  "Kendrick Lamar",
  "Harry Styles",
  "Travis Scott",
]

const allGenres = [
  "Pop",
  "Hip-Hop",
  "R&B",
  "Rock",
  "Electronic",
  "Country",
  "Jazz",
  "Classical",
  "Reggae",
  "Folk",
  "Metal",
  "Blues",
  "Indie",
  "K-Pop",
  "Latin",
]

export function MusicPreferencesForm({ userData, updateUserData }: MusicPreferencesFormProps) {
  const [artistSearch, setArtistSearch] = useState("")
  const [genreSearch, setGenreSearch] = useState("")
  const [artistOpen, setArtistOpen] = useState(false)
  const [genreOpen, setGenreOpen] = useState(false)

  const filteredArtists = allArtists.filter((artist) => artist.toLowerCase().includes(artistSearch.toLowerCase()))

  const filteredGenres = allGenres.filter((genre) => genre.toLowerCase().includes(genreSearch.toLowerCase()))

  const addArtist = (artist: string) => {
    if (!userData.artists.includes(artist)) {
      updateUserData({ artists: [...userData.artists, artist] })
    }
    setArtistOpen(false)
  }

  const removeArtist = (artist: string) => {
    updateUserData({ artists: userData.artists.filter((a) => a !== artist) })
  }

  const addGenre = (genre: string) => {
    if (!userData.genres.includes(genre)) {
      updateUserData({ genres: [...userData.genres, genre] })
    }
    setGenreOpen(false)
  }

  const removeGenre = (genre: string) => {
    updateUserData({ genres: userData.genres.filter((g) => g !== genre) })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Favorite Artists (select at least one)</Label>
        <Popover open={artistOpen} onOpenChange={setArtistOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" role="combobox" aria-expanded={artistOpen} className="w-full justify-between">
              {artistSearch || "Search for artists..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder="Search artists..." value={artistSearch} onValueChange={setArtistSearch} />
              <CommandList>
                <CommandEmpty>No artists found.</CommandEmpty>
                <CommandGroup>
                  {filteredArtists.map((artist) => (
                    <CommandItem key={artist} value={artist} onSelect={() => addArtist(artist)}>
                      <Check
                        className={cn("mr-2 h-4 w-4", userData.artists.includes(artist) ? "opacity-100" : "opacity-0")}
                      />
                      {artist}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        <div className="flex flex-wrap gap-2 mt-3">
          {userData.artists.map((artist) => (
            <Badge key={artist} variant="secondary" className="px-3 py-1">
              {artist}
              <Button variant="ghost" size="sm" className="h-4 w-4 p-0 ml-2" onClick={() => removeArtist(artist)}>
                <X className="h-3 w-3" />
                <span className="sr-only">Remove {artist}</span>
              </Button>
            </Badge>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Music Genres (select at least one)</Label>
        <Popover open={genreOpen} onOpenChange={setGenreOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" role="combobox" aria-expanded={genreOpen} className="w-full justify-between">
              {genreSearch || "Select genres..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder="Search genres..." value={genreSearch} onValueChange={setGenreSearch} />
              <CommandList>
                <CommandEmpty>No genres found.</CommandEmpty>
                <CommandGroup>
                  {filteredGenres.map((genre) => (
                    <CommandItem key={genre} value={genre} onSelect={() => addGenre(genre)}>
                      <Check
                        className={cn("mr-2 h-4 w-4", userData.genres.includes(genre) ? "opacity-100" : "opacity-0")}
                      />
                      {genre}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        <div className="flex flex-wrap gap-2 mt-3">
          {userData.genres.map((genre) => (
            <Badge key={genre} variant="secondary" className="px-3 py-1">
              {genre}
              <Button variant="ghost" size="sm" className="h-4 w-4 p-0 ml-2" onClick={() => removeGenre(genre)}>
                <X className="h-3 w-3" />
                <span className="sr-only">Remove {genre}</span>
              </Button>
            </Badge>
          ))}
        </div>
      </div>
    </div>
  )
}
