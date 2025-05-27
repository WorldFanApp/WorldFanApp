// World App Integration Utilities

export interface WorldAppVerificationRequest {
  app_id: string
  action: string
  signal: string
}

export interface WorldAppVerificationResponse {
  success: boolean
  nullifier_hash?: string
  verification_level?: string
  error?: string
}

export class WorldAppIntegration {
  private static instance: WorldAppIntegration
  private messageHandlers: Map<string, (data: any) => void> = new Map()

  static getInstance(): WorldAppIntegration {
    if (!WorldAppIntegration.instance) {
      WorldAppIntegration.instance = new WorldAppIntegration()
    }
    return WorldAppIntegration.instance
  }

  constructor() {
    // Listen for messages from World App
    if (typeof window !== "undefined") {
      window.addEventListener("message", this.handleMessage.bind(this))
    }
  }

  private handleMessage(event: MessageEvent) {
    const { type, ...data } = event.data

    if (this.messageHandlers.has(type)) {
      const handler = this.messageHandlers.get(type)
      if (handler) {
        handler(data)
      }
    }
  }

  isWorldApp(): boolean {
    if (typeof window === "undefined") return false

    const userAgent = navigator.userAgent.toLowerCase()
    return (
      userAgent.includes("world") ||
      userAgent.includes("worldcoin") ||
      window.location.href.includes("worldcoin.org") ||
      window.location.href.includes("world.org") ||
      typeof (window as any).WorldApp !== "undefined" ||
      typeof (window as any).worldcoin !== "undefined" ||
      window.self !== window.top
    )
  }

  async requestVerification(request: WorldAppVerificationRequest): Promise<WorldAppVerificationResponse> {
    return new Promise((resolve, reject) => {
      const requestId = Math.random().toString(36).substr(2, 9)

      // Set up response handler
      const responseHandler = (data: any) => {
        if (data.requestId === requestId) {
          this.messageHandlers.delete(`WORLD_ID_VERIFICATION_RESPONSE_${requestId}`)
          resolve(data)
        }
      }

      this.messageHandlers.set(`WORLD_ID_VERIFICATION_RESPONSE_${requestId}`, responseHandler)

      // Try native World App API first
      if (typeof (window as any).WorldApp !== "undefined") {
        const worldApp = (window as any).WorldApp
        worldApp
          .requestVerification({
            ...request,
            requestId,
          })
          .then(resolve)
          .catch((error: any) => {
            // Fallback to postMessage
            this.sendPostMessage(request, requestId)
          })
      } else {
        // Use postMessage
        this.sendPostMessage(request, requestId)
      }

      // Timeout after 30 seconds
      setTimeout(() => {
        this.messageHandlers.delete(`WORLD_ID_VERIFICATION_RESPONSE_${requestId}`)
        reject(new Error("Verification timeout"))
      }, 30000)
    })
  }

  private sendPostMessage(request: WorldAppVerificationRequest, requestId: string) {
    const message = {
      type: "WORLD_ID_VERIFICATION_REQUEST",
      requestId,
      ...request,
    }

    // Send to parent window (World App)
    if (window.parent && window.parent !== window) {
      window.parent.postMessage(message, "*")
    } else {
      throw new Error("No World App parent window found")
    }
  }

  // Method to handle direct World App callbacks
  onVerificationComplete(callback: (response: WorldAppVerificationResponse) => void) {
    this.messageHandlers.set("WORLD_ID_SUCCESS", callback)
    this.messageHandlers.set("WORLD_ID_ERROR", (data) => callback({ success: false, error: data.error }))
  }
}

export const worldAppIntegration = WorldAppIntegration.getInstance()
