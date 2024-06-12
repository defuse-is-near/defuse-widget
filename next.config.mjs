/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve = {
      ...config.resolve,
      fallback: {
        fs: false,
        path: false,
        os: false,
      },
    }
    return config
  },
  env: {
    nearChainId: process.env.NEAR_CAHIN_ID,
    nearNodeUrl: process.env.NEAR_NODE_URL,
    ethChainId: process.env.ETH_CHAIN_ID,
    baseChainId: process.env.BASE_CHAIN_ID,
    environment: process.env.ENVIRONMENT,
    turnOffApps: process.env.NEXT_PUBLIC_TURN_OFF_APPS,
    NEAR_ENV: process.env.NEAR_ENV,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "assets.coingecko.com",
        port: "",
        pathname: "/coins/images/**",
      },
    ],
  },
}

export default nextConfig
