import { useEffect, useState } from "preact/hooks";
import Image from "next/future/image";
import { useLanyard } from "react-use-lanyard";
import { Icon } from '@iconify/react';

// Calculate elapsed time
const getElapsedTime = (start: number, duration: number) => {
  const currentTime = Date.now();
  const elapsedTime = Math.max(0, currentTime - start); // Elapsed time since the song started
  return Math.min(elapsedTime, duration); // Ensure elapsed time doesn't exceed the duration
};

// Format time to MM:SS
const formatDuration = (ms: number) => {
  const minutes = Math.floor(ms / 60000); // Convert milliseconds to minutes
  const seconds = Math.floor((ms % 60000) / 1000); // Convert the remaining milliseconds to seconds
  return `${minutes}:${seconds.toString().padStart(2, "0")}`; // Return formatted string (e.g., "2:30")
};

// Extract external URL for thumbnail image
const getThumbnailUrl = (imagePath: string) => {
  if (!imagePath) return "/images/emptysong.jpg"; // Return the fallback if imagePath is falsy (null or undefined)

  // Check if imagePath contains "mp:external" or "attachments"
  if (imagePath.includes("mp:external")) {
    const imageUrl = imagePath.split("mp:external/")[1]; // Extract the URL after "mp:external/"
    return `https://media.discordapp.net/external/${imageUrl}`;
  } else if (imagePath.includes("mp:attachments")) {
    // If it's an attachment URL, return the appropriate path
    const imageUrl = imagePath.split("attachments/")[1]; // Extract the URL after "attachments/"
    return `https://cdn.discordapp.com/attachments/${imageUrl}`;
  }

  return "/images/emptysong.jpg"; // Fallback if no valid format is found
};

const USER_ID = "982268021143896064";

export default function YouTubeMusicActivity() {
  const { status: lanyard } = useLanyard({
    userId: USER_ID,
    socket: true,
  });

  const [elapsedTime, setElapsedTime] = useState(0); // Store the elapsed time
  const [isPlaying, setIsPlaying] = useState(false); // Track if the song is playing

  // Update elapsed time every second
  useEffect(() => {
    const interval = setInterval(() => {
      if (lanyard) {
        const youtubeMusicActivities = lanyard?.activities.filter(
          (activity) => activity.name?.includes("YouTube Music")
        );

        if (youtubeMusicActivities?.length > 0) {
          const activity = youtubeMusicActivities[0];
          const startTimestamp = activity.timestamps?.start || activity.created_at;
          const endTimestamp = activity.timestamps?.end;
          const duration = endTimestamp ? endTimestamp - startTimestamp : Date.now() - startTimestamp;
          const currentElapsedTime = getElapsedTime(startTimestamp, duration);

          setElapsedTime(currentElapsedTime);
          setIsPlaying(endTimestamp ? currentElapsedTime < duration : true); // Determine if the song is still playing
        }
      }
    }, 1000); // Update every second

    return () => clearInterval(interval); // Clear interval on component unmount
  }, [lanyard]);

  return (
    <div className="mb-4">
      {lanyard ? (
        <div>
          {lanyard?.activities?.some((activity) => activity.name?.includes("YouTube Music")) && (
            <div className="flex gap-2 items-center text-base leading-snug">
              {lanyard.activities.map((activity) => {
                if (!activity.name?.includes("YouTube Music")) return null;

                const startTimestamp = activity.timestamps?.start || activity.created_at;
                const endTimestamp = activity.timestamps?.end;
                const duration = endTimestamp ? endTimestamp - startTimestamp : Date.now() - startTimestamp;

                return (
                  <div key={activity.id} className="text-sm text-white">
                    <div className="flex items-center gap-3">
                      {activity.assets?.large_image && (
                        <Image
                          src={getThumbnailUrl(activity.assets.large_image)} // External URL for thumbnail or fallback
                          alt="Song Thumbnail"
                          className="w-16 h-16 md:w-20 md:h-20 object-cover object-center rounded-lg"
                          width={256}
                          height={256}
                        />
                      )}
                      <div className="flex flex-col justify-between flex-1">
                        <p className="truncate whitespace-nowrap">
                          <span className="opacity-95 flex items-center gap-2">
                            <Icon icon="simple-icons:youtubemusic" width={48} height={48} className="opacity-80 w-4 h-4" />
                            {activity.name}
                            <span className="ml-auto">
                              {isPlaying ? (
                                <Icon icon="line-md:play-to-pause-transition" className="text-white h-5 w-5" />
                              ) : (
                                <Icon icon="line-md:pause-to-play-transition" className="text-white h-5 w-5" />
                              )}
                            </span>
                          </span>
                        </p>
                        {activity.type === 2 && (
                          <div className="mt-1">
                            {activity.details && (
                              <p>
                                <a className="opacity-80 border-b border-[#fff4] transition hover:border-white">
                                  {activity.details}
                                </a>{" "}
                                <a className="opacity-60 border-[#fff4] transition hover:border-white">{!activity.state.toLowerCase().includes("by") && <> oleh </>}</a>{" "}
                                <a className="opacity-60  font-bold border-b border-[#fff4] transition hover:border-white">
                                  {activity.state}
                                </a>
                              </p>
                            )}
                            {activity.assets?.large_text && (
                              <p className="opacity-60">
                                Album{" "}
                                <a className="opacity-85 border-b border-[#fff4] transition hover:border-white">
                                  {activity.assets.large_text}
                                </a>
                              </p>
                            )}
                          </div>
                        )}
                        <div className="mt-2">
                          {/* Progress bar */}
                          <div className="w-full h-1 rounded overflow-hidden bg-[#5e5e5e]">
                            <div
                              className="block h-full bg-white"
                              style={{
                                width: `${(elapsedTime / duration) * 100}%`, // Fill the bar based on elapsed time
                              }}
                            />
                          </div>
                          <p className="text-xs opacity-60 mt-1">
                            <span className="flex items-center text-sm">
                              <span className="basis-full">
                                {formatDuration(elapsedTime)}
                              </span>
                              <span className="basis-full text-right">
                                {endTimestamp ? formatDuration(duration) : "--:--"}
                              </span>
                            </span>
                          </p>
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