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
				title="Musik"
				description="Daftar putar dan lagu yang sering saya dengarkan di Spotify."
			/>
			
			<h1 className="heading mb-2">
				Musik <Icon className="ml-2 h-12 w-12 text-green-400" icon="mdi:spotify" />
			</h1>

			<p className="text-lg mb-16">Daftar putar dan lagu yang sering saya dengarkan di <span className="text-green-400"><Link href="/spotify"><a target="_blank" rel="noopener noreferrer" className="border-b border-[#fff4] hover:border-white transition">Spotify</a></Link></span>.</p>

			<h2 className="font-bold text-3xl mb-4">Daftar Putar</h2>
      <TrackList playlists={topMusic?.playlists || []} priority={true} />

			<h2 className="font-bold text-3xl mb-4">Bulan Ini</h2>
			<TrackList tracks={topMusic?.short.items} priority={true} />

			<h2 className="font-bold text-3xl mb-4">6 Bulan Terakhir</h2>
      <TrackList tracks={topMusic?.medium.items} priority={false} />

      <h2 className="font-bold text-3xl mb-4">Sepanjang Waktu</h2>
      <TrackList tracks={topMusic?.long.items} priority={false} />

      <h2 className="font-bold text-3xl mb-4">Artis Teratas</h2>
      <TrackList topArtists={topMusic?.topArtists} priority={false} />
    </>
  );
}