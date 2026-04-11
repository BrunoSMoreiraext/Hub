const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  disable: process.env.NODE_ENV === "development",
});

const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "image.tmdb.org" },
      { protocol: "https", hostname: "books.google.com" },
    ],
  },
};

module.exports = withPWA(nextConfig);