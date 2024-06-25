"use client"

import { useCallback, useEffect, useState } from "react"

import { useWalletSelector } from "@src/providers/WalletSelectorProvider"
import { nep141Balance } from "@src/utils/near"
import { NetworkTokenWithSwapRoute } from "@src/types/interfaces"

export const useGetTokensBalance = (
  tokensList: NetworkTokenWithSwapRoute[]
) => {
  const [isFetching, setIsFetching] = useState(false)
  const [isError, setIsError] = useState(false)
  const [data, setData] = useState<NetworkTokenWithSwapRoute[]>([])
  const { accountId } = useWalletSelector()

  const getTokensBalance = useCallback(async () => {
    try {
      setIsFetching(true)
      const dataWithBalances = await Promise.all(
        tokensList.map(async (token) => {
          if (token.chainName?.toLocaleLowerCase() !== "near") {
            return token
          }
          const balance: string | null = await nep141Balance(
            accountId as string,
            token.address as string
          )
          return {
            ...token,
            balance: balance ?? "0",
          }
        })
      )

      setData(dataWithBalances)
      setIsFetching(false)
    } catch (e) {
      console.log("useGetTokensBalance: ", e)
      setIsError(true)
      setIsFetching(false)
    }
  }, [tokensList])

  useEffect(() => {
    getTokensBalance()
  }, [tokensList])

  return {
    data,
    isFetching,
    isError,
  }
}
