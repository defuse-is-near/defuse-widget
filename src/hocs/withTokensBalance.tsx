"use client"

import React, { PropsWithChildren, useEffect } from "react"
import { formatUnits } from "viem"

import { useGetTokensBalance } from "@src/hooks/useGetTokensBalance"
import { useCombinedTokensListAdapter } from "@src/hooks/useTokensListAdapter"
import { useTokensStore } from "@src/providers/TokensStoreProvider"
import { NetworkTokenWithSwapRoute } from "@src/types/interfaces"
import { LIST_NATIVE_TOKENS } from "@src/constants/tokens"
import { useAccountBalance } from "@src/hooks/useAccountBalance"

export function withTokensBalance<T extends React.ComponentType>(
  WrappedComponent: T
): React.FC<PropsWithChildren & React.ComponentProps<T>> {
  const displayName =
    WrappedComponent.displayName || WrappedComponent.name || "Component"

  const ComponentWithTokensBalance: React.FC<PropsWithChildren> = ({
    children,
    ...rest
  }) => {
    const { data: dataTokenList } = useCombinedTokensListAdapter()
    const { data: dataTokensBalance } = useGetTokensBalance(dataTokenList)
    const { onLoad, updateTokens } = useTokensStore((state) => state)
    const { getAccountBalance } = useAccountBalance()

    const handlePrepareNativeTokenList = async (): Promise<
      NetworkTokenWithSwapRoute[]
    > => {
      const nativeTokenList = await Promise.all(
        LIST_NATIVE_TOKENS.map(async (token) => {
          switch (token.blockchain) {
            case "near":
              const { balance } = await getAccountBalance()
              const formattedAmountOut = formatUnits(
                BigInt(balance),
                token.decimals as number
              )
              const wNear = dataTokensBalance.find(
                (token) => token.defuse_asset_id === "near:mainnet:wrap.near"
              )
              const wNearRoutes = wNear?.routes ?? []
              const nearRoutes = token?.routes ?? []
              return {
                ...token,
                balance: parseFloat(formattedAmountOut),
                balanceToUsd: wNear?.balanceToUsd ?? 0,
                convertedLast: {
                  usd: wNear?.convertedLast?.usd ?? 0,
                },
                routes: [...nearRoutes, ...wNearRoutes],
              }
            default:
              return token
          }
        })
      )
      return nativeTokenList as NetworkTokenWithSwapRoute[]
    }

    const handleInjectPlatformWNativeToNativeSupport = (
      dataTokens: NetworkTokenWithSwapRoute[]
    ): NetworkTokenWithSwapRoute[] => {
      return dataTokens.map((token) => {
        switch (token.defuse_asset_id) {
          case "near:mainnet:wrap.near":
            const nearRoutes = token?.routes ?? []
            return {
              ...token,
              routes: [...nearRoutes, "near:mainnet:native"],
            }
          default:
            return token
        }
      })
    }

    const handleUpdateDataTokenList = async () => {
      const getNativeListWithBalance = await handlePrepareNativeTokenList()
      updateTokens([
        ...handleInjectPlatformWNativeToNativeSupport(dataTokensBalance),
        ...getNativeListWithBalance,
      ])
    }

    useEffect(() => {
      if (!dataTokensBalance) {
        return
      }
      onLoad()
      handleUpdateDataTokenList()
    }, [dataTokensBalance])

    return (
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      <WrappedComponent {...rest}>{children}</WrappedComponent>
    )
  }

  ComponentWithTokensBalance.displayName = `WithTokensBalance(${displayName})`

  return ComponentWithTokensBalance as React.FC<
    PropsWithChildren & React.ComponentProps<T>
  >
}
