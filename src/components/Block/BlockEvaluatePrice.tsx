"use client"

import React from "react"
import { InfoCircledIcon } from "@radix-ui/react-icons"
import { Tooltip } from "@radix-ui/themes"
import clsx from "clsx"

import { EvaluateResultEnum } from "@src/hooks/useEvaluateSwapEstimation"
import { SwapEstimateProviderResponse } from "@src/libs/de-sdk/types/interfaces"
import { NetworkToken } from "@src/types/interfaces"
import { tokenBalanceToFormatUnits } from "@src/utils/token"

const BlockEvaluatePrice = ({
  priceEvaluation,
  priceResults,
  tokenOut,
}: {
  priceEvaluation?: EvaluateResultEnum
  priceResults: SwapEstimateProviderResponse[] | null
  tokenOut?: NetworkToken
}) => {
  return (
    <span className="flex flex-nowrap gap-2 items-center text-sm font-medium text-secondary">
      {priceEvaluation && (
        <span
          className={clsx(
            "flex flex-nowrap items-center gap-1 p-1.5 py-0.5 rounded-full text-xs",
            priceEvaluation === EvaluateResultEnum.BEST &&
              "bg-green-800 text-black",
            priceEvaluation === EvaluateResultEnum.LOW && "bg-pink text-white"
          )}
        >
          {priceEvaluation}
          {tokenOut && priceResults?.length && (
            <Tooltip
              content={
                <span className="flex flex-col gap-1">
                  {priceResults.map((providers, i) =>
                    providers.map((result) => {
                      return (
                        <span key={i}>
                          Rate{" "}
                          {tokenBalanceToFormatUnits({
                            balance: result.amount_out,
                            decimals: tokenOut.decimals!,
                          })}{" "}
                          from {result.solver_id}
                        </span>
                      )
                    })
                  )}
                </span>
              }
            >
              <InfoCircledIcon />
            </Tooltip>
          )}
        </span>
      )}
    </span>
  )
}

export default BlockEvaluatePrice
