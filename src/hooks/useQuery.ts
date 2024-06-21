"use client"

import { useCallback } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { CollectorHook } from "@src/hooks/useHistoryCollector"
import { useWalletSelector } from "@src/providers/WalletSelectorProvider"
import { getTransactionDetails } from "@src/api/transaction"
import { HistoryData } from "@src/stores/historyStore"

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

enum UseQueryCollectorKeys {
  DEFUSE_CLIENT_ID = "defuseClientId",
  TRANSACTION_HASHS = "transactionHashes",
  ERROR_MESSAGE = "errorMessage",
  ERROR_CODE = "errorCode",
}

// This hook collects transactions based on query parameters from the URL
export const useQueryCollector = (): CollectorHook => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { accountId } = useWalletSelector()

  const cleanupQuery = (keys: string[]) => {
    const params = new URLSearchParams(searchParams.toString())
    keys.forEach((key) => params.delete(key))
    router.replace(pathname + "?" + params)
  }

  const getTransactions = useCallback(async (): Promise<HistoryData[]> => {
    try {
      const defuseClientId = searchParams.get(
        UseQueryCollectorKeys.DEFUSE_CLIENT_ID
      )
      const transactionHashes = searchParams.get(
        UseQueryCollectorKeys.TRANSACTION_HASHS
      )
      const errorMessage = searchParams.get(UseQueryCollectorKeys.ERROR_MESSAGE)
      const errorCode = searchParams.get(UseQueryCollectorKeys.ERROR_CODE)

      if (transactionHashes) {
        const data = await getTransactionDetails(
          transactionHashes as string,
          accountId as string
        )
        cleanupQuery([
          UseQueryCollectorKeys.DEFUSE_CLIENT_ID,
          UseQueryCollectorKeys.TRANSACTION_HASHS,
          UseQueryCollectorKeys.ERROR_MESSAGE,
          UseQueryCollectorKeys.ERROR_CODE,
        ])
        return [
          {
            defuseClientId: defuseClientId as string,
            status: data?.result?.final_execution_status as string,
            hash: transactionHashes,
            logs: data?.result?.receipts_outcome[0].outcome?.logs as string[],
            details: {
              failure:
                data?.result?.receipts_outcome[1].outcome?.status?.Failure
                  ?.ActionError?.kind?.FunctionCallError?.ExecutionError,
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
      cleanupQuery(["transactionHashes", "errorMessage", "errorCode"])
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
