import { useEffect, useState } from "react";
import Image from "next/image";
import { Icon } from "@iconify/react";
import formatDistanceStrict from "date-fns/formatDistanceStrict";

// Activity types
const activityTypes = [
  "Playing",
  "Streaming",
  "Listening to",
  "Watching",
  "Custom Status: ",
  "Competing in",
];

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

const getActivityIcon = (name: string) => {
  if (name.toLowerCase().includes("youtube music")) return "simple-icons:youtubemusic";
  if (name.toLowerCase().includes("youtube")) return "simple-icons:youtube";
  if (name.toLowerCase().includes("apple")) return "simple-icons:applemusic";
  return "akar-icons:music-album-fill";
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

export default function MusicActivity() {
  const [lanyardData, setLanyardData] = useState<LanyardData | null>(null);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasActivity, setHasActivity] = useState(false);

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
        const filteredActivities = lanyardData.activities.filter(
          (activity) =>
            activity.type === 0 ||
            activity.name?.toLowerCase().includes("music") ||
            activity.name?.toLowerCase().includes("youtube")
        );

        if (filteredActivities.length > 0) {
          playing = true;
          const activity = filteredActivities[0];
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
      setHasActivity(playing);
    }, 1000);

    return () => clearInterval(interval);
  }, [lanyardData]);

  if (!lanyardData || !lanyardData.activities || !hasActivity) {
    return null; // Hide the component if no activity
  }

  return (
    <div className="mb-4">
      <div className="flex items-center text-base leading-snug gap-4">
        {lanyardData.activities
          .filter(
            (activity) =>
              activity.type === 0 ||
              activity.name?.toLowerCase().includes("music") ||
              activity.name?.toLowerCase().includes("youtube")
          )
          .map((activity) => {
            const startTimestamp = activity.timestamps?.start;
            const endTimestamp = activity.timestamps?.end;
            const duration = startTimestamp && endTimestamp ? endTimestamp - startTimestamp : 0;

            const isMusicOrYoutube =
              activity.name?.toLowerCase().includes("music") ||
              activity.name?.toLowerCase().includes("youtube");

            return (
              <div key={activity.id} className="flex items-center gap-3">
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
                <div className="flex-col justify-between">
                  <div className="flex items-center gap-1">
                    {isMusicOrYoutube && (
                      <Icon
                        icon={getActivityIcon(activity.name)}
                        width={24}
                        height={24}
                        className="opacity-80 w-4 h-4"
                      />
                    )}
                    <span className="opacity-80">{activityTypes[activity.type] || "Unknown"}</span>{" "}
                    <span className="opacity-95">{activity.name}</span>{" "}
                    {!isMusicOrYoutube && activity.timestamps?.start && (
                      <span className="opacity-80">
                        for{" "}
                        {formatDistanceStrict(
                          now,
                          activity.timestamps.start
                        )}
                      </span>
                    )}
                    {isMusicOrYoutube && (
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
                    )}
                  </div>
                  <div className="mt-2">
                    <div className="mt-1">
                      {activity.details && (
                        <p>
                          <a
                            className="opacity-80 border-b border-[#fff4] transition hover:border-white"
                            href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
                              `${activity.details} ${activity.state || ""}`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {activity.details}
                          </a>{" "}
                          {activity.state && (
                            <a className="opacity-60 font-bold">{activity.state}</a>
                          )}
                        </p>
                      )}
                      {activity.assets?.large_text && (
                        <p className="opacity-60">
                          Album{" "}
                          <a
                            className="opacity-85 border-b border-[#fff4] transition hover:border-white"
                            href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
                              activity.assets.large_text
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {activity.assets.large_text}
                          </a>
                        </p>
                      )}
                    </div>
                    {isMusicOrYoutube && isPlaying && (
                      <>
                        <div className="w-full h-1 rounded overflow-hidden bg-[#5e5e5e]">
                          <div
                            className="block h-full bg-white"
                            style={{
                              width: `${(elapsedTime / duration) * 100}%`,
                            }}
                          />
                        </div>
                        <p className="text-xs opacity-60 mt-1">
                          <span className="flex items-center text-sm">
                            <span className="basis-full">{formatDuration(elapsedTime)}</span>
                            <span className="basis-full text-right">
                              {formatDuration(duration)}
                            </span>
                          </span>
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}