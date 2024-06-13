import { useMutation } from "@tanstack/react-query"

import { getSolverTokenFormat } from "../../oracles"

const queryKey = "quoting"
export const getQuotingKey = [queryKey, "get-prices-ref-finance"]

export const useQuotingSolver = (options = {}) =>
  useMutation({
    mutationKey: getQuotingKey,
    mutationFn: (token: string) => getSolverTokenFormat(token),
    ...options,
  })
