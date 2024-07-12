import React, { PropsWithChildren } from "react"
import { Metadata } from "next"

import Layout from "@src/components/Layout"

export const metadata: Metadata = {
  title: "Defuse - Your Multichain DeFi Hub",
  description:
    "Defuse: the premier platform for cross-chain liquidity and trading. Experience efficient, secure, and transparent swaps across multiple blockchains.",
}

const HomeLayout: React.FC<PropsWithChildren> = ({ children }) => {
  return <Layout>{children}</Layout>
}

export default HomeLayout
