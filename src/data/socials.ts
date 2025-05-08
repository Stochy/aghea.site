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
       name: "Twitter",
       icon: "simple-icons:twitter",
       url: "/twitter"
    },
//  {
//        name: "Bluesky App",
//        icon: "simple-icons:bluesky",
//        url: "/bsky"
//    },
    {
        name: "Roblox",
        icon: "simple-icons:roblox",
        url: "/roblox"
    }
];

export default socials;