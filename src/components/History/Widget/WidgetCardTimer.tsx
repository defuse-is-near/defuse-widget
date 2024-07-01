import React from "react"
import dayjs from "dayjs"
import duration from "dayjs/plugin/duration"

import { useDaysTimer } from "@src/hooks/useTimer"
dayjs.extend(duration)

export const WidgetCardTimer = ({ timeLeft }: { timeLeft: number }) => {
  const time = useDaysTimer(timeLeft)
  return time !== "0 sec" ? <span>Estimated time left: {time}</span> : null
}
