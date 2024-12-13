import { HomeIcon } from "@heroicons/react/solid";
import differenceInCalendarYears from "date-fns/differenceInCalendarYears";
import type { InferGetServerSidePropsType } from "next";
import Image from "next/future/image";
import Link from "next/link";
import { Clock } from "../components/Clock";
import Discord from "../components/Discord";
import DiscordActivity from "../components/DiscordActivity";
import GenericMeta from "../components/GenericMeta";
import Spotify from "../components/Spotify";
import { socials } from "../data/socials";
import { Icon } from '@iconify/react';

const birthday = new Date(1998, 8, 31);

export async function getStaticProps() {
	return {
		props: {
			age: differenceInCalendarYears(Date.now(), birthday).toString()
		}
	};
}

export default function Home({
	age
}: InferGetServerSidePropsType<typeof getStaticProps>) {
	return (
		<>
			<GenericMeta
				title="Agcrismanto Budhi Praswastyka"
				description="A programmer who aware of the tiny moments in a persons life that reveal greater truths."
			/>

			<h1 className="heading mb-2">
				Aghea&nbsp;<Icon icon="material-symbols:verified" color="#1dcaff" width="40" />
			</h1>

			<p className="mb-4">
				<span className="opacity-80">Nama saya adalah Agcrismanto Budhi Praswastyka, dikenal sebagai Cris ataupun Aghea, berasal dari Yogyakarta, Indonesia. Saya adalah seorang {" "}
				 Pegiat Hukum, dan Web Developer. Saya juga mengisi waktu kosong sebagai seorang Kurator di <span className="text-blue-400 opacity-95"><Link href="/mxm"><a target="_blank" rel="noopener noreferrer" className="border-b border-[#fff4] hover:border-white transition">Musixmatch</a></Link></span></span>.{" "}
			</p>

			<p className="mb-2 flex flex-wrap gap-2 items-center">
				{socials.map(({ name, icon, url }) => (
					<a
						key={name}
						href={url}
						target="_blank"
						rel="noopener noreferrer"
						className="w-6 h-6 hover:opacity-80 transition"
					>
						<Icon
							icon={icon}
						/>
					</a>
				))}
			</p>

			<p className="mb-4 text-base text-gray-300">
				<Clock />
			</p>

			<hr className="mb-4 bg-slate-800 border-none h-0.5" />

			<Discord />
			<DiscordActivity />
			<Spotify />
		</>
	);
}
