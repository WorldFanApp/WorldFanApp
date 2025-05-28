"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, ExternalLink } from "lucide-react"
import { useMiniKit } from "@/components/minikit-provider"

// Mock payment for development/testing outside World App
const mockPayment = async () => {
  // Simulate payment delay
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // Return a mock successful payment
  return {
    finalPayload: {
      status: "success",
      transaction_hash: "mock_transaction_hash",
    },
  }
}

interface MiniKitPaymentProps {
  amount: string
  description: string
  reference: string
  onSuccess?: (result: any) => void
  onError?: (error: string) => void
}

export function MiniKitPayment({ amount, description, reference, onSuccess, onError }: MiniKitPaymentProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { isAvailable, isInstalled, isInitialized, isInitializing } = useMiniKit()

  const handlePayment = async () => {
    if (isInitializing) {
      const errorMsg = "MiniKit is still initializing. Please wait a moment and try again."
      setError(errorMsg)
      onError?.(errorMsg)
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      let paymentResult

      if (isAvailable && isInstalled) {
        // We're in the World App, use real payment
        console.log("Using real World App payment")

        // Access MiniKit safely
        // @ts-ignore - MiniKit might not be defined
        const MiniKit = window.MiniKit

        const { finalPayload } = await MiniKit.commandsAsync.pay({
          reference,
          to: "0x...", // This would be your wallet address
          tokens: [
            {
              symbol: "WLD",
              token_amount: amount,
              token_decimals: 18, // WLD has 18 decimals
            },
          ],
          description,
        })

        if (finalPayload.status === "success") {
          paymentResult = finalPayload
        } else {
          throw new Error(finalPayload.error_message || "Payment failed")
        }
      } else {
        // We're not in the World App, use mock payment for development
        console.log("Using mock payment (not in World App)")
        const { finalPayload } = await mockPayment()
        paymentResult = finalPayload
      }

      console.log("Payment successful:", paymentResult)
      onSuccess?.(paymentResult)
    } catch (err) {
      console.error("Payment error:", err)
      const errorMsg = "An error occurred during payment. Please try again."
      setError(errorMsg)
      onError?.(errorMsg)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="space-y-4">
      <Button onClick={handlePayment} disabled={isProcessing} className="w-full">
        {isProcessing ? "Processing..." : `Pay ${amount} WLD`}
      </Button>

      {!isAvailable && (
        <Alert className="bg-yellow-50 border-yellow-200">
          <AlertCircle className="h-5 w-5 text-yellow-600" />
          <AlertDescription className="text-yellow-800 ml-2">
            World App integration is not available in this environment.
            {process.env.NODE_ENV === "development" && " Using mock payment for development."}
          </AlertDescription>
        </Alert>
      )}

      {isAvailable && !isInstalled && (
        <Alert className="bg-yellow-50 border-yellow-200">
          <AlertCircle className="h-5 w-5 text-yellow-600" />
          <AlertDescription className="text-yellow-800 ml-2">
            Please open this app in the World App for real payments.
            <a
              href="https://worldcoin.org/download"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 underline mt-1"
            >
              Download World App <ExternalLink className="h-3 w-3" />
            </a>
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert className="bg-red-50 border-red-200">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <AlertDescription className="text-red-800 ml-2">{error}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}
