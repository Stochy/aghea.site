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
		name: "ADLink",
		description:
			"ADLink adalah templat link website satu halaman yang dapat disesuaikan.",
		image: "/images/projects/preview.jpg",
		url: "https://bit.ly/ADLink-Docs",
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
	{
		name: "AD-GPT3",
		description:
			"Sebuah AI Assistant Discord Bot yang mendukung GPT-3.5.",
		image: "/images/projects/Logo_Geng_West.png",
		url: "https://github.com/agcrisbp/AD-GPT3",
		stack: [
			{
				name: "JavaScript",
				icon: "javascript"
			},
			{
				name: "DiscordJS",
				icon: "discord"
			},
			{
				name: "Discord Bot",
				icon: "discordbots"
			},
		]
  },
	{
		name: "AD-GPT3",
		description:
			"Sebuah AI Assistant Discord Bot yang mendukung GPT-4.",
		image: "/images/projects/Logo_Geng_West.png",
		url: "https://github.com/agcrisbp/AD-GPT4",
		stack: [
			{
				name: "Python",
				icon: "python"
			},
			{
				name: "Docker",
				icon: "docker"
			},
			{
				name: "DiscordJS",
				icon: "discord"
			},
			{
				name: "Discord Bot",
				icon: "discordbots"
			},
		]
  },
	{
		name: "ADResume",
		description:
			"Templat Resume/Portfolio menggunakan Vue (Nuxt 3).",
		image: "/images/projects/adresume.png",
		url: "https://bit.ly/AD-Resume",
		stack: [
			{
				name: "VueJS",
				icon: "vuejs"
			},
			{
				name: "CSS",
				icon: "css"
			},
			{
				name: "TypeScript",
				icon: "ts"
			},
			{
				name: "Python",
				icon: "python"
			}
		]
	},
	{
		name: "ACode",
		description:
			"Editor kode/koding seperti VS Code untuk Android.",
		image: "/images/projects/acode.png",
		url: "https://github.com/deadlyjack/Acode",
		stack: [
			{
				name: "Java",
				icon: "java"
			},
			{
				name: "CSS",
				icon: "css"
			},
			{
				name: "JavaScript",
				icon: "javascript"
			},
			{
				name: "SCSS",
				icon: "scss"
			},
			{
				name: "HTML",
				icon: "html"
			}
		]
	},
	{
		name: "Spotify Card for ADLink",
		description:
			"Menampilkan lagu yang sedang diputar di Spotify untuk ditampilkan di website menggunakan format html ataupun MDX.",
		image: "/images/projects/spotify.png",
		url: "https://bit.ly/Spotify-ADLink",
		stack: [
			{
				name: "Python",
				icon: "python"
			},
			{
				name: "Firebase",
				icon: "firebase"
			}
		]
	},
	{
		name: "BLAST.TV",
		description:
			"BLASTTV adalah platform untuk menonton, mengobrol, dan dihibur oleh konten terbaik dari dunia esports.",
		image: "/images/projects/blast.jpg",
		url: "https://blast.tv",
		stack: [
			{
				name: "React",
				icon: "react"
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
			{
				name: "MongoDB",
				icon: "mongo"
			},
		]
	},
	{
		name: "Discord Stage",
		description:
			"Seperti namanya, fitur ini memungkinkan pengguna membuat ruang obrolan audio untuk berdiskusi.",
		image: "/images/projects/dc1.png",
		url: "https://support.discord.com/hc/en-us/articles/1500005513722-Stage-Channels-FAQ",
		stack: [
			{
				name: "React",
				icon: "react"
			},
			{
				name: "Golang",
				icon: "golang"
			},
			{
				name: "Electron",
				icon: "electron"
			},
			{
				name: "Kotlin",
				icon: "kotlin"
			},
			{
				name: "Java",
				icon: "java"
			},
		]
  },
	{
		name: "It Never Ends ft. Julian Wilt",
		description:
			"Lagu aransemen yang dibuat hanya untuk mengetes peralatan musik. Artis orisinal: Bring Me The Horizon.",
		image: "/images/projects/ine.jpg",
		url: "https://ite.aghea.site",
		stack: [
			{
				name: "Apple Music",
				src: "/images/projects/app.png"
			},
			{
				name: "Spotify",
				src: "/images/projects/spo.png"
			},
		]
  },
	{
		name: "Soultaker",
		description:
			"Album ini merupakan kompilasi lagu-lagu Bon-Bon Soultaker dari Album 'Deathless Guitar' (2012), 'Scents of Death' (2012), 'Doubt' (2013), and 'Tuhan, Manusia, Malaikat, & Iblis' (2013).",
		image: "/images/projects/soultaker.jpg",
		url: "https://soultaker.aghea.site",
		stack: [
			{
				name: "Apple Music",
				src: "/images/projects/app.png"
			},
			{
				name: "Spotify",
				src: "/images/projects/spo.png"
			},
		]
	}
];
