"use client"

import { useState } from "react"
import { Text } from "@radix-ui/themes"

import AssetComboIcon from "@src/components/Network/AssetComboIcon"
import { NearTX, NetworkTokenWithSwapRoute } from "@src/types/interfaces"
import { smallBalanceToFormat } from "@src/utils/token"
import WidgetCardLink from "@src/components/History/Widget/WidgetCardLink"

enum CardFailedStatusEnum {
  SWAP = "Swap",
}

enum CardFailedActionEnum {
  FT_TRANSFER_CALL = "ft_transfer_call",
}

type Props = {
  actions: NearTX["transaction"]["actions"]
  tokenIn: string
  tokenOut: string
  selectedTokenIn: NetworkTokenWithSwapRoute
  selectedTokenOut: NetworkTokenWithSwapRoute
  hash: string
}

const NEAR_EXPLORER = process?.env?.nearExplorer ?? ""

const WidgetCardFailed = ({
  actions,
  tokenIn,
  tokenOut,
  selectedTokenOut,
  selectedTokenIn,
  hash,
}: Props) => {
  const [isActive, setIsActive] = useState(false)

  const handleGetActionMethodName = (
    actions: NearTX["transaction"]["actions"]
  ): CardFailedActionEnum => {
    return actions[0].FunctionCall.method_name as CardFailedActionEnum
  }

  let cardStatus: CardFailedStatusEnum
  switch (handleGetActionMethodName(actions)) {
    case CardFailedActionEnum.FT_TRANSFER_CALL:
      cardStatus = CardFailedStatusEnum.SWAP
      break
  }

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
        <AssetComboIcon {...selectedTokenOut} />
      </div>
      <div className="shrink grow flex flex-col justify-between items-start">
        <Text size="2" weight="medium" className="text-black-400">
          {cardStatus}
        </Text>
        {!isActive && (
          <span className="flex gap-1">
            <Text size="1" weight="medium" className="text-gray-600">
              -{smallBalanceToFormat(tokenIn, 7)}
            </Text>
            <Text size="1" weight="medium" className="text-gray-600">
              {selectedTokenIn.symbol}
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
          <Text size="1" weight="medium" className="text-red-600">
            Rejected
          </Text>
          <span className="flex gap-1">
            <Text size="1" weight="medium" className="text-black-200">
              +{smallBalanceToFormat(tokenOut, 7)}
            </Text>
            <Text size="1" weight="medium" className="text-black-200">
              {selectedTokenOut.symbol}
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

export default WidgetCardFailed
