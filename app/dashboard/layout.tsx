"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import Image from "next/image"
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarGroupLabel,
  SidebarGroup,
} from "@/components/ui/sidebar"
import { Home, Music, Ticket, GamepadIcon, Settings, LogOut, User, Shield } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isClient, setIsClient] = useState(false)
  const router = useRouter()
  const { data: session, status } = useSession()

  useEffect(() => {
    setIsClient(true)

    // Check if user is authenticated and has completed signup
    if (status === "unauthenticated") {
      router.push("/")
    } else if (status === "authenticated") {
      const userData = localStorage.getItem("userData")
      if (!userData) {
        router.push("/signup")
      }
    }
  }, [status, router])

  if (!isClient || status === "loading") {
    return null // Prevent hydration mismatch or show loading state
  }

  // If not authenticated, don't render the dashboard
  if (status === "unauthenticated") {
    return null
  }

  // Get credential type badge color
  const getCredentialBadgeColor = (type?: string) => {
    switch (type) {
      case "orb":
        return "bg-green-100 text-green-800 border-green-200"
      case "phone":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar>
          <SidebarHeader className="border-b pb-2">
            <div className="flex items-center gap-2 px-2">
              <Image
                src="/placeholder.svg?height=32&width=32&query=world%20logo"
                alt="World Logo"
                width={32}
                height={32}
              />
              <span className="text-xl font-bold">World Music</span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="/dashboard">
                      <Home className="h-5 w-5" />
                      <span>Dashboard</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="/dashboard/account">
                      <Settings className="h-5 w-5" />
                      <span>Account</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="/dashboard/favorites">
                      <Music className="h-5 w-5" />
                      <span>Favorites</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="/dashboard/drops">
                      <Ticket className="h-5 w-5" />
                      <span>Drops</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="/dashboard/game">
                      <GamepadIcon className="h-5 w-5" />
                      <span>Game</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>User</SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <User className="h-5 w-5" />
                    <span>{session?.user?.name || "Anonymous User"}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <Shield className="h-5 w-5" />
                    <span>Verification</span>
                    {session?.user?.worldcoin_credential_type && (
                      <Badge className={`ml-auto ${getCredentialBadgeColor(session.user.worldcoin_credential_type)}`}>
                        {session.user.worldcoin_credential_type}
                      </Badge>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="border-t pt-2">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => {
                    localStorage.removeItem("userData")
                    signOut({ callbackUrl: "/" })
                  }}
                >
                  <LogOut className="h-5 w-5" />
                  <span>Sign Out</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        <div className="flex-1">
          <header className="border-b">
            <div className="flex h-16 items-center px-4 gap-4">
              <SidebarTrigger />
              <h1 className="text-xl font-bold">Dashboard</h1>
            </div>
          </header>
          <main className="p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}
