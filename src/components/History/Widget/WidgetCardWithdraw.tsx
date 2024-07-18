"use client"

import { useState } from "react"
import { Text } from "@radix-ui/themes"

import AssetComboIcon from "@src/components/Network/AssetComboIcon"
import { NearTX, NetworkTokenWithSwapRoute } from "@src/types/interfaces"
import { smallBalanceToFormat } from "@src/utils/token"
import WidgetCardLink from "@src/components/History/Widget/WidgetCardLink"
import useShortAccountId from "@src/hooks/useShortAccountId"

type Props = {
  accountId: string
  tokenIn: string
  selectedTokenIn: NetworkTokenWithSwapRoute
  hash: string
}

const NEAR_EXPLORER = process?.env?.nearExplorer ?? ""

const WidgetCardWithdraw = ({
  accountId,
  tokenIn,
  selectedTokenIn,
  hash,
}: Props) => {
  const [isActive, setIsActive] = useState(false)
  const { shortAccountId } = useShortAccountId(accountId)

  return (
    <div
      onClick={() => {
        window.open(NEAR_EXPLORER + "/txns/" + hash)
      }}
      onMouseOver={() => setIsActive(true)}
      onMouseLeave={() => setIsActive(false)}
      className="relative flex flex-nowrap justify-between items-center p-2.5 gap-3 hover:bg-gray-950 cursor-pointer"
    >
      <div className="flex-none w-[40px] h-[36px]">
        <AssetComboIcon {...selectedTokenIn} />
      </div>
      <div className="shrink grow flex flex-col justify-between items-start">
        <Text size="2" weight="medium" className="text-black-400">
          Withdraw
        </Text>
        {!isActive && (
          <span className="flex gap-1">
            <Text size="1" weight="medium" className="text-gray-600">
              To {shortAccountId}
            </Text>
          </span>
        )}
        {isActive && (
          <span className="flex gap-1">
            <Text size="1" weight="medium" className="text-gray-600">
              View transaction
            </Text>
          </span>
        )}
      </div>
      {!isActive && (
        <div className="shrink grow flex flex-col justify-between items-end">
          <Text size="1" weight="medium" className="text-gray-600">
            Completed
          </Text>
          <span className="flex gap-1">
            <Text size="1" weight="medium" className="text-red-600">
              -{smallBalanceToFormat(tokenIn, 7)}
            </Text>
            <Text size="1" weight="medium" className="text-red-600">
              {selectedTokenIn.symbol}
            </Text>
          </span>
        </div>
      )}
      {isActive && (
        <div className="flex-none">
          <WidgetCardLink />
        </div>
      )}
    </div>
  )
}

export default WidgetCardWithdraw
