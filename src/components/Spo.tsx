import { useEffect, useState } from "react";
import Image from "next/image";
import { Icon } from "@iconify/react";

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

const formatDuration = (ms: number) => {
  const hours = Math.floor(ms / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return hours > 0
    ? `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
    : `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

export default function Spo() {
  const [spotifyData, setSpotifyData] = useState<SpotifyData | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const fetchLanyardData = async () => {
    try {
      const response = await fetch("/api/lanyard");
      const { data } = await response.json();
      if (data.listening_to_spotify) {
        setSpotifyData(data.spotify);
      } else {
        setSpotifyData(null);
      }
    } catch (error) {
      console.error("Error fetching Lanyard data:", error);
      setSpotifyData(null);
    }
  };

  useEffect(() => {
    fetchLanyardData();
    const interval = setInterval(fetchLanyardData, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (spotifyData && spotifyData.timestamps) {
      const interval = setInterval(() => {
        const now = Date.now();
        const elapsed = now - spotifyData.timestamps.start;
        setElapsedTime(Math.min(elapsed, spotifyData.timestamps.end - spotifyData.timestamps.start));
        setIsPlaying(elapsed < spotifyData.timestamps.end - spotifyData.timestamps.start);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [spotifyData]);

  if (!spotifyData || !spotifyData.timestamps) return null;

  const duration = spotifyData.timestamps.end - spotifyData.timestamps.start;
  const trackUrl = `https://open.spotify.com/track/${spotifyData.track_id}`;

  return (
    <div className="mb-4">
      <div className="flex items-center text-base leading-snug gap-2">
        {/* Thumbnail */}
        <div className="w-16 h-16 md:w-20 md:h-20 flex-shrink-0 relative">
          <Image
            src={spotifyData.album_art_url}
            alt={`Album art for ${spotifyData.album}`}
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
              {spotifyData.song}
            </a>
            <p className="text-sm opacity-65">{spotifyData.artist}</p>
            <p className="text-sm opacity-50">{spotifyData.album}</p>
          </div>

          {/* Progress Bar */}
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
        </div>
      </div>
    </div>
  );
}