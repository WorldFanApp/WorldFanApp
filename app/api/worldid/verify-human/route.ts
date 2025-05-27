import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { payload, proof, merkle_root, nullifier_hash, verification_level } = body

    console.log("Verifying World ID proof:", {
      action: payload.action,
      nullifier_hash,
      verification_level,
    })

    // Verify with Worldcoin API
    const worldcoinResponse = await fetch(
      "https://developer.worldcoin.org/api/v1/verify/app_7a9639a92f85fcf27213f982eddb5064",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.WORLDCOIN_API_KEY}`,
        },
        body: JSON.stringify({
          nullifier_hash,
          merkle_root,
          proof,
          verification_level,
          action: payload.action,
          signal: payload.signal,
        }),
      },
    )

    const worldcoinResult = await worldcoinResponse.json()
    console.log("Worldcoin API response:", worldcoinResult)

    if (worldcoinResponse.ok && worldcoinResult.success) {
      return NextResponse.json({
        success: true,
        nullifier_hash,
        verification_level,
        message: "Human verification successful",
      })
    } else {
      console.error("Worldcoin verification failed:", worldcoinResult)
      return NextResponse.json(
        {
          success: false,
          error: worldcoinResult.detail || "Verification failed",
        },
        { status: 400 },
      )
    }
  } catch (error: any) {
    console.error("Human verification error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Internal server error",
      },
      { status: 500 },
    )
  }
}
