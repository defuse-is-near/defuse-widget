"use client"

import { useState } from "react"
import { Button, Text } from "@radix-ui/themes"
import Image from "next/image"

import AssetComboIcon from "@src/components/Network/AssetComboIcon"
import { NetworkTokenWithSwapRoute } from "@src/types/interfaces"
import { HistoryStatus } from "@src/stores/historyStore"
import { smallBalanceToFormat } from "@src/utils/token"
import WidgetCardMask from "@src/components/History/Widget/WidgetCardMask"
import WidgetCardLink from "@src/components/History/Widget/WidgetCardLink"

enum CardSwapStatusEnum {
  PENDING = "Pending",
  COMPLETED = "Completed",
}

type Props = {
  hash: string
  clientId: string
  timestamp: number
  status: HistoryStatus
  tokenIn: string
  tokenOut: string
  selectedTokenIn: NetworkTokenWithSwapRoute
  selectedTokenOut: NetworkTokenWithSwapRoute
  handleCloseIntent: ({ id }: { id: string; receiverId?: string }) => void
  receiverId?: string
}

const NEAR_EXPLORER = process?.env?.nearExplorer ?? ""

const WidgetCardSwap = ({
  hash,
  clientId,
  timestamp,
  status,
  tokenIn,
  tokenOut,
  selectedTokenOut,
  selectedTokenIn,
  handleCloseIntent,
  receiverId,
}: Props) => {
  const [isActive, setIsActive] = useState(false)

  let cardStatus: CardSwapStatusEnum | null = null
  switch (status) {
    case HistoryStatus.AVAILABLE:
    case HistoryStatus.INTENT_1_AVAILABLE:
      cardStatus = CardSwapStatusEnum.PENDING
      break
    case HistoryStatus.COMPLETED:
    case HistoryStatus.INTENT_1_EXECUTED:
      cardStatus = CardSwapStatusEnum.COMPLETED
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
      {cardStatus !== CardSwapStatusEnum.COMPLETED && (
        <WidgetCardMask timestamp={timestamp} />
      )}
      <div className="flex-none w-[40px] h-[36px]">
        <AssetComboIcon {...selectedTokenOut} />
      </div>
      <div className="shrink grow flex flex-col justify-between items-start">
        <Text size="2" weight="medium" className="text-black-400">
          Swap
        </Text>
        {cardStatus === CardSwapStatusEnum.COMPLETED && isActive ? (
          <span className="flex gap-1">
            <Text size="1" weight="medium" className="text-gray-600">
              View transaction
            </Text>
          </span>
        ) : (
          <span className="flex gap-1">
            <Text size="1" weight="medium" className="text-gray-600">
              -{smallBalanceToFormat(tokenIn, 7)}
            </Text>
            <Text size="1" weight="medium" className="text-gray-600">
              {selectedTokenIn.symbol}
            </Text>
          </span>
        )}
      </div>
      {cardStatus === CardSwapStatusEnum.COMPLETED && isActive ? (
        <WidgetCardLink />
      ) : (
        <>
          <div className="shrink grow flex flex-col justify-between items-end">
            <Text size="1" weight="medium" className="text-gray-600">
              {cardStatus}
            </Text>
            <span className="flex gap-1">
              <Text size="1" weight="medium" className="text-green-400">
                +{smallBalanceToFormat(tokenOut, 7)}
              </Text>
              <Text size="1" weight="medium" className="text-green-400">
                {selectedTokenOut.symbol}
              </Text>
            </span>
          </div>
          {cardStatus !== CardSwapStatusEnum.COMPLETED && (
            <div className="flex-none">
              <Button
                variant="classic"
                color="red"
                onClick={(e) => {
                  e.stopPropagation()
                  handleCloseIntent({ id: clientId, receiverId })
                }}
                className="relative w-[32px] h-[32px] cursor-pointer"
              >
                <Image
                  className="absolute"
                  src="/static/icons/cross-2.svg"
                  alt="Cross"
                  width={16}
                  height={16}
                />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default WidgetCardSwap
