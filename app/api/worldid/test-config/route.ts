import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const appId = process.env.NEXT_PUBLIC_WORLDCOIN_APP_ID || "app_7a9639a92f85fcf27213f982eddb5064"

    // Test if the app_id is valid by checking with Worldcoin's API
    const testResponse = await fetch(`https://id.worldcoin.org/api/v1/verify/${appId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nullifier_hash: "test",
        merkle_root: "test",
        proof: "test",
        verification_level: "device",
        action: "signin",
        signal: "",
      }),
    })

    const result = await testResponse.json()

    return NextResponse.json({
      app_id: appId,
      api_response_status: testResponse.status,
      api_response: result,
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
      app_id: process.env.NEXT_PUBLIC_WORLDCOIN_APP_ID,
      timestamp: new Date().toISOString(),
    })
  }
}
