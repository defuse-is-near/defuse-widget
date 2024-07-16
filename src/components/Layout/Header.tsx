"use client"

import React from "react"
import Link from "next/link"
import clsx from "clsx"
import { Text } from "@radix-ui/themes"

import Logo from "@src/components/Logo"
import Navbar from "@src/components/Navbar"
import ConnectWallet from "@src/components/Wallet"
import Settings from "@src/components/Settings"
import { Navigation } from "@src/constants/routes"

const TURN_OFF_APPS = process?.env?.turnOffApps === "true" ?? true
const NEXT_PUBLIC_APP_URL = process?.env?.appUrl ?? ""

const Header = () => {
  return (
    <>
      <header className="h-[56px] fixed top-0 left-0 w-full md:relative border-b-[1px] border-white-200 z-50 bg-transparent dark:border-black-600">
        <div className="h-full flex justify-between items-center px-3">
          <Logo />
          <div className="hidden md:flex justify-center w-full max-w-5xl pl-3">
            {!TURN_OFF_APPS && <Navbar />}
          </div>
          <div className="flex justify-between items-center gap-4">
            {!TURN_OFF_APPS && (
              <>
                <ConnectWallet />
                {/*  TODO Wallet page has to be re-designed */}
                {/*<Settings />*/}
              </>
            )}
            {TURN_OFF_APPS && (
              <>
                <Link
                  href={Navigation.JOBS}
                  className="hidden md:block relative px-3 py-1.5 rounded-full text-sm"
                >
                  Jobs
                </Link>
                <Link
                  href={NEXT_PUBLIC_APP_URL}
                  className={clsx(
                    "rounded-full text-white px-4 py-2.5 text-sm bg-primary hover:bg-primary-200"
                  )}
                  target="_blank"
                >
                  <Text size="2" weight="medium" wrap="nowrap">
                    Launch App
                  </Text>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>
      <div className="block md:hidden h-[56px]"></div>
    </>
  )
}

export default Header
