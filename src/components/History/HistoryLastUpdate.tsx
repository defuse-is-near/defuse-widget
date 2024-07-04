import clsx from "clsx"
import { useEffect, useState } from "react"
import { Spinner } from "@radix-ui/themes"

import { useHistoryStore } from "@src/providers/HistoryStoreProvider"
import WidgetCard from "@src/components/History/Widget/WidgetCard"
import { HistoryData } from "@src/stores/historyStore"

const SCHEDULER_30_SEC = 30000

const HistoryLastUpdate = () => {
  const { active, data, activePreview, togglePreview } = useHistoryStore(
    (state) => state
  )
  const [isLoading, setIsLoading] = useState(false)
  const [lastData, setLastData] = useState<HistoryData[]>([])
  const [isOpen, setIsOpen] = useState(false)

  let cycle = 0

  const handleReSchedulerRequest = (hash: string) => {
    cycle++
    if (cycle > 5) {
      return
    }
    setTimeout(() => handleFindHistory.call(this, hash), SCHEDULER_30_SEC)
  }

  const handleFindHistory = (hash: string) => {
    setIsLoading(true)
    const getHistoryByHash = data.get(hash)
    if (!getHistoryByHash) {
      handleReSchedulerRequest(hash)
    }
    setIsLoading(false)
    setLastData([getHistoryByHash as HistoryData])
    setIsOpen(true)
  }

  useEffect(() => {
    if (active) {
      setIsOpen(false)
    }
    return () => {
      togglePreview(undefined)
    }
  }, [active])

  useEffect(() => {
    if (activePreview && data.size) {
      handleFindHistory(activePreview)
    }
  }, [activePreview, data])

  return (
    <div
      className={clsx(
        "absolute bottom-[75px] w-full md:w-auto md:bottom-[100px] left-0 md:left-auto md:right-[35px]",
        !isOpen && "hidden"
      )}
    >
      <div className="min-w-full md:min-w-auto md:w-[300px]">
        <Spinner loading={isLoading} />
        <WidgetCard
          {...lastData[0]}
          withCloseHistory
          onCloseHistory={() => {
            setIsOpen(false)
            togglePreview(undefined)
          }}
        />
      </div>
    </div>
  )
}

export default HistoryLastUpdate
