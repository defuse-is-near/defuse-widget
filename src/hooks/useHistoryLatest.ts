"use client"

import { useState } from "react"

import { HistoryData, HistoryStatus } from "@src/stores/historyStore"
import { useHistoryStore } from "@src/providers/HistoryStoreProvider"
import { intentStatus } from "@src/utils/near"
import { CONTRACTS_REGISTER } from "@src/constants/contracts"
import { NearIntentStatus, NearTX, Result } from "@src/types/interfaces"
import { getNearTransactionDetails } from "@src/api/transaction"
import { useWalletSelector } from "@src/providers/WalletSelectorProvider"

const SCHEDULER_3_MIN = 180000

export const useHistoryLatest = () => {
  const { accountId } = useWalletSelector()
  const { updateHistory } = useHistoryStore((state) => state)
  const [isHistoryWorkerSleeping, setIsHistoryWorkerSleeping] = useState(true)
  const [isMonitoringComplete, setIsMonitoringComplete] = useState({
    cycle: 0,
    done: false,
  })

  const runHistoryMonitoring = async (data: HistoryData[]): Promise<void> => {
    setIsHistoryWorkerSleeping(false)

    const validHistoryStatuses = [
      HistoryStatus.COMPLETED,
      HistoryStatus.ROLLED_BACK,
      HistoryStatus.EXPIRED,
    ]

    const historyCompletion: boolean[] = []
    const result: HistoryData[] = await Promise.all(
      data.map(async (historyData) => {
        if (
          (historyData?.status &&
            validHistoryStatuses.includes(
              historyData!.status as HistoryStatus
            )) ||
          !historyData?.clientId ||
          historyData.errorMessage ||
          historyData.isClosed
        ) {
          historyCompletion.push(true)
          return historyData
        }

        const getIntentStatus = (await intentStatus(
          CONTRACTS_REGISTER.INTENT,
          historyData.clientId
        )) as NearIntentStatus | null
        if (getIntentStatus?.status) {
          Object.assign(historyData, { status: getIntentStatus?.status })
        }

        if (!historyData.details?.receipts_outcome) {
          const { result } = (await getNearTransactionDetails(
            historyData.hash as string,
            accountId as string
          )) as Result<NearTX>
          if (result) {
            Object.assign(historyData, {
              details: {
                ...historyData.details,
                receipts_outcome: result.receipts_outcome,
                transaction: result.transaction,
              },
            })
          }
        }

        return historyData
      })
    )

    updateHistory(result)

    if (!historyCompletion.includes(false)) {
      setIsHistoryWorkerSleeping(true)
      setIsMonitoringComplete({
        ...isMonitoringComplete,
        done: true,
      })
    }

    setTimeout(() => {
      setIsMonitoringComplete({
        ...isMonitoringComplete,
        cycle: isMonitoringComplete.cycle++,
      })
      runHistoryMonitoring(result)
    }, SCHEDULER_3_MIN)
  }

  const runHistoryUpdate = (data: HistoryData[]): void => {
    runHistoryMonitoring(data)
  }

  return {
    runHistoryUpdate,
    isHistoryWorkerSleeping,
    isMonitoringComplete,
  }
}
