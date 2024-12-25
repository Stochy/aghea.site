import { NextApiRequest, NextApiResponse } from "next";

export type TopMusicResponseSuccess = {
  short: any;
  medium: any;
  long: any;
  trackPlayCounts: Record<string, number>;
  artistPlayTimes: Record<string, number>;
  topArtists: SpotifyApi.ArtistObjectFull[];
};

export type TopMusicResponseError = { error: unknown };
export type TopMusicResponse = TopMusicResponseSuccess | TopMusicResponseError;

const SPOTIFY_API_URL = 'https://api.spotify.com/v1';

let accessToken: string | null = null;
let expirationTime = 0;
let cachedTime = 0;
let cached: TopMusicResponseSuccess | undefined;

const fetchFromSpotify = async (url: string, accessToken: string) => {
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!response.ok) throw new Error(`Failed to fetch from ${url}`);
  return response.json();
};

const fetchAllRecentlyPlayedTracks = async (accessToken: string) => {
  let allTracks: any[] = [];
  let hasMoreTracks = true;
  let before: string | null = null;

  while (hasMoreTracks) {
    const url = `${SPOTIFY_API_URL}/me/player/recently-played?limit=30${before ? `&before=${before}` : ''}`;
    const data = await fetchFromSpotify(url, accessToken);
    allTracks = [...allTracks, ...data.items];
    before = data.items.length ? data.items[data.items.length - 1].played_at : null;
    hasMoreTracks = data.items.length >= 50;
  }

  return allTracks;
};

const fetchTopArtists = async (accessToken: string) => {
  const data = await fetchFromSpotify(`${SPOTIFY_API_URL}/me/top/artists?limit=30`, accessToken);
  return data.items;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<TopMusicResponse>) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed." });

  try {
    if (Date.now() > expirationTime || !accessToken) {
      const refreshUrl = "https://accounts.spotify.com/api/token";
      const refreshHeaders = {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(
          `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
        ).toString("base64")}`,
      };
      const refreshBody = new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: process.env.SPOTIFY_REFRESH_TOKEN!,
      });

      const refreshResponse = await fetch(refreshUrl, {
        method: "POST",
        headers: refreshHeaders,
        body: refreshBody,
      });

      const refreshData = await refreshResponse.json();
      accessToken = refreshData.access_token;
      expirationTime = Date.now() + refreshData.expires_in * 1000;
    }

    if (!accessToken) {
      res.status(400).json({ error: "Access token is missing." });
      return;
    }

    // Serve cached data if available and not expired
    if (!cached || Date.now() > cachedTime) {
      const [topArtists, short, medium, long, recentTracks] = await Promise.all([
        fetchTopArtists(accessToken),
        fetchFromSpotify(`${SPOTIFY_API_URL}/me/top/tracks?limit=30&time_range=short_term`, accessToken),
        fetchFromSpotify(`${SPOTIFY_API_URL}/me/top/tracks?limit=30&time_range=medium_term`, accessToken),
        fetchFromSpotify(`${SPOTIFY_API_URL}/me/top/tracks?limit=30&time_range=long_term`, accessToken),
        fetchAllRecentlyPlayedTracks(accessToken),
      ]);

      const trackPlayCounts: Record<string, number> = {};
      const artistPlayTimes: Record<string, number> = {};

      // Calculate play counts for tracks and playtimes for artists
      recentTracks.forEach((item) => {
        const { id, duration_ms } = item.track;
        trackPlayCounts[id] = (trackPlayCounts[id] || 0) + 1;
        item.track.artists.forEach((artist: { name: string }) => {
          artistPlayTimes[artist.name] = (artistPlayTimes[artist.name] || 0) + duration_ms;
        });
      });

      cached = {
        short,
        medium,
        long,
        trackPlayCounts,
        artistPlayTimes,
        topArtists,
      };

      cachedTime = Date.now() + 24 * 60 * 60 * 1000; // Cache for 24 hours
    }

    res.status(200).json(cached);
  } catch (err) {
    res.status(500).json({ error: (err as any)?.message });
  }
}