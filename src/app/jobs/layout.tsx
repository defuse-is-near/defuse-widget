import React, { PropsWithChildren } from "react"
import { Metadata } from "next"

import Layout from "@src/components/Layout"

export const metadata: Metadata = {
  title: "Careers at Defuse - Join Our Team",
  description:
    "Join Defuse for exciting careers in blockchain and cross-chain technology. Apply today and start shaping the future of decentralized finance!",
}

const JobsLayout: React.FC<PropsWithChildren> = ({ children }) => {
  return <Layout>{children}</Layout>
}

export default JobsLayout
