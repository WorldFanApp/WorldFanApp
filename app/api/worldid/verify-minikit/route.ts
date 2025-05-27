import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { payload, proof, merkle_root, nullifier_hash, verification_level } = await request.json()

    console.log("MiniKit verification request:", {
      action: payload.action,
      nullifier_hash,
      verification_level,
    })

    // Verify the proof with Worldcoin's API
    const verifyResponse = await fetch(`https://id.worldcoin.org/api/v1/verify/app_7a9639a92f85fcf27213f982eddb5064`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nullifier_hash,
        merkle_root,
        proof,
        verification_level,
        action: payload.action,
        signal: payload.signal,
      }),
    })

    const verifyResult = await verifyResponse.json()
    console.log("Worldcoin verification result:", verifyResult)

    if (verifyResponse.ok && verifyResult.success) {
      return NextResponse.json({
        success: true,
        nullifier_hash,
        verification_level,
        verified: true,
        timestamp: new Date().toISOString(),
      })
    } else {
      console.error("Worldcoin verification failed:", verifyResult)
      return NextResponse.json(
        {
          success: false,
          error: verifyResult.detail || verifyResult.error || "World ID verification failed",
        },
        { status: 400 },
      )
    }
  } catch (error: any) {
    console.error("MiniKit verification error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "World ID verification service error",
      },
      { status: 500 },
    )
  }
}
