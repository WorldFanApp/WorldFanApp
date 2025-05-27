"use client"

import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Music, X } from "lucide-react"

interface GenreSelectorProps {
  selectedGenres: string[]
  onGenresChange: (genres: string[]) => void
}

const musicGenres = [
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
  "Salsa",
  "Bachata",
  "Flamenco",
  "Bossa Nova",
  "Ska",
  "Grunge",
  "Emo",
  "Hardcore",
  "Progressive",
  "Psychedelic",
  "Shoegaze",
  "Post-Rock",
  "Math Rock",
  "Doom",
  "Black Metal",
  "Death Metal",
  "Thrash",
  "Power Metal",
  "Symphonic Metal",
  "Nu Metal",
]

export function GenreSelector({ selectedGenres, onGenresChange }: GenreSelectorProps) {
  const toggleGenre = (genre: string) => {
    if (selectedGenres.includes(genre)) {
      onGenresChange(selectedGenres.filter((g) => g !== genre))
    } else {
      onGenresChange([...selectedGenres, genre])
    }
  }

  return (
    <>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Music className="w-5 h-5" />
          Music Genres
        </CardTitle>
        <CardDescription>Select the genres you love - this helps us find the perfect events for you</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Selected Genres */}
        {selectedGenres.length > 0 && (
          <div>
            <h4 className="font-medium mb-2">Your Music Taste ({selectedGenres.length})</h4>
            <div className="flex flex-wrap gap-2">
              {selectedGenres.map((genre) => (
                <Badge key={genre} variant="default" className="flex items-center gap-1">
                  {genre}
                  <X className="w-3 h-3 cursor-pointer hover:text-red-500" onClick={() => toggleGenre(genre)} />
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* All Genres */}
        <div>
          <h4 className="font-medium mb-2">All Genres</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-60 overflow-y-auto">
            {musicGenres.map((genre) => (
              <Button
                key={genre}
                variant={selectedGenres.includes(genre) ? "default" : "outline"}
                size="sm"
                onClick={() => toggleGenre(genre)}
                className="justify-start text-left"
              >
                {genre}
              </Button>
            ))}
          </div>
        </div>

        {selectedGenres.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-4">Select at least one genre to continue</p>
        )}
      </CardContent>
    </>
  )
}
