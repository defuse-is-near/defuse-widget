"use client"

import { useCallback } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { CollectorHook } from "@src/hooks/useHistoryCollector"
import { useWalletSelector } from "@src/providers/WalletSelectorProvider"
import {
  getNearBlockById,
  getNearTransactionDetails,
} from "@src/api/transaction"
import { HistoryData } from "@src/stores/historyStore"
import { NearBlock, NearTX, NetworkToken, Result } from "@src/types/interfaces"
import { CONFIRM_SWAP_LOCAL_KEY } from "@src/constants/contracts"
import { ModalConfirmSwapPayload } from "@src/components/Modal/ModalConfirmSwap"
import { useHistoryStore } from "@src/providers/HistoryStoreProvider"

interface HistoryFromLocal {
  tokenIn?: string
  tokenOut?: string
  selectedTokenIn?: NetworkToken
  selectedTokenOut?: NetworkToken
}

export enum UseQueryCollectorKeys {
  CLIENT_ID = "clientId",
  TRANSACTION_HASHS = "transactionHashes",
  ERROR_MESSAGE = "errorMessage",
  ERROR_CODE = "errorCode",
}

export const useCreateQueryString = () => {
  const searchParams = useSearchParams()

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(name, value)

      return params.toString()
    },
    [searchParams]
  )

  return {
    createQueryString,
  }
}

// This hook collects transactions based on query parameters from the URL
export const useQueryCollector = (): CollectorHook => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { accountId } = useWalletSelector()
  const { togglePreview } = useHistoryStore((state) => state)

  const cleanupQuery = (keys: string[]) => {
    const params = new URLSearchParams(searchParams.toString())
    keys.forEach((key) => params.delete(key))
    router.replace(pathname + "?" + params)
  }

  const handleCleanupQuery = () => {
    cleanupQuery([
      UseQueryCollectorKeys.CLIENT_ID,
      UseQueryCollectorKeys.TRANSACTION_HASHS,
      UseQueryCollectorKeys.ERROR_MESSAGE,
      UseQueryCollectorKeys.ERROR_CODE,
    ])
  }

  const getTryToExtractDataFromLocal = (clientId: string): HistoryFromLocal => {
    const getConfirmSwapFromLocal = localStorage.getItem(CONFIRM_SWAP_LOCAL_KEY)
    if (!getConfirmSwapFromLocal) return {}
    const parsedData: { data: ModalConfirmSwapPayload } = JSON.parse(
      getConfirmSwapFromLocal
    )
    if (parsedData.data.clientId !== clientId) {
      return {}
    }
    return {
      tokenIn: parsedData.data.tokenIn,
      tokenOut: parsedData.data.tokenOut,
      selectedTokenIn: parsedData.data.selectedTokenIn,
      selectedTokenOut: parsedData.data.selectedTokenOut,
    }
  }

  const getTransactions = useCallback(async (): Promise<HistoryData[]> => {
    try {
      const clientId = searchParams.get(UseQueryCollectorKeys.CLIENT_ID)
      const transactionHashes = searchParams.get(
        UseQueryCollectorKeys.TRANSACTION_HASHS
      )
      const errorMessage = searchParams.get(UseQueryCollectorKeys.ERROR_MESSAGE)
      const errorCode = searchParams.get(UseQueryCollectorKeys.ERROR_CODE)

      if (transactionHashes) {
        const { result } = (await getNearTransactionDetails(
          transactionHashes as string,
          accountId as string
        )) as Result<NearTX>

        let getNearBlockData = 0
        if (result.receipts_outcome.length) {
          const { result: resultBlock } = (await getNearBlockById(
            result.receipts_outcome[0].block_hash
          )) as NearBlock
          getNearBlockData = resultBlock.header.timestamp
        }

        togglePreview(transactionHashes)
        handleCleanupQuery()

        return [
          {
            clientId: clientId as string,
            hash: transactionHashes as string,
            timestamp: getNearBlockData ?? 0,
            details: {
              receipts_outcome: result?.receipts_outcome,
              transaction: result?.transaction,
              ...getTryToExtractDataFromLocal(clientId as string),
            },
          },
        ]
      }

      // TODO Add failure events
      // if (errorCode || errorMessage) {
      //   return {
      //     status: (errorMessage as string) || (errorCode as string),
      //     hash: transactionHashes,
      //     logs: [],
      //   }
      // }

      handleCleanupQuery()
      return []
    } catch (e) {
      console.log("useQueryCollector: ", e)
      return []
    }
  }, [searchParams])

  return {
    getTransactions,
  }
}
