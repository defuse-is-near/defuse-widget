"use client"

import { useState } from "react"
import * as borsh from "borsh"

import { HistoryData, HistoryStatus } from "@src/stores/historyStore"
import { useHistoryStore } from "@src/providers/HistoryStoreProvider"
import { intentStatus } from "@src/utils/near"
import {
  CONFIRM_SWAP_LOCAL_KEY,
  CONTRACTS_REGISTER,
} from "@src/constants/contracts"
import {
  NearIntentCreate,
  NearIntentStatus,
  NearTX,
  RecoverDetails,
  Result,
} from "@src/types/interfaces"
import { getNearTransactionDetails } from "@src/api/transaction"
import { useWalletSelector } from "@src/providers/WalletSelectorProvider"
import { useTransactionScan } from "@src/hooks/useTransactionScan"
import { swapSchema } from "@src/utils/schema"
import { ModalConfirmSwapPayload } from "@src/components/Modal/ModalConfirmSwap"

const SCHEDULER_30_SEC = 30000
const SCHEDULER_5_SEC = 5000

export const useHistoryLatest = () => {
  const { accountId } = useWalletSelector()
  const { updateHistory } = useHistoryStore((state) => state)
  const [isHistoryWorkerSleeping, setIsHistoryWorkerSleeping] = useState(true)
  const { getTransactionScan } = useTransactionScan()
  const [isMonitoringComplete, setIsMonitoringComplete] = useState({
    cycle: 0,
    done: false,
  })

  const runHistoryMonitoring = async (data: HistoryData[]): Promise<void> => {
    const validHistoryStatuses = [
      HistoryStatus.COMPLETED,
      HistoryStatus.ROLLED_BACK,
      HistoryStatus.EXPIRED,
      HistoryStatus.FAILED,
      HistoryStatus.WITHDRAW,
      HistoryStatus.DEPOSIT,
      HistoryStatus.STORAGE_DEPOSIT,
    ]

    const historyCompletion: boolean[] = []
    const result: HistoryData[] = await Promise.all(
      data.map(async (historyData) => {
        if (
          (historyData?.status &&
            validHistoryStatuses.includes(
              historyData!.status as HistoryStatus
            )) ||
          historyData.errorMessage ||
          historyData.isClosed
        ) {
          historyCompletion.push(true)
          return historyData
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

        // Try to recover clientId and "Swap" data in case it was lost
        const getMethodName =
          historyData.details?.transaction?.actions.length &&
          historyData.details?.transaction?.actions[0].FunctionCall.method_name
        if (getMethodName && historyData.details?.transaction) {
          let getHashedArgs = ""
          let argsJson = ""
          let args: unknown
          let msgBase64 = ""
          let msgBuffer: Buffer
          switch (getMethodName) {
            case "ft_transfer_call":
              getHashedArgs =
                historyData.details.transaction.actions[0].FunctionCall.args
              argsJson = Buffer.from(getHashedArgs ?? "", "base64").toString(
                "utf-8"
              )
              args = JSON.parse(argsJson)
              msgBase64 = (args as { msg: string }).msg
              msgBuffer = Buffer.from(msgBase64, "base64")

              const msgBorshDeserialize = borsh.deserialize(
                swapSchema as any, // eslint-disable-line @typescript-eslint/no-explicit-any
                msgBuffer
              )
              const recoverData = msgBorshDeserialize as NearIntentCreate
              const clientId = recoverData.CreateIntent?.id
              const recoverDetails = recoverData.CreateIntent?.IntentStruct

              const sendAmount = recoverDetails?.send.amount.toString()
              const receiveAmount = recoverDetails?.receive.amount.toString()
              const expiration = {
                Block: recoverDetails?.expiration.Block.toString(),
              }

              Object.assign(historyData, {
                clientId,
                details: {
                  ...historyData.details,
                  recoverDetails: {
                    ...recoverDetails,
                    send: {
                      ...(recoverDetails as RecoverDetails).send,
                      amount: sendAmount,
                    },
                    receive: {
                      ...(recoverDetails as RecoverDetails).receive,
                      amount: receiveAmount,
                    },
                    expiration,
                  },
                },
              })

              const getIntentStatus = (await intentStatus(
                CONTRACTS_REGISTER.INTENT,
                historyData.clientId
              )) as NearIntentStatus | null
              if (getIntentStatus?.status) {
                Object.assign(historyData, { status: getIntentStatus?.status })
              }
              break

            case "rollback_intent":
              getHashedArgs =
                historyData.details.transaction.actions[0].FunctionCall.args
              argsJson = Buffer.from(getHashedArgs ?? "", "base64").toString(
                "utf-8"
              )
              args = JSON.parse(argsJson)
              Object.assign(historyData, {
                clientId: (args as { id: string }).id,
                status: HistoryStatus.ROLLED_BACK,
              })
              break

            case "near_deposit":
              getHashedArgs =
                historyData.details.transaction.actions[0].FunctionCall.args
              argsJson = Buffer.from(getHashedArgs ?? "", "base64").toString(
                "utf-8"
              )
              const logMsg = historyData.details?.receipts_outcome
                ? historyData.details?.receipts_outcome[0]!.outcome!.logs[0]
                : undefined
              Object.assign(historyData, {
                status: HistoryStatus.DEPOSIT,
                details: {
                  ...historyData.details,
                  recoverDetails: {
                    msg: logMsg,
                  },
                },
              })
              break

            case "near_withdraw":
              getHashedArgs =
                historyData.details.transaction.actions[0].FunctionCall.args
              argsJson = Buffer.from(getHashedArgs ?? "", "base64").toString(
                "utf-8"
              )
              args = JSON.parse(argsJson)
              Object.assign(historyData, {
                status: HistoryStatus.WITHDRAW,
                details: {
                  ...historyData.details,
                  recoverDetails: {
                    amount: (args as { amount: string }).amount,
                  },
                },
              })
              break

            case "storage_deposit":
              Object.assign(historyData, {
                status: HistoryStatus.STORAGE_DEPOSIT,
              })
              break
          }
        }

        // Extract data from local
        if (
          !historyData.details?.selectedTokenIn ||
          !historyData.details?.selectedTokenOut ||
          !historyData.details?.tokenIn ||
          !historyData.details?.tokenOut
        ) {
          const getConfirmSwapFromLocal = localStorage.getItem(
            CONFIRM_SWAP_LOCAL_KEY
          )
          if (getConfirmSwapFromLocal) {
            const parsedData: { data: ModalConfirmSwapPayload } = JSON.parse(
              getConfirmSwapFromLocal
            )
            if (parsedData.data.clientId === historyData.clientId) {
              Object.assign(historyData, {
                details: {
                  ...historyData.details,
                  tokenIn: parsedData.data.tokenIn,
                  tokenOut: parsedData.data.tokenOut,
                  selectedTokenIn: parsedData.data.selectedTokenIn,
                  selectedTokenOut: parsedData.data.selectedTokenOut,
                },
              })
            }
          }
        }

        const { isFailure } = await getTransactionScan(
          historyData!.details as NearTX
        )
        if (isFailure) {
          historyCompletion.push(true)
          Object.assign(historyData, { status: HistoryStatus.FAILED })
          return historyData
        }

        historyCompletion.push(false)
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
      return
    }

    setTimeout(() => {
      console.log("useHistoryLatest next run: ", isMonitoringComplete.cycle)
      setIsMonitoringComplete({
        ...isMonitoringComplete,
        cycle: isMonitoringComplete.cycle++,
      })
      runHistoryMonitoring(result)
    }, SCHEDULER_5_SEC)
  }

  const runHistoryUpdate = (data: HistoryData[]): void => {
    setIsHistoryWorkerSleeping(false)
    void runHistoryMonitoring(data)
  }

  return {
    runHistoryUpdate,
    isHistoryWorkerSleeping,
    isMonitoringComplete,
  }
}
