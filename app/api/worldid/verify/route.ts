import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("Verification request:", body)

    const { proof, signal, action } = body

    if (!proof || !signal) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Verify with Worldcoin's API
    const verifyResponse = await fetch(
      "https://developer.worldcoin.org/api/v1/verify/app_7a9639a92f85fcf27213f982eddb5064",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nullifier_hash: proof.nullifier_hash,
          merkle_root: proof.merkle_root,
          proof: proof.proof,
          verification_level: proof.verification_level,
          action: action || "verify",
          signal: signal || "",
        }),
      },
    )

    const verifyResult = await verifyResponse.json()
    console.log("Worldcoin verification result:", verifyResult)

    if (verifyResponse.ok && verifyResult.success) {
      // Create user session
      const userData = {
        worldId: proof.nullifier_hash,
        nullifierHash: proof.nullifier_hash,
        verificationLevel: proof.verification_level,
        isHumanVerified: true,
        verifiedAt: new Date().toISOString(),
        platform: "worldcoin",
        username: `worldfan_${Date.now().toString().slice(-6)}`,
        email: "",
        image: "",
        genres: [],
        cities: [],
        favoriteArtists: "",
        ticketStruggles: "",
        priceRange: "$50-150",
        notifications: true,
      }

      return NextResponse.json({
        success: true,
        user: userData,
        message: "World ID verified successfully",
      })
    } else {
      console.error("Verification failed:", verifyResult)
      return NextResponse.json({ error: verifyResult.detail || "Verification failed" }, { status: 400 })
    }
  } catch (error) {
    console.error("Verification error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
