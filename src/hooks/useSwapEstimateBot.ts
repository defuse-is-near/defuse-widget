"use client"

import { useState } from "react"

import { setSettings } from "@src/libs/de-sdk/settings"
import { concurrentEstimateSwap } from "@src/libs/de-sdk"
import { DataEstimateRequest } from "@src/libs/de-sdk/types/interfaces"

const useSwapEstimateBot = (externalProviders: unknown[] = []) => {
  const [isFetching, setFetching] = useState(false)
  const providerIds = externalProviders.filter(
    (provider): provider is string => typeof provider === "string"
  )

  setSettings({ providerIds })

  const getSwapEstimateBot = async (
    data: DataEstimateRequest
  ): Promise<string> => {
    setFetching(true)
    console.log("getSwapEstimateBot data:", data)
    const estimates = await concurrentEstimateSwap(data)
    const sortEstimates = estimates.sort(
      (a, b) => Number(b.estimateOut) - Number(a.estimateOut)
    )
    console.log("useSwapEstimateBot: ", estimates)
    setFetching(false)
    return sortEstimates[0].estimateOut
  }

  return {
    isFetching,
    getSwapEstimateBot,
  }
}

export default useSwapEstimateBot
