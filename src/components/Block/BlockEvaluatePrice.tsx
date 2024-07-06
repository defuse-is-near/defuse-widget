"use client"

import React from "react"
import { InfoCircledIcon } from "@radix-ui/react-icons"
import { Tooltip } from "@radix-ui/themes"
import clsx from "clsx"

import { smallBalanceToFormat } from "@src/utils/token"
import {
  EvaluateResultEnum,
  EvaluateSwapEstimationResult,
} from "@src/hooks/useEvaluateSwapEstimation"

const BlockEvaluatePrice = ({
  priceEvaluation,
  priceResults,
}: EvaluateSwapEstimationResult) => {
  return (
    <div className="absolute top-4 left-5 flex flex-nowrap gap-2 items-center text-sm font-medium text-secondary">
      {priceEvaluation && (
        <span
          className={clsx(
            "px-2 py-0.5 rounded-full text-xs",
            priceEvaluation === EvaluateResultEnum.BEST &&
              "bg-green text-white",
            priceEvaluation === EvaluateResultEnum.LOW &&
              "bg-red-100 text-red-400"
          )}
        >
          {priceEvaluation}
        </span>
      )}
      {priceResults?.length && (
        <Tooltip
          content={
            <span className="flex flex-col gap-1">
              {priceResults.map((result, i) => (
                <span key={i}>
                  Rate {smallBalanceToFormat(result.amount_out)} from{" "}
                  {result.solver_id}
                </span>
              ))}
            </span>
          }
        >
          <InfoCircledIcon />
        </Tooltip>
      )}
    </div>
  )
}

export default BlockEvaluatePrice
