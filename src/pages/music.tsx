import { MusicNoteIcon } from "@heroicons/react/solid";
import { useEffect, useState } from "preact/hooks";
import Link from "next/link";
import GenericMeta from "../components/GenericMeta";
import { TrackList } from "../components/TrackList";
import type { TopMusicResponseSuccess } from "./api/topMusic";
import { playlists } from "../data/playlists";
import Image from "next/future/image";

export default function Projects() {
	const [topMusic, setTopMusic] = useState<TopMusicResponseSuccess | null>(
		null
	);

	useEffect(() => {
		fetch(`/api/topMusic`)
			.then(res => res.json())
			.then(info => {
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
				Musik <MusicNoteIcon className="ml-4 h-12 w-12 text-rose-400" />
			</h1>

			<p className="text-lg mb-4">Daftar putar dan lagu yang sering saya dengarkan di <span className="text-green-400"><Link href="/spotify"><a target="_blank" rel="noopener noreferrer" className="border-b border-[#fff4] hover:border-white transition">Spotify</a></Link></span>.</p>

			<div className="fade-in grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-5 gap-2 sm:gap-4">
				{playlists.map(({ name, image, href, bg }) => (
					<a
						key={image}
						href={href}
						target="_blank"
						rel="noopener noreferrer"
						className="group overflow-hidden isolate relative grid place-items-center rounded-lg aspect-square before:absolute before:inset-0 before:z-10 before:bg-black before:opacity-0 before:transition before:duration-300 hover:before:opacity-50"
						style={{
							backgroundColor: bg ?? "#252938"
						}}
					>
						<Image
							src={image}
							alt={name}
							width={256}
							height={256}
							className="absolute top-0 left-0 w-full h-full object-cover -z-10 transition duration-300 group-hover:scale-[1.02]"
							priority={true}
						/>
						<div className="z-10 absolute inset-2 flex flex-col justify-end transition duration-300 scale-95 opacity-0 group-hover:scale-100 group-hover:opacity-100">
							<h2 className="text-base font-bold leading-tight">
								{name}
							</h2>
						</div>
					</a>
				))}
			</div>

      <br/>

			<h2 className="font-bold text-3xl mb-4">Bulan Ini</h2>
			<TrackList tracks={topMusic?.short.items} priority={true} />

			<h2 className="font-bold text-3xl mb-4">6 Bulan Terakhir</h2>
			<TrackList tracks={topMusic?.medium.items} />

			<h2 className="font-bold text-3xl mb-4">Sepanjang Waktu</h2>
			<TrackList tracks={topMusic?.long.items} />
		</>
	);
}
