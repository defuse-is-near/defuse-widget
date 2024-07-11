"use client"

import { useState } from "react"

import { NetworkTokenWithSwapRoute } from "@src/types/interfaces"

export enum SwapGuardErrorEnum {
  INSUFFICIENT_BALANCE = "Insufficient Balance",
  NOT_AVAILABLE_SWAP = "Not Available Swap",
}

export const useSwapGuard = () => {
  const [errorMsg, setErrorMsg] = useState<SwapGuardErrorEnum>()

  const handleValidateInputs = ({
    tokenIn,
    selectTokenIn,
    selectTokenOut,
  }: {
    tokenIn: string
    selectTokenIn: NetworkTokenWithSwapRoute
    selectTokenOut: NetworkTokenWithSwapRoute
  }) => {
    setErrorMsg(undefined)
    if (!selectTokenIn.routes?.includes(selectTokenOut.defuse_asset_id)) {
      setErrorMsg(SwapGuardErrorEnum.NOT_AVAILABLE_SWAP)
    } else {
      const isExceedBalance =
        parseFloat(tokenIn) > (selectTokenIn?.balance ?? 0)
      isExceedBalance && setErrorMsg(SwapGuardErrorEnum.INSUFFICIENT_BALANCE)
    }
  }

  return {
    errorMsg,
    handleValidateInputs,
  }
}
