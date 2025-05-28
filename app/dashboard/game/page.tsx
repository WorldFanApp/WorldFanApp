"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { GamepadIcon, Trophy } from "lucide-react"

export default function GamePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Music Game</h1>
        <p className="text-muted-foreground">Play games and earn rewards based on your music knowledge</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GamepadIcon className="h-5 w-5" />
            Coming Soon
          </CardTitle>
          <CardDescription>This feature is currently in development</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">Game Feature Coming Soon</h3>
            <p className="text-muted-foreground mb-4">
              We're working on bringing you fun music-based games and challenges. Stay tuned for updates!
            </p>
            <Button variant="outline">
              <Trophy className="mr-2 h-4 w-4" />
              Notify Me When Available
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Music Trivia</CardTitle>
            <CardDescription>Test your knowledge about your favorite artists</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <div className="rounded-lg border p-4 flex justify-between items-center">
                <div>
                  <h3 className="font-medium">Coming Soon</h3>
                  <p className="text-sm text-muted-foreground">
                    Answer questions about your favorite artists and genres
                  </p>
                </div>
                <Button variant="outline" disabled>
                  Play
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Song Recognition</CardTitle>
            <CardDescription>How quickly can you identify songs?</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <div className="rounded-lg border p-4 flex justify-between items-center">
                <div>
                  <h3 className="font-medium">Coming Soon</h3>
                  <p className="text-sm text-muted-foreground">
                    Test how quickly you can identify songs from short clips
                  </p>
                </div>
                <Button variant="outline" disabled>
                  Play
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
