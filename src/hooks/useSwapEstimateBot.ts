"use client"

import { useState } from "react"

import { setSettings } from "@src/libs/de-sdk/settings"
import { concurrentEstimateSwap } from "@src/libs/de-sdk"
import {
  DataEstimateRequest,
  SwapEstimateProviderResponse,
} from "@src/libs/de-sdk/types/interfaces"

export interface SwapEstimateBotResult {
  bestOut: string | null
  allEstimates?: SwapEstimateProviderResponse[]
}

const useSwapEstimateBot = () => {
  const [isFetching, setFetching] = useState(false)

  const getSwapEstimateBot = async (
    data: DataEstimateRequest
  ): Promise<SwapEstimateBotResult> => {
    setFetching(true)
    // console.log("getSwapEstimateBot data:", data)
    const estimates = await concurrentEstimateSwap(data)

    if (!estimates.length) {
      setFetching(false)
      return {
        bestOut: null,
      }
    }

    const sortEstimates = estimates.sort(
      (a, b) => Number(b.amount_out) - Number(a.amount_out)
    )
    console.log("useSwapEstimateBot: ", estimates)
    setFetching(false)
    return {
      bestOut: sortEstimates[0].amount_out,
      allEstimates: sortEstimates[0]?.list,
    }
  }

  return {
    isFetching,
    getSwapEstimateBot,
  }
}

export default useSwapEstimateBot
