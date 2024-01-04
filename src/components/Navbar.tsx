import {
	CollectionIcon,
	HeartIcon,
	HomeIcon,
	MusicNoteIcon,
	SparklesIcon,
	DeviceMobileIcon
} from "@heroicons/react/solid";

import ActiveLink from "./ActiveLink";

interface PageData {
	href: string;
	title: string;
	Icon: (props: { className?: string }) => JSX.Element;
	color: string;
}

const pages: PageData[] = [
	{
		href: "/",
		title: "Beranda",
		Icon: HomeIcon,
		color: "text-orange-400"
	},
	{
		href: "/projects",
		title: "Projek",
		Icon: CollectionIcon,
		color: "text-blue-400"
	},
	{
		href: "https://blog.aghea.site",
		title: "Tulisan",
		Icon: SparklesIcon,
		color: "text-purple-400"
	},
	{
		href: "/music",
		title: "Musik",
		Icon: MusicNoteIcon,
		color: "text-violet-400"
	}
];

export default function Navbar() {
	return (
		<nav className="mb-12 flex flex-wrap items-center gap-x-8 font-bold">
			{pages.map(({ href, title, Icon, color }) => (
				<ActiveLink
					href={href}
					key={href}
					activeClass="after:inset-x-0"
					nonActiveClass="after:opacity-0 after:inset-x-1/2 hover:after:opacity-100 hover:after:inset-x-1/4"
				>
					<a className="py-2 flex items-center relative after:absolute after:bottom-0 after:h-0.5 after:bg-white after:rounded after:transition-all">
						{title}
						<Icon className={`w-5 h-5 ml-2 ${color}`} />
					</a>
				</ActiveLink>
			))}
		</nav>
	);
}
