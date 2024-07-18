"use client"

import { useState } from "react"
import { Text } from "@radix-ui/themes"

import AssetComboIcon from "@src/components/Network/AssetComboIcon"
import { NearTX, NetworkTokenWithSwapRoute } from "@src/types/interfaces"
import { smallBalanceToFormat } from "@src/utils/token"
import WidgetCardLink from "@src/components/History/Widget/WidgetCardLink"

enum CardRollbackStatusEnum {
  SWAP = "Swap",
  REFUND = "Refund",
}

enum CardRollbackActionEnum {
  FT_TRANSFER_CALL = "ft_transfer_call",
  ROLLBACK_INTENT = "rollback_intent",
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

const WidgetCardRollback = ({
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
  ): CardRollbackActionEnum => {
    return actions[0].FunctionCall.method_name as CardRollbackActionEnum
  }

  let cardStatus: CardRollbackStatusEnum
  switch (handleGetActionMethodName(actions)) {
    case CardRollbackActionEnum.FT_TRANSFER_CALL:
      cardStatus = CardRollbackStatusEnum.SWAP
      break
    case CardRollbackActionEnum.ROLLBACK_INTENT:
      cardStatus = CardRollbackStatusEnum.REFUND
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
            {cardStatus === CardRollbackStatusEnum.REFUND ? (
              <Text size="1" weight="medium" className="text-gray-600">
                Swap refund
              </Text>
            ) : (
              <>
                <Text size="1" weight="medium" className="text-gray-600">
                  -{smallBalanceToFormat(tokenIn, 7)}
                </Text>
                <Text size="1" weight="medium" className="text-gray-600">
                  {selectedTokenIn.symbol}
                </Text>
              </>
            )}
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
            {cardStatus === CardRollbackStatusEnum.REFUND
              ? "Completed"
              : "Refunded"}
          </Text>
          <span className="flex gap-1">
            <Text size="1" weight="medium" className="text-green-400">
              +
              {cardStatus === CardRollbackStatusEnum.REFUND
                ? smallBalanceToFormat(tokenIn, 7)
                : smallBalanceToFormat(tokenOut, 7)}
            </Text>
            <Text size="1" weight="medium" className="text-green-400">
              {cardStatus === CardRollbackStatusEnum.REFUND
                ? selectedTokenIn.symbol
                : selectedTokenOut.symbol}
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

export default WidgetCardRollback
