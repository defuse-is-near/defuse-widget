import { NetworkToken } from "@src/types/interfaces"

enum TOKENS_MAINNET {
  NEAR = "",
  wNEAR = "wrap",
  AURORA = "aurora.mainnet",
  REF = "ref.mainnet",
  USDt = "usdtt.mainnet",
}

enum TOKENS_TESTNET {
  NEAR = "",
  wNEAR = "wrap.testnet",
  AURORA = "aurora.fakes.testnet",
  REF = "ref.fakes.testnet",
  USDt = "usdtt.fakes.testnet",
}

const environment = process.env.environment || "production"
export const SUPPORTED_TOKENS: typeof TOKENS_MAINNET | typeof TOKENS_TESTNET =
  environment === "development" ? TOKENS_TESTNET : TOKENS_MAINNET

export type TokenEnum = typeof TOKENS_MAINNET | typeof TOKENS_TESTNET

export type TOKEN = {
  decimals: number
  symbol: string
  contract: TokenEnum
}

export type Token = {
  [key in keyof TokenEnum]: {
    decimals: number
    symbol: string
    contract: TokenEnum[key]
  }
}

export const TOKENS: Token = {
  NEAR: {
    decimals: 24,
    symbol: "NEAR",
    contract: SUPPORTED_TOKENS.NEAR,
  },
  wNEAR: {
    decimals: 24,
    symbol: "wNEAR",
    contract: SUPPORTED_TOKENS.wNEAR,
  },
  AURORA: {
    decimals: 18,
    symbol: "AURORA",
    contract: SUPPORTED_TOKENS.AURORA,
  },
  REF: {
    decimals: 18,
    symbol: "REF",
    contract: SUPPORTED_TOKENS.REF,
  },
  USDt: {
    decimals: 6,
    symbol: "USDt",
    contract: SUPPORTED_TOKENS.USDt,
  },
}

export const LIST_NETWORKS_TOKENS: NetworkToken[] = [
  // {
  //   chainName: "NEAR",
  //   chainId: "1313161554",
  //   address: "0x1",
  //   name: "NEAR",
  //   symbol: "NEAR",
  //   chainIcon: "/static/icons/network/near.svg",
  //   icon: "https://assets.coingecko.com/coins/images/10365/standard/near.jpg?1696510367",
  //   decimals: 24,
  // },
  {
    chainName: "NEAR",
    chainId: "1313161554",
    address: "wrap.testnet",
    name: "Wrapped NEAR fungible token",
    symbol: "wNEAR",
    chainIcon: "/static/icons/network/near.svg",
    icon: "https://assets.coingecko.com/coins/images/18280/standard/EX4mrWMW_400x400.jpg?1696517773",
    decimals: 24,
  },
  {
    chainName: "NEAR",
    chainId: "1313161554",
    address: "aurora.fakes.testnet",
    name: "Aurora",
    symbol: "AURORA",
    chainIcon: "/static/icons/network/near.svg",
    icon: "https://assets.coingecko.com/coins/images/20582/standard/aurora.jpeg?1696519989",
    decimals: 18,
  },
  {
    chainName: "NEAR",
    chainId: "1313161554",
    address: "usdt.fakes.testnet",
    name: "Tether USD",
    symbol: "USDT.e",
    chainIcon: "/static/icons/network/near.svg",
    icon: "https://assets.coingecko.com/coins/images/325/standard/Tether.png?1696501661",
    decimals: 6,
  },
  {
    chainName: "NEAR",
    chainId: "1313161554",
    address: "usdc.fakes.testnet",
    name: "USD Coin",
    symbol: "USDC",
    chainIcon: "/static/icons/network/near.svg",
    icon: "https://assets.coingecko.com/coins/images/6319/standard/usdc.png?1696506694",
    decimals: 6,
  },
  {
    chainName: "NEAR",
    chainId: "1313161554",
    address: "wbtc.fakes.testnet",
    name: "Wrapped BTC",
    symbol: "WBTC",
    chainIcon: "/static/icons/network/near.svg",
    icon: "https://assets.coingecko.com/coins/images/7598/standard/wrapped_bitcoin_wbtc.png?1696507857",
    decimals: 8,
  },
  {
    chainName: "NEAR",
    chainId: "1313161554",
    address: "14b2bc0c-32bc-4ac0-8eab-416c700d7c3d.testnet",
    name: "Sweat",
    symbol: "SWEAT",
    chainIcon: "/static/icons/network/near.svg",
    icon: "https://assets.coingecko.com/coins/images/25057/standard/fhD9Xs16_400x400.jpg?1696524208",
    decimals: 18,
  },
  {
    chainName: "NEAR",
    chainId: "1313161554",
    address: "ref.fakes.testnet",
    name: "Ref Finance Token",
    symbol: "REF",
    chainIcon: "/static/icons/network/near.svg",
    icon: "https://assets.coingecko.com/coins/images/18279/standard/ref.png?1696517772",
    decimals: 18,
  },
  {
    chainName: "NEAR",
    chainId: "1313161554",
    address: "blackdragon.fakes.testnet",
    name: "Black Dragon",
    symbol: "BLACKDRAGON",
    chainIcon: "/static/icons/network/near.svg",
    icon: "https://assets.coingecko.com/coins/images/35502/standard/Untitled-8.png?1709390396",
    decimals: 16,
  },
  {
    chainName: "NEAR",
    chainId: "1313161554",
    address: "deltalonk.testnet",
    name: "LONK fungible token",
    symbol: "LONK",
    chainIcon: "/static/icons/network/near.svg",
    icon: "https://assets.coingecko.com/coins/images/36497/standard/Logo_Long_square.png?1717541650",
    decimals: 8,
  },
  // ######################################################
  // # NEAR MAINNET LIST                                  #
  // ######################################################
  {
    chainName: "NEAR",
    chainId: "1313161554",
    address: "usm.tkn.near",
    name: "USMeme",
    symbol: "USM",
    chainIcon: "/static/icons/network/near.svg",
    icon: "https://assets.coingecko.com/coins/images/38114/standard/usmeme.jpeg?1716536863",
    decimals: 18,
  },
]
