import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { SessionProvider } from "@/components/session-provider"
import { MiniKitProvider } from '@worldcoin/minikit-js'; // Attempting direct import

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
        <MiniKitProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <SessionProvider>{children}</SessionProvider>
          </ThemeProvider>
        </MiniKitProvider>
      </body>
    </html>
  )
}
