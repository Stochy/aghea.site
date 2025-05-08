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
		image: "/images/projects/devmate.png",
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
				name: "Roblox",
				icon: "roblox"
			}
		]
	},
	{
		name: "Active Entertainment",
		description:
			"Roblox Game Studio.",
		image: "/images/projects/active.png",
		url: "https://active-entertainment.group",
		stack: [
			{
				name: "lua",
				icon: "lua"
			},
			
		]
	},
	
];
