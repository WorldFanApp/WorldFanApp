"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

interface MiniKitContextType {
  isWorldApp: boolean
  isInitialized: boolean
  isLoading: boolean
  error: string | null
}

const MiniKitContext = createContext<MiniKitContextType>({
  isWorldApp: false,
  isInitialized: false,
  isLoading: true,
  error: null,
})

export const useMiniKit = () => useContext(MiniKitContext)

interface MiniKitProviderProps {
  children: ReactNode
}

export function MiniKitProvider({ children }: MiniKitProviderProps) {
  const [state, setState] = useState<MiniKitContextType>({
    isWorldApp: false,
    isInitialized: false,
    isLoading: true,
    error: null,
  })

  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window === "undefined") {
      setState({
        isWorldApp: false,
        isInitialized: false,
        isLoading: false,
        error: "Not in browser environment",
      })
      return
    }

    // Function to detect World App
    const detectWorldApp = () => {
      try {
        // Check if we're in the World App by looking for the miniAppBridge
        const isInWorldApp = !!((window as any).webkit?.messageHandlers?.miniAppBridge || (window as any).miniAppBridge)

        console.log("World App detection:", isInWorldApp)

        // Check if MiniKit is available
        const isMiniKitAvailable = typeof (window as any).MiniKit !== "undefined"
        console.log("MiniKit available:", isMiniKitAvailable)

        setState({
          isWorldApp: isInWorldApp,
          isInitialized: true,
          isLoading: false,
          error: null,
        })
      } catch (error) {
        console.error("Error detecting World App:", error)
        setState({
          isWorldApp: false,
          isInitialized: false,
          isLoading: false,
          error: error instanceof Error ? error.message : "Error detecting World App",
        })
      }
    }

    // In development mode, we'll create a mock MiniKit for testing
    if (process.env.NODE_ENV === "development" && typeof (window as any).MiniKit === "undefined") {
      console.log("Creating mock MiniKit for development")

      // Create a mock MiniKit object
      ;(window as any).MiniKit = {
        verify: async (params: any) => {
          console.log("Mock verify called with params:", params)
          // Simulate a delay
          await new Promise((resolve) => setTimeout(resolve, 1500))
          // Return a mock successful verification
          return {
            success: true,
            proof: "mock_proof",
            merkle_root: "mock_merkle_root",
            nullifier_hash: "mock_nullifier_hash",
            verification_level: "orb",
          }
        },
      }
    }

    // Run detection after a short delay to ensure everything is loaded
    const timeoutId = setTimeout(detectWorldApp, 500)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [])

  return <MiniKitContext.Provider value={state}>{children}</MiniKitContext.Provider>
}
