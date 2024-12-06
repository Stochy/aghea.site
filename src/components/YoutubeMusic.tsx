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
  };
}

interface LanyardData {
  activities?: Activity[];
  discord_status?: string;
}

// Component
export default function YouTubeMusicActivity() {
  const [lanyardData, setLanyardData] = useState<LanyardData | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

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
  
    const interval = setInterval(fetchLanyardData, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);
  
  useEffect(() => {
    const interval = setInterval(() => {
      if (lanyardData?.activities) {
        const youtubeMusicActivities = lanyardData.activities.filter((activity) =>
          activity.name?.includes("YouTube")
        );
  
        if (youtubeMusicActivities?.length > 0) {
          const activity = youtubeMusicActivities[0];
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
    }, 1000);
  
    return () => clearInterval(interval);
  }, [lanyardData]);

  // Render
  return (
    <div className="mb-4">
      {lanyardData ? (
        <div>
          {lanyardData?.activities?.some((activity: any) =>
            activity.name?.includes("YouTube")
          ) && (
            <div className="flex gap-2 items-center text-base leading-snug">
              {lanyardData.activities.map((activity: any) => {
                if (!activity.name?.includes("YouTube")) return null;

                const startTimestamp = activity.timestamps?.start;
                const endTimestamp = activity.timestamps?.end;
                const duration = startTimestamp && endTimestamp ? endTimestamp - startTimestamp : 0;

                return (
                  <div key={activity.id} className="text-sm text-white">
                    <div className="flex items-center gap-3">
                      {activity.assets?.large_image && (
                        <Image
                          src={getThumbnailUrl(activity.assets.large_image)}
                          alt="Song Thumbnail"
                          className="w-16 h-16 md:w-20 md:h-20 object-cover object-center rounded-lg"
                          width={65}
                          height={65}
                        />
                      )}
                      <div className="flex flex-col justify-between flex-1">
                        <p className="truncate whitespace-nowrap">
                          <span className="opacity-95 flex items-center gap-2">
                            <Icon
                              icon={
                                activity.type === 2
                                  ? "simple-icons:youtubemusic"
                                  : "simple-icons:youtube"
                              }
                              width={48}
                              height={48}
                              className="opacity-80 w-4 h-4"
                            />
                            {activity.name}
                            <span className="ml-auto">
                              {isPlaying ? (
                                <Icon
                                  icon="line-md:play-to-pause-transition"
                                  className="text-white h-5 w-5"
                                />
                              ) : (
                                <Icon
                                  icon="line-md:pause-to-play-transition"
                                  className="text-white h-5 w-5"
                                />
                              )}
                            </span>
                          </span>
                        </p>
                        {(activity.type === 2 || activity.type === 3) && (
                          <div className="mt-1">
                            {activity.details && (
                              <p>
                                <a
                                  className="opacity-80 border-b border-[#fff4] transition hover:border-white"
                                  href={
                                    activity.name.includes("YouTube Music")
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
                                <a className="opacity-60 border-[#fff4] transition hover:border-white">
                                  {!activity.state?.toLowerCase().includes("by") && " oleh "}
                                </a>{" "}
                                <a className="opacity-60 font-bold border-b border-[#fff4] transition hover:border-white"
                                  href={
                                    activity.name.includes("YouTube Music")
                                      ? `https://music.youtube.com/search?q=${encodeURIComponent(
                                          `${activity.details} ${activity.state || ''}`
                                        )}`
                                      : `https://www.youtube.com/results?search_query=${encodeURIComponent(
                                          `${activity.state?.toLowerCase().includes("by") ? activity.state.replace("by", "").trim() : activity.state || ''}`
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
                                    activity.name.includes("YouTube Music")
                                      ? `https://music.youtube.com/search?q=${encodeURIComponent(activity.assets.large_text)}`
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
          )}
        </div>
      ) : (
        <div className="w-32 opacity-80"></div>
      )}
    </div>
  );
}