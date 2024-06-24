"use client"

import React, { PropsWithChildren, useEffect } from "react"
import { setNearProvider, getNearProvider } from "@near-eth/client"
import { providers } from "near-api-js"

import {
  GetAccountBalanceProps,
  useAccountBalance,
} from "@src/hooks/useAccountBalance"
import { useGetTokensBalance } from "@src/hooks/useGetTokensBalance"
import { useCombinedTokensListAdapter } from "@src/hooks/useTokensListAdapter"
import { useWalletSelector } from "@src/providers/WalletSelectorProvider"

const NEAR_NODE_URL = process.env.NEAR_NODE_URL ?? ""

export function withTokensBalance<T extends React.ComponentType>(
  WrappedComponent: T
): React.FC<PropsWithChildren & React.ComponentProps<T>> {
  const displayName =
    WrappedComponent.displayName || WrappedComponent.name || "Component"

  const ComponentWithTokensBalance: React.FC<PropsWithChildren> = ({
    children,
    ...rest
  }) => {
    const { accountId } = useWalletSelector()
    const { data: dataTokenList, isFetching } = useCombinedTokensListAdapter()
    const {} = useGetTokensBalance(dataTokenList)
    const { getAccountBalance } = useAccountBalance()

    setNearProvider(new providers.JsonRpcProvider({ url: NEAR_NODE_URL }))

    const handleUpdateDataTokenList = async () => {
      const provider = getNearProvider()
      const updateDataTokenLis = await Promise.all(
        dataTokenList.map((token) => {
          return getAccountBalance({
            provider,
            accountId,
          } as GetAccountBalanceProps)
        })
      )
      console.log(updateDataTokenLis, "updateDataTokenLis")
    }

    useEffect(() => {
      if (!isFetching && dataTokenList) {
        handleUpdateDataTokenList()
      }
    }, [dataTokenList, isFetching])

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
