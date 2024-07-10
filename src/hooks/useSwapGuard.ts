"use client"

import { useState } from "react"

export enum SwapGuardErrorEnum {
  INSUFFICIENT_BALANCE = "Insufficient Balance",
  NOT_AVAILABLE_SWAP = "Not Available Swap",
}

export const useSwapGuard = () => {
  const [errorMsg, setErrorMsg] = useState<SwapGuardErrorEnum>()

  const handleValidateInputs = () => {}

  return {
    errorMsg,
    handleValidateInputs,
  }
}
