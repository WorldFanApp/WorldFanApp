"use client"

import { useState, useEffect, useCallback } from "react" // Added useEffect, useCallback
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input" // Added Input
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
// Command components might be removed or repurposed for genres only if not using Spotify for genres
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Check, ChevronsUpDown, X, Search, Loader2 } from "lucide-react" // Added Search, Loader2
import { cn } from "@/lib/utils"
import Image from "next/image" // Added Image

// Define the SpotifyArtist type based on what the proxy returns
interface SpotifyArtist {
  id: string;
  name: string;
  images?: { url: string; height?: number; width?: number }[];
  genres?: string[]; // Optional: if you want to use genres from selected artists
  // Add other fields if your proxy returns them and you need them
}

interface MusicPreferencesFormProps {
  userData: {
    artists: SpotifyArtist[] // Changed from string[] to SpotifyArtist[]
    genres: string[]
  }
  updateUserData: (data: Partial<{ artists: SpotifyArtist[]; genres: string[] }>) => void
}

// Sample data for genres - keep this or fetch from an API if desired
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
  // State for Spotify artist search
  const [artistSearchQuery, setArtistSearchQuery] = useState("")
  const [artistSuggestions, setArtistSuggestions] = useState<SpotifyArtist[]>([])
  const [isSearchingArtists, setIsSearchingArtists] = useState(false)
  const [artistSearchError, setArtistSearchError] = useState<string | null>(null)

  // State for genre search (existing logic)
  const [genreSearch, setGenreSearch] = useState("")
  const [genreOpen, setGenreOpen] = useState(false)
  const filteredGenres = allGenres.filter((genre) => genre.toLowerCase().includes(genreSearch.toLowerCase()))

  // Debounce function
  const debounce = <F extends (...args: any[]) => any>(func: F, delay: number) => {
    let timeoutId: ReturnType<typeof setTimeout>;
    return (...args: Parameters<F>): Promise<ReturnType<F>> => {
      return new Promise((resolve) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          resolve(func(...args));
        }, delay);
      });
    };
  };

  // Debounced fetch function for Spotify artists
  const fetchArtistSuggestions = useCallback(
    debounce(async (query: string) => {
      if (query.length < 2) { // Typically, don't search for less than 2-3 chars
        setArtistSuggestions([]);
        setArtistSearchError(null);
        setIsSearchingArtists(false);
        return;
      }
      setIsSearchingArtists(true);
      setArtistSearchError(null);
      try {
        const response = await fetch(`/api/spotify-proxy?query=${encodeURIComponent(query)}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Error: ${response.status}`);
        }
        const data: SpotifyArtist[] = await response.json();
        setArtistSuggestions(data);
      } catch (err) {
        setArtistSearchError(err instanceof Error ? err.message : "Failed to fetch artists");
        setArtistSuggestions([]);
      } finally {
        setIsSearchingArtists(false);
      }
    }, 500), // 500ms debounce delay
    [] // Empty dependency array for useCallback as debounce setup doesn't change
  );

  useEffect(() => {
    if (artistSearchQuery) {
      fetchArtistSuggestions(artistSearchQuery);
    } else {
      setArtistSuggestions([]); // Clear suggestions if query is empty
      setIsSearchingArtists(false);
      setArtistSearchError(null);
    }
  }, [artistSearchQuery, fetchArtistSuggestions]);


  const handleSelectArtist = (artist: SpotifyArtist) => {
    // Prevent adding duplicate artists by ID
    if (!userData.artists.find(a => a.id === artist.id)) {
      updateUserData({ artists: [...userData.artists, artist] });
    }
    setArtistSearchQuery(""); // Clear search input
    setArtistSuggestions([]); // Clear suggestions
    setArtistSearchError(null);
  };

  const removeArtist = (artistId: string) => {
    updateUserData({ artists: userData.artists.filter((a) => a.id !== artistId) });
  };

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
      {/* Artist Selection */}
      <div className="space-y-2">
        <Label htmlFor="artistSearch">Favorite Artists (select at least one)</Label>
        <div className="relative">
          <Input
            id="artistSearch"
            type="text"
            placeholder="Search for artists..."
            value={artistSearchQuery}
            onChange={(e) => setArtistSearchQuery(e.target.value)}
            className="pr-10"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            {isSearchingArtists ? (
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            ) : (
              <Search className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
        </div>

        {artistSearchError && <p className="text-sm text-destructive mt-1">{artistSearchError}</p>}

        {artistSuggestions.length > 0 && (
          <div className="mt-2 border rounded-md max-h-60 overflow-y-auto">
            {artistSuggestions.map((artist) => (
              <div
                key={artist.id}
                onClick={() => handleSelectArtist(artist)}
                className="p-3 hover:bg-accent cursor-pointer flex items-center gap-3"
              >
                {artist.images && artist.images[0] ? (
                  <Image
                    src={artist.images[artist.images.length -1 ].url} // smallest image
                    alt={artist.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground">
                    <Music className="h-5 w-5" />
                  </div>
                )}
                <span>{artist.name}</span>
              </div>
            ))}
          </div>
        )}
         {artistSearchQuery && !isSearchingArtists && artistSuggestions.length === 0 && !artistSearchError && (
          <p className="text-sm text-muted-foreground mt-1">No artists found for "{artistSearchQuery}".</p>
        )}

        <div className="flex flex-wrap gap-2 mt-3">
          {userData.artists.map((artist) => (
            <Badge key={artist.id} variant="secondary" className="px-3 py-1 text-sm">
              {artist.name}
              <Button variant="ghost" size="icon" className="h-5 w-5 p-0 ml-2" onClick={() => removeArtist(artist.id)}>
                <X className="h-3 w-3" />
                <span className="sr-only">Remove {artist.name}</span>
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
