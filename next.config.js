// @ts-check

const withPreact = require("next-plugin-preact");
const withBundleAnalyzer = require("@next/bundle-analyzer")({
 enabled: process.env.ANALYZE === "true"
});

// Menambahkan modul 'http'
const http = require("http");

// Menambahkan fungsi untuk melakukan redirect
function redirectHandler(req, res) {
  res.statusCode = 301;
  res.setHeader("/twitter", "https://twitter.com/agcrisbp");
  res.setHeader("/bsky", "http://aghea.vercel.app/bsky");
  res.end();
}

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  swcMinify: true,
  i18n: { locales: ["id-ID"], defaultLocale: "id-ID" },
  images: {
    domains: ["cdn.discordapp.com", "i.scdn.co", "skillicons.dev", "media.discordapp.net"],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  experimental: {
    esmExternals: false,
    images: {
      allowFutureImage: true,
    },
  },
  async redirects() {
    return [
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
        destination: 'mailto:agcrisbp@proton.me',
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
        destination: 'https://bit.ly/AgheaTwitter',
        permanent: true,
      },
      {
        source: '/github',
        destination: 'https://bit.ly/3RwQ0yc',
        permanent: true,
      },
      {
        source: '/linkedin',
        destination: 'https://bit.ly/48tDdU0',
        permanent: true,
      },
      {
        source: '/spotify',
        destination: 'https://bit.ly/4atYAGx',
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

module.exports = withBundleAnalyzer(withPreact(config));