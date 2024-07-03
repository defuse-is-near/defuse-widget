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
import {
  NearTX,
  NetworkToken,
  QueueTransactions,
  Result,
} from "@src/types/interfaces"
import { swapSchema } from "@src/utils/schema"
import useStorageDeposit from "@src/hooks/useStorageDeposit"
import useNearSwapNearToWNear from "@src/hooks/useSwapNearToWNear"
import { useNearBlock } from "@src/hooks/useNearBlock"
import { getNearTransactionDetails } from "@src/api/transaction"
import { useTransactionScan } from "@src/hooks/useTransactionScan"

type Props = {
  accountId: string | null
  selector: WalletSelector | null
}

export type EstimateQueueTransactions = {
  queueTransactionsTrack: QueueTransactions[]
  queueInTrack: number
}

export type NextEstimateQueueTransactionsProps = {
  estimateQueue: EstimateQueueTransactions
  receivedHash: string
}

export type NextEstimateQueueTransactionsResult = {
  value: EstimateQueueTransactions
  done: boolean
}

export type CallRequestIntentProps = {
  tokenIn: string
  tokenOut: string
  selectedTokenIn: NetworkToken
  selectedTokenOut: NetworkToken
  estimateQueue: EstimateQueueTransactions
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
  const { getTransactionScan } = useTransactionScan()

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
    inputs: Omit<
      Pick<
        CallRequestIntentProps,
        | "tokenIn"
        | "tokenOut"
        | "selectedTokenIn"
        | "selectedTokenOut"
        | "clientId"
      >,
      "estimateQueue"
    >
  ): Promise<EstimateQueueTransactions> => {
    let queue = 1
    const queueTransaction = [QueueTransactions.CREATE_INTENT]

    if (!isValidInputs(inputs as CallRequestIntentProps)) {
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

  const nextEstimateQueueTransactions = async ({
    estimateQueue,
    receivedHash,
  }: NextEstimateQueueTransactionsProps): Promise<NextEstimateQueueTransactionsResult> => {
    const { result } = (await getNearTransactionDetails(
      receivedHash as string,
      accountId as string
    )) as Result<NearTX>
    const { isFailure } = await getTransactionScan(result)

    if (isFailure) {
      return {
        value: estimateQueue,
        done: false,
      }
    }

    const updateEstimateQueue = estimateQueue?.queueTransactionsTrack
    updateEstimateQueue?.shift()
    return {
      value: {
        queueTransactionsTrack: updateEstimateQueue,
        queueInTrack: updateEstimateQueue!.length,
      },
      done: updateEstimateQueue!.length ? false : true,
    } as NextEstimateQueueTransactionsResult
  }

  const callRequestCreateIntent = async (inputs: CallRequestIntentProps) => {
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

    const currentQueue: QueueTransactions =
      estimateQueue!.queueTransactionsTrack[0]

    setIsProcessing(true)

    switch (currentQueue) {
      case QueueTransactions.SWAP_FROM_NATIVE:
        // TODO If wNear user amount less than amountIn and Near user amount cover left part then do deposit
        // if (!selectedTokenIn?.address) {
        //   await callRequestNearDeposit(SUPPORTED_TOKENS.wNEAR, unitsSendAmount)
        // }
        break

      case QueueTransactions.STORAGE_DEPOSIT_TOKEN_IN:
        const storageBalanceTokenIn = await getStorageBalance(
          selectedTokenIn!.address as string,
          accountId as string
        )
        if (
          selectedTokenIn?.address &&
          !Number(storageBalanceTokenIn?.toString() || "0")
        ) {
          await setStorageDeposit(
            selectedTokenIn!.address as string,
            accountId as string
          )
        }
        break

      case QueueTransactions.STORAGE_DEPOSIT_TOKEN_OUT:
        const storageBalanceTokenOut = await getStorageBalance(
          selectedTokenOut!.address as string,
          accountId as string
        )
        if (
          selectedTokenOut?.address &&
          !Number(storageBalanceTokenOut?.toString() || "0")
        ) {
          await setStorageDeposit(
            selectedTokenOut!.address as string,
            accountId as string
          )
        }
        break

      case QueueTransactions.CREATE_INTENT:
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
        break
    }

    setIsProcessing(false)
  }

  const callRequestRollbackIntent = async (inputs: { id: string }) => {
    const wallet = await selector!.wallet()
    await wallet.signAndSendTransactions({
      transactions: [
        {
          receiverId: CONTRACTS_REGISTER.INTENT,
          actions: [
            {
              type: "FunctionCall",
              params: {
                methodName: "rollback_intent",
                args: {
                  id: inputs.id,
                },
                gas: MAX_GAS_TRANSACTION,
                deposit: "0",
              },
            },
          ],
        },
      ],
    })
  }

  return {
    isProcessing,
    nextEstimateQueueTransactions,
    getEstimateQueueTransactions,
    callRequestCreateIntent,
    callRequestRollbackIntent,
  }
}
