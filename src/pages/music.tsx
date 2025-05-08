import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import GenericMeta from "../components/GenericMeta";
import { TrackList } from "../components/TrackList";
import type { TopMusicResponseSuccess } from "./api/topMusic";
import Image from "next/image";

export default function Projects() {
	const [topMusic, setTopMusic] = useState<TopMusicResponseSuccess | null>(null);

  useEffect(() => {
    fetch(`/api/topMusic`)
      .then((res) => res.json())
      .then((info) => {
        if (info.error) return;
        setTopMusic(info);
      })
      .catch(console.error);
  }, []);

	return (
		<>
			<GenericMeta
				title="Music"
				description="Playlists and songs that I often listen to on Spotify."
			/>
			
			<h1 className="heading mb-2">
				Music <Icon className="ml-2 h-12 w-12 text-green-400" icon="mdi:spotify" />
			</h1>

			<p className="text-lg mb-16">Playlists and songs that I often listen to on <span className="text-green-400"><Link href="https://open.spotify.com/user/0o03ugqme912awle667dmgiic?si=b93d38710eaa414b"><a target="_blank" rel="noopener noreferrer" className="border-b border-[#fff4] hover:border-white transition">Spotify</a></Link></span>.</p>

			<h2 className="font-bold text-3xl mb-4">Playlist</h2>
      <TrackList playlists={topMusic?.playlists || []} priority={true} />

			<h2 className="font-bold text-3xl mb-4">This month</h2>
			<TrackList tracks={topMusic?.short.items} priority={true} />

			<h2 className="font-bold text-3xl mb-4">Last 6 Months</h2>
      <TrackList tracks={topMusic?.medium.items} priority={false} />

      <h2 className="font-bold text-3xl mb-4">All the time</h2>
      <TrackList tracks={topMusic?.long.items} priority={false} />

      <h2 className="font-bold text-3xl mb-4">Top Artist</h2>
      <TrackList topArtists={topMusic?.topArtists} priority={false} />
    </>
  );
}