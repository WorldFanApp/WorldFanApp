import { type NextRequest, NextResponse } from "next/server"

// In-memory storage for demo (in production, use a real database)
const userDatabase = new Map<string, any>()

export async function POST(request: NextRequest) {
  try {
    const userData = await request.json()

    if (!userData.username) {
      return NextResponse.json({ success: false, error: "Username is required" }, { status: 400 })
    }

    // Generate a unique developer ID
    const developerId = `dev_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Create developer account
    const developerAccount = {
      ...userData,
      id: developerId,
      isDeveloperAccount: true,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    }

    userDatabase.set(developerId, developerAccount)

    return NextResponse.json({
      success: true,
      message: "Developer account created successfully",
      userData: developerAccount,
      userId: developerId,
    })
  } catch (error: any) {
    console.error("Error creating developer account:", error)
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create developer account" },
      { status: 500 },
    )
  }
}
