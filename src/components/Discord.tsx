import { useEffect, useState } from "preact/hooks";
import Image from "next/future/image";
import Link from "next/link";
import { Icon } from '@iconify/react';
import formatDistanceStrict from "date-fns/formatDistanceStrict";

const statusColors: Record<string, string> = {
  online: "bg-emerald-500",
  idle: "bg-amber-400",
  dnd: "bg-rose-400",
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

    fetchData();
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
        <div className="w-16 h-16 md:w-20 md:h-20 flex-shrink-0 relative">
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
            />
          </Link>

          {/* Avatar decoration (if exists) */}
          {data?.discord_user.avatar_decoration_data?.asset && (
            <Image
              src={`https://cdn.discordapp.com/avatar-decoration-presets/${data.discord_user.avatar_decoration_data.asset}.png?size=80&passthrough=true`}
              alt="Avatar Decoration"
              width={320}
              height={320}
              className="absolute inset-0 pointer-events-none translate-x-[-0px] scale-125"
            />
          )}

          {/* Status Indicator */}
          <div
            className={`absolute bottom-0.5 right-0.5 w-3 h-3 md:w-4 md:h-4 rounded-full ring-[3px] md:ring-4 ring-black ${getStatusColor(
              data?.discord_status
            )}`}
          >
            <div className="text-sm absolute z-10 mb-1 px-2 py-1 bg-slate-900 opacity-0 group-hover:opacity-100 transition pointer-events-none bottom-full rounded-lg w-max">
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

  return (
    <>
      {activities?.map((activity) => (
        <div key={activity.id} className="flex-grow">
          <p>
            <span className="opacity-80">{getActivityType(activity.type)}</span>{" "}
            <span className="opacity-95">{activity.name}</span>{" "}
            <span className="opacity-80">
              for{" "}
              {formatDistanceStrict(
                now,
                activity.timestamps?.start ?? activity.created_at
              )}
            </span>
          </p>
          {activity.type === 2 && (
            <div className="mt-1">
              {activity.details && (
                <p className="opacity-80 flex items-center gap-2">
                  <Icon
                    icon={getIconByActivityName(activity.name)}
                    width={20}
                    height={20}
                    className="w-4 h-4"
                  />
                  {activity.state} – {activity.details}
                </p>
              )}
            </div>
          )}
        </div>
      ))}
    </>
  );
}