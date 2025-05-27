"use server"

export async function saveUserData(userData: any) {
  try {
    // Check for World App authentication
    if (!userData.worldIdData || !userData.worldId) {
      return {
        success: false,
        error: "World App authentication is required. No user data will be saved without valid authentication.",
      }
    }

    console.log("World App authentication successful, saving user data:", {
      worldId: userData.worldId,
      username: userData.username,
      email: userData.email,
      cities: userData.cities,
      genres: userData.genres,
      favoriteArtists: userData.favoriteArtists,
      ticketStruggles: userData.ticketStruggles,
      priceRange: userData.priceRange,
      notifications: userData.notifications,
      platform: userData.worldIdData.platform,
      timestamp: new Date().toISOString(),
    })

    // Here you would save to your database
    // Only save data after successful World App authentication

    return {
      success: true,
      message: "World App authentication successful. Welcome to World Fan!",
      verificationLevel: userData.worldIdData.verification_level || "world_app",
    }
  } catch (error) {
    console.error("Error saving user data:", error)
    return {
      success: false,
      error: "Failed to save user data. Please try again.",
    }
  }
}
