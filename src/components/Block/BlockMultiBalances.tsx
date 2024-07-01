import React from "react"
import { BigNumber } from "ethers"
import { Checkbox, Text } from "@radix-ui/themes"
import { CheckedState } from "@radix-ui/react-checkbox"

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
      <span className="text-sm text-gray-600">Balance:</span>
      <span className="text-xs px-2 py-0.5 bg-red-100 text-red-400 rounded-full">
        {balance?.toString()}
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
          <Text size="1" className="text-gray-600">
            Use Near balance
          </Text>
        </div>
      )}
    </div>
  )
}

export default BlockMultiBalances
