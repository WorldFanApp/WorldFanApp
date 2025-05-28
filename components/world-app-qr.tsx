"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, ExternalLink } from "lucide-react"

export function WorldAppQR() {
  const [currentUrl, setCurrentUrl] = useState<string>("")
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("")

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Get the current URL
      const url = window.location.href
      setCurrentUrl(url)

      // Generate QR code URL using a free QR code API
      setQrCodeUrl(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`)
    }
  }, [])

  return (
    <div className="flex flex-col items-center space-y-4 p-4 border rounded-lg">
      <Alert className="bg-yellow-50 border-yellow-200">
        <AlertCircle className="h-5 w-5 text-yellow-600" />
        <AlertDescription className="text-yellow-800 ml-2">
          For the best experience, please open this app in the World App.
        </AlertDescription>
      </Alert>

      <div className="text-center">
        <p className="text-sm text-muted-foreground mb-2">Scan this QR code with your phone to open in World App:</p>
        {qrCodeUrl && (
          <img src={qrCodeUrl || "/placeholder.svg"} alt="QR Code to open in World App" className="mx-auto w-40 h-40" />
        )}
      </div>

      <div className="flex flex-col gap-2 w-full">
        <Button asChild variant="outline" className="flex items-center gap-2">
          <a href="https://worldcoin.org/download" target="_blank" rel="noopener noreferrer">
            Download World App <ExternalLink className="h-4 w-4" />
          </a>
        </Button>

        <Button asChild variant="outline" className="flex items-center gap-2">
          <a href={`worldapp://open?url=${encodeURIComponent(currentUrl)}`}>Open in World App</a>
        </Button>
      </div>
    </div>
  )
}
