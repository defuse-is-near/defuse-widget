"use client"

import { useEffect, useState } from "react"

import { useQueryCollector } from "@src/hooks/useQuery"
import { useHistoryStore } from "@src/providers/HistoryStoreProvider"
import { HistoryData } from "@src/stores/historyStore"

const NEAR_COLLECTOR_KEY = "__d_history_collector"

export interface CollectorHook {
  getTransactions: () => Promise<HistoryData[]>
}

// This hook uses modules for gathering historical transactions, filtering, and
// transferring to history module
export const useHistoryCollector = (collectorHooks: CollectorHook[]) => {
  const [isFetching, setIsFetching] = useState(false)
  const [isError, setIsError] = useState(false)
  const { data, updateHistory } = useHistoryStore((state) => state)

  useEffect(() => {
    if (!data.size) {
      return
    }
    const getHistoryFromStore: HistoryData[] = []
    data.forEach((value) => getHistoryFromStore.push(value))
    localStorage.setItem(
      NEAR_COLLECTOR_KEY,
      JSON.stringify({ data: getHistoryFromStore })
    )
  }, [data])

  const runTransactionCollector = async () => {
    try {
      setIsFetching(true)
      const allTransactions = await Promise.all(
        collectorHooks.map((hook) => hook.getTransactions())
      )
      const getTransactionHistories = allTransactions.flat()
      const getHistoryFromLocal = localStorage.getItem(NEAR_COLLECTOR_KEY)
      let getHistoryFromStore: HistoryData[] = []
      data.forEach((value) => getHistoryFromStore.push(value))

      // Do merge as we suppose that this is initial fetch
      if (!getHistoryFromStore.length && getHistoryFromLocal) {
        const parsedData: { data: HistoryData[] } =
          JSON.parse(getHistoryFromLocal)
        if (Array.isArray(parsedData.data)) {
          getHistoryFromStore = [
            ...getHistoryFromStore,
            ...(parsedData.data as HistoryData[]),
          ]
        }
      }
      const history = [...getHistoryFromStore, ...getTransactionHistories]
      console.log("Data before store to the history: ", history)
      updateHistory(history)

      setIsFetching(false)
    } catch (e) {
      console.log("runTransactionCollector: ", e)
      setIsError(true)
      setIsFetching(false)
    }
  }

  return {
    runTransactionCollector,
    isFetching,
    isError,
  }
}

export const useCombinedHistoryCollector = () => {
  const queryCollector = useQueryCollector()
  return useHistoryCollector([queryCollector])
}
