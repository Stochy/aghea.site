import { useEffect, useState } from "react";
import Image from "next/image";
import { Icon } from "@iconify/react";
import useSWR from "swr";

import type {
	NowPlayingResponseError,
	NowPlayingResponseSuccess
} from "../pages/api/nowPlaying";

interface SpotifyData {
  song: string;
  artist: string;
  album: string;
  album_art_url: string;
  track_id: string;
  timestamps: {
    start: number;
    end: number;
  } | null;
}

interface Artist {
  id: string;
  name: string;
  external_urls: {
    spotify: string;
  };
}

const formatDuration = (ms: number) => {
  const hours = Math.floor(ms / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return hours > 0
    ? `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
    : `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Spo() {
  const [spotifyData, setSpotifyData] = useState<SpotifyData | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const { data: lanyardData } = useSWR("/api/lanyard", fetcher, { refreshInterval: 5000 });
  const { data: nowPlayingData } = useSWR<NowPlayingResponseSuccess, NowPlayingResponseError>(
		"/api/nowPlaying",
		fetcher,
		{ refreshInterval: 5000 }
	);

  const fetchLanyardData = async () => {
    if (lanyardData?.data.listening_to_spotify && lanyardData?.data.spotify) {
      setSpotifyData(lanyardData.data.spotify);
    } else {
      setSpotifyData(null);
    }
  };

  useEffect(() => {
    fetchLanyardData();
  }, [lanyardData]);

  useEffect(() => {
    if (spotifyData?.timestamps) {
      const interval = setInterval(() => {
        const now = Date.now();
        if (spotifyData.timestamps) {
          const elapsed = now - spotifyData.timestamps.start;
          setElapsedTime(Math.min(elapsed, spotifyData.timestamps.end - spotifyData.timestamps.start));
          setIsPlaying(elapsed < spotifyData.timestamps.end - spotifyData.timestamps.start);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [spotifyData]);

  const [time, setTime] = useState(0);

  useEffect(() => {
    if (!nowPlayingData?.progessMs || !nowPlayingData.track) return;

    const started = Date.now();

    const interval = setInterval(() => {
      setTime(
        nowPlayingData.isPaused
          ? nowPlayingData.progessMs
          : Math.min(
              nowPlayingData.progessMs + Date.now() - started,
              nowPlayingData.track.duration_ms
            )
      );
    }, 100);

    return () => clearInterval(interval);
  }, [nowPlayingData]);

  // Handle the case when only Spotify API data is available
  if (!spotifyData || !spotifyData.timestamps) {
    if (lanyardData?.data.listening_to_spotify === false && nowPlayingData?.track) {
      return (
        <div className="flex gap-2 items-center text-base leading-snug">
          <div className="w-16 h-16 md:w-20 md:h-20 flex-shrink-0">
            <Image
              src={nowPlayingData.track.album.images[0]?.url ?? "/images/emptysong.jpg"}
              alt={`Album art for ${nowPlayingData.track.name}`}
              width={256}
              height={256}
              className="w-16 h-16 md:w-20 md:h-20 object-cover object-center rounded-lg"
            />
          </div>
          <div className="basis-full">
            <p>
              <a
                href={nowPlayingData.track.external_urls.spotify}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold border-b border-[#fff4] transition hover:border-white"
              >
                {nowPlayingData.track.name}
              </a>{" "}
              oleh{" "}
              {nowPlayingData.track.artists.map((artist: Artist, i: number) => (
                <span key={artist.id}>
                  <a
                    href={artist.external_urls.spotify}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border-b border-[#fff4] transition hover:border-white"
                  >
                    {artist.name}
                  </a>
                  {i < nowPlayingData.track.artists.length - 1 ? ", " : null}
                </span>
              ))}
            </p>
            <p className="opacity-80">
              Album{" "}
              <a
                href={nowPlayingData.track.album.external_urls.spotify}
                target="_blank"
                rel="noopener noreferrer"
                className="border-b border-[#fff4] transition hover:border-white"
              >
                {nowPlayingData.track.album.name}
              </a>
            </p>
          {nowPlayingData?.isPlayingNow && nowPlayingData.track ? (
						<span className="block w-full max-w-sm mt-2">
							<span className="block h-0.5 rounded overflow-hidden bg-[#5e5e5e]">
								<span
									className="block h-full bg-white"
									style={{
										width: `${
											(time! / nowPlayingData.track.duration_ms) *
											100
										}%`
									}}
								/>
							</span>
							<span className="flex items-center text-sm">
								<span className="basis-full">
									{formatDuration(time!)}
								</span>
								<span>
									{nowPlayingData?.isPaused ? (
										<Icon className="text-white h-4 w-4" icon="line-md:pause-to-play-transition" />
									) : (
										<Icon className="text-white h-4 w-4" icon="line-md:play-to-pause-transition" />
									)}
								</span>
								<span className="basis-full text-right">
									{formatDuration(nowPlayingData.track.duration_ms)}
								</span>
							</span>
						</span>
					) : (
						<>
            <span className="opacity-70 flex items-center">
              <Icon
                icon="simple-icons:spotify"
                width={48}
                height={48}
                className="mr-1 w-4 h-4"
              />
              {nowPlayingData?.track ? <>Terakhir diputar di </> : null}
              Spotify
            </span>
						</>
					)}
          </div>
        </div>
      );
    }
  }

  const duration = spotifyData?.timestamps?.end && spotifyData?.timestamps?.start
    ? spotifyData.timestamps.end - spotifyData.timestamps.start
    : 0; // Ensure duration is 0 if timestamps are null

  const trackUrl = spotifyData?.track_id ? `https://open.spotify.com/track/${spotifyData.track_id}` : '';

  return (
    <div className="mb-4">
      <div className="flex items-center text-base leading-snug gap-2">
        {/* Thumbnail */}
        <div className="w-16 h-16 md:w-20 md:h-20 flex-shrink-0 relative">
          <Image
            src={spotifyData?.album_art_url ?? '/images/emptysong.jpg'} // Default fallback
            alt={`Album art for ${spotifyData?.album}`}
            className="w-full h-full object-cover object-center rounded-lg"
            width={256}
            height={256}
          />
        </div>

        {/* Song Details and Play Icon */}
        <div className="flex flex-col justify-between flex-1">
          <div className="mt-2">
            <a
              href={trackUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white opacity-80 border-b border-[#fff4] transition hover:border-white"
            >
              {spotifyData?.song ?? 'Not Listening to Anything'}
            </a>
            <p className="text-sm opacity-65">{spotifyData?.artist}</p>
            <p className="text-sm opacity-50">{spotifyData?.album}</p>
          </div>

          {/* Progress Bar */}
          {spotifyData?.timestamps && (
            <div className="mt-2">
              <div className="w-full h-1 rounded overflow-hidden bg-[#5e5e5e]">
                <div
                  className="block h-full bg-white"
                  style={{ width: `${(elapsedTime / duration) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-xs opacity-60 mt-1">
                <span>{formatDuration(elapsedTime)}</span>
                <span>{formatDuration(duration)}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}