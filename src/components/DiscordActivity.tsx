import { useEffect, useState } from "react";
import Image from "next/image";
import { Icon } from "@iconify/react";

// Helper functions
const getElapsedTime = (start: number, duration: number) => {
  const currentTime = Date.now();
  const elapsedTime = Math.max(0, currentTime - start);
  return Math.min(elapsedTime, duration);
};

const formatDuration = (ms: number) => {
  const hours = Math.floor(ms / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return hours > 0
    ? `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
    : `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

const getThumbnailUrl = (imagePath: string) => {
  if (!imagePath) return "/images/emptysong.jpg";
  if (imagePath.includes("mp:external")) {
    const imageUrl = imagePath.split("mp:external/")[1];
    return `https://media.discordapp.net/external/${imageUrl}`;
  } else if (imagePath.includes("mp:attachments")) {
    const imageUrl = imagePath.split("attachments/")[1];
    return `https://cdn.discordapp.com/attachments/${imageUrl}`;
  }
  return "/images/emptysong.jpg";
};

const getActivityIcon = (name: string, state: string) => {
  if (name.toLowerCase().includes("youtube music")) return "simple-icons:youtubemusic";
  if (name.toLowerCase().includes("youtube")) return "simple-icons:youtube";
  if (name.toLowerCase().includes("tune")) return "akar-icons:music";
  if (name.toLowerCase().includes("spotify")) return "simple-icons:spotify";
  if (name.toLowerCase().includes("music")) return "simple-icons:applemusic";
  if (state.toLowerCase().includes("apple")) return "simple-icons:applepodcasts";
  return "streamline:entertainment-earpods-airpods-audio-earpods-music-earbuds-true-wireless";
};

interface Activity {
  id: string;
  name: string;
  type: number;
  state?: string;
  details?: string;
  timestamps?: {
    start?: number;
    end?: number;
  };
  assets?: {
    large_image?: string;
    large_text?: string;
    small_text?: string;
  };
}

interface LanyardData {
  activities?: Activity[];
  discord_status?: string;
}

export default function MusicActivity() {
  const [lanyardData, setLanyardData] = useState<LanyardData | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasMusicActivity, setHasMusicActivity] = useState(false);

  useEffect(() => {
    const fetchLanyardData = async () => {
      try {
        const res = await fetch("/api/lanyard");
        if (!res.ok) throw new Error("Failed to fetch Lanyard data");
        const data = await res.json();
        setLanyardData(data.data);
      } catch (error) {
        console.error("Error fetching Lanyard data:", error);
      }
    };

    fetchLanyardData();

    const interval = setInterval(fetchLanyardData, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      let playing = false;
      if (lanyardData?.activities) {
        const musicActivities = lanyardData.activities.filter(
          (activity) =>
            activity.name?.toLowerCase().includes("music") || activity.state?.toLowerCase().includes("apple") || activity.name?.toLowerCase().includes("tune") || activity.assets?.small_text?.toLowerCase().includes("spotify")
        );
        
        const youtubeActivities = lanyardData.activities.filter(
          (activity) =>
            activity.name?.toLowerCase().includes("youtube")
        );

        if (musicActivities.length > 0 || youtubeActivities.length > 0) {
          playing = true;
          const activity = musicActivities.length > 0 ? musicActivities[0] : youtubeActivities[0];
          const startTimestamp = activity.timestamps?.start;
          const endTimestamp = activity.timestamps?.end;

          if (startTimestamp && endTimestamp) {
            const duration = endTimestamp - startTimestamp;
            const currentElapsedTime = getElapsedTime(startTimestamp, duration);
            setElapsedTime(currentElapsedTime);
            setIsPlaying(currentElapsedTime < duration);
          } else {
            setIsPlaying(false);
            setElapsedTime(0);
          }
        }
      }
      setHasMusicActivity(playing);
    }, 1000);

    return () => clearInterval(interval);
  }, [lanyardData]);

  return (
    <div className="mb-4">
      {lanyardData && lanyardData.activities ? (
        hasMusicActivity ? (
          <div className="flex items-center text-base leading-snug gap-4">
            {lanyardData.activities.map((activity) => {
              const icon = getActivityIcon(activity.name, activity.state || "");
              const isMusicActivity =
                activity.name?.toLowerCase().includes("music") || activity.state?.toLowerCase().includes("apple") || activity.name?.toLowerCase().includes("tune") || activity.assets?.small_text?.toLowerCase().includes("spotify");
              const isYoutubeActivity =
                activity.name?.toLowerCase().includes("youtube");

              if (!isMusicActivity && !isYoutubeActivity) return null;

              const startTimestamp = activity.timestamps?.start;
              const endTimestamp = activity.timestamps?.end;
              const duration = startTimestamp && endTimestamp ? endTimestamp - startTimestamp : 0;

              return (
                <div key={activity.id} className="flex items-center gap-3">
                  {/* Thumbnail */}
                  <div className="w-16 h-16 md:w-20 md:h-20 flex-shrink-0 relative">
                    {activity.assets?.large_image && (
                      <Image
                        src={getThumbnailUrl(activity.assets.large_image)}
                        alt="Activity Thumbnail"
                        className="w-full h-full object-cover object-center rounded-lg"
                        width={256}
                        height={256}
                      />
                    )}
                  </div>

                  {/* Activity details and state */}
                  <div className="flex flex-col justify-between flex-1">
                    <div className="flex items-center gap-1">
                      <Icon
                        icon={icon}
                        width={24}
                        height={24}
                        className="opacity-80 w-4 h-4"
                      />
                      <a>{activity.name}</a>
                      <span className="ml-auto">
                        {isPlaying ? (
                          <Icon
                            icon="line-md:play-to-pause-transition"
                            className="h-5 w-5"
                          />
                        ) : (
                          <Icon
                            icon="line-md:pause-to-play-transition"
                            className="h-5 w-5"
                          />
                        )}
                      </span>
                    </div>
                    <div className="mt-2">
                      {(activity.type === 2 || activity.type === 3) && (
                        <div className="mt-1">
                          {activity.details && (
                          <p>
                            <a
                              className="opacity-80 border-b border-[#fff4] transition hover:border-white"
                              href={
                                activity.state?.toLowerCase().includes("on apple podcasts")
                                  ? `https://podcasts.apple.com/search?term=${encodeURIComponent(
                                      `${activity.details || ''} ${activity.state?.replace('on Apple Podcasts', '').trim() || ''}`
                                    )}`
                                  : activity.name.toLowerCase().includes("spotify")
                                  ? `https://open.spotify.com/search/results/${encodeURIComponent(
                                      `${activity.details}`
                                    )}`
                                  : isMusicActivity
                                  ? `https://music.youtube.com/search?q=${encodeURIComponent(
                                      `${activity.details} ${activity.state || ''}`
                                    )}`
                                  : `https://www.youtube.com/results?search_query=${encodeURIComponent(
                                      `${activity.details} ${activity.state || ''}`
                                    )}`
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {activity.details}
                            </a>{" "}
                            {!activity.state?.toLowerCase().includes("on apple podcasts") && (
                              <span className="opacity-60">oleh </span>
                            )}
                            <a
                              className="opacity-60 font-bold border-b border-[#fff4] transition hover:border-white"
                              href={
                                activity.state?.toLowerCase().includes("on apple podcasts")
                                  ? `https://podcasts.apple.com/search?term=${encodeURIComponent(
                                      `${activity.details || ''} ${activity.state?.replace('on Apple Podcasts', '').trim() || ''}`
                                    )}`
                                  : activity.name.toLowerCase().includes("spotify")
                                  ? `https://open.spotify.com/search/results/${encodeURIComponent(
                                      `${activity.state}`
                                    )}`
                                  : isMusicActivity
                                  ? `https://music.youtube.com/search?q=${encodeURIComponent(
                                      `${activity.details} ${activity.state || ''}`
                                    )}`
                                  : `https://www.youtube.com/results?search_query=${encodeURIComponent(
                                      activity.state?.toLowerCase().includes("by")
                                        ? activity.state.replace("by", "").trim()
                                        : activity.state || ''
                                    )}`
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {activity.state}
                            </a>
                          </p>
                          )}
                          {activity.assets?.large_text && (
                            <p className="opacity-60">
                              Album{" "}
                              <a
                                className="opacity-85 border-b border-[#fff4] transition hover:border-white"
                                href={
                                  isMusicActivity
                                    ? `https://music.youtube.com/search?q=${encodeURIComponent(
                                        `${activity.assets.large_text} ${activity.details || ''}`
                                      )}`
                                    : `https://www.youtube.com/results?search_query=${encodeURIComponent(activity.assets.large_text)}`
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {activity.assets.large_text}
                              </a>
                            </p>
                          )}
                        </div>
                      )}
                      <div className="mt-2">
                        {isPlaying && (
                          <div className="w-full h-1 rounded overflow-hidden bg-[#5e5e5e]">
                            <div
                              className="block h-full bg-white"
                              style={{
                                width: `${(elapsedTime / duration) * 100}%`,
                                backgroundColor: document.body.classList.contains("dark")
                                ? "#fff"
                                : "#000",
                              }}
                            />
                          </div>
                        )}
                        {isPlaying && (
                          <p className="text-xs opacity-60 mt-1">
                            <span className="flex items-center text-sm">
                              <span className="basis-full">
                                {formatDuration(elapsedTime)}
                              </span>
                              <span className="basis-full text-right">
                                {formatDuration(duration)}
                              </span>
                            </span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : null
        ) : null}
    </div>
  );
}