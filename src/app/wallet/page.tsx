"use client"

import React, { useEffect, useState } from "react"
import { Spinner, Text, TextArea } from "@radix-ui/themes"
import { formatUnits } from "viem"

import CardBalance from "@src/app/wallet/CardBalance"
import CardTokenList from "@src/app/wallet/CardTokenList"
import {
  nearTokenList,
  otherTokenList,
} from "@src/app/wallet/CardBalance/mocks"
import { NetworkTokenWithSwapRoute } from "@src/types/interfaces"
import { useTokensStore } from "@src/providers/TokensStoreProvider"
import { useAccountBalance } from "@src/hooks/useAccountBalance"
import { LIST_NATIVE_TOKENS } from "@src/constants/tokens"

export interface EmptyTokenBalance {
  name: string
  symbol: string
  balance: string
  icon?: string
  balanceToUsd?: string
  chainId?: string
}

export default function Wallet() {
  const { data, isFetched } = useTokensStore((state) => state)
  const [assetListWithBalances, setAssetListWithBalances] = useState<
    NetworkTokenWithSwapRoute[]
  >([])
  const { getAccountBalance } = useAccountBalance()

  const [balanceNear, setBalanceNear] = useState<string | undefined>()

  useEffect(() => {
    const tokenNearNative = LIST_NATIVE_TOKENS.find(
      (token) => token.defuse_asset_id === "near:mainnet:0x1"
    )

    ;(async () => {
      const { balance } = await getAccountBalance()
      const formattedAmountOut = formatUnits(
        BigInt(balance),
        tokenNearNative!.decimals as number
      )
      setBalanceNear(formattedAmountOut)
    })()

    if (!data.size) {
      return
    }

    const getAssetListWithBalances: NetworkTokenWithSwapRoute[] = []
    data.forEach((value) => {
      if (value?.balance) {
        getAssetListWithBalances.push({
          ...value,
          balance: value?.balance,
        })
      }
    })

    setAssetListWithBalances(getAssetListWithBalances)
  }, [data])

  return (
    <div className="flex flex-col flex-1 mx-3 md:mx-6">
      <div className="w-full mx-auto max-w-[768px] mt-[24px] mb-[32px] md:mt-[64px] md:mb-[90px]">
        <h1 className="mb-8">Wallet</h1>
      </div>
      <div className="w-full mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-10 mb-[90px]">
        <div className="flex flex-col gap-8">
          <CardBalance
            label="NEAR balance (available)"
            balance={balanceNear?.substring(0, 12) ?? "0.00"}
          />
          {!isFetched ? (
            <div className="flex justify-center">
              <Spinner loading={!isFetched} size="3" />
            </div>
          ) : (
            <CardTokenList
              list={
                assetListWithBalances ? assetListWithBalances : nearTokenList
              }
            />
          )}
        </div>
        <div className="flex flex-col gap-8 blur-sm">
          <CardBalance label="Deposited balance" balance="Deposited balance" />
          <CardTokenList list={otherTokenList} />
        </div>
      </div>
    </div>
  )
}
