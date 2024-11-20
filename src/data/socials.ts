import { Icon } from '@iconify/react';

export interface SocialInfo {
    name: string;
    icon: string;
    url: string;
}

export const socials: SocialInfo[] = [
    {
        name: "GitHub",
        icon: "simple-icons:github",
        url: "/github"
    },
    {
        name: "LinkedIn",
        icon: "simple-icons:linkedin",
        url: "/linkedin"
    },
    {
        name: "Bluesky App",
        icon: "simple-icons:bluesky",
        url: "/bsky"
    },
    {
        name: "Chat Me",
        icon: "simple-icons:signal",
        url: "/contact"
    },
    {
        name: "Email",
        icon: "simple-icons:protonmail",
        url: "/email"
    }
];

export default socials;