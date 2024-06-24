import { useMutation } from "@tanstack/react-query"

import { getNearTransactionDetails } from "../../transaction"

const transactionKey = "transaction"
export const getTransactionKey = [transactionKey, "get-transaction-details"]

export const useGetTransactionDetails = (options = {}) =>
  useMutation({
    mutationKey: getTransactionKey,
    mutationFn: ({
      transactionHash,
      accountId,
    }: {
      transactionHash: string
      accountId: string
    }) => getNearTransactionDetails(transactionHash, accountId),
    ...options,
  })
