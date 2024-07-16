"use client"

import React from "react"

import { useHistoryStore } from "@src/providers/HistoryStoreProvider"
import WidgetEmpty from "@src/components/History/Widget/WidgetEmpty"
import WidgetDataList from "@src/components/History/Widget/WidgetDataList"
import { HistoryData } from "@src/stores/historyStore"
import WidgetCard from "@src/components/History/Widget/WidgetCard"
import { useWalletSelector } from "@src/providers/WalletSelectorProvider"

const Widget = () => {
  const { accountId } = useWalletSelector()
  const { active, data } = useHistoryStore((state) => state)
  if (!active) {
    return null
  }

  const getHistoryFromStore: HistoryData[] = []
  if (data.size) {
    data.forEach((setOfData) => {
      if (
        typeof setOfData === "object" &&
        !setOfData?.isClosed &&
        accountId === setOfData.details?.transaction?.signer_id
      )
        getHistoryFromStore.push(setOfData)
    })
  }

  return (
    <div className="min-w-full md:min-w-auto md:w-[300px]">
      {data.size && getHistoryFromStore.length ? (
        <WidgetDataList<HistoryData>
          Component={WidgetCard}
          data={getHistoryFromStore.toReversed()}
        />
      ) : (
        <WidgetEmpty />
      )}
    </div>
  )
}

export default Widget
