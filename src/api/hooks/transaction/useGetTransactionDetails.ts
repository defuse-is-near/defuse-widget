import { useMutation } from "@tanstack/react-query"

import { getTransactionDetails } from "../../transaction"

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
    }) => getTransactionDetails(transactionHash, accountId),
    ...options,
  })
