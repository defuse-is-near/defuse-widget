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

export enum TokenConvertEnum {
  USD = "usd",
}

export type TokenBalance = {
  balance?: number
  balanceToUsd?: number
  convertedLast?: {
    [key in TokenConvertEnum]: number
  }
}

export interface TokenInfo extends TokenBalance {
  address: string
  symbol: string
  name: string
  decimals: number
  icon?: string
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
  "DEPOSIT" = "deposit",
  "WITHDRAW" = "withdraw",
  "STORAGE_DEPOSIT_TOKEN_IN" = "storageDepositTokenIn",
  "STORAGE_DEPOSIT_TOKEN_OUT" = "storageDepositTokenOut",
  "CREATE_INTENT" = "createIntent",
}

export interface Result<T> {
  result: T
  error?: NearTXError
}

export interface NearTXTransaction {
  hash: string
  actions: {
    FunctionCall: {
      method_name: string
      args: string
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

export type NearTXError = {
  message: string
  data: string
}

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

type TransferToken = {
  token_id: string
  amount: string
}

type ExpirationEnum = {
  Null: string
  Time: string
  Block: string
}

export interface NearIntentCreate {
  CreateIntent: {
    id: string
    IntentStruct: {
      initiator: string
      send: TransferToken
      receive: TransferToken
      expiration: ExpirationEnum
      referral: string
    }
  }
}

export interface RecoverDetails {
  initiator: string
  send: TransferToken
  receive: TransferToken
  expiration: ExpirationEnum
  referral: string
  msg?: string
  amount?: string
}

export type JobsDetails = {
  team?: string
  applicationLink?: boolean
  position: string
  link: string
}
