import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    console.log("Testing Worldcoin API key configuration...")

    // Check if API key is available
    const apiKey = process.env.WORLDCOIN_API_KEY

    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: "WORLDCOIN_API_KEY environment variable not found",
        config: {
          hasApiKey: false,
          appId: process.env.NEXT_PUBLIC_WORLDCOIN_APP_ID || "Not set",
          timestamp: new Date().toISOString(),
        },
      })
    }

    // Extract the secret key part (after the colon if present)
    const secretKey = apiKey.includes(":") ? apiKey.split(":")[1] : apiKey
    const keyPreview = secretKey ? `${secretKey.slice(0, 8)}...${secretKey.slice(-4)}` : "Invalid"

    // Test API connectivity (without making actual verification call)
    const testResponse = await fetch("https://developer.worldcoin.org/api/v1/precheck", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/json",
      },
    }).catch((err) => {
      console.log("API connectivity test failed:", err.message)
      return null
    })

    return NextResponse.json({
      success: true,
      message: "API key configuration test completed",
      config: {
        hasApiKey: true,
        keyPreview,
        appId: process.env.NEXT_PUBLIC_WORLDCOIN_APP_ID || "Not set",
        apiConnectivity: testResponse ? testResponse.status : "Failed to connect",
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error: any) {
    console.error("API key test error:", error)
    return NextResponse.json(
      {
        success: false,
        error: `API key test failed: ${error.message}`,
        config: {
          hasApiKey: !!process.env.WORLDCOIN_API_KEY,
          timestamp: new Date().toISOString(),
        },
      },
      { status: 500 },
    )
  }
}
