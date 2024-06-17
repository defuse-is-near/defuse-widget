"use client"

import { useState, useDeferredValue } from "react"
import { Text } from "@radix-ui/themes"
import Image from "next/image"

import ModalDialog from "@src/components/Modal/ModalDialog"
import { NetworkToken } from "@src/types/interfaces"
import { LIST_NETWORKS_TOKENS } from "@src/constants/tokens"
import { useModalStore } from "@src/providers/ModalStoreProvider"
import { useSwap } from "@src/hooks/useSwap"
import { useWalletSelector } from "@src/providers/WalletSelectorProvider"
import Button from "@src/components/Button"

export type ModalReviewSwapPayload = {
  tokenIn: number
  selectedTokenIn: NetworkToken
  selectedTokenOut: NetworkToken
}

const ModalReviewSwap = () => {
  const { selector, accountId } = useWalletSelector()
  const { onCloseModal, modalType, payload } = useModalStore((state) => state)
  const modalPayload = payload as ModalReviewSwapPayload

  const { callRequestIntent } = useSwap({ selector, accountId })

  const handleConfirmSwap = async () => {
    await callRequestIntent({
      inputAmount: modalPayload.tokenIn,
    })
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
                00:24
              </Text>
            </div>
          </div>
          <button className="shrink-0" onClick={onCloseModal}>
            <Image
              src="/static/icons/close.svg"
              alt="Search Icon"
              width={14}
              height={14}
            />
          </button>
        </div>
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
            <Text size="2" weight="medium">
              1 AURORA = 0.027952 NEAR
            </Text>
          </div>
        </div>
        <Button size="lg" fullWidth onChange={handleConfirmSwap}>
          Confirm swap
        </Button>
      </div>
    </ModalDialog>
  )
}

export default ModalReviewSwap
