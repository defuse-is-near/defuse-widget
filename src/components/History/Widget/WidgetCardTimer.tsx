import React from "react"
import dayjs from "dayjs"
import duration from "dayjs/plugin/duration"
import clsx from "clsx"

import { useDaysTimer } from "@src/hooks/useTimer"
dayjs.extend(duration)

type Props = {
  timeLeft: number
  className?: string
}
export const WidgetCardTimer = ({ timeLeft, className }: Props) => {
  const time = useDaysTimer(timeLeft)
  return time !== "0 sec" ? (
    <span className={clsx(className && className)}>
      Estimated time left: {time}
    </span>
  ) : null
}
