"use client"

import { useEffect, useState } from "react"

const useShortAccountId = (address: string) => {
  const [shortAccountId, setShortAccountId] = useState(address)

  useEffect(() => {
    if (address && address.length >= 42) {
      setShortAccountId(
        `${address.substring(0, 4)}...${address.substring(address.length - 5, address.length)}`
      )
    } else {
      setShortAccountId(address)
    }
  }, [address])

  return {
    shortAccountId,
  }
}

export default useShortAccountId
