"use client"

import { useEffect, useRef, useState } from "react"

export const useTimer = (
  initialTime: number,
  asyncCallback: () => Promise<void>
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
      callbackRef.current().then(resetTimer)
      return
    }

    const intervalId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1)
    }, 1000)

    return () => clearInterval(intervalId)
  }, [timeLeft, isRunning])

  return { timeLeft, resetTimer }
}
