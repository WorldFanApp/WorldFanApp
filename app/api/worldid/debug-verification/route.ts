import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("=== DEBUG VERIFICATION START ===")
    console.log("Request body:", JSON.stringify(body, null, 2))

    // Log all environment variables (safely)
    console.log("Environment check:")
    console.log("- WORLDCOIN_API_KEY exists:", !!process.env.WORLDCOIN_API_KEY)
    console.log("- NEXT_PUBLIC_WORLDCOIN_APP_ID:", process.env.NEXT_PUBLIC_WORLDCOIN_APP_ID)
    console.log("- NEXT_PUBLIC_WORLDCOIN_ACTION:", process.env.NEXT_PUBLIC_WORLDCOIN_ACTION)

    const apiKey = process.env.WORLDCOIN_API_KEY
    if (!apiKey) {
      console.log("❌ No API key found")
      return NextResponse.json({ success: false, error: "No API key configured" }, { status: 500 })
    }

    // Extract secret key
    const secretKey = apiKey.includes(":") ? apiKey.split(":")[1] : apiKey
    console.log("- API key format:", apiKey.includes(":") ? "Full format" : "Secret only")
    console.log("- Secret key length:", secretKey.length)
    console.log("- Secret key preview:", `${secretKey.slice(0, 8)}...${secretKey.slice(-4)}`)

    // Prepare verification payload
    const verificationPayload = {
      nullifier_hash: body.nullifier_hash,
      merkle_root: body.merkle_root,
      proof: body.proof,
      verification_level: body.verification_level || "device",
      action: body.action || process.env.NEXT_PUBLIC_WORLDCOIN_ACTION || "signin",
      signal: body.signal || "",
    }

    console.log("Verification payload:", JSON.stringify(verificationPayload, null, 2))

    // Try multiple Worldcoin API endpoints
    const endpoints = [
      "https://developer.worldcoin.org/api/v1/verify",
      "https://developer.worldcoin.org/api/v2/verify",
      "https://api.worldcoin.org/v1/verify",
    ]

    let lastError = null
    let lastResponse = null

    for (const endpoint of endpoints) {
      try {
        console.log(`Trying endpoint: ${endpoint}`)

        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${secretKey}`,
          },
          body: JSON.stringify(verificationPayload),
        })

        console.log(`Response status: ${response.status}`)
        console.log(`Response headers:`, Object.fromEntries(response.headers.entries()))

        const responseText = await response.text()
        console.log(`Response body: ${responseText}`)

        let responseData
        try {
          responseData = JSON.parse(responseText)
        } catch {
          responseData = { raw_response: responseText }
        }

        lastResponse = {
          endpoint,
          status: response.status,
          ok: response.ok,
          data: responseData,
        }

        if (response.ok && responseData.success) {
          console.log("✅ Verification successful!")
          return NextResponse.json({
            success: true,
            verified: true,
            endpoint_used: endpoint,
            nullifier_hash: body.nullifier_hash,
            verification_level: body.verification_level,
            message: "World ID verification successful",
            debug_info: lastResponse,
          })
        } else {
          console.log(`❌ Endpoint ${endpoint} failed:`, responseData)
          lastError = responseData
        }
      } catch (error: any) {
        console.log(`❌ Endpoint ${endpoint} error:`, error.message)
        lastError = { endpoint, error: error.message }
      }
    }

    console.log("=== ALL ENDPOINTS FAILED ===")
    console.log("Last error:", lastError)
    console.log("Last response:", lastResponse)

    return NextResponse.json(
      {
        success: false,
        error: "All verification endpoints failed",
        last_error: lastError,
        last_response: lastResponse,
        debug_info: {
          endpoints_tried: endpoints,
          payload_sent: verificationPayload,
          api_key_configured: true,
        },
      },
      { status: 400 },
    )
  } catch (error: any) {
    console.error("=== DEBUG VERIFICATION ERROR ===", error)
    return NextResponse.json(
      {
        success: false,
        error: `Debug verification failed: ${error.message}`,
        stack: error.stack,
      },
      { status: 500 },
    )
  }
}
