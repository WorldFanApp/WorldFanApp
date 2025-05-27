import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { app_id, action } = await request.json()

    // Generate state and nonce for security
    const state = "music_app_" + Math.random().toString(36).substr(2, 9)
    const nonce = Math.random().toString(36).substr(2, 9)

    // Build authorization URL
    const authUrl =
      `https://id.worldcoin.org/authorize?` +
      new URLSearchParams({
        client_id: app_id,
        response_type: "code",
        scope: "openid",
        redirect_uri: `${request.nextUrl.origin}/api/worldid/callback`,
        state: state,
        nonce: nonce,
      }).toString()

    return NextResponse.json({
      success: true,
      auth_url: authUrl,
      state: state,
      nonce: nonce,
    })
  } catch (error) {
    console.error("Error generating auth URL:", error)
    return NextResponse.json({ success: false, error: "Failed to generate auth URL" }, { status: 500 })
  }
}
