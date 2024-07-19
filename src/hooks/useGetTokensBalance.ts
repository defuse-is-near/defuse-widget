"use client"

import { useEffect, useState } from "react"
import { formatUnits } from "viem"

import { useWalletSelector } from "@src/providers/WalletSelectorProvider"
import { nep141Balance } from "@src/utils/near"
import { NetworkTokenWithSwapRoute, TokenBalance } from "@src/types/interfaces"
import { useHistoryStore } from "@src/providers/HistoryStoreProvider"
import { useGetCoingeckoExchangesList } from "@src/api/hooks/exchanges/useGetCoingeckoExchangesList"
import { CoingeckoExchanges } from "@src/types/coingecko"

export const useGetTokensBalance = (
  tokensList: NetworkTokenWithSwapRoute[]
) => {
  const [isFetching, setIsFetching] = useState(false)
  const [isError, setIsError] = useState(false)
  const [data, setData] = useState<NetworkTokenWithSwapRoute[]>([])
  const { accountId } = useWalletSelector()
  const { activePreview } = useHistoryStore((state) => state)
  const { data: exchangesList, isFetched } = useGetCoingeckoExchangesList()

  const getTokensBalance = async () => {
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

          let balance: number | undefined = undefined
          if (accountId && token?.address && token.address !== "native") {
            const getBalance = await nep141Balance(
              accountId as string,
              token.address as string
            )
            if (getBalance) {
              balance = Number(
                formatUnits(
                  BigInt(getBalance as string),
                  token.decimals as number
                )
              )
              Object.assign(tokenBalance, { balance })
            }
          }

          const getCoinIndex = (
            exchangesList as CoingeckoExchanges
          )?.tickers?.findIndex((coin) => {
            const defuseAssetId = token?.defuse_asset_id?.split(":")
            if (defuseAssetId.length === 3) {
              return coin.base.toLowerCase() === defuseAssetId[2].toLowerCase()
            }
          })

          if (getCoinIndex !== -1) {
            const convertedLastUsd = (exchangesList as CoingeckoExchanges)
              ?.tickers[getCoinIndex].converted_last.usd
            if (convertedLastUsd) {
              Object.assign(tokenBalance, {
                convertedLast: { usd: convertedLastUsd },
              })
            }
            if (balance) {
              const balanceToUsd = balance * convertedLastUsd
              Object.assign(tokenBalance, {
                balanceToUsd,
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
  }

  const clearTokensBalance = () => {
    const dataCleanBalances = data.map(
      ({ balance, balanceToUsd, convertedLast, ...rest }) => ({ ...rest })
    )
    setData(dataCleanBalances)
  }

  useEffect(() => {
    if (tokensList || activePreview || isFetched) {
      getTokensBalance()
    }
  }, [accountId, tokensList, activePreview, isFetched])

  useEffect(() => {
    if (!accountId) {
      clearTokensBalance()
    }
  }, [accountId])

  return {
    data,
    isFetching,
    isError,
  }
}
