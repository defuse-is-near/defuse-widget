import { Button, Text } from "@radix-ui/themes"
import React from "react"

import NetworkIcon from "@src/components/Network/NetworkIcon"
import useShortAccountId from "@src/hooks/useShortAccountId"

const NetworkNear = ({
  chainIcon,
  chainName,
  account,
  onConnect,
  onDisconnect,
}: {
  chainIcon: string
  chainName: string
  account: string
  onConnect: () => void
  onDisconnect: () => void
}) => {
  const { shortAccountId } = useShortAccountId(account)
  return (
    <div className="flex justify-center items-center">
      <div className="flex-none w-[56px] h-[36px]">
        <NetworkIcon
          chainIcon={chainIcon}
          chainName={chainName}
          isConnect={!!account}
        />
      </div>
      <div className="shrink grow flex flex-col justify-between items-start">
        <span className="flex gap-1">
          <Text size="1" weight="medium" className="text-gray-600">
            From
          </Text>
        </span>
        <div className="flex items-center h-[38px]">
          <Text
            size="2"
            weight="medium"
            className="text-black-400 capitalize dark:text-white"
          >
            {shortAccountId ? shortAccountId : `Your ${chainName} address`}
          </Text>
        </div>
      </div>
      <div className="flex-none">
        {!account && (
          <Button
            radius="full"
            variant="solid"
            color="orange"
            className="cursor-pointer"
            onClick={onConnect}
          >
            <Text size="2" weight="medium" wrap="nowrap">
              Connect wallet
            </Text>
          </Button>
        )}
        {account && (
          <Button
            radius="full"
            variant="outline"
            className="cursor-pointer"
            color="gray"
            onClick={onDisconnect}
          >
            <Text size="2" weight="medium" wrap="nowrap">
              Disconnect
            </Text>
          </Button>
        )}
      </div>
    </div>
  )
}

export default NetworkNear
