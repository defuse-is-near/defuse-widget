"use client"

import { WalletSelector } from "@near-wallet-selector/core"
import * as borsh from "borsh"
import { parseUnits } from "viem"
import { BigNumber } from "ethers"
import { useState } from "react"

import {
  CONTRACTS_REGISTER,
  CREATE_INTENT_EXPIRATION_BLOCK_BOOST,
  MAX_GAS_TRANSACTION,
} from "@src/constants/contracts"
import { NetworkToken, QueueTransactions } from "@src/types/interfaces"
import { swapSchema } from "@src/utils/schema"
import useStorageDeposit from "@src/hooks/useStorageDeposit"
import useNearSwapNearToWNear from "@src/hooks/useSwapNearToWNear"
import { useNearBlock } from "@src/hooks/useNearBlock"

type Props = {
  accountId: string | null
  selector: WalletSelector | null
}

export type EstimateQueueTransactions = {
  queueTransactionsTrack: QueueTransactions[]
  queueInTrack: number
}

export type CallRequestIntentProps = {
  tokenIn: string
  tokenOut: string
  selectedTokenIn: NetworkToken
  selectedTokenOut: NetworkToken
  estimateQueue?: EstimateQueueTransactions
  clientId?: string
}

const REFERRAL_ACCOUNT = process.env.REFERRAL_ACCOUNT ?? ""

export const useSwap = ({ accountId, selector }: Props) => {
  const [isProcessing, setIsProcessing] = useState(false)
  const { getStorageBalance, setStorageDeposit } = useStorageDeposit({
    accountId,
    selector,
  })
  const { callRequestNearDeposit } = useNearSwapNearToWNear({
    accountId,
    selector,
  })
  const { getNearBlock } = useNearBlock()

  const isValidInputs = (inputs: CallRequestIntentProps): boolean => {
    if (!accountId) {
      console.log("Non valid recipient address")
      return false
    }
    if (!inputs!.selectedTokenIn?.address) {
      console.log("Non valid contract address")
      return false
    }
    if (!inputs?.clientId) {
      console.log("Non valid clientId")
      return false
    }
    return true
  }
  const isValidEstimateQueue = (
    queueTransaction?: EstimateQueueTransactions
  ) => {
    if (!queueTransaction?.queueTransactionsTrack?.length) {
      console.log("Non valid queueTransactionsTrack")
      return false
    }
    return true
  }

  const getEstimateQueueTransactions = async (
    inputs: CallRequestIntentProps
  ): Promise<EstimateQueueTransactions> => {
    let queue = 1
    const queueTransaction = [QueueTransactions.CREATE_INTENT]

    if (!isValidInputs(inputs)) {
      return {
        queueInTrack: 0,
        queueTransactionsTrack: [],
      }
    }

    const { tokenIn, tokenOut, selectedTokenIn, selectedTokenOut } = inputs

    // Estimate if user did storage before in order to transfer tokens for swap
    const storageBalanceTokenIn = await getStorageBalance(
      selectedTokenIn!.address as string,
      accountId as string
    )
    const storageBalanceTokenInToString = BigNumber.from(
      storageBalanceTokenIn
    ).toString()
    console.log(
      "useSwap storageBalanceTokenIn: ",
      storageBalanceTokenInToString
    )
    if (!parseFloat(storageBalanceTokenInToString)) {
      queueTransaction.unshift(QueueTransactions.STORAGE_DEPOSIT_TOKEN_IN)
      queue++
    }

    // Estimate if user did storage before in order to transfer tokens for swap
    const storageBalanceTokenOut = await getStorageBalance(
      selectedTokenOut!.address as string,
      accountId as string
    )
    const storageBalanceTokenOutToString = BigNumber.from(
      storageBalanceTokenOut
    ).toString()
    console.log(
      "useSwap storageBalanceTokenOut: ",
      storageBalanceTokenOutToString
    )
    if (!parseFloat(storageBalanceTokenOutToString)) {
      queueTransaction.unshift(QueueTransactions.STORAGE_DEPOSIT_TOKEN_OUT)
      queue++
    }

    // const isExistSwapRoute = LIST_NATIVE_TOKENS.findIndex(
    //     (token) => token.swapRoute === selectedTokenIn.address
    // )
    // if (isExistSwapRoute !== -1) {
    //   // TODO compare tokenIn > selectedTokenIn.address balance then get balance of Native, and then queue++
    //   queueTransaction.unshift(QueueTransactions.SWAP_FROM_NATIVE)
    //   queue++
    // }

    return {
      queueInTrack: queue,
      queueTransactionsTrack: queueTransaction,
    }
  }

  const callRequestCreateIntent = async (inputs: CallRequestIntentProps) => {
    setIsProcessing(true)
    if (!isValidInputs(inputs) && !isValidEstimateQueue(inputs?.estimateQueue))
      return
    const {
      tokenIn,
      tokenOut,
      selectedTokenIn,
      selectedTokenOut,
      clientId,
      estimateQueue,
    } = inputs

    if (
      estimateQueue!.queueTransactionsTrack.includes(
        QueueTransactions.SWAP_FROM_NATIVE
      )
    ) {
      // TODO If wNear user amount less than amountIn and Near user amount cover left part then do deposit
      // if (!selectedTokenIn?.address) {
      //   await callRequestNearDeposit(SUPPORTED_TOKENS.wNEAR, unitsSendAmount)
      // }
    }

    if (
      estimateQueue!.queueTransactionsTrack.includes(
        QueueTransactions.STORAGE_DEPOSIT_TOKEN_IN
      )
    ) {
      const balance = await getStorageBalance(
        selectedTokenIn!.address as string,
        accountId as string
      )
      if (selectedTokenIn?.address && !Number(balance?.toString() || "0")) {
        await setStorageDeposit(
          selectedTokenIn!.address as string,
          accountId as string
        )
      }
    }

    if (
      estimateQueue!.queueTransactionsTrack.includes(
        QueueTransactions.STORAGE_DEPOSIT_TOKEN_OUT
      )
    ) {
      const balance = await getStorageBalance(
        selectedTokenOut!.address as string,
        accountId as string
      )
      if (selectedTokenOut?.address && !Number(balance?.toString() || "0")) {
        await setStorageDeposit(
          selectedTokenOut!.address as string,
          accountId as string
        )
      }
    }

    const unitsSendAmount = parseUnits(
      tokenIn,
      selectedTokenIn?.decimals as number
    ).toString()
    const estimateUnitsBackAmount = parseUnits(
      tokenOut,
      selectedTokenOut?.decimals as number
    ).toString()

    const getBlock = await getNearBlock()

    const msg = {
      CreateIntent: {
        id: clientId,
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
            Block: getBlock.height + CREATE_INTENT_EXPIRATION_BLOCK_BOOST,
          },
          referral: {
            Some: REFERRAL_ACCOUNT,
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

    setIsProcessing(false)
  }

  return {
    isProcessing,
    getEstimateQueueTransactions,
    callRequestCreateIntent,
  }
}
