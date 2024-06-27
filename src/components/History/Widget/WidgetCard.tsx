"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"
import { Spinner, Text } from "@radix-ui/themes"
import Link from "next/link"

import { HistoryData } from "@src/stores/historyStore"
import Button from "@src/components/Button/Button"
import { NearTX, QueueTransactions } from "@src/types/interfaces"

const NEAR_EXPLORER = process?.env?.nearExplorer ?? ""

const PLACEHOLDER = "XX"

const WidgetCard = ({ hash, details, isClosed, status }: HistoryData) => {
  const [title, setTitle] = useState<string>("")

  const handlePrepareTitle = (
    details: HistoryData["details"],
    typeQueueTransactions?: QueueTransactions
  ): string => {
    switch (typeQueueTransactions) {
      case QueueTransactions.CREATE_INTENT:
        return `Swapping ${details?.tokenIn ?? PLACEHOLDER} ${details?.selectedTokenIn?.symbol ?? PLACEHOLDER} for ${details?.tokenOut ?? PLACEHOLDER} ${details?.selectedTokenOut?.symbol ?? PLACEHOLDER}`
      case QueueTransactions.STORAGE_DEPOSIT_TOKEN_IN:
      case QueueTransactions.STORAGE_DEPOSIT_TOKEN_OUT:
        return `Storage deposit on ${details?.transaction?.receiver_id ?? PLACEHOLDER} by ${details?.transaction?.signer_id ?? PLACEHOLDER}`
      default:
        return "Unknown"
    }
  }

  const handleGetTypeOfQueueTransactions = (
    transaction: NearTX["transaction"]
  ): QueueTransactions | undefined => {
    if (
      transaction.actions[0].FunctionCall.method_name === "ft_transfer_call"
    ) {
      return QueueTransactions.CREATE_INTENT
    }
    if (transaction.actions[0].FunctionCall.method_name === "storage_deposit") {
      // No matter is IN or OUT as QueueTransactions.STORAGE_DEPOSIT_TOKEN_OUT
      return QueueTransactions.STORAGE_DEPOSIT_TOKEN_IN
    }
  }

  useEffect(() => {
    if (details && details?.transaction) {
      const typeQueueTransactions = handleGetTypeOfQueueTransactions(
        details!.transaction as NearTX["transaction"]
      )
      const title = handlePrepareTitle(details, typeQueueTransactions)
      setTitle(title)
    }
    return () => {
      setTitle("")
    }
  }, [details])

  return (
    <div className="max-w-full md:max-w-[260px] min-h-[152px] flex flex-col justify-between m-5 p-3 card-history bg-white rounded-[8px] border overflow-hidden">
      <div className="flex justify-between items-center mb-3">
        <Spinner size="3" />
        <Image
          src="/static/icons/close.svg"
          width={16}
          height={16}
          alt="Close"
        />
      </div>
      <Text size="1" weight="bold" className="mb-1">
        {title.substring(0, 37)}
        ...
      </Text>
      <Text size="1" className="mb-3">
        Estimated time left: 2 mins
      </Text>
      <div className="flex justify-start items-center gap-3 cursor-pointer">
        <Button size="sm" variant="soft" className="bg-black cursor-pointer">
          View details
        </Button>
        <Link
          className="h-[32px] flex items-center gap-[4px] border border-gray-600 rounded-[3px] cursor-pointer px-3"
          href={NEAR_EXPLORER + "/txns/" + hash}
          rel="noopener noreferrer"
          target="_blank"
        >
          <Text size="1" className="text-gray-600 text-nowrap">
            See in Explorer
          </Text>
          <Image
            src="/static/icons/arrow-top-right.svg"
            width={16}
            height={16}
            alt="Link"
          />
        </Link>
      </div>
    </div>
  )
}

export default WidgetCard
