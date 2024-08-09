import { Button, Text } from "@radix-ui/themes"
import React from "react"
import clsx from "clsx"

import NetworkIcon from "@src/components/Network/NetworkIcon"

type Props = {
  chainIcon: string
  chainName: string
  account?: string
  onChange: (value: string) => void
  onBlur: (value: string) => void
}
const Network = ({
  chainIcon,
  chainName,
  account,
  onChange,
  onBlur,
}: Props) => {
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
            To
          </Text>
        </span>
        <input
          onChange={(e) => onChange(e.target.value)}
          onBlur={(e) => onBlur(e.target.value)}
          placeholder={`Enter Your ${chainName ? chainName.charAt(0).toUpperCase() + chainName.slice(1) : ""} Address`}
          className={clsx(
            "w-full grow flex-1 px-0 text-sm font-medium placeholder-black border-transparent focus:border-transparent focus:ring-0 bg-gray-50 dark:bg-black-900 dark:placeholder-white"
          )}
        />
      </div>
    </div>
  )
}

export default Network
