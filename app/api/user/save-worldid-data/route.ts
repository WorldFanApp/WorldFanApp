import { type NextRequest, NextResponse } from "next/server"

// In-memory storage for demo (in production, use a real database)
const userDatabase = new Map<string, any>()

export async function POST(request: NextRequest) {
  try {
    const { nullifierHash, userData } = await request.json()

    if (!nullifierHash) {
      return NextResponse.json({ success: false, error: "Nullifier hash is required" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = userDatabase.get(nullifierHash)

    if (existingUser) {
      // Update existing user data
      const updatedUser = {
        ...existingUser,
        ...userData,
        lastLoginAt: new Date().toISOString(),
      }
      userDatabase.set(nullifierHash, updatedUser)

      return NextResponse.json({
        success: true,
        message: "Welcome back! User data updated.",
        userData: updatedUser,
        isReturningUser: true,
      })
    } else {
      // Create new user
      const newUser = {
        ...userData,
        nullifierHash,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
      }
      userDatabase.set(nullifierHash, newUser)

      return NextResponse.json({
        success: true,
        message: "New user created successfully.",
        userData: newUser,
        isReturningUser: false,
      })
    }
  } catch (error: any) {
    console.error("Error saving World ID data:", error)
    return NextResponse.json({ success: false, error: error.message || "Failed to save user data" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const nullifierHash = searchParams.get("nullifierHash")

    if (!nullifierHash) {
      return NextResponse.json({ success: false, error: "Nullifier hash is required" }, { status: 400 })
    }

    const userData = userDatabase.get(nullifierHash)

    if (userData) {
      return NextResponse.json({
        success: true,
        userData,
        exists: true,
      })
    } else {
      return NextResponse.json({
        success: true,
        userData: null,
        exists: false,
      })
    }
  } catch (error: any) {
    console.error("Error retrieving user data:", error)
    return NextResponse.json(
      { success: false, error: error.message || "Failed to retrieve user data" },
      { status: 500 },
    )
  }
}
