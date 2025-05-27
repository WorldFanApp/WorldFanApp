import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { nullifier_hash, merkle_root, proof, verification_level } = await request.json()

    // For now, we'll accept any verification data
    // In production, you would verify this with Worldcoin's API

    if (nullifier_hash) {
      return NextResponse.json({
        success: true,
        verified: true,
        nullifier_hash: nullifier_hash,
        verification_level: verification_level || "orb",
        timestamp: new Date().toISOString(),
      })
    }

    return NextResponse.json(
      {
        success: false,
        error: "Invalid verification data",
      },
      { status: 400 },
    )
  } catch (error) {
    console.error("Verification error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Verification failed",
      },
      { status: 500 },
    )
  }
}
