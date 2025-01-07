import { NextApiRequest, NextApiResponse } from "next";

export type TopMusicResponseSuccess = {
  short: any;
  medium: any;
  long: any;
  topArtists: SpotifyApi.ArtistObjectFull[];
  playlists: SpotifyApi.PlaylistObjectSimplified[];
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

const fetchPlaylists = async (accessToken: string) => {
  const data = await fetchFromSpotify(`${SPOTIFY_API_URL}/me/playlists`, accessToken);
  return data.items;
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

    if (!cached || Date.now() > cachedTime) {
      const [topArtists, short, medium, long, playlists] = await Promise.all([
        fetchTopArtists(accessToken),
        fetchFromSpotify(`${SPOTIFY_API_URL}/me/top/tracks?limit=30&time_range=short_term`, accessToken),
        fetchFromSpotify(`${SPOTIFY_API_URL}/me/top/tracks?limit=30&time_range=medium_term`, accessToken),
        fetchFromSpotify(`${SPOTIFY_API_URL}/me/top/tracks?limit=30&time_range=long_term`, accessToken),
        fetchPlaylists(accessToken),
      ]);

      cached = {
        short,
        medium,
        long,
        topArtists,
        playlists,
      };

      cachedTime = Date.now() + 24 * 60 * 60 * 1000; // Cache for 24 hours
    }

    res.status(200).json(cached);
  } catch (err) {
    res.status(500).json({ error: (err as any)?.message });
  }
}