import { Box, Popover, Switch, Text, Tabs } from "@radix-ui/themes"
import { useTheme } from "next-themes"
import clsx from "clsx"
import { PropsWithChildren } from "react"

import LabelComingSoon from "@src/components/LabelComingSoon"

const ConnectWalletTabBox = ({ children }: PropsWithChildren) => {
  return (
    <div className="pt-[22px] pb-[26px] flex flex-col gap-2">{children}</div>
  )
}

const ConnectWalletTabs = () => {
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
            <Text size="7" weight="bold">
              $0,000.00
            </Text>
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
