import { Buffer } from 'buffer'; // Node.js Buffer

const clientId = "3a293576826d4b4392082b4cd8b71178";
const clientSecret = "97fe10d19f2e4eafa1a5b44964701204";

interface SpotifyToken {
  access_token: string;
  token_type: string;
  expires_in: number;
  fetched_at: number; // Timestamp when token was fetched
}

let token: SpotifyToken | null = null;

async function getAccessToken(): Promise<string | null> {
  // Check if token exists and is still valid (e.g., expires in more than 60 seconds)
  if (token && token.fetched_at + (token.expires_in - 60) * 1000 > Date.now()) {
    return token.access_token;
  }

  const authString = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  try {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${authString}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });

    if (!response.ok) {
      console.error("Spotify Auth Error:", response.status, await response.text());
      token = null; // Invalidate token on error
      return null;
    }

    const data = await response.json();
    token = { ...data, fetched_at: Date.now() };
    return token!.access_token;
  } catch (error) {
    console.error("Error fetching Spotify access token:", error);
    token = null; // Invalidate token on error
    return null;
  }
}

interface SpotifyArtist {
  id: string;
  name: string;
  // Add other fields if needed, e.g., images, popularity
}

interface SpotifySearchResponse {
  artists: {
    items: SpotifyArtist[];
    // other pagination fields if needed
  };
}

export async function searchArtists(query: string, limit: number = 5): Promise<SpotifyArtist[]> {
  if (!query) {
    return [];
  }

  const accessToken = await getAccessToken();
  if (!accessToken) {
    console.error("No access token available for Spotify API.");
    return [];
  }

  try {
    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=artist&limit=${limit}`,
      {
        headers: {
          "Authorization": `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      console.error("Spotify Search Error:", response.status, await response.text());
      return [];
    }

    const data: SpotifySearchResponse = await response.json();
    return data.artists.items;
  } catch (error) {
    console.error("Error searching Spotify artists:", error);
    return [];
  }
}
