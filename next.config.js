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
  res.setHeader("/twitter", "https://twitter.com/crisminolog");
  res.setHeader("/bsky", "https://bsky.app/profile/aghea.site");
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
        destination: 'https://bsky.aghea.site',
        permanent: true,
      },
      {
        source: '/contact',
        destination: 'https://contact.aghea.site',
        permanent: true,
      },
      {
        source: '/email',
        destination: 'https://email.aghea.site',
        permanent: true,
      },
      {
        source: '/discord',
        destination: 'https://bit.ly/3RxrKvQ',
        permanent: true,
      },
      {
        source: '/mxm',
        destination: 'https://bit.ly/3RA3zwF',
        permanent: true,
      },
      {
        source: '/twitter',
        destination: 'https://twitter.aghea.site',
        permanent: true,
      },
      {
        source: '/github',
        destination: 'https://github.aghea.site',
        permanent: true,
      },
      {
        source: '/linkedin',
        destination: 'https://linkedin.aghea.site',
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