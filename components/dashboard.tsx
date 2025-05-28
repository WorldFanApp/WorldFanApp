"use client"

import type React from "react"
import { useState, useEffect } from "react"

type DashboardProps = {}

const Dashboard: React.FC<DashboardProps> = () => {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const storedSession = localStorage.getItem("worldfan_session")
    if (storedSession) {
      try {
        const sessionData = JSON.parse(storedSession)
        setUser(sessionData)
      } catch (error) {
        console.error("Error parsing session data:", error)
        localStorage.removeItem("worldfan_session") // Clear invalid session
      }
    }
    setLoading(false)
  }, [])

  const handleSignOut = () => {
    localStorage.removeItem("worldfan_session")
    window.location.reload()
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return <div>Not authenticated.</div>
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {user?.email}!</p>
      <button onClick={handleSignOut}>Sign Out</button>
    </div>
  )
}

export default Dashboard
