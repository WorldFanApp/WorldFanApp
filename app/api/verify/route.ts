import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { proof, merkle_root, nullifier_hash } = await req.json();

    if (!proof || !merkle_root || !nullifier_hash) {
      return NextResponse.json({ success: false, error: "Missing required parameters" }, { status: 400 });
    }

    const worldcoinVerifyPayload = {
      app_id: "app_7a9639a92f85fcf27213f982eddb5064",
      action: "worldfansignup",
      signal: null, // As per prompt, can be omitted if not used, example shows null
      proof: proof,
      merkle_root: merkle_root,
      nullifier_hash: nullifier_hash,
    };

    const verifyUrl = "https://developer.worldcoin.org/api/v1/verify";

    const verifyRes = await fetch(verifyUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(worldcoinVerifyPayload),
    });

    const verifyData = await verifyRes.json();

    if (verifyRes.ok && verifyData.success) {
      // Verification successful, proceed with any app-specific logic
      // For now, just return success
      return NextResponse.json({ success: true });
    } else {
      // Verification failed
      console.error("Worldcoin verification failed:", verifyData);
      return NextResponse.json(
        { success: false, error: verifyData.detail || "Verification failed with Worldcoin" },
        { status: verifyRes.status === 200 ? 400 : verifyRes.status } // If Worldcoin returns 200 but success:false, use 400
      );
    }
  } catch (error) {
    console.error("Error in verification API route:", error);
    let errorMessage = "An unknown error occurred";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
