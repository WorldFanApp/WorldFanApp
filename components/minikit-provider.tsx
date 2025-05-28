"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

// Define a type for the MiniKit global object that might not exist
type MiniKitType = {
  install: () => Promise<void>
  isInstalled: () => boolean
  commandsAsync: {
    verify: (params: any) => Promise<any>
    pay: (params: any) => Promise<any>
  }
}

// Create a safe wrapper for MiniKit
const getSafeMiniKit = (): { minikit: MiniKitType | null; error: string | null } => {
  try {
    // Check if we're in a browser environment
    if (typeof window === "undefined") {
      return { minikit: null, error: "Not in browser environment" }
    }

    // Try to access the MiniKit global
    // @ts-ignore - MiniKit might not be defined
    const MiniKit = window.MiniKit || (typeof require !== "undefined" ? require("@worldcoin/minikit-js").MiniKit : null)

    if (!MiniKit) {
      return { minikit: null, error: "MiniKit is not available" }
    }

    return { minikit: MiniKit as MiniKitType, error: null }
  } catch (error) {
    console.error("Error accessing MiniKit:", error)
    return { minikit: null, error: "Error accessing MiniKit" }
  }
}

interface MiniKitContextType {
  isAvailable: boolean
  isInstalled: boolean
  isInitialized: boolean
  isInitializing: boolean
  error: string | null
}

const MiniKitContext = createContext<MiniKitContextType>({
  isAvailable: false,
  isInstalled: false,
  isInitialized: false,
  isInitializing: true,
  error: null,
})

export const useMiniKit = () => useContext(MiniKitContext)

interface MiniKitProviderProps {
  children: ReactNode
}

export function MiniKitProvider({ children }: MiniKitProviderProps) {
  const [state, setState] = useState<MiniKitContextType>({
    isAvailable: false,
    isInstalled: false,
    isInitialized: false,
    isInitializing: true,
    error: null,
  })

  useEffect(() => {
    const initializeMiniKit = async () => {
      console.log("Initializing MiniKit...")

      // Try to safely get MiniKit
      const { minikit, error } = getSafeMiniKit()

      if (!minikit) {
        console.log("MiniKit is not available:", error)

        // In development mode, we'll simulate MiniKit being available
        if (process.env.NODE_ENV === "development") {
          setState({
            isAvailable: true, // Pretend it's available in dev mode
            isInstalled: false, // But not installed (not in World App)
            isInitialized: true,
            isInitializing: false,
            error: error || "MiniKit is not available (Development Mode)",
          })
        } else {
          setState({
            isAvailable: false,
            isInstalled: false,
            isInitialized: false,
            isInitializing: false,
            error: error || "MiniKit is not available",
          })
        }
        return
      }

      try {
        console.log("MiniKit is available, attempting to install...")
        setState((prev) => ({ ...prev, isAvailable: true }))

        // Try to initialize MiniKit
        await minikit.install()
        console.log("MiniKit installed successfully")

        // Check if running in World App
        let isInstalledValue = false
        try {
          isInstalledValue = minikit.isInstalled()
          console.log("Running in World App:", isInstalledValue)
        } catch (installError) {
          console.error("Error checking if MiniKit is installed:", installError)
        }

        setState({
          isAvailable: true,
          isInstalled: isInstalledValue,
          isInitialized: true,
          isInitializing: false,
          error: null,
        })
      } catch (installError) {
        console.error("Failed to initialize MiniKit:", installError)
        setState({
          isAvailable: true,
          isInstalled: false,
          isInitialized: false,
          isInitializing: false,
          error: installError instanceof Error ? installError.message : "Failed to initialize MiniKit",
        })
      }
    }

    initializeMiniKit()
  }, [])

  return <MiniKitContext.Provider value={state}>{children}</MiniKitContext.Provider>
}
