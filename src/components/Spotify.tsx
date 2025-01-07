// Spotify.tsx
import { Icon } from "@iconify/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import useSWR from "swr";
import Link from "next/link";

import type {
  NowPlayingResponseError,
  NowPlayingResponseSuccess,
} from "../pages/api/podcast";

const formatDuration = (ms: number) => {
  const seconds = Math.floor((ms / 1000) % 60).toString().padStart(2, "0");
  const minutes = Math.floor((ms / 1000 / 60) % 60).toString().padStart(2, "0");
  const hours = Math.floor(ms / 1000 / 60 / 60);

  return hours > 0 ? `${hours}:${minutes}:${seconds}` : `${minutes}:${seconds}`;
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Spotify() {
  const { data } = useSWR<
    NowPlayingResponseSuccess,
    NowPlayingResponseError
  >("/api/podcast", fetcher, { refreshInterval: 5000 });

  const [time, setTime] = useState(0);

  useEffect(() => {
    if (!data?.progessMs || !data.item) return;

    const started = Date.now();

    const interval = setInterval(() => {
      setTime(
        data.isPaused
          ? data.progessMs
          : Math.min(
              data.progessMs + Date.now() - started,
              data.item.duration_ms ?? 0,
            ),
      );
    }, 100);

    return () => clearInterval(interval);
  }, [data]);

  return (
    <div className="flex gap-2 items-center text-base leading-snug">
      <div className="w-16 h-16 md:w-20 md:h-20 flex-shrink-0">
        <Link href="/spotify">
          <Image
            src={
              (data?.item?.type === "track"
                ? data?.item?.album?.images[0]?.url
                : data?.item?.images[0]?.url) ?? "/images/emptysong.jpg"
            }
            alt="Spotify Now Playing"
            width={256}
            height={256}
            priority={true}
            className="w-16 h-16 md:w-20 md:h-20 object-cover object-center rounded-lg"
            onContextMenu={(e) => e.preventDefault()}
          />
        </Link>
      </div>
      <div className="basis-full">
        {data?.item ? (
          <>
            <p>
              <a
                href={data.item.external_urls.spotify}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold border-b border-[#fff4] transition hover:border-white"
              >
                {data.item.name}
              </a>
              {"album" in data.item && (
                <>
                  {" "}
                  oleh{" "}
                  {data.item.artists.map((artist: any, i: number) => (
                      <span key={data.item.id + artist.id}>
                        <a
                          href={artist.external_urls.spotify}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="border-b border-[#fff4] transition hover:border-white"
                        >
                          {artist.name}
                        </a>
                        {i < data.item.artists.length - 1 ? ", " : null}
                      </span>
                    ))}
                </>
              )}
            </p>
            {"album" in data.item ? ( // Use "album" in data.item
              <p className="opacity-80">
                Album{" "}
                <a
                  href={data.item.album.external_urls.spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-b border-[#fff4] transition hover:border-white"
                >
                  {data.item.album.name}
                </a>
              </p>
            ) : (
              // Display Show information for episodes
              <p className="opacity-80">
                Podcast{" "}<a
                  href={data.item.show.external_urls.spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-b border-[#fff4] transition hover:border-white"
                >
                  {data.item.show.name}
                </a>{" "}
              </p>
            )}
            <p className="opacity-80 flex items-center gap-1">
              {data.isPlayingNow && data.item ? (
                <span className="block w-full max-w-sm mt-2">
                  <span className="block h-0.5 rounded overflow-hidden bg-[#5e5e5e]">
                    <span
                      className="block h-full"
                      style={{
                        width: `${
                          (time / (data.item.duration_ms ?? 0)) * 100
                        }%`,
                        backgroundColor: document.body.classList.contains("dark")
                        ? "#fff"
                        : "#000",
                      }}
                    />
                  </span>
                  <span className="flex items-center text-sm">
                    <span className="basis-full">{formatDuration(time)}</span>
                    <span>
                      {data.isPaused ? (
                        <Icon
                          className="h-4 w-4"
                          icon="line-md:pause-to-play-transition"
                        />
                      ) : (
                        <Icon
                          className="h-4 w-4"
                          icon="line-md:play-to-pause-transition"
                        />
                      )}
                    </span>
                    <span className="basis-full text-right">
                      {formatDuration(data.item.duration_ms ?? 0)}
                    </span>
                  </span>
                </span>
              ) : (
                <>
                  <span className="w-4 h-4">
                    <Icon
                      icon="simple-icons:spotify"
                      width={48}
                      height={48}
                      className="w-4 h-4"
                    />
                  </span>
                  {data.recentlyPlayed ? (
                    <>Terakhir diputar di </>
                  ) : null}
                  Spotify
                </>
              )}
            </p>
          </>
        ) : (
          <p>Offline</p>
        )}
      </div>
    </div>
  );
}
