"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Check, ChevronsUpDown, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { searchArtists } from "@/lib/spotify"

interface SpotifyArtistItem {
  id: string;
  name: string;
}

interface MusicPreferencesFormProps {
  userData: {
    artists: string[]
    genres: string[]
  }
  updateUserData: (data: Partial<{ artists: string[]; genres: string[] }>) => void
}

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
  const [apiArtists, setApiArtists] = useState<SpotifyArtistItem[]>([])
  const [isLoadingArtists, setIsLoadingArtists] = useState(false)
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null)
  const [genreSearch, setGenreSearch] = useState("")
  const [artistOpen, setArtistOpen] = useState(false)
  const [genreOpen, setGenreOpen] = useState(false)

  const filteredGenres = allGenres.filter((genre) => genre.toLowerCase().includes(genreSearch.toLowerCase()))

  const handleArtistSearchChange = (searchValue: string) => {
    setArtistSearch(searchValue)

    if (debounceTimeout) {
      clearTimeout(debounceTimeout)
    }

    if (!searchValue.trim()) {
      setApiArtists([])
      setIsLoadingArtists(false)
      return
    }

    setIsLoadingArtists(true)
    const newTimeout = setTimeout(async () => {
      try {
        const results = await searchArtists(searchValue, 5) // Fetch 5 results
        setApiArtists(results)
      } catch (error) {
        console.error("Failed to search artists:", error)
        setApiArtists([]) // Clear results on error
      } finally {
        setIsLoadingArtists(false)
      }
    }, 500) // 500ms debounce

    setDebounceTimeout(newTimeout)
  }

  const addArtist = (artistName: string) => {
    if (!userData.artists.includes(artistName)) {
      updateUserData({ artists: [...userData.artists, artistName] })
    }
    setArtistOpen(false)
    // Optional: Clear search input and results after selection
    // setArtistSearch("");
    // setApiArtists([]);
  }

  const removeArtist = (artistName: string) => {
    updateUserData({ artists: userData.artists.filter((a) => a !== artistName) })
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
              <CommandInput
                placeholder="Search artists..."
                value={artistSearch}
                onValueChange={handleArtistSearchChange}
              />
              <CommandList>
                {isLoadingArtists && <CommandItem disabled>Loading...</CommandItem>}
                {!isLoadingArtists && apiArtists.length === 0 && artistSearch.trim() !== "" && (
                  <CommandEmpty>No artists found for "{artistSearch}".</CommandEmpty>
                )}
                {!isLoadingArtists && apiArtists.length === 0 && artistSearch.trim() === "" && (
                  <CommandEmpty>Type to search for artists.</CommandEmpty>
                )}
                {!isLoadingArtists && apiArtists.map((artist) => (
                  <CommandItem
                    key={artist.id}
                    value={artist.name}
                    onSelect={() => addArtist(artist.name)}
                  >
                    <Check
                      className={cn("mr-2 h-4 w-4", userData.artists.includes(artist.name) ? "opacity-100" : "opacity-0")}
                    />
                    {artist.name}
                  </CommandItem>
                ))}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        <div className="flex flex-wrap gap-2 mt-3">
          {userData.artists.map((artistName) => (
            <Badge key={artistName} variant="secondary" className="px-3 py-1">
              {artistName}
              <Button variant="ghost" size="sm" className="h-4 w-4 p-0 ml-2" onClick={() => removeArtist(artistName)}>
                <X className="h-3 w-3" />
                <span className="sr-only">Remove {artistName}</span>
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
