"use client"

import { useState } from "react"

import { DataEstimateRequest } from "@src/libs/de-sdk/types/interfaces"
import { SwapEstimateBotResult } from "@src/hooks/useSwapEstimateBot"
import { swapEstimateRefFinanceProvider } from "@src/libs/de-sdk/providers/refFinanceProvider"
import { useTokensStore } from "@src/providers/TokensStoreProvider"
import { NetworkTokenWithSwapRoute } from "@src/types/interfaces"

const IS_DISABLE_QUOTING_FROM_REF =
  process.env.NEXT_PUBLIC_DISABLE_QUOTING_FROM_REF === "true"
const IS_DISABLE_QUOTING_FROM_COINGECKO =
  process.env.NEXT_PUBLIC_DISABLE_QUOTING_FROM_COINGECKO === "true"

export enum EvaluateResultEnum {
  BEST = "best price",
  LOW = "low price",
}

export interface EvaluateSwapEstimationResult {
  priceEvaluation: EvaluateResultEnum | undefined
  priceResults?: {
    solver_id: string
    amount_out: string
  }[]
}

const HIGH_REQUEST = 1000
const ESTIMATE_DIFFERENCE_PERCENTAGE = 2

export const useEvaluateSwapEstimation = () => {
  const [data, setData] = useState<EvaluateSwapEstimationResult | undefined>()
  const [isFetched, setIsFetched] = useState(false)
  const { data: tokensData } = useTokensStore((state) => state)

  const findTokenByName = (
    tokenAddress: string
  ): NetworkTokenWithSwapRoute | undefined => {
    let token = undefined
    if (tokensData.size) {
      tokensData.forEach((networkToken) => {
        if (networkToken.address === tokenAddress) {
          token = networkToken
        }
      })
    }
    return token
  }

  const getSwapEstimateFromRefFinance = async (
    fieldName: string,
    dataEstimate: DataEstimateRequest,
    bestOut: SwapEstimateBotResult["bestOut"]
  ): Promise<void> => {
    const token = findTokenByName(
      fieldName === "tokenIn" ? dataEstimate.tokenIn : dataEstimate.tokenOut
    )

    const isHighRequest =
      bestOut &&
      token?.convertedLast?.usd &&
      Number(bestOut) * token?.convertedLast?.usd > HIGH_REQUEST

    if (!isHighRequest && !IS_DISABLE_QUOTING_FROM_REF) {
      const result = await swapEstimateRefFinanceProvider(dataEstimate)
      if (parseFloat(result.amount_out) && bestOut) {
        if (bestOut > result.amount_out) {
          setData((state) => ({
            priceEvaluation: EvaluateResultEnum.BEST,
            priceResults: state?.priceResults,
          }))
          return
        }
        const resultAmountOut = parseFloat(result.amount_out)
        const difference = Math.abs(Number(bestOut) - resultAmountOut)
        const average = (Number(bestOut) + resultAmountOut) / 2
        const percentageDifference = (difference / average) * 100

        if (percentageDifference > ESTIMATE_DIFFERENCE_PERCENTAGE) {
          setData((state) => ({
            priceEvaluation: EvaluateResultEnum.LOW,
            priceResults: state?.priceResults,
          }))
          return
        }
      }
      return
    }

    setData((state) => ({
      priceEvaluation: EvaluateResultEnum.BEST,
      priceResults: state?.priceResults,
    }))
  }

  const getSolversResults = (
    estimatesFromSolvers: SwapEstimateBotResult["allEstimates"]
  ) => {
    setData((state) => ({
      priceEvaluation: state?.priceEvaluation,
      priceResults: estimatesFromSolvers,
    }))
  }

  const cleanEvaluateSwapEstimate = () => {
    setData({
      priceEvaluation: undefined,
      priceResults: undefined,
    })
  }

  const getEvaluateSwapEstimate = async (
    fieldName: string,
    data: DataEstimateRequest,
    estimatesFromSolvers: SwapEstimateBotResult["allEstimates"],
    bestOut: SwapEstimateBotResult["bestOut"]
  ): Promise<void> => {
    cleanEvaluateSwapEstimate()
    getSolversResults(estimatesFromSolvers)

    setIsFetched(true)
    await getSwapEstimateFromRefFinance(fieldName, data, bestOut)
    setIsFetched(false)
  }

  return {
    data,
    cleanEvaluateSwapEstimate,
    getEvaluateSwapEstimate,
  }
}
