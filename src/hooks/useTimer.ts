"use client"

import { useEffect, useRef, useState } from "react"
import dayjs from "dayjs"

export const useTimer = (
  initialTime: number,
  asyncCallback?: () => Promise<void>
) => {
  const [timeLeft, setTimeLeft] = useState(initialTime)
  const [isRunning, setIsRunning] = useState(true)
  const callbackRef = useRef(asyncCallback)

  useEffect(() => {
    callbackRef.current = asyncCallback
  }, [asyncCallback])

  const resetTimer = () => {
    setTimeLeft(initialTime)
    setIsRunning(true)
  }

  useEffect(() => {
    if (!isRunning) return

    if (timeLeft <= 0) {
      setIsRunning(false)
      callbackRef.current && callbackRef.current().then(resetTimer)
      return
    }

    const intervalId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1)
    }, 1000)

    return () => clearInterval(intervalId)
  }, [timeLeft, isRunning])

  return { timeLeft, resetTimer }
}

export const useDaysTimer = (timestamp: number): string => {
  const calculateTimeLeft = () => {
    const now = dayjs()
    const targetTime = dayjs(timestamp)
    const difference = targetTime.diff(now, "second")
    return difference > 0 ? difference : 0
  }

  const [secondsLeft, setSecondsLeft] = useState(calculateTimeLeft)

  useEffect(() => {
    if (secondsLeft <= 0) return

    const intervalId = setInterval(() => {
      setSecondsLeft(calculateTimeLeft)
    }, 1000)

    return () => clearInterval(intervalId)
  }, [secondsLeft, timestamp])

  const formatTime = (seconds: number) => {
    const days = Math.floor(seconds / (60 * 60 * 24))
    const hours = Math.floor((seconds % (60 * 60 * 24)) / (60 * 60))
    const minutes = Math.floor((seconds % (60 * 60)) / 60)
    const remainingSeconds = seconds % 60

    let timeString = ""
    if (days > 0) timeString += `${days} day${days > 1 ? "s" : ""} `
    if (hours > 0) timeString += `${hours} hour${hours > 1 ? "s" : ""} `
    if (minutes > 0) timeString += `${minutes} min `
    timeString += `${remainingSeconds} sec`

    return timeString.trim()
  }

  return formatTime(secondsLeft)
}
