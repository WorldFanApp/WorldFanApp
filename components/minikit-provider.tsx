"use client"

import { MiniKit } from "@minikit-js/react"
import { type ReactNode, useEffect } from "react"

export function MiniKitProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    MiniKit.install({
      appId: "app_7a9639a92f85fcf27213f982eddb5064",
    })
  }, [])

  return <>{children}</>
}
