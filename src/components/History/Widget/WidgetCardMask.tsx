import React from "react"
import clsx from "clsx"

import { WidgetCardTimer } from "@src/components/History/Widget/WidgetCardTimer"

const WAIT_MORE_2MIN = 120000

type Props = {
  timestamp: number
}
const WidgetCardMask = ({ timestamp }: Props) => {
  const timeLeft = Math.floor(timestamp / 1e6 + WAIT_MORE_2MIN)
  const isTimeLeftExpired = new Date().getTime() > timeLeft
  return (
    <div
      className={clsx(
        "group z-50 absolute top-0 left-0 w-full h-full",
        isTimeLeftExpired && "hidden"
      )}
    >
      {!isTimeLeftExpired && (
        <div className="hidden group-hover:flex h-full justify-center items-center bg-white opacity-85">
          <WidgetCardTimer
            timeLeft={timeLeft}
            className="text-sm font-medium"
          />
        </div>
      )}
    </div>
  )
}

export default WidgetCardMask
