"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Ticket, Disc, Calendar } from "lucide-react"
import { useState } from "react"

export default function DropsPage() {
  const [purchaseStatus, setPurchaseStatus] = useState<string | null>(null)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Drops</h1>
        <p className="text-muted-foreground">Upcoming ticket and vinyl drops for your favorite artists</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Coming Soon
          </CardTitle>
          <CardDescription>This feature is currently in development</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">Drops Feature Coming Soon</h3>
            <p className="text-muted-foreground mb-4">
              We're working on bringing you exclusive ticket and vinyl drops from your favorite artists. Stay tuned for
              updates!
            </p>
            <div className="flex justify-center gap-4">
              <Button variant="outline">
                <Ticket className="mr-2 h-4 w-4" />
                Tickets
              </Button>
              <Button variant="outline">
                <Disc className="mr-2 h-4 w-4" />
                Vinyl
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="tickets" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tickets">Tickets</TabsTrigger>
          <TabsTrigger value="vinyl">Vinyl</TabsTrigger>
        </TabsList>

        <TabsContent value="tickets" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Ticket Drops</CardTitle>
              <CardDescription>Get notified when tickets become available</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div className="rounded-lg border p-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Feature Coming Soon</h3>
                    <p className="text-sm text-muted-foreground">We'll notify you when this feature is available</p>
                  </div>
                  {/* MiniKitPayment component removed */}
                </div>
                {purchaseStatus && <p className="text-sm mt-2 text-center">{purchaseStatus}</p>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vinyl" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Vinyl Releases</CardTitle>
              <CardDescription>Limited edition vinyl from your favorite artists</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div className="rounded-lg border p-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Feature Coming Soon</h3>
                    <p className="text-sm text-muted-foreground">We'll notify you when this feature is available</p>
                  </div>
                  <Button variant="outline" disabled>
                    Notify Me
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
