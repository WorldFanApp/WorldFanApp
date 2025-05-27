import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json({ success: false, error: "User ID is required" }, { status: 400 })
    }

    // Generate referral code based on user ID
    const referralCode = `WORLDFAN${userId.slice(-6).toUpperCase()}`

    return NextResponse.json({
      success: true,
      referralCode,
      message: "Referral code generated successfully",
    })
  } catch (error: any) {
    console.error("Error generating referral code:", error)
    return NextResponse.json(
      { success: false, error: error.message || "Failed to generate referral code" },
      { status: 500 },
    )
  }
}
