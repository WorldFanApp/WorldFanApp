import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory cache for the token (consider a more robust solution for production)
let spotifyTokenCache = {
  accessToken: null as string | null,
  expiresAt: 0 as number, // Timestamp when the token expires
};

async function getSpotifyToken(): Promise<string | null> {
  const now = Date.now();
  if (spotifyTokenCache.accessToken && now < spotifyTokenCache.expiresAt) {
    // console.log("Using cached Spotify token");
    return spotifyTokenCache.accessToken;
  }

  // console.log("Fetching new Spotify token");
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.error("Spotify client ID or secret not configured.");
    return null;
  }

  const authOptions = {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials'
  };

  try {
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', authOptions);
    if (!tokenResponse.ok) {
      const errorBody = await tokenResponse.text();
      console.error(`Spotify token API error: ${tokenResponse.status} - ${errorBody}`);
      return null;
    }
    const tokenData = await tokenResponse.json();
    if (!tokenData.access_token || !tokenData.expires_in) {
      console.error("Invalid token data received from Spotify:", tokenData);
      return null;
    }

    spotifyTokenCache.accessToken = tokenData.access_token;
    // Calculate expiry time, subtracting a small buffer (e.g., 60 seconds)
    spotifyTokenCache.expiresAt = now + (tokenData.expires_in * 1000) - 60000;

    // console.log("New Spotify token fetched and cached:", spotifyTokenCache.accessToken);
    return spotifyTokenCache.accessToken;
  } catch (error) {
    console.error("Error fetching Spotify token:", error);
    return null;
  }
}

export async function GET(req: NextRequest) {
  // Check for environment variables at the start
  if (!process.env.SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_CLIENT_SECRET) {
    console.error("SPOTIFY_CLIENT_ID or SPOTIFY_CLIENT_SECRET is not set.");
    return NextResponse.json({ error: "Server configuration error: Spotify API credentials missing." }, { status: 500 });
  }

  const { searchParams } = new URL(req.url);
  const query = searchParams.get('query');

  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
  }

  const accessToken = await getSpotifyToken();
  if (!accessToken) {
    return NextResponse.json({ error: 'Failed to retrieve Spotify access token' }, { status: 503 });
  }

  const searchUrl = `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=artist&limit=5`;

  try {
    const spotifyResponse = await fetch(searchUrl, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (!spotifyResponse.ok) {
      const errorBody = await spotifyResponse.text();
      console.error(`Spotify search API error: ${spotifyResponse.status} - ${errorBody}`);
      return NextResponse.json({ error: `Spotify API error: ${spotifyResponse.statusText}`, details: errorBody }, { status: spotifyResponse.status });
    }

    const spotifyData = await spotifyResponse.json();

    // Extract relevant artist data
    const artists = spotifyData.artists?.items.map((artist: any) => ({
      id: artist.id,
      name: artist.name,
      images: artist.images,
      genres: artist.genres,
      popularity: artist.popularity,
      uri: artist.uri, // Spotify URI e.g., spotify:artist:123
    })) || [];

    return NextResponse.json(artists);

  } catch (error) {
    console.error("Error making request to Spotify search API:", error);
    if (error instanceof Error) {
        return NextResponse.json({ error: "Failed to fetch data from Spotify", details: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "An unknown error occurred while fetching from Spotify" }, { status: 500 });
  }
}
