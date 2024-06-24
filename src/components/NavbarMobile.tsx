"use client"

import React from "react"

import Navbar from "@src/components/Navbar"
import { LINKS_HEADER } from "@src/constants/routes"
import { useHistoryStore } from "@src/providers/HistoryStoreProvider"

const NavbarMobile = () => {
  const { active, openWidget, closeWidget } = useHistoryStore((state) => state)

  const handleOpenHistory = () => {
    if (!active) {
      return openWidget()
    }
    closeWidget()
  }

  const historyActionLink = { action: handleOpenHistory, label: "History" }

  return (
    <>
      <div className="fixed bottom-0 z-50 left-0 md:hidden w-full px-5 py-3 bg-white border-t-[1px] border-white-200">
        <Navbar links={[...LINKS_HEADER, historyActionLink]} />
      </div>
      <div className="block md:hidden h-[56px]"></div>
    </>
  )
}

export default NavbarMobile
