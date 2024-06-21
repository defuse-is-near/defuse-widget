"use client"

import { WalletSelector } from "@near-wallet-selector/core"
import * as borsh from "borsh"
import { parseUnits } from "viem"

import {
  CONTRACTS_REGISTER,
  MAX_GAS_TRANSACTION,
} from "@src/constants/contracts"
import { sha256 } from "@src/actions/crypto"
import { NetworkToken } from "@src/types/interfaces"
import { swapSchema } from "@src/utils/schema"
import useStorageDeposit from "@src/hooks/useStorageDeposit"
import useNearSwapNearToWNear from "@src/hooks/useSwapNearToWNear"
import { LIST_NATIVE_TOKENS, SUPPORTED_TOKENS } from "@src/constants/tokens"

type Props = {
  accountId: string | null
  selector: WalletSelector | null
}
export type CallRequestIntentProps = {
  tokenIn: string
  tokenOut: string
  selectedTokenIn: NetworkToken
  selectedTokenOut: NetworkToken
  defuseClientId?: string
}

export const useSwap = ({ accountId, selector }: Props) => {
  const { getStorageBalance, setStorageDeposit } = useStorageDeposit({
    accountId,
    selector,
  })
  const { callRequestNearDeposit } = useNearSwapNearToWNear({
    accountId,
    selector,
  })

  const validateInputs = (inputs: CallRequestIntentProps) => {
    if (accountId) {
      console.log("Non valid recipient address")
      return
    }
    if (inputs!.selectedTokenIn?.address) {
      console.log("Non valid contract address")
      return
    }
    if (inputs?.defuseClientId) {
      console.log("Non valid defuseClientId")
      return
    }
  }

  const getEstimateQueueTransactions = async (
    inputs: CallRequestIntentProps
  ) => {
    let queue = 1
    validateInputs(inputs)
    const { tokenIn, tokenOut, selectedTokenIn, selectedTokenOut } = inputs
    const isExistSwapRoute = LIST_NATIVE_TOKENS.findIndex(
      (token) => token.swapRoute === selectedTokenIn.address
    )
    if (isExistSwapRoute !== -1) {
      // TODO compare tokenIn > selectedTokenIn.address balance then get balance of Native, and then queue++
      queue++
    }

    const balance = await getStorageBalance(
      selectedTokenIn!.address as string,
      CONTRACTS_REGISTER.INTENT
    )
    console.log("useSwap getEstimateQueueTransactions: ", balance)
    if (selectedTokenIn?.address && !Number(balance?.toString() || "0")) {
      queue++
    }
    return queue
  }

  const callRequestCreateIntent = async (inputs: CallRequestIntentProps) => {
    validateInputs(inputs)
    const {
      tokenIn,
      tokenOut,
      selectedTokenIn,
      selectedTokenOut,
      defuseClientId,
    } = inputs

    const balance = await getStorageBalance(
      selectedTokenIn!.address as string,
      CONTRACTS_REGISTER.INTENT
    )

    if (selectedTokenIn?.address && !Number(balance?.toString() || "0")) {
      await setStorageDeposit(
        selectedTokenIn!.address as string,
        CONTRACTS_REGISTER.INTENT
      )
    }

    const intent_account_id = await sha256(defuseClientId as string)

    const unitsSendAmount = parseUnits(
      tokenIn,
      selectedTokenIn?.decimals as number
    ).toString()
    const estimateUnitsBackAmount = parseUnits(
      tokenOut,
      selectedTokenOut?.decimals as number
    ).toString()

    const getBlock = 121_700_000 // Current block + 10
    const referral = "referral.near" // Some referral account

    // TODO If wNear user amount less than amountIn and Near user amount cover left part then do deposit
    // if (!selectedTokenIn?.address) {
    //   await callRequestNearDeposit(SUPPORTED_TOKENS.wNEAR, unitsSendAmount)
    // }

    const msg = {
      CreateIntent: {
        id: intent_account_id,
        IntentStruct: {
          initiator: accountId,
          send: {
            token_id: selectedTokenIn!.address,
            amount: unitsSendAmount,
          },
          receive: {
            token_id: selectedTokenOut!.address,
            amount: estimateUnitsBackAmount,
          },
          expiration: {
            Block: getBlock,
          },
          referral: {
            Some: referral,
          },
        },
      },
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const msgBorsh = borsh.serialize(swapSchema as any, msg)

    const wallet = await selector!.wallet()
    await wallet.signAndSendTransactions({
      transactions: [
        {
          receiverId: selectedTokenIn!.address as string,
          actions: [
            {
              type: "FunctionCall",
              params: {
                methodName: "ft_transfer_call",
                args: {
                  receiver_id: CONTRACTS_REGISTER.INTENT,
                  amount: unitsSendAmount,
                  memo: "Execute intent: NEP-141 to NEP-141",
                  msg: Buffer.from(msgBorsh).toString("base64"),
                },
                gas: MAX_GAS_TRANSACTION,
                deposit: "1",
              },
            },
          ],
        },
      ],
    })
  }

  return {
    getEstimateQueueTransactions,
    callRequestCreateIntent,
  }
}
