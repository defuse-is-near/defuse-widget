"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"
import { Spinner, Text } from "@radix-ui/themes"
import Link from "next/link"

import { HistoryData, HistoryStatus } from "@src/stores/historyStore"
import Button from "@src/components/Button/Button"
import { NearTX, QueueTransactions } from "@src/types/interfaces"
import { WidgetCardTimer } from "@src/components/History/Widget/WidgetCardTimer"
import {
  smallBalanceToFormat,
  tokenBalanceToFormatUnits,
} from "@src/utils/token"
import { useHistoryStore } from "@src/providers/HistoryStoreProvider"
import { rollbackIntent } from "@src/utils/near"
import { CONTRACTS_REGISTER } from "@src/constants/contracts"
import { useNetworkTokens } from "@src/hooks/useNetworkTokens"

const NEAR_EXPLORER = process?.env?.nearExplorer ?? ""
const PLACEHOLDER = "XX"

const WidgetCard = ({
  clientId,
  hash,
  details,
  timestamp,
  status,
}: HistoryData) => {
  const [title, setTitle] = useState("")
  const [subTitle, setSubTitle] = useState("")
  const { closeHistoryItem } = useHistoryStore((state) => state)
  const { getTokensDataByIds } = useNetworkTokens()

  const handlePrepareMeta = (
    details: HistoryData["details"],
    typeQueueTransactions?: QueueTransactions
  ): { title: string; subTitle?: string } => {
    switch (typeQueueTransactions) {
      case QueueTransactions.CREATE_INTENT:
        if (status === HistoryStatus.FAILED) {
          return {
            title: "Transaction failed",
            subTitle: `You received ${smallBalanceToFormat(details?.tokenOut ?? "0") ?? PLACEHOLDER} ${details?.selectedTokenOut?.symbol ?? PLACEHOLDER}.`,
          }
        }
        if (status === HistoryStatus.COMPLETED) {
          return {
            title: `Transaction complete!`,
            subTitle: `You received ${smallBalanceToFormat(details?.tokenOut ?? "0") ?? PLACEHOLDER} ${details?.selectedTokenOut?.symbol ?? PLACEHOLDER}.`,
          }
        }

        if (!details?.tokenIn || !details?.tokenOut) {
          const tokensData = getTokensDataByIds([
            details?.recoverDetails?.send.token_id ?? "",
            details?.recoverDetails?.receive.token_id ?? "",
          ])
          if (tokensData.length !== 2) {
            return {
              title: `Swapping ${PLACEHOLDER} ${PLACEHOLDER} for ${PLACEHOLDER} ${PLACEHOLDER}`,
            }
          }
          const tokenIn = tokenBalanceToFormatUnits({
            balance: details?.recoverDetails?.send.amount as string,
            decimals: tokensData[0].decimals as number,
          })
          const tokenOut = tokenBalanceToFormatUnits({
            balance: details?.recoverDetails?.receive.amount as string,
            decimals: tokensData[1].decimals as number,
          })
          return {
            title: `Swapping ${tokenIn} ${tokensData[0].symbol} for ${tokenOut} ${tokensData[1].symbol}`,
          }
        }

        return {
          title: `Swapping ${details?.tokenIn} ${details?.selectedTokenIn?.symbol} for ${details?.tokenOut} ${details?.selectedTokenOut?.symbol}`,
        }
      case QueueTransactions.STORAGE_DEPOSIT_TOKEN_IN:
      case QueueTransactions.STORAGE_DEPOSIT_TOKEN_OUT:
        return {
          title: `Storage deposit on ${details?.transaction?.receiver_id ?? PLACEHOLDER} by ${details?.transaction?.signer_id ?? PLACEHOLDER}`,
        }
      default:
        return { title: "Unknown" }
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

  const handleCloseHistory = () => closeHistoryItem(hash)

  const handleRollbackIntent = async () => {
    await rollbackIntent(CONTRACTS_REGISTER.INTENT, clientId)
  }

  useEffect(() => {
    if (details && details?.transaction) {
      const typeQueueTransactions = handleGetTypeOfQueueTransactions(
        details!.transaction as NearTX["transaction"]
      )
      const { title, subTitle } = handlePrepareMeta(
        details,
        typeQueueTransactions
      )
      setTitle(title)
      subTitle && setSubTitle(subTitle)
    }
    return () => {
      setTitle("")
    }
  }, [details])

  return (
    <div className="max-w-full md:max-w-[260px] min-h-[152px] flex flex-col justify-between m-5 p-3 card-history bg-white rounded-[8px] border overflow-hidden">
      <div className="flex justify-between items-center mb-3">
        {status === HistoryStatus.COMPLETED && (
          <Image
            src="/static/icons/CheckCircle.svg"
            width={28}
            height={28}
            alt="CheckCircle"
          />
        )}
        {status === HistoryStatus.FAILED && (
          <Image
            src="/static/icons/Failed.svg"
            width={28}
            height={28}
            alt="Failed"
          />
        )}
        {status !== HistoryStatus.COMPLETED &&
          status !== HistoryStatus.FAILED && <Spinner size="3" />}
        <button onClick={handleCloseHistory}>
          <Image
            src="/static/icons/close.svg"
            width={16}
            height={16}
            alt="Close"
          />
        </button>
      </div>
      <Text size="1" weight="bold" className="mb-1">
        {title.length > 37 ? title.substring(0, 37) + "..." : title}
      </Text>
      <Text size="1" className="mb-3">
        {subTitle && subTitle}
        {!subTitle && (
          <WidgetCardTimer timeLeft={Math.floor(timestamp / 1e6)} />
        )}
      </Text>
      <div className="flex justify-start items-center gap-3 cursor-pointer">
        {status !== HistoryStatus.COMPLETED &&
          status !== HistoryStatus.FAILED && (
            <Button
              size="sm"
              variant="soft"
              className="bg-black cursor-pointer"
              onClick={handleRollbackIntent}
            >
              Cancel Swap
            </Button>
          )}
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
