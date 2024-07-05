import { useQuery } from "@tanstack/react-query"

import { getTrendingList } from "@src/libs/de-sdk/providers/coingeckoProvider"

const queryKey = "exchanges"
export const getExchangesKey = [queryKey, "get-exchanges"]

export const useGetCoingeckoExchangesList = (options = {}) =>
  useQuery({
    queryKey: getExchangesKey,
    queryFn: () => getTrendingList("ref_finance"),
    ...options,
  })
