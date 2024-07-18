"use client"

import React, { useState } from "react"

import { HistoryData, HistoryStatus } from "@src/stores/historyStore"
import {
  NearTX,
  NetworkTokenWithSwapRoute,
  QueueTransactions,
} from "@src/types/interfaces"
import { useHistoryStore } from "@src/providers/HistoryStoreProvider"
import { useNetworkTokens } from "@src/hooks/useNetworkTokens"
import { useSwap } from "@src/hooks/useSwap"
import { useWalletSelector } from "@src/providers/WalletSelectorProvider"
import WidgetCardSwap from "@src/components/History/Widget/WidgetCardSwap"
import WidgetCardLoading from "@src/components/History/Widget/WidgetCardLoading"
import WidgetCardRollback from "@src/components/History/Widget/WidgetCardRollback"
import WidgetCardFailed from "@src/components/History/Widget/WidgetCardFailed"
import WidgetCardWithdraw from "@src/components/History/Widget/WidgetCardWithdraw"
import WidgetCardDeposit from "@src/components/History/Widget/WidgetCardDeposit"
import WidgetCardStorageDeposit from "@src/components/History/Widget/WidgetCardStorageDeposit"

type Props = {
  onCloseHistory?: () => void
  withCloseHistory?: boolean
}

const WidgetCardTransaction = ({
  clientId,
  hash,
  details,
  timestamp,
  status,
}: HistoryData & Props) => {
  const { selector, accountId } = useWalletSelector()
  const { callRequestRollbackIntent } = useSwap({ selector, accountId })

  const iTokenDetailMissing =
    !details?.tokenIn ||
    !details.tokenOut ||
    !details.selectedTokenIn ||
    !details.selectedTokenOut

  switch (status) {
    case HistoryStatus.FAILED:
      if (!details?.transaction?.actions || !hash || iTokenDetailMissing) {
        return <WidgetCardLoading />
      }
      return (
        <WidgetCardFailed
          actions={details!.transaction!.actions}
          tokenIn={details!.tokenIn as string}
          tokenOut={details!.tokenOut as string}
          selectedTokenIn={
            details!.selectedTokenIn as NetworkTokenWithSwapRoute
          }
          selectedTokenOut={
            details!.selectedTokenOut as NetworkTokenWithSwapRoute
          }
          hash={hash}
        />
      )

    case HistoryStatus.AVAILABLE:
    case HistoryStatus.COMPLETED:
      if (iTokenDetailMissing || !hash) {
        return <WidgetCardLoading />
      }
      return (
        <WidgetCardSwap
          hash={hash}
          status={status}
          clientId={clientId}
          tokenIn={details!.tokenIn as string}
          tokenOut={details!.tokenOut as string}
          selectedTokenIn={
            details!.selectedTokenIn as NetworkTokenWithSwapRoute
          }
          selectedTokenOut={
            details!.selectedTokenOut as NetworkTokenWithSwapRoute
          }
          timestamp={timestamp}
          handleCloseIntent={callRequestRollbackIntent}
        />
      )

    case HistoryStatus.ROLLED_BACK:
      if (!details?.transaction?.actions || !hash || iTokenDetailMissing) {
        return <WidgetCardLoading />
      }
      return (
        <WidgetCardRollback
          actions={details!.transaction!.actions}
          tokenIn={details!.tokenIn as string}
          tokenOut={details!.tokenOut as string}
          selectedTokenIn={
            details!.selectedTokenIn as NetworkTokenWithSwapRoute
          }
          selectedTokenOut={
            details!.selectedTokenOut as NetworkTokenWithSwapRoute
          }
          hash={hash}
        />
      )

    case HistoryStatus.WITHDRAW:
      if (!details?.transaction || !hash || iTokenDetailMissing) {
        return <WidgetCardLoading />
      }
      return (
        <WidgetCardWithdraw
          accountId={details?.transaction.signer_id as string}
          tokenOut={details!.tokenOut as string}
          selectedTokenOut={
            details!.selectedTokenOut as NetworkTokenWithSwapRoute
          }
          hash={hash}
        />
      )

    case HistoryStatus.DEPOSIT:
      if (!details?.transaction || !hash || iTokenDetailMissing) {
        return <WidgetCardLoading />
      }
      return (
        <WidgetCardDeposit
          accountId={details?.transaction.signer_id as string}
          tokenIn={details!.tokenIn as string}
          selectedTokenIn={
            details!.selectedTokenIn as NetworkTokenWithSwapRoute
          }
          hash={hash}
        />
      )

    case HistoryStatus.STORAGE_DEPOSIT:
      if (!details?.transaction || !hash || iTokenDetailMissing) {
        return <WidgetCardLoading />
      }
      return (
        <WidgetCardStorageDeposit
          receiverId={details?.transaction.receiver_id as string}
          tokenIn={details!.tokenIn as string}
          selectedTokenIn={
            details!.selectedTokenIn as NetworkTokenWithSwapRoute
          }
          hash={hash}
        />
      )
  }

  return <WidgetCardLoading />
}

export default WidgetCardTransaction
