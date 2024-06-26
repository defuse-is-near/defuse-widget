import { InfrastructureProps } from "@src/app/(home)/Table/TableInfrastructure"

export const infrastructureData: InfrastructureProps[] = [
  {
    featureDesc: "Control",
    featureIcon: "/static/logos/Eye.svg",
    dexDesc: "Decentralized",
    cexDesc: "Centralized",
    defuseDesc: "Decentralized",
  },
  {
    featureDesc: "Speed",
    featureIcon: "/static/logos/Gauge.svg",
    dexDesc: "Slower due to network constraints",
    cexDesc: "Generally fast",
    defuseDesc: "Fast, facilitated by multi-chain support",
  },
  {
    featureDesc: "Security",
    featureIcon: "/static/logos/ShieldCheck.svg",
    dexDesc: "More secure, less prone to single points of failure",
    cexDesc: "Vulnerable to hacks and failures",
    defuseDesc: "Highly secure, no central point of control",
  },
  {
    featureDesc: "Liquidity",
    featureIcon: "/static/logos/HandCoins.svg",
    dexDesc: "Limited to individual chains",
    cexDesc: "High liquidity",
    defuseDesc: "Combined liquidity across chains",
  },
  {
    featureDesc: "Range of assets",
    featureIcon: "/static/logos/Coins.svg",
    dexDesc: "Limited to assets on a single chain",
    cexDesc: "Wide range, but limited by listing policies",
    defuseDesc: "Extensive, includes tokens, NFTs, FTs, SBTs",
  },
  {
    featureDesc: "Innovation",
    featureIcon: "/static/logos/LightbulbFilament.svg",
    dexDesc: "Innovation limited to single chain features",
    cexDesc: "Controlled by the platform",
    defuseDesc: "Highly innovative, permissionless creation of new trades",
  },
  {
    featureDesc: "Fees",
    featureIcon: "/static/logos/Percent.svg",
    dexDesc: "Lower fees, but variable based on network",
    cexDesc: "Higher fees due to operational costs",
    defuseDesc: "Low transaction fees, optimized for cost-efficiency",
  },
  {
    featureDesc: "Compliance",
    featureIcon: "/static/logos/ClipboardText.svg",
    dexDesc: "Generally less regulated",
    cexDesc: "Subject to regulatory constraints",
    defuseDesc: "Decentralized with compliance features such as KYC",
  },
  {
    featureDesc: "Interoperability",
    featureIcon: "/static/logos/TreeStructure.svg",
    dexDesc: "Limited to single blockchain",
    cexDesc: "Limited, usually single platform",
    defuseDesc: "Cross-chain interoperability",
  },
  {
    featureDesc: "Staking",
    featureIcon: "/static/logos/Plant.svg",
    dexDesc: "Available, chain-specific",
    cexDesc: "Typically available, platform-specific",
    defuseDesc: "Available, with the ability to trade/lend staking accounts",
  },
  {
    featureDesc: "P2P Transfers",
    featureIcon: "/static/logos/Users.svg",
    dexDesc: "Direct, but limited to one chain",
    cexDesc: "Not usually direct, involves platform mediation",
    defuseDesc: "Direct, cross-chain with minimal costs",
  },
]
