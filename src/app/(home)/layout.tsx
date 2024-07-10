import React, { PropsWithChildren } from "react"
import { Metadata } from "next"

import Layout from "@src/components/Layout"

export const metadata: Metadata = {
  title: "Welcome to Defuse - Multichain DeFi Hub",
  description: "Next-Generation Platform for Unified Cross-Chain DeFi",
}

const HomeLayout: React.FC<PropsWithChildren> = ({ children }) => {
  return <Layout>{children}</Layout>
}

export default HomeLayout
