import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { app_id, action } = await request.json()

    // Generate a unique session ID
    const sessionId = crypto.randomUUID()

    // Create verification URL for World App
    const verificationUrl = `https://worldcoin.org/verify?app_id=${app_id}&action=${action}&session_id=${sessionId}`

    // In a real app, you'd store the session in a database
    // For now, we'll use a simple in-memory store
    global.verificationSessions = global.verificationSessions || new Map()
    global.verificationSessions.set(sessionId, {
      app_id,
      action,
      status: "pending",
      created_at: new Date().toISOString(),
    })

    return NextResponse.json({
      success: true,
      session_id: sessionId,
      verification_url: verificationUrl,
    })
  } catch (error) {
    console.error("Error creating verification session:", error)
    return NextResponse.json({ success: false, error: "Failed to create verification session" }, { status: 500 })
  }
}
