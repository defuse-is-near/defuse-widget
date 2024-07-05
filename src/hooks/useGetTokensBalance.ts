"use client"

import { useCallback, useEffect, useState } from "react"
import { formatUnits } from "viem"

import { useWalletSelector } from "@src/providers/WalletSelectorProvider"
import { nep141Balance } from "@src/utils/near"
import { NetworkTokenWithSwapRoute, TokenBalance } from "@src/types/interfaces"
import { useHistoryStore } from "@src/providers/HistoryStoreProvider"
import { useGetCoingeckoExchangesList } from "@src/api/hooks/exchanges/useGetCoingeckoExchangesList"
import { useGetCoinsListWithMarketData } from "@src/api/hooks/exchanges/useGetCoinsListWithMarketData"
import { CoingeckoMarkets } from "@src/types/coingecko"

const STABLE_LIST = ["USDC", "USDC.e", "USDt", "USDT.e"]

export const useGetTokensBalance = (
  tokensList: NetworkTokenWithSwapRoute[]
) => {
  const [isFetching, setIsFetching] = useState(false)
  const [isError, setIsError] = useState(false)
  const [data, setData] = useState<NetworkTokenWithSwapRoute[]>([])
  const { accountId } = useWalletSelector()
  const { activePreview } = useHistoryStore((state) => state)
  const { data: marketData, isFetched } = useGetCoinsListWithMarketData()

  const getTokensBalance = useCallback(async () => {
    try {
      setIsFetching(true)
      const dataWithBalances = await Promise.all(
        tokensList.map(async (token) => {
          // Not proceed with fetching balances if token is not belong to near chain
          // Use different Promise map
          if (token.chainName?.toLocaleLowerCase() !== "near") {
            return token
          }

          const tokenBalance: TokenBalance = {}

          let balance: string | undefined = undefined
          if (accountId && token?.address) {
            const getBalance = await nep141Balance(
              accountId as string,
              token.address as string
            )
            if (getBalance) {
              balance = getBalance
              Object.assign(tokenBalance, { balance })
            }
          }

          const getCoinIndex = (marketData as CoingeckoMarkets[])?.findIndex(
            (coin) => {
              if (STABLE_LIST.includes(token?.symbol ?? "")) {
                return true
              }
              if (
                token.symbol === "wNear" &&
                coin.symbol.toLowerCase() === "near"
              ) {
                return true
              }
              if (
                token.symbol?.toLowerCase() === "wBTC" &&
                coin.symbol.toLowerCase() === "btc"
              ) {
                return true
              }
              if (
                token.symbol?.toLowerCase() === "wETH" &&
                coin.symbol.toLowerCase() === "eth"
              ) {
                return true
              }
              if (coin.symbol.toLowerCase() === token.symbol?.toLowerCase()) {
                return true
              }
            }
          )

          const getHigh24h: number | undefined = (
            marketData as CoingeckoMarkets[]
          )?.length
            ? (marketData as CoingeckoMarkets[])[getCoinIndex]?.high_24h
            : undefined
          if (getCoinIndex !== undefined && getCoinIndex !== -1) {
            Object.assign(tokenBalance, { convertedLast: getHigh24h })
            if (balance) {
              const balanceToUds = formatUnits(
                BigInt(balance as string),
                token.decimals as number
              )
              Object.assign(tokenBalance, {
                balanceToUds,
              })
            }
          }

          return {
            ...token,
            ...tokenBalance,
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
  }, [tokensList, marketData])

  useEffect(() => {
    if (tokensList || activePreview || isFetched) {
      getTokensBalance()
    }
  }, [tokensList, activePreview, isFetched])

  return {
    data,
    isFetching,
    isError,
  }
}
