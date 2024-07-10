"use client"

import { Box, Text, Tabs, Spinner } from "@radix-ui/themes"
import { PropsWithChildren, useEffect, useState } from "react"
import { formatUnits } from "viem"

import LabelComingSoon from "@src/components/LabelComingSoon"
import { useTokensStore } from "@src/providers/TokensStoreProvider"
import { useAccountBalance } from "@src/hooks/useAccountBalance"
import { LIST_NATIVE_TOKENS } from "@src/constants/tokens"

const IS_DISABLED_ALL_TABS = true

const ConnectWalletTabBox = ({ children }: PropsWithChildren) => {
  return (
    <div className="pt-[22px] pb-[26px] flex flex-col gap-2">{children}</div>
  )
}

const ConnectWalletTabs = () => {
  const [isLoading, setIsLoading] = useState(false)
  const { data, isFetched } = useTokensStore((state) => state)
  const [totalBalanceInUsd, setTotalBalanceInUsd] = useState<
    number | undefined
  >()
  const { getAccountBalance } = useAccountBalance()

  const getBalanceToUsd = async () => {
    setIsLoading(true)
    let balanceInUsd = 0
    const temp = []
    let wNearConvertedLastUsd = 0

    data.forEach((token) => {
      temp.push(token)
      if (token?.balanceToUsd && token?.balanceToUsd > 0) {
        balanceInUsd = Number(balanceInUsd) + Number(token!.balanceToUsd)
        if (token.defuse_asset_id === "near:mainnet:wrap.near") {
          wNearConvertedLastUsd = token.convertedLast!.usd
        }
      }
    })

    const tokenNearNative = LIST_NATIVE_TOKENS.find(
      (token) => token.defuse_asset_id === "near:mainnet:0x1"
    )

    const { balance } = await getAccountBalance()
    const nativeBalanceInUsd = formatUnits(
      BigInt(balance),
      tokenNearNative!.decimals as number
    )

    balanceInUsd += Number(nativeBalanceInUsd) * wNearConvertedLastUsd

    setTotalBalanceInUsd(balanceInUsd)
    setIsLoading(false)
  }

  useEffect(() => {
    if (data.size && isFetched) {
      getBalanceToUsd()
    }
  }, [data, isFetched])

  const TabTotalBalance = () => {
    return (
      <ConnectWalletTabBox>
        {isLoading ? (
          <div className="h-[36px]">
            <Spinner loading={isLoading} />
          </div>
        ) : (
          <Text size="7" weight="bold">
            ${totalBalanceInUsd ? totalBalanceInUsd?.toFixed(2) : "0.00"}
          </Text>
        )}
        <Text size="2" weight="medium" className="text-gray-600">
          Total balance
        </Text>
      </ConnectWalletTabBox>
    )
  }

  return IS_DISABLED_ALL_TABS ? (
    <TabTotalBalance />
  ) : (
    <Tabs.Root defaultValue="account">
      <Tabs.List color="orange">
        <Tabs.Trigger value="available">Available</Tabs.Trigger>
        <Tabs.Trigger value="deposited" className="pointer-events-none">
          <div className="relative">
            Deposited
            <LabelComingSoon className="-top-4" />
          </div>
        </Tabs.Trigger>
      </Tabs.List>

      <Box pt="3" className="border-b-[1px] border-white-900 -mx-4 px-4">
        <Tabs.Content value="available">
          <TabTotalBalance />
        </Tabs.Content>

        <Tabs.Content value="deposited">
          <ConnectWalletTabBox>
            <Text size="2">Deposited</Text>
          </ConnectWalletTabBox>
        </Tabs.Content>
      </Box>
    </Tabs.Root>
  )
}

export default ConnectWalletTabs
