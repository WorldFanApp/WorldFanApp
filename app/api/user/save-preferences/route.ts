import { type NextRequest, NextResponse } from "next/server"

// In-memory storage for demo (in production, use a real database)
const userDatabase = new Map<string, any>()

export async function POST(request: NextRequest) {
  try {
    const { userId, preferences } = await request.json()

    if (!userId) {
      return NextResponse.json({ success: false, error: "User ID is required" }, { status: 400 })
    }

    // Get existing user data
    const existingUser = userDatabase.get(userId) || {}

    // Update preferences
    const updatedUser = {
      ...existingUser,
      ...preferences,
      updatedAt: new Date().toISOString(),
    }

    userDatabase.set(userId, updatedUser)

    return NextResponse.json({
      success: true,
      message: "Preferences saved successfully",
      userData: updatedUser,
    })
  } catch (error: any) {
    console.error("Error saving preferences:", error)
    return NextResponse.json({ success: false, error: error.message || "Failed to save preferences" }, { status: 500 })
  }
}
