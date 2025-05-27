import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Providers } from "@/components/providers"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "World Fan - Music Experiences on Worldcoin",
  description:
    "Join World Fan for exclusive vinyl drops, fair-priced tickets, and direct artist connections powered by WorldID verification.",
  keywords: ["music", "vinyl", "tickets", "worldcoin", "worldid", "concerts", "artists"],
  openGraph: {
    title: "World Fan - Music Experiences on Worldcoin",
    description: "Join World Fan for exclusive vinyl drops, fair-priced tickets, and direct artist connections.",
    images: ["/images/world-fan-logo-hq.png"],
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
