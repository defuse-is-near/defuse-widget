"use client"

import Logo from "@src/components/Logo"
import Navbar from "@src/components/Navbar"
import ConnectWallet from "@src/components/ConnectWallet"
import Settings from "@src/components/Settings"

const Header = () => {
  return (
    <>
      <header className="h-[56px] fixed top-0 left-0 w-full md:relative border-b-[1px] border-white-200 z-50 bg-transparent">
        <div className="h-full flex justify-between items-center px-3">
          <Logo />
          <div className="hidden md:flex justify-center w-full max-w-5xl pl-3">
            <Navbar />
          </div>
          <div className="flex justify-between items-center gap-4">
            <ConnectWallet />
            <Settings />
          </div>
        </div>
      </header>
      <div className="block md:hidden h-[56px]"></div>
    </>
  )
}

export default Header
