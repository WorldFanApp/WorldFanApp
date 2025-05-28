import { NextResponse } from "next/server"

export async function GET() {
  const config = {
    environment: process.env.NODE_ENV,
    nextauth_url: process.env.NEXTAUTH_URL,
    worldcoin_client_id: process.env.WORLDCOIN_CLIENT_ID ? "Configured" : "Not configured",
    worldcoin_client_secret: process.env.WORLDCOIN_CLIENT_SECRET ? "Configured" : "Not configured",
    nextauth_secret: process.env.NEXTAUTH_SECRET ? "Configured" : "Not configured",
    callback_url: `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/auth/callback/worldcoin`,
  }

  return NextResponse.json(config, {
    headers: {
      "Content-Type": "application/json",
    },
  })
}
