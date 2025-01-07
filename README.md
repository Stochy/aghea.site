<center><img src="/public/images/sign.png" /></center>

<p align="center">
    <img alt='GitHub Clones' src='https://img.shields.io/badge/dynamic/json?color=success&label=Clone&query=count&url=https://gist.github.com/agcrisbp/f19fcc40267314fedad0e51b5e48f463/raw/clone.json&logo=github'>
    <img alt='GitHub Clones' src='https://img.shields.io/badge/dynamic/json?color=success&label=Unique&query=uniques&url=https://gist.github.com/agcrisbp/f19fcc40267314fedad0e51b5e48f463/raw/clone.json&logo=githubactions&logoColor=white'>
</p>

---

# About

- Resume/Portfolio website using NextJS, connect to [lanyard](https://github.com/Phineas/lanyard) & [Spotify APi](https://github.com/agcrisbp/Spotify-ADLink).

---

# Support

<a href="https://www.buymeacoffee.com/agcrisbp" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 32px !important;width: 114px !important;" ></a>
<a href="https://saweria.co/agcrisbp" target="_blank"><img src="https://bio-aghea.vercel.app/saweria-button.png" alt="Saweria" style="height: 30px !important;width: 114px !important;" ></a>
<a href="https://github.com/sponsors/agcrisbp" target="_blank"><img src="/public/images/sponsor-badge.svg" alt="Github Sponsor" style="height: 30px !important;width: 114px !important;" ></a>

---

# Quick Start

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/import/git?s=https://github.com/agcrisbp/aghea.site)
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/agcrisbp/aghea.site)

---

# Get Started

- Create this app:
```
yarn create next-app app -e https://github.com/agcrisbp/aghea.site
```

- Rename `.env.example` to `.env` and fill it with yours.

- Run the app:
```
cd app && yarn dev
```

> Edit & deploy.

---

# Information

### Discord ID Setup
- Read: [Setup](https://ad-link-docs.vercel.app/frontend#add-discord-status), and **YOU MUST** join [Lanyard Discord Server](https://discord.gg/lanyard).
- Take a look to [/src/pages/api/lanyard.js](/src/pages/api/lanyard.js).

### Spotify Setup
- Read [Setting up Spotify Dev](https://github.com/agcrisbp/ADTify?tab=readme-ov-file#setting-up-spotify-dev).
- If you're too lazy, replace `<Spotify />` and its import with the following code below to [/src/pages/index.tsx](/src/pages/index.tsx):

```tsx
import Spo from "../components/Spo";

<Spo />
```

### Domain Setup
- Make sure your domain is already connected with [Vercel Nameservers](https://vercel.com/docs/projects/domains/working-with-nameservers), then change the [vercel.json](/vercel.json).
- Also take a look to [next-sitemap.config.js](/next-sitemap.config.js).

---

# QNA?
- I really open my door to anyone who wants to ask questions if they encounter difficulties in creating this app. Please contact me through [Signal](https://aghea.vercel.app/contact) or [Email](https://aghea.vercel.app/email).

---