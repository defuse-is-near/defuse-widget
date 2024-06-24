import { useMutation } from "@tanstack/react-query"

import { getTokenFormatSolver0 } from "@src/api/intent"

const queryKey = "quoting"
export const getQuotingKey = [queryKey, "get-prices-ref-finance"]

export const useQuotingSolver = (options = {}) =>
  useMutation({
    mutationKey: getQuotingKey,
    mutationFn: (token: string) => getTokenFormatSolver0(token),
    ...options,
  })
