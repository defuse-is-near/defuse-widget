import { StatsGroupType, StatsGroupProps } from "@src/app/(home)/Card/CardStats"

export const group_1: StatsGroupProps = {
  label: "Feature",
  type: StatsGroupType.MAIN,
  data: [
    {
      description: "Control",
      icon: "/static/logos/Eye.svg",
    },
    {
      description: "Speed",
      icon: "/static/logos/Gauge.svg",
    },
    {
      description: "Security",
      icon: "/static/logos/ShieldCheck.svg",
    },
    {
      description: "Liquidity",
      icon: "/static/logos/HandCoins.svg",
    },
    {
      description: "Range of assets",
      icon: "/static/logos/Coins.svg",
    },
    {
      description: "Innovation",
      icon: "/static/logos/LightbulbFilament.svg",
    },
    {
      description: "Fees",
      icon: "/static/logos/Percent.svg",
    },
    {
      description: "Compliance",
      icon: "/static/logos/ClipboardText.svg",
    },
    {
      description: "Interoperability",
      icon: "/static/logos/TreeStructure.svg",
    },
    {
      description: "Staking",
      icon: "/static/logos/Plant.svg",
    },
    {
      description: "P2P Transfers",
      icon: "/static/logos/Users.svg",
    },
  ],
}

export const group_2: StatsGroupProps = {
  label: "CEX",
  type: StatsGroupType.REGULAR,
  data: [
    {
      description: "Centralized",
    },
    {
      description: "Generally fast",
    },
    {
      description: "Vulnerable to hacks and failures",
    },
    {
      description: "High liquidity",
    },
    {
      description: "Wide range, but limited by listing policies",
    },
    {
      description: "Controlled by the platform",
    },
    {
      description: "Higher fees due to operational costs",
    },
    {
      description: "Subject to regulatory constraints",
    },
    {
      description: "Limited, usually single platform",
    },
    {
      description: "Typically available, platform-specific",
    },
    {
      description: "Not usually direct, involves platform mediation",
    },
  ],
}

export const group_3: StatsGroupProps = {
  label: "DEX",
  type: StatsGroupType.REGULAR,
  data: [
    {
      description: "Decentralized",
    },
    {
      description: "Slower due to network constraints",
    },
    {
      description: "More secure, less prone to single points of failure",
    },
    {
      description: "Limited to individual chains",
    },
    {
      description: "Limited to assets on a single chain",
    },
    {
      description: "Innovation limited to single chain features",
    },
    {
      description: "Lower fees, but variable based on network",
    },
    {
      description: "Generally less regulated",
    },
    {
      description: "Limited to single blockchain",
    },
    {
      description: "Available, chain-specific",
    },
    {
      description: "Direct, but limited to one chain",
    },
  ],
}

export const group_4: StatsGroupProps = {
  label: "Defuse",
  type: StatsGroupType.PRIMARY,
  data: [
    {
      description: "Decentralized",
    },
    {
      description: "Fast, facilitated by multi-chain support",
    },
    {
      description: "Highly secure, no central point of control",
    },
    {
      description: "Combined liquidity across chains",
    },
    {
      description: "Extensive, includes tokens, NFTs, FTs, SBTs",
    },
    {
      description: "Highly innovative, permissionless creation of new trades",
    },
    {
      description: "Low transaction fees, optimized for cost-efficiency",
    },
    {
      description: "Decentralized with compliance features such as KYC",
    },
    {
      description: "Cross-chain interoperability",
    },
    {
      description: "Available, with the ability to trade/lend staking accounts",
    },
    {
      description: "Direct, cross-chain with minimal costs",
    },
  ],
}
