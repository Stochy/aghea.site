import { useEffect, useState } from "preact/hooks";
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
  const imageUrl = imagePath.split("mp:external/")[1]; // Extract the URL after "mp:external/"
  return `https://media.discordapp.net/external/${imageUrl}`;
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
          const startTimestamp = activity.timestamps?.start || 0;
          const endTimestamp = activity.timestamps?.end || 0;
          const duration = endTimestamp - startTimestamp;
          const currentElapsedTime = getElapsedTime(startTimestamp, duration);

          setElapsedTime(currentElapsedTime);
          setIsPlaying(currentElapsedTime < duration); // Determine if the song is still playing
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
            <div className="mt-2 p-3 bg-transparent border border-gray-500 rounded-lg shadow-lg">
              {lanyard.activities.map((activity) => {
                if (!activity.name?.includes("YouTube Music")) return null;

                const startTimestamp = activity.timestamps?.start || 0;
                const endTimestamp = activity.timestamps?.end || 0;
                const duration = endTimestamp - startTimestamp;

                return (
                  <div key={activity.id} className="text-sm text-white">
                    <div className="flex items-center gap-3">
                      {activity.assets?.large_image && (
                        <img
                          src={getThumbnailUrl(activity.assets.large_image)} // External URL for thumbnail
                          alt="Song Thumbnail"
                          className="w-12 h-12 rounded-lg"
                        />
                      )}
                      <div className="flex flex-col justify-between flex-1">
                        <p className="truncate whitespace-nowrap">
                          <span className="opacity-95 flex items-center gap-2">
                            <Icon icon="simple-icons:youtubemusic" className="opacity-80" />
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
                              <p className="opacity-80 items-center gap-2">
                                {activity.state} – {activity.details}
                              </p>
                            )}
                          </div>
                        )}
                        {duration > 0 && (
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
                                  {formatDuration(duration)}
                                </span>
                              </span>
                            </p>
                          </div>
                        )}
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