import { BigNumber } from "ethers"
import { providers } from "near-api-js"
import type { AccountView } from "near-api-js/lib/providers/provider"

export interface GetAccountBalanceProps {
  provider: providers.Provider
  accountId: string
}

export interface GetAccountBalanceResult {
  hasBalance: boolean
  balance: string
}

export const useAccountBalance = () => {
  const getAccountBalance = async ({
    provider,
    accountId,
  }: GetAccountBalanceProps): Promise<GetAccountBalanceResult> => {
    try {
      const { amount } = await provider.query<AccountView>({
        request_type: "view_account",
        finality: "final",
        account_id: accountId,
      })
      const bn = BigNumber.from(amount)
      const isZero = bn.isZero()
      return { hasBalance: !isZero, balance: amount }
    } catch (e) {
      console.log("useAccountBalance: ", e)
      return { hasBalance: false, balance: "0" }
    }
  }

  return {
    getAccountBalance,
  }
}
