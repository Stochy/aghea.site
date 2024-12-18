// pages/api/nowPlaying.js

import { NextApiRequest, NextApiResponse } from "next";

export interface NowPlayingResponseSuccess {
  isPlayingNow: boolean;
  isPaused: boolean;
  progessMs: number;
  item: any | null;
  recentlyPlayed: boolean; // Add this flag
}
export type NowPlayingResponseError = { error: unknown };
export type NowPlayingResponse =
  | NowPlayingResponseSuccess
  | NowPlayingResponseError;

let accessToken: string | null = null; 
let expirationTime = 0; 

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<NowPlayingResponse>
) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed." });
    return;
  }

  try {
    // Refresh access token if expired or not set
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

    // Construct the API URL with necessary parameters and headers
    const apiUrl = `https://api.spotify.com/v1/me/player/currently-playing?additional_types=track,episode`; 
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    // Fetch data directly from the URL
    const playingResponse = await fetch(apiUrl, { headers });


    let response: NowPlayingResponseSuccess = {
      isPlayingNow: false,
      isPaused: false,
      progessMs: 0,
      item: null,
      recentlyPlayed: false, // Add this flag
    };

    if (playingResponse.status === 204) {
      // No song is currently playing, fetch recently played
      const recentlyPlayedUrl = `https://api.spotify.com/v1/me/player/recently-played?limit=1`;
      const recentlyPlayedResponse = await fetch(recentlyPlayedUrl, {
        headers,
      });
      const recentlyPlayedData = await recentlyPlayedResponse.json();

      if (recentlyPlayedData?.items[0]) {
        response.item = recentlyPlayedData.items[0].track;
        response.recentlyPlayed = true; // Set the flag to true
      }
    } else if (playingResponse.ok) {
      const playingData = await playingResponse.json();
      response.isPlayingNow = true;
      response.item = playingData.item;
      response.isPaused = !playingData.is_playing;
      response.progessMs = playingData.progress_ms ?? 0;
    } else {
      throw new Error(`Spotify API request failed with status ${playingResponse.status}`);
    }

    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ error: (err as any)?.message });
  }
}
