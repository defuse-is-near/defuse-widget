"use client"

import { useRouter } from "next/navigation"

import { Navigation } from "@src/constants/routes"
import Banner from "@src/app/(home)/Banner"
import PaperHome from "@src/app/(home)/PaperHome"
import InvestorLogo from "@src/app/(home)/InvestorLogo"
import Vision from "@src/app/(home)/Vision"
import Evolution from "@src/app/(home)/Evolution"
import Button from "@src/components/Button/Button"
import Infrastructure from "@src/app/(home)/Infrastructure"
import Interested from "@src/app/(home)/Interested"
import FAQ from "@src/app/(home)/FAQ"
import CardSocial from "@src/app/(home)/Card/CardSocial"

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
        <Infrastructure />
        <Interested />
        <FAQ />
      </PaperHome>
      <div className="flex flex-col mt-[56px] md:mt-[108px] mb-[39px] md:mb-[106px]">
        <div className="max-w-[189px] md:max-w-full mx-auto mb-[28px] md:[56px]">
          <h2 className="font-black mb-5 text-black-400 text-[32px] md:text-5xl text-center">
            Connect with Defuse
          </h2>
        </div>
        <div className="w-full justify-center flex flex-wrap gap-5 px-5">
          <CardSocial name="Follow on X" icon="/static/icons/X.svg" link="#" />
          <CardSocial
            name="Join Discord"
            icon="/static/icons/discord.svg"
            link="#"
          />
          <CardSocial
            name="Documentation"
            icon="/static/icons/Docs.svg"
            link="#"
          />
        </div>
      </div>
    </div>
  )
}
