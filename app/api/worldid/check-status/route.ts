import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get("session_id")

    if (!sessionId) {
      return NextResponse.json({ success: false, error: "Session ID required" }, { status: 400 })
    }

    // Check session status from in-memory store
    // In a real app, this would be from a database
    const sessions = global.verificationSessions || new Map()
    const session = sessions.get(sessionId)

    if (!session) {
      return NextResponse.json({ success: false, error: "Session not found" }, { status: 404 })
    }

    // For demo purposes, simulate verification after 10 seconds
    const createdAt = new Date(session.created_at)
    const now = new Date()
    const secondsElapsed = (now.getTime() - createdAt.getTime()) / 1000

    if (secondsElapsed > 10 && session.status === "pending") {
      // Simulate successful verification
      session.status = "verified"
      session.nullifier_hash = "demo_" + sessionId.slice(0, 8)
      session.verification_level = "orb"
      sessions.set(sessionId, session)
    }

    if (session.status === "verified") {
      return NextResponse.json({
        success: true,
        verified: true,
        nullifier_hash: session.nullifier_hash,
        verification_level: session.verification_level,
      })
    }

    return NextResponse.json({
      success: true,
      verified: false,
      status: session.status,
    })
  } catch (error) {
    console.error("Error checking verification status:", error)
    return NextResponse.json({ success: false, error: "Failed to check verification status" }, { status: 500 })
  }
}
