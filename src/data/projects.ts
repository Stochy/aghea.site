export interface StackIconItem {
	name: string;
	icon: string;
	src?: never;
}

export interface StackCustomItem {
	name: string;
	icon?: never;
	src: string;
}

export interface ProjectInfo {
	name: string;
	description: React.ReactNode;
	image: string;
	url: string;
	stack: (StackIconItem | StackCustomItem)[];
}

export const projects: ProjectInfo[] = [
	{
		name: "DevMate",
		description:
			"DevMate in a online product store for sellers.",
		image: "/images/projects/O5ulOZZ3eX.png",
		url: "https://devmate.co.uk",
		stack: [
			{
				name: "NextJS",
				icon: "nextjs"
			},
			{
				name: "TypeScript",
				icon: "ts"
			},
			{
				name: "CSS",
				icon: "css"
			}
		]
	},
	{
		name: "ADPortfolio",
		description:
			"Templat Resume/Portfolio menggunakan NextJS. Terhubung ke react-use-lanyard dan Spotify APi.",
		image: "/images/projects/ADPortfolio.png",
		url: "https://github.com/agcrisbp/ADPortfolio",
		stack: [
			{
				name: "NextJS",
				icon: "nextjs"
			},
			{
				name: "TypeScript",
				icon: "ts"
			},
			{
				name: "TailwindCSS",
				icon: "tailwindcss"
			},
			{
				name: "WindiCSS",
				icon: "windicss"
			},
		]
	},
	
];
