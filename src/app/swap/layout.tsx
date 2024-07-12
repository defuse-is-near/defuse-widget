import React, { PropsWithChildren } from "react"
import { Metadata } from "next"

import Layout from "@src/components/Layout"

export const metadata: Metadata = {
  title: "Defuse Swap - Efficient Cross-Chain Asset Swapping",
  description:
    "Defuse Swap ensures fast transactions and the best rates across multiple blockchains. Start swapping with Defuse today for a superior trading experience.",
}

const SwapLayout: React.FC<PropsWithChildren> = ({ children }) => {
  return <Layout>{children}</Layout>
}

export default SwapLayout
