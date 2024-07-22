"use client"

import React from "react"
import { BigNumber } from "ethers"
import { Checkbox, Text, Tooltip } from "@radix-ui/themes"
import { CheckedState } from "@radix-ui/react-checkbox"
import { InfoCircledIcon } from "@radix-ui/react-icons"
import Image from "next/image"
import clsx from "clsx"

import { smallBalanceToFormat } from "@src/utils/token"

export interface BlockMultiBalancesProps {
  balance?: string | BigNumber
  withNativeSupport?: boolean
  nativeSupportChecked?: CheckedState
  handleIncludeNativeToSwap?: (checked: CheckedState) => void
}
const BlockMultiBalances = ({
  balance,
  withNativeSupport,
  nativeSupportChecked = false,
  handleIncludeNativeToSwap,
}: BlockMultiBalancesProps) => {
  return (
    <div className="absolute bottom-4 right-5 flex justify-center items-center gap-2">
      {Number(balance) > 0 ? (
        <Image
          src="/static/icons/wallet_active.svg"
          alt={"Balance"}
          width={16}
          height={16}
        />
      ) : (
        <Image
          src="/static/icons/wallet_no_active.svg"
          alt={"Balance"}
          width={16}
          height={16}
        />
      )}
      <span
        className={clsx(
          "text-xs px-2 py-0.5 rounded-full",
          Number(balance) > 0
            ? "bg-red-100 text-red-400 dark:bg-red-200 dark:text-primary-400"
            : "bg-white-200 text-gray-600"
        )}
      >
        {smallBalanceToFormat(balance?.toString() ?? "", 7)}
      </span>
      {withNativeSupport && (
        <div className="absolute -top-[74px] right-0 flex justify-center items-center gap-1">
          <Checkbox
            size="1"
            checked={nativeSupportChecked ?? false}
            onCheckedChange={
              handleIncludeNativeToSwap ? handleIncludeNativeToSwap : () => {}
            }
            color="orange"
          />
          <Text size="1" className="text-gray-600 text-nowrap">
            Use Native
          </Text>
          <Tooltip content="Your NEAR balance will be automatically wrapped to wNEAR if your wNEAR balance isn't sufficient for the swap">
            <InfoCircledIcon />
          </Tooltip>
        </div>
      )}
    </div>
  )
}

export default BlockMultiBalances
