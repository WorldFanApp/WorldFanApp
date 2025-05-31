import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import ClientProviders from "./client-providers"; // Import the new providers component

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "World Music App",
  description: "A music preference app for Orb-verified users",
  manifest: "/manifest.json",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <ClientProviders> {/* Use the new ClientProviders */}
            {children}
          </ClientProviders>
        </ThemeProvider>
      </body>
    </html>
  )
}
