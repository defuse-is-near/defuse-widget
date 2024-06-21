"use client"

import { useRouter } from "next/navigation"

import { Navigation } from "@src/constants/routes"
import Banner from "@src/app/(home)/Banner"
import PaperHome from "@src/app/(home)/PaperHome"
import InvestorLogo from "@src/app/(home)/InvestorLogo"
import Vision from "@src/app/(home)/Vision"
import Evolution from "@src/app/(home)/Evolution"
import Button from "@src/components/Button/Button"

const TURN_OFF_APPS = process?.env?.turnOffApps === "true" ?? true

export default function Home() {
  const router = useRouter()

  return (
    <div className="flex flex-col flex-1 justify-start item-center">
      <Banner />
      <div className="w-full mx-auto flex flex-col items-center gap-6 pt-10 md:pt-0 z-10 my-[72px] md:mt-[148px] md:mb-[156px]">
        <h1 className="text-3xl md:text-6xl text-center font-bold md:text-nowrap">
          Welcome to Defuse
        </h1>
        <p className="max-w-[561px] text-center text-xl md:text-[40px] font-black md:leading-[48px] tracking-[-0.4px] text-gray-600">
          Your Multichain DeFi Hub
        </p>
        <Button
          onClick={() => router.push(Navigation.SWAP)}
          size="lg"
          variant="base"
          disabled={TURN_OFF_APPS}
        >
          Coming soon
        </Button>
      </div>
      <PaperHome>
        <InvestorLogo />
        <Vision />
        <Evolution />
      </PaperHome>
    </div>
  )
}
