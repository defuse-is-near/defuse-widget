import { useCallback } from "react"
import { providers } from "near-api-js"
import type { AccountView } from "near-api-js/lib/providers/provider"
import { WalletSelector } from "@near-wallet-selector/core"

import { useAccountBalance } from "@src/hooks/useAccountBalance"
import { Account } from "@src/types/interfaces"

type Props = {
  accountId: string | null
  selector: WalletSelector | null
}

export const useGetAccount = ({ accountId, selector }: Props) => {
  const { getAccountBalance } = useAccountBalance()

  const getAccount = useCallback(async (): Promise<Account | null> => {
    if (!accountId || !selector) {
      return null
    }

    const { network } = selector.options
    const provider = new providers.JsonRpcProvider({ url: network.nodeUrl })

    const { hasBalance } = await getAccountBalance()

    if (!hasBalance) {
      window.alert(
        `Account ID: ${accountId} has not been founded. Please send some NEAR into this account.`
      )
      const wallet = await selector.wallet()
      await wallet.signOut()
      return null
    }

    return provider
      .query<AccountView>({
        request_type: "view_account",
        finality: "final",
        account_id: accountId,
      })
      .then((data) => ({
        ...data,
        account_id: accountId,
      }))
  }, [accountId, selector])

  return {
    getAccount,
  }
}
