import type { AccountView } from "near-api-js/lib/providers/provider"
import { BigNumber } from "ethers"

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
