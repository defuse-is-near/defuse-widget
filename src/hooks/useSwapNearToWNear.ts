import { WalletSelector } from "@near-wallet-selector/core"

import {
  FT_STORAGE_DEPOSIT_GAS,
  FT_WITHDRAW_GAS,
} from "@src/constants/contracts"

type Props = {
  accountId: string | null
  selector: WalletSelector | null
}

const useSwapNearToWNear = ({ selector }: Props) => {
  const callRequestNearDeposit = async (
    contractAddress: string,
    deposit: string
  ) => {
    const wallet = await selector!.wallet()
    return await wallet.signAndSendTransactions({
      transactions: [
        {
          receiverId: contractAddress,
          actions: [
            {
              type: "FunctionCall",
              params: {
                methodName: "near_deposit",
                args: {},
                gas: FT_STORAGE_DEPOSIT_GAS,
                deposit,
              },
            },
          ],
        },
      ],
    })
  }

  const callRequestNearWithdraw = async (
    contractAddress: string,
    amount: string
  ) => {
    const wallet = await selector!.wallet()
    debugger
    return await wallet.signAndSendTransactions({
      transactions: [
        {
          receiverId: contractAddress,
          actions: [
            {
              type: "FunctionCall",
              params: {
                methodName: "near_withdraw",
                args: {
                  amount,
                },
                gas: FT_WITHDRAW_GAS,
                deposit: "1",
              },
            },
          ],
        },
      ],
    })
  }

  return {
    callRequestNearDeposit,
    callRequestNearWithdraw,
  }
}

export default useSwapNearToWNear
