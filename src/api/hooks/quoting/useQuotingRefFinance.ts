import { useMutation } from "@tanstack/react-query"

import { getFtGetTokenMetadata } from "../../oracles"

const queryKey = "quoting"
export const getQuotingKey = [queryKey, "get-prices-ref-finance"]

export const useQuotingRefFinance = (options = {}) =>
  useMutation({
    mutationKey: getQuotingKey,
    mutationFn: (token: string) => getFtGetTokenMetadata(token),
    ...options,
  })
