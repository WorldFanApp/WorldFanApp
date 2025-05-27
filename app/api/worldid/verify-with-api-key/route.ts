import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("Verification request:", body)

    // Your World API key (should be in environment variables)
    const apiKey =
      process.env.WORLDCOIN_API_KEY ||
      "api_a2V5XzQyODZjMGRjYTVmMjE4ZDFlZTk3YzkwZTQ4NGE3MTQzOnNrX2ZlMDMyNTQxNjZiOTJkNGQ4YTcyNjY3NTUzZTkwYjY4ZGNjNDJkYWYxN2MwMWY1NQ"

    // Extract the secret key part (after the colon)
    const secretKey = apiKey.includes(":") ? apiKey.split(":")[1] : apiKey

    console.log("Using API key for verification...")

    // Call Worldcoin's verification API
    const verificationResponse = await fetch("https://developer.worldcoin.org/api/v1/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${secretKey}`,
      },
      body: JSON.stringify({
        nullifier_hash: body.nullifier_hash,
        merkle_root: body.merkle_root,
        proof: body.proof,
        verification_level: body.verification_level || "device",
        action: body.action || "signin",
        signal: body.signal || "",
      }),
    })

    const verificationResult = await verificationResponse.json()
    console.log("Worldcoin API response:", verificationResult)

    if (verificationResponse.ok && verificationResult.success) {
      return NextResponse.json({
        success: true,
        verified: true,
        nullifier_hash: body.nullifier_hash,
        verification_level: body.verification_level,
        message: "World ID verification successful",
      })
    } else {
      console.error("Worldcoin verification failed:", verificationResult)
      return NextResponse.json(
        {
          success: false,
          error: verificationResult.detail || verificationResult.error || "Verification failed",
          code: verificationResult.code,
        },
        { status: 400 },
      )
    }
  } catch (error: any) {
    console.error("Verification error:", error)
    return NextResponse.json(
      {
        success: false,
        error: `Verification failed: ${error.message}`,
      },
      { status: 500 },
    )
  }
}
