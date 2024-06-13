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
    solverRelay: process.env.NEXT_PUBLIC_SOLVER_RELAY_API,
    coingeckoApiKey: process.env.COINGECKO_API_KEY,
    landing: process.env.NEXT_PUBLIC_LANDING_URL,
    appUrl: process.env.NEXT_PUBLIC_APP_URL,
    // Specific [Keys] has to be below.
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
      {
        protocol: "https",
        hostname: "solver-relay.chaindefuser.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "pro-api.coingecko.com",
        port: "",
        pathname: "/api/**",
      },
    ],
  },
}

export default nextConfig
