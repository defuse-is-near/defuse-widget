"use client"

import { useState } from "react"
import { formatUnits } from "viem"

import { swapEstimateRefFinanceProvider } from "@src/libs/de-sdk/providers/refFinanceProvider"
import { NetworkToken } from "@src/types/interfaces"

const IS_DISABLE_QUOTING_FROM_REF =
  process.env.NEXT_PUBLIC_DISABLE_QUOTING_FROM_REF === "true"
// const IS_DISABLE_QUOTING_FROM_COINGECKO =
//   process.env.NEXT_PUBLIC_DISABLE_QUOTING_FROM_COINGECKO === "true"

export enum EvaluateResultEnum {
  BEST = "best price",
  LOW = "low price",
}

export interface EvaluateSwapEstimationResult {
  priceEvaluation: EvaluateResultEnum | undefined
}

const ESTIMATE_DIFFERENCE_PERCENTAGE = 2
function prepareRefAddressData(address: string) {
  if (address === "native") return "wrap.near"
  return address
}
export const useEvaluateSwapEstimation = () => {
  const [data, setData] = useState<EvaluateSwapEstimationResult | undefined>()

  const getSwapEstimateFromRefFinance = async (
    tokenIn: NetworkToken,
    tokenOut: NetworkToken,
    amountIn: string,
    bestOut: string
  ): Promise<void> => {
    const result = await swapEstimateRefFinanceProvider({
      tokenIn: prepareRefAddressData(tokenIn.address!),
      tokenOut: prepareRefAddressData(tokenOut.address!),
      amountIn,
    })
    const refFinancePrice = +result
    const bestOutN = +formatUnits(BigInt(bestOut), tokenOut.decimals!)
    if (bestOutN > refFinancePrice) {
      setData({
        priceEvaluation: EvaluateResultEnum.BEST,
      })
      return
    }

    const difference = Math.abs(Number(bestOutN) - refFinancePrice)
    const average = (bestOutN + refFinancePrice) / 2
    const percentageDifference = (difference / average) * 100

    if (percentageDifference > ESTIMATE_DIFFERENCE_PERCENTAGE) {
      setData({
        priceEvaluation: EvaluateResultEnum.LOW,
      })
      return
    }

    return
  }

  const getEvaluateSwapEstimate = async (
    tokenIn: NetworkToken,
    tokenOut: NetworkToken,
    amountIn: string,
    bestOut: string | null
  ): Promise<void> => {
    setData({
      priceEvaluation: undefined,
    })

    if (bestOut === null) return

    if (!IS_DISABLE_QUOTING_FROM_REF) {
      if (tokenIn.blockchain === "near" && tokenOut.blockchain === "near") {
        await getSwapEstimateFromRefFinance(
          tokenIn,
          tokenOut,
          amountIn,
          bestOut
        )
      }
      return
    }
  }

  return {
    data,
    getEvaluateSwapEstimate,
  }
}
