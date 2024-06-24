"use client"

import { useEffect, useState } from "react"

import { useWalletSelector } from "@src/providers/WalletSelectorProvider"
import { nep141Balance } from "@src/utils/near"
import { NetworkTokenWithSwapRoute } from "@src/types/interfaces"

export const useGetTokensBalance = (
  tokensList: NetworkTokenWithSwapRoute[]
) => {
  const [data, setData] = useState<NetworkTokenWithSwapRoute[]>([])
  const { accountId } = useWalletSelector()

  const getTokensBalance = async () => {
    const dataWithBalances = await Promise.all(
      tokensList.map(async (token) => {
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
  }

  return {
    data,
    getTokensBalance,
  }
}
