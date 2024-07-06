"use client"

import { Box, Text, Tabs, Spinner } from "@radix-ui/themes"
import { PropsWithChildren, useEffect, useState } from "react"

import LabelComingSoon from "@src/components/LabelComingSoon"
import { useTokensStore } from "@src/providers/TokensStoreProvider"

const ConnectWalletTabBox = ({ children }: PropsWithChildren) => {
  return (
    <div className="pt-[22px] pb-[26px] flex flex-col gap-2">{children}</div>
  )
}

const ConnectWalletTabs = () => {
  const { data, isLoading, isFetched } = useTokensStore((state) => state)
  const [totalBalanceInUsd, setTotalBalanceInUsd] = useState<
    number | undefined
  >()

  useEffect(() => {
    if (data.size && isFetched) {
      let balanceInUsd = 0
      const temp = []
      data.forEach((token) => {
        temp.push(token)
        if (token?.balanceToUds && token?.balanceToUds > 0) {
          balanceInUsd = Number(balanceInUsd) + Number(token!.balanceToUds)
        }
      })
      // TODO Has to be fixed getting balances for Native and Wrap Native tokens
      setTotalBalanceInUsd(balanceInUsd)
    }
  }, [data, isFetched])

  return (
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
          <ConnectWalletTabBox>
            {isLoading && !isFetched ? (
              <Spinner loading={isLoading} />
            ) : (
              <Text size="7" weight="bold">
                ${totalBalanceInUsd ? totalBalanceInUsd?.toFixed(10) : "0.0"}
              </Text>
            )}
            <Text size="2" weight="medium" className="text-gray-600">
              Total balance
            </Text>
          </ConnectWalletTabBox>
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
