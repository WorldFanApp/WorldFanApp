"use server"

export async function verifyWorldIDProof(proof: any) {
  try {
    console.log("Server: Verifying WorldID proof:", proof)

    // Verify the WorldID proof with Worldcoin's verification API
    const response = await fetch("https://id.worldcoin.org/api/v1/verify/app_7a9639a92f85fcf27213f982eddb5064", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nullifier_hash: proof.nullifier_hash,
        merkle_root: proof.merkle_root,
        proof: proof.proof,
        verification_level: proof.verification_level,
        action: "world_fan_signup",
        signal: proof.signal || "",
      }),
    })

    const result = await response.json()
    console.log("WorldID verification API result:", result)

    if (response.ok && result.success) {
      return {
        success: true,
        verified: true,
        verification_level: proof.verification_level,
        nullifier_hash: proof.nullifier_hash,
      }
    } else {
      console.error("WorldID verification failed:", result)
      return {
        success: false,
        error: result.detail || result.error || "WorldID verification failed",
      }
    }
  } catch (error) {
    console.error("WorldID verification error:", error)
    return {
      success: false,
      error: "WorldID verification service unavailable",
    }
  }
}
