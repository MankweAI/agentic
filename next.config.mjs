/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ucarecdn.com",
      },

      {
        protocol: "https",
        hostname: "wordpress-1287485-4668137.cloudwaysapps.com",
      },
    ],
  },
  rewrites: async () => {
    return [
      {
        source: "/settings/agentic",
        destination: "/settings/agentic", // or '/pages/settings/agentic.js' if you have a page component
      },
    ];
  },
};

export default nextConfig;
