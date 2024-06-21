"use client"

import { useRouter } from "next/navigation"

import { Navigation } from "@src/constants/routes"
import Button from "@src/components/Button/Button"

const TURN_OFF_APPS = process?.env?.turnOffApps === "true" ?? true

export default function Home() {
  const router = useRouter()

  return (
    <div className="flex flex-col flex-1 justify-center item-center">
      <div className="w-full mx-auto flex flex-col items-center gap-6 pt-10 md:pt-0">
        <h1 className="text-3xl md:text-6xl text-center font-bold md:text-nowrap">
          Welcome to Defuse
        </h1>
        <p className="max-w-[561px] text-center text-xl md:text-[40px] font-black md:leading-[48px] tracking-[-0.4px] text-gray-600">
          Next-Generation Platform for Unified Cross-Chain DeFi
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
    </div>
  )
}
