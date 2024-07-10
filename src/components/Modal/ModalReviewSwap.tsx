"use client"

import { Text } from "@radix-ui/themes"
import Image from "next/image"
import React, { useState } from "react"
import { parseUnits } from "viem"

import ModalDialog from "@src/components/Modal/ModalDialog"
import { NetworkToken } from "@src/types/interfaces"
import { useModalStore } from "@src/providers/ModalStoreProvider"
import Button from "@src/components/Button/Button"
import CardSwap from "@src/components/Card/CardSwap"
import { ModalType } from "@src/stores/modalStore"
import { useTimer } from "@src/hooks/useTimer"
import { useTimeFormatMinutes } from "@src/hooks/useTimeFormat"
import useSwapEstimateBot from "@src/hooks/useSwapEstimateBot"
import { smallBalanceToFormat } from "@src/utils/token"

export type ModalReviewSwapPayload = {
  tokenIn: string
  tokenOut: string
  selectedTokenIn: NetworkToken
  selectedTokenOut: NetworkToken
  isNativeInSwap: boolean
}

const RECALCULATE_ESTIMATION_TIME_SECS = 15

const ModalReviewSwap = () => {
  const { onCloseModal, setModalType, payload } = useModalStore(
    (state) => state
  )
  const { getSwapEstimateBot, isFetching } = useSwapEstimateBot()
  const [convertPayload, setConvertPayload] = useState<ModalReviewSwapPayload>(
    payload as ModalReviewSwapPayload
  )

  const recalculateEstimation = async () => {
    const pair = [
      convertPayload.selectedTokenIn.address as string,
      convertPayload.selectedTokenOut.address as string,
    ]
    // Not needed recalculation if ratio is 1:1
    if (pair.includes("0x1") && pair.includes("wrap.near")) return

    const unitsTokenIn = parseUnits(
      convertPayload.tokenIn,
      convertPayload.selectedTokenIn.decimals as number
    ).toString()

    const { bestOut } = await getSwapEstimateBot({
      tokenIn: convertPayload.selectedTokenIn.address as string,
      tokenOut: convertPayload.selectedTokenOut.address as string,
      amountIn: unitsTokenIn,
    })
    setConvertPayload({ ...convertPayload, tokenOut: bestOut ?? "0" })
  }

  const { timeLeft } = useTimer(
    RECALCULATE_ESTIMATION_TIME_SECS,
    recalculateEstimation
  )
  const { formatTwoNumbers } = useTimeFormatMinutes()

  const handleConfirmSwap = async () => {
    setModalType(ModalType.MODAL_CONFIRM_SWAP, payload)
  }

  return (
    <ModalDialog>
      <div className="flex flex-col min-h-[256px] max-h-[680px] h-full p-5">
        <div className="flex justify-between items-center mb-[44px]">
          <div className="relative w-full shrink text-center text-black-400">
            <Text size="4" weight="bold">
              Review swap
            </Text>
            <div className="absolute top-[30px] left-[50%] -translate-x-2/4 text-gray-600">
              <Text size="2" weight="medium">
                00:{formatTwoNumbers(timeLeft)}
              </Text>
            </div>
          </div>
          <button className="shrink-0" onClick={onCloseModal}>
            <Image
              src="/static/icons/close.svg"
              alt="Close Icon"
              width={14}
              height={14}
            />
          </button>
        </div>
        <CardSwap
          amountIn={smallBalanceToFormat(convertPayload.tokenIn, 7)}
          amountOut={smallBalanceToFormat(convertPayload.tokenOut, 7)}
          amountOutToUsd="~"
          amountInToUsd="~"
          selectTokenIn={convertPayload.selectedTokenIn}
          selectTokenOut={convertPayload.selectedTokenOut}
        />
        <div className="flex flex-col w-full mb-6 gap-3">
          <div className="flex justify-between items-center">
            <Text size="2" weight="medium" className="text-gray-600">
              Fee
            </Text>
            <div className="px-2.5 py-1 rounded-full bg-green-100">
              <Text size="2" weight="medium" className="text-green">
                Free
              </Text>
            </div>
          </div>
          <div className="flex justify-between items-center gap-3">
            <Text size="2" weight="medium" className="text-gray-600">
              Estimated time
            </Text>
            <Text size="2" weight="medium">
              ~ 2 min
            </Text>
          </div>
          <div className="flex justify-between items-center gap-3">
            <Text size="2" weight="medium" className="text-gray-600">
              Rate
            </Text>
            <div className="flex justify-center items-center gap-2">
              <Text size="2" weight="medium">
                1
              </Text>
              <Text size="2" weight="medium">
                {convertPayload.selectedTokenIn.symbol}
              </Text>
              =
              <Text size="2" weight="medium">
                {(
                  Number(convertPayload.tokenOut) /
                  Number(convertPayload.tokenIn)
                ).toFixed(4)}
              </Text>
              <Text size="2" weight="medium">
                {convertPayload.selectedTokenOut.symbol}
              </Text>
            </div>
          </div>
        </div>
        <Button
          size="lg"
          fullWidth
          onClick={handleConfirmSwap}
          isLoading={isFetching}
        >
          Confirm swap
        </Button>
      </div>
    </ModalDialog>
  )
}

export default ModalReviewSwap
