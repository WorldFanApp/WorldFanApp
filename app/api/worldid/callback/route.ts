import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get("code")
  const error = searchParams.get("error")

  if (error) {
    // Redirect back to app with error
    return NextResponse.redirect(`${request.nextUrl.origin}/?error=${error}`)
  }

  if (code) {
    // Redirect back to app with code
    return NextResponse.redirect(`${request.nextUrl.origin}/?code=${code}`)
  }

  return NextResponse.redirect(`${request.nextUrl.origin}/?error=no_code`)
}

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json()

    if (!code) {
      return NextResponse.json({ success: false, error: "No authorization code provided" }, { status: 400 })
    }

    // Exchange code for token
    const tokenResponse = await fetch("https://id.worldcoin.org/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code: code,
        client_id: "app_7a9639a92f85fcf27213f982eddb5064",
        redirect_uri: `${request.nextUrl.origin}/api/worldid/callback`,
      }),
    })

    const tokenData = await tokenResponse.json()

    if (!tokenResponse.ok) {
      throw new Error(tokenData.error || "Token exchange failed")
    }

    // Get user info
    const userResponse = await fetch("https://id.worldcoin.org/userinfo", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    })

    const userData = await userResponse.json()

    if (!userResponse.ok) {
      throw new Error("Failed to get user info")
    }

    return NextResponse.json({
      success: true,
      sub: userData.sub,
      verification_level: userData["https://id.worldcoin.org/beta"].likely_human,
      access_token: tokenData.access_token,
    })
  } catch (error: any) {
    console.error("OAuth callback error:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
