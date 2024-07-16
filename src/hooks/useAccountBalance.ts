import { BigNumber } from "ethers"
import { providers } from "near-api-js"
import type { AccountView } from "near-api-js/lib/providers/provider"

import { useWalletSelector } from "@src/providers/WalletSelectorProvider"

export interface GetAccountBalanceProps {
  provider: providers.Provider
  accountId: string
}

export interface GetAccountBalanceResult {
  hasBalance: boolean
  balance: string
}

const NEAR_NODE_URL = process.env.nearNodeUrl ?? "https://rpc.mainnet.near.org"

export const useAccountBalance = () => {
  const { accountId } = useWalletSelector()

  const getAccountBalance = async (): Promise<GetAccountBalanceResult> => {
    const balance = { hasBalance: false, balance: "0" }
    try {
      if (!accountId) {
        return balance
      }
      const provider = new providers.JsonRpcProvider({ url: NEAR_NODE_URL })
      const { amount } = await provider.query<AccountView>({
        request_type: "view_account",
        finality: "final",
        account_id: accountId,
      })
      const bn = BigNumber.from(amount)
      const isZero = bn.isZero()
      return Object.assign(balance, { hasBalance: !isZero, balance: amount })
    } catch (e) {
      console.log("useAccountBalance: ", e)
      return balance
    }
  }

  return {
    getAccountBalance,
  }
}
