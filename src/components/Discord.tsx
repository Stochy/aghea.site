import { useEffect, useState } from "react";
import Image from "next/future/image";
import Link from "next/link";
import { Icon } from '@iconify/react';
import formatDistanceStrict from "date-fns/formatDistanceStrict";

const statusColors: Record<string, string> = {
  online: "bg-emerald-500",
  idle: "bg-amber-400",
  dnd: "bg-rose-400",
};

const getThumbnailUrl = (imagePath: string, applicationId?: string) => {
  if (!imagePath && !applicationId) return "/images/2872585.png";
  
  // Handle Spotify-specific images
  if (imagePath.startsWith("spotify:")) {
    const spotifyImageId = imagePath.split(":")[1];
    return `https://i.scdn.co/image/${spotifyImageId}`;
  }

  // If the applicationId and large_image are available, form the URL
  if (applicationId && imagePath) {
    return `https://cdn.discordapp.com/app-assets/${applicationId}/${imagePath}.png?size=160`;
  }

  // Handle external images
  if (imagePath.includes("mp:external")) {
    const imageUrl = imagePath.split("mp:external/")[1];
    return `https://media.discordapp.net/external/${imageUrl}`;
  } 
  // Handle attachments
  else if (imagePath.includes("mp:attachments")) {
    const imageUrl = imagePath.split("attachments/")[1];
    return `https://cdn.discordapp.com/attachments/${imageUrl}`;
  }

  // Default fallback
  return "/images/2872585.png";
};

const getStatusColor = (status: string | undefined) => {
  if (!status) return "bg-gray-400";
  const str = statusColors[status];
  return str || "bg-gray-400";
};

const capitalize = (str: string) => {
  return str[0].toUpperCase() + str.slice(1);
};

export default function Discord() {
  const [lanyard, setLanyard] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch the Lanyard data from the Next.js API route
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/lanyard");
        if (!res.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await res.json();
        setLanyard(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load data");
        setLoading(false);
      }
    };
  
    // Fetch the initial data
    fetchData();
  
    // Set up polling every 5 seconds (5000ms)
    const interval = setInterval(() => {
      fetchData();
    }, 5000);
  
    return () => clearInterval(interval); // Clean up the interval when the component unmounts
  }, []);

  if (loading) return <div></div>;
  if (error) return <div>{error}</div>;

  const { USER_ID, data } = lanyard || {};

  // Filter out the activities for non-Spotify and non-custom statuses
  const otherActivities = data?.activities.filter(
    (activity: any) => activity.type !== 2 && activity.type !== 4
  );

  return (
    <div className="mb-4 flex gap-2 items-center text-base leading-snug">
      {data?.discord_user.avatar ? (
          <div className="w-16 h-16 md:w-20 md:h-20 flex-shrink-0 relative group">
            {/* Avatar */}
            <Link href="/discord">
              <Image
                src={`https://cdn.discordapp.com/avatars/${data?.discord_user.id}/${
                  data?.discord_user.avatar
                }.${
                  data?.discord_user.avatar.startsWith("a_") ? "gif" : "webp"
                }?size=256`}
                alt="Discord Avatar"
                width={256}
                height={256}
                priority={true}
                className="rounded-full"
                onContextMenu={(e) => e.preventDefault()}
              />
            </Link>
          
            {/* Avatar decoration */}
            {data?.discord_user.avatar_decoration_data?.asset && (
              <Image
                src={`https://cdn.discordapp.com/avatar-decoration-presets/${data.discord_user.avatar_decoration_data.asset}.png?size=80&passthrough=true`}
                alt="Avatar Decoration"
                width={320}
                height={320}
                className="absolute inset-0 pointer-events-none translate-x-[-0px] scale-125"
                onContextMenu={(e) => e.preventDefault()}
              />
            )}
          
            {/* Status Indicator */}
            <div
            className={`absolute bottom-0.5 right-0.5 w-3 h-3 md:w-4 md:h-4 rounded-full ring-[3px] md:ring-4 ring-black ${getStatusColor(
              data?.discord_status
            )}`}
          >
            <div className="text-white text-sm absolute z-10 mb-1 px-2 py-1 bg-slate-900 opacity-0 group-hover:opacity-100 transition pointer-events-none bottom-full rounded-lg w-max">
              {capitalize(data?.discord_status)} on{" "}
              {data?.active_on_discord_mobile ? "Mobile" : "Desktop"}
            </div>
          </div>
        </div>
      ) : (
        <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-800 rounded-full"></div>
      )}
      <div>
        <p>
          {data?.discord_user.display_name}
          <span className="ml-2 opacity-50">
            <Link href="/discord">
              <a
                target="_blank"
                rel="noopener noreferrer"
                className="border-b border-[#fff4] transition hover:border-white"
              >
                {data?.discord_user.username}
              </a>
            </Link>
          </span>
        </p>
        <p>
          <span className="opacity-70">
            {data?.activities[0]?.type === 4
              ? data?.activities[0]?.state
              : null}
          </span>
        </p>
        <OtherActivities activities={otherActivities} />
      </div>
    </div>
  );
}

// Activity types
const activityTypes = [
  "Playing",
  "Streaming",
  "Listening to",
  "Watching",
  "Custom Status: ",
  "Competing in",
];

// Activity name for a given activity type
const getActivityType = (type: number) => {
  return activityTypes[type];
};

interface OtherActivitiesProps {
  activities: any[] | undefined;
}

const getIconByActivityName = (name: string) => {
  if (name.includes("Spotify")) {
    return "simple-icons:spotify";
  } else if (name.includes("YouTube Music")) {
    return "simple-icons:youtubemusic";
  } else if (name.includes("YouTube")) {
    return "simple-icons:youtube";
  } else if (name.includes("Twitch")) {
    return "simple-icons:twitch";
  } else {
    return "mdi:music-note"; // Default music note icon
  }
};

function OtherActivities({ activities }: OtherActivitiesProps) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Filter out activities where the name contains "YouTube"
  const filteredActivities = activities?.filter(
    (activity) => !activity.name.includes("YouTube")
  );

  return (
    <>
      {filteredActivities?.map((activity) => (
        <div key={activity.id} className="flex gap-1 mb-3">
          <div className="flex-shrink-0 relative">
            {/* Activity Thumbnail */}
            <Image
              src={getThumbnailUrl(activity.assets?.large_image || "", activity.application_id)}
              alt="Activity Thumbnail"
              className="w-5 h-5 object-cover object-center rounded-lg"
              width={256}
              height={256}
            />
          </div>

          <div className="flex-1">
            {/* Activity Type and Name */}
            <p className="flex flex-wrap items-center gap-1">
              <span className="opacity-80">{getActivityType(activity.type)}</span>
              <span className="opacity-95">{activity.name}</span>
              {/* Time for the activity */}
              <span className="opacity-80">
                for{" "}
                {formatDistanceStrict(now, activity.timestamps?.start ?? activity.created_at)}
              </span>
            </p>

            {/* Additional activity details */}
            {activity.type === 2 && (
              <div className="mt-1">
                {activity.details && (
                  <p className="opacity-80 flex items-center gap-2">
                    {activity.state} – {activity.details}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </>
  );
}