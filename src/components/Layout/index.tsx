"use client"

import React, { PropsWithChildren } from "react"
import { usePathname } from "next/navigation"

import { withHistory } from "@src/hocs/withHistory"
import Header from "@src/components/Layout/Header"
import Footer from "@src/components/Layout/Footer"
import PageBackground from "@src/components/PageBackground"
import NavbarMobile from "@src/components/NavbarMobile"
import History from "@src/components/History"
import { LINKS_HEADER } from "@src/constants/routes"

const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  const pathname = usePathname()
  const isAppsPath = LINKS_HEADER.some((route) => route.href === pathname)

  // PREFETCH: Prefetch action could be done similarly to the prefetch action
  //           in _app.ts within the pages Router.
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex md:flex-1">{children}</main>
      <Footer />
      <NavbarMobile />
      <PageBackground />
      {isAppsPath && <History />}
    </div>
  )
}

export default withHistory(Layout)
