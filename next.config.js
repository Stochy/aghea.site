// @ts-check

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true"
});

const http = require("http");

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  swcMinify: true,
  i18n: { locales: ["id-ID"], defaultLocale: "id-ID" },
  images: {
    remotePatterns: [
        {
            protocol: 'https',
            hostname: 'skillicons.dev',
        },
        {
            protocol: 'https',
            hostname: 'i.ibb.co',
        },
        {
            protocol: 'https',
            hostname: 'cdn.discordapp.com',
        },
        {
            protocol: 'https',
            hostname: 'i.scdn.co',
        },
        {
            protocol: 'https',
            hostname: 'media.discordapp.net',
        },
        {
            protocol: 'https',
            hostname: 'image-cdn-ak.spotifycdn.com',
        },
        {
            protocol: 'https',
            hostname: 'image-cdn-fa.spotifycdn.com',
        },
        {
            protocol: 'https',
            hostname: 'mosaic.scdn.co',
        },
    ],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  experimental: {
    esmExternals: false,
  },
  async redirects() {
    return [
      {
        source: '/roblox',
        destination: 'https://www.roblox.com/users/3563143453/profile',
        permanent: true,
      },
      {
        source: '/bsky',
        destination: 'https://bit.ly/AgheaBsky',
        permanent: true,
      },
      {
        source: '/contact',
        destination: 'https://bit.ly/AgheaSignal',
        permanent: true,
      },
      {
        source: '/email',
        destination: '/api/email',
        permanent: true,
      },
      {
        source: '/discord',
        destination: 'https://bit.ly/3RxrKvQ',
        permanent: true,
      },
      {
        source: '/mxm',
        destination: 'https://bit.ly/AgheaMXM',
        permanent: true,
      },
      {
        source: '/twitter',
        destination: 'https://x.com/@DevMate_GCORP',
        permanent: true,
      },
      {
        source: '/github',
        destination: 'https://github.com/@Stochy',
        permanent: true,
      },
      {
        source: '/linkedin',
        destination: 'https://bit.ly/48tDdU0',
        permanent: true,
      },
      {
        source: '/spotify',
        destination: 'https://open.spotify.com/user/0o03ugqme912awle667dmgiic?si=296a470a814341a7',
        permanent: true,
      },
      {
        source: '/termux',
        destination: 'https://bit.ly/3vuDUhG',
        permanent: true,
      },
      {
        source: '/termuxdl',
        destination: 'https://bit.ly/4aGdHN4',
        permanent: true,
      },
    ];
  },
};

module.exports = withBundleAnalyzer(config);