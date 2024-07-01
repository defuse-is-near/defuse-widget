import type { AccountView } from "near-api-js/lib/providers/provider"
import { BigNumber } from "ethers"

import { HistoryStatus } from "@src/stores/historyStore"

// defuse_asset_id - consist of: `blockchain + ":" + chainId + ":" + "token"`
export type DefuseBaseIds = {
  defuse_asset_id: string
  blockchain: string
}

export type Account = AccountView & {
  account_id: string
}

export type TokenInfo = {
  address: string
  symbol: string
  name: string
  decimals: number
  icon?: string
  balance?: string | BigNumber
  balanceToUds?: string
}

export interface NetworkToken extends Partial<TokenInfo>, DefuseBaseIds {
  chainId?: string
  chainIcon?: string
  chainName?: string
}

export interface NetworkTokenWithSwapRoute extends NetworkToken {
  routes?: string[]
}

export enum QueueTransactions {
  "SWAP_FROM_NATIVE" = "swapFromNative",
  "STORAGE_DEPOSIT_TOKEN_IN" = "storageDepositTokenIn",
  "STORAGE_DEPOSIT_TOKEN_OUT" = "storageDepositTokenOut",
  "CREATE_INTENT" = "createIntent",
}

export interface Result<T> {
  result: T
}

export interface NearTXTransaction {
  actions: {
    FunctionCall: {
      method_name: string
    }
  }[]
  signer_id: string
  receiver_id: string
}

export type NearTxReceiptsOutcomeFailure = {
  ActionError: {
    index: number
    kind: {
      FunctionCallError: {
        ExecutionError: string
      }
    }
  }
}

export type NearTxReceiptsOutcome = {
  block_hash: string
  id: string
  outcome: {
    logs: string[]
    status: {
      SuccessReceiptId?: string
      SuccessValue?: string
      Failure?: NearTxReceiptsOutcomeFailure
    }
  }
}[]

export type NearTX = {
  transaction: NearTXTransaction
  receipts_outcome: NearTxReceiptsOutcome
}

export interface NearHeader {
  height: number
  prev_height: number
  timestamp: number
}

export type NearBlock = Result<{
  chunks: unknown
  header: NearHeader
}>

export type NearIntentStatus = {
  intent: {
    initiator: string
    send: {
      token_id: string
      amount: string
    }
    receive: {
      token_id: string
      amount: string
    }
    expiration: {
      Block: number
    }
    referral: string
  }
  status: HistoryStatus
  created_at: number
  min_ttl: number
}
