import { type NextRequest, NextResponse } from "next/server"
import { verifyCloudProof } from "@worldcoin/idkit"

export async function POST(request: NextRequest) {
  try {
    const { proof, merkle_root, nullifier_hash, verification_level } = await request.json()

    console.log("Received verification request:", {
      proof: proof ? "present" : "missing",
      merkle_root,
      nullifier_hash,
      verification_level,
    })

    const app_id = process.env.NEXT_PUBLIC_WORLDCOIN_APP_ID || "app_7a9639a92f85fcf27213f982eddb5064"
    const action = process.env.NEXT_PUBLIC_WORLDCOIN_ACTION || "verify"

    // Verify the proof using Worldcoin's cloud verification
    const verifyRes = await verifyCloudProof(proof, app_id, action)

    console.log("Cloud verification result:", verifyRes)

    if (verifyRes.success) {
      // Check if this nullifier hash has been used before
      // In production, you'd check against your database
      const isFirstTime = await checkNullifierHash(nullifier_hash)

      if (!isFirstTime) {
        return NextResponse.json(
          {
            success: false,
            error: "This World ID has already been used for verification",
          },
          { status: 400 },
        )
      }

      // Store the nullifier hash to prevent reuse
      await storeNullifierHash(nullifier_hash)

      // Create user session or JWT here
      const userData = {
        nullifier_hash,
        verification_level,
        verified_at: new Date().toISOString(),
        app_id,
        action,
      }

      return NextResponse.json({
        success: true,
        verified: true,
        userData,
        message: "World ID verification successful",
      })
    } else {
      console.error("Cloud verification failed:", verifyRes)
      return NextResponse.json(
        {
          success: false,
          error: "World ID verification failed",
          details: verifyRes,
        },
        { status: 400 },
      )
    }
  } catch (error: any) {
    console.error("Verification error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Server error during verification",
      },
      { status: 500 },
    )
  }
}

// In-memory storage for demo (use a real database in production)
const usedNullifiers = new Set<string>()

async function checkNullifierHash(nullifierHash: string): Promise<boolean> {
  // Return true if this is the first time using this nullifier
  return !usedNullifiers.has(nullifierHash)
}

async function storeNullifierHash(nullifierHash: string): Promise<void> {
  // Store the nullifier hash to prevent reuse
  usedNullifiers.add(nullifierHash)
}
