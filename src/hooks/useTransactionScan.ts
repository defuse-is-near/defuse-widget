import { NearTX } from "@src/types/interfaces"

export type GetTransactionScanResult = {
  isFailure: boolean
}

export const useTransactionScan = () => {
  const getTransactionScan = (tx: NearTX): GetTransactionScanResult => {
    const isFailureResults = tx.receipts_outcome.map((receipt) => {
      return Boolean(
        receipt.outcome.status?.Failure?.ActionError.kind.FunctionCallError
          .ExecutionError
      )
    })
    return {
      isFailure: isFailureResults.includes(true),
    }
  }

  return {
    getTransactionScan,
  }
}
