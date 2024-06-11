import React from "react"

import { useHistoryStore } from "@src/providers/HistoryStoreProvider"
import WidgetEmpty from "@src/components/History/Widget/WidgetEmpty"

const Widget = () => {
  const { active } = useHistoryStore((state) => state)
  if (!active) {
    return null
  }
  return (
    <div className="min-w-full md:min-w-auto md:w-[300px]">
      <WidgetEmpty />
    </div>
  )
}

export default Widget