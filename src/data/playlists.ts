export interface PlaylistsInfo {
	name: string;
	image: string;
	href: string;
	bg?: string;
}

export const playlists: PlaylistsInfo[] = [
  {
		name: "It's The End of September, But I'm Still Stuck With May",
		image: "/images/may.jpg",
		href: "https://open.spotify.com/playlist/2qAWVxaB78WS7G0tnntHff?si=ledKmQdgQiOTTsId0trWhg"
	},
	{
		name: "MUSE: Meant to be Us Since Eternity",
		image: "/images/muse.jpg",
		href: "https://open.spotify.com/playlist/7brL4X5emCMMQgA78MyP3f?si=jD3xb8zNRgy5QozofjPVmQ"
	},
  {
		name: "Six Feet Down (Soultaker)",
		image: "/images/sfds.jpg",
		href: "https://open.spotify.com/playlist/0AdxQ6m8E6MqeR1YT3dd9Z?si=yMqDtIlpRJ6pXNNIfCXRWQ"
	},
	{
		name: "Six Feet Down (The Dying Songs)",
		image: "/images/sfd.jpg",
		href: "https://open.spotify.com/playlist/3JTeyPRtGt5xA6lMxNGtBc?si=Y8Q9zHBGTMC0s01Dycj13w"
	},
	{
		name: "Metalcore Kingdom",
		image: "/images/mc.png",
		href: "https://open.spotify.com/playlist/2oibGVZOVOJzTRLeYNQZxd?si=HazyjHL4Q8y7O71tOljgjw"
	}
];
