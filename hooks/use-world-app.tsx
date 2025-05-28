"use client"

import { useMiniKit } from "@/components/minikit-provider"

export function useWorldApp() {
  const { isAvailable, isInstalled, isInitialized, isInitializing, error } = useMiniKit()

  return {
    isWorldApp: isInstalled,
    isAvailable,
    isLoading: isInitializing,
    isInitialized,
    error, // We'll keep this for debugging, but won't display it prominently
  }
}
