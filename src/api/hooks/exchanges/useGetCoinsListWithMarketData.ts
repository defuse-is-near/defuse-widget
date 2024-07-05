import { useQuery } from "@tanstack/react-query"

import { getCoinsListWithMarketData } from "@src/libs/de-sdk/providers/coingeckoProvider"

const queryKey = "exchanges"
export const getMarketDataKey = [queryKey, "get-market-data"]

export const useGetCoinsListWithMarketData = (options = {}) =>
  useQuery({
    queryKey: getMarketDataKey,
    queryFn: () => getCoinsListWithMarketData("usd"),
    ...options,
  })
