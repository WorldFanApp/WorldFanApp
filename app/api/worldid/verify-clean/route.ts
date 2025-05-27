import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { nullifier_hash, proof, merkle_root, verification_level } = await request.json()

    console.log("Clean verification request:", {
      nullifier_hash,
      proof: proof ? "present" : "missing",
      merkle_root,
      verification_level,
    })

    const app_id = "app_7a9639a92f85fcf27213f982eddb5064"
    const action = "verify"

    // Verify with Worldcoin API directly
    const verificationResponse = await fetch("https://developer.worldcoin.org/api/v1/verify/" + app_id, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nullifier_hash,
        merkle_root,
        proof,
        verification_level,
        action,
      }),
    })

    const result = await verificationResponse.json()
    console.log("Worldcoin verification result:", result)

    if (verificationResponse.ok && result.success) {
      // Store user data
      const userData = {
        nullifier_hash,
        verification_level,
        verified_at: new Date().toISOString(),
        app_id,
        action,
        platform: "worldid_clean",
      }

      return NextResponse.json({
        success: true,
        verified: true,
        userData,
        message: "World ID verification successful",
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          error: result.detail || "Verification failed",
        },
        { status: 400 },
      )
    }
  } catch (error: any) {
    console.error("Verification error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Server error",
      },
      { status: 500 },
    )
  }
}
