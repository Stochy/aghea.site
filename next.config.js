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
    domains: ["cdn.discordapp.com", "i.scdn.co", "skillicons.dev"],
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
        destination: 'https://bit.ly/3wxXBWC',
        permanent: true,
      },
      {
        source: '/contact',
        destination: 'https://simplex.chat/contact#/?v=1-4&smp=smp%3A%2F%2F0YuTwO05YJWS8rkjn9eLJDjQhFKvIYd8d4xG8X1blIU%3D%40smp8.simplex.im%2FU5OFRjMLTNrAnK0_M1Q2ZXl01Q1eF75G%23%2F%3Fv%3D1-2%26dh%3DMCowBQYDK2VuAyEAik_8l_Xf3pvXnc6AHjcovHVDAiF5o2ptu8MvnelwSBk%253D%26srv%3Dbeccx4yfxxbvyhqypaavemqurytl6hozr47wfc7uuecacjqdvwpw2xid.onion',
        permanent: true,
      },
      {
        source: '/email',
        destination: 'https://aghea.vercel.app/email',
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
        destination: 'https://bit.ly/3TtYbxM',
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