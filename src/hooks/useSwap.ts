"use client"

import { WalletSelector } from "@near-wallet-selector/core"
import * as borsh from "borsh"
import { parseUnits } from "viem"
import { BigNumber } from "ethers"
import { useState } from "react"

import {
  CONTRACTS_REGISTER,
  CREATE_INTENT_EXPIRATION_BLOCK_BOOST,
  FT_MINIMUM_STORAGE_BALANCE_LARGE,
  FT_STORAGE_DEPOSIT_GAS,
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
import { LIST_NATIVE_TOKENS } from "@src/constants/tokens"

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

type WithSwapDepositRequest = {
  useNative?: boolean
}

const REFERRAL_ACCOUNT = process.env.REFERRAL_ACCOUNT ?? ""

export const useSwap = ({ accountId, selector }: Props) => {
  const [isProcessing, setIsProcessing] = useState(false)
  const { getStorageBalance, setStorageDeposit } = useStorageDeposit({
    accountId,
    selector,
  })
  const { callRequestNearDeposit, callRequestNearWithdraw } =
    useNearSwapNearToWNear({
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
    > &
      WithSwapDepositRequest
  ): Promise<EstimateQueueTransactions> => {
    let queue = 1
    const queueTransaction = [QueueTransactions.CREATE_INTENT]

    if (!isValidInputs(inputs as CallRequestIntentProps)) {
      return {
        queueInTrack: 0,
        queueTransactionsTrack: [],
      }
    }

    const { tokenIn, tokenOut, selectedTokenIn, selectedTokenOut, useNative } =
      inputs

    if (useNative) {
      const pair = [selectedTokenIn!.address, selectedTokenOut!.address]
      if (pair.includes("0x1") && pair.includes("wrap.near")) {
        const queueTransaction =
          selectedTokenIn!.address === "0x1"
            ? QueueTransactions.DEPOSIT
            : QueueTransactions.WITHDRAW
        return {
          queueInTrack: 1,
          queueTransactionsTrack: [queueTransaction],
        }
      }
      // TODO If Token to Native then use QueueTransactions.WITHDRAW
      queueTransaction.unshift(QueueTransactions.DEPOSIT)
      queue++
    }

    const isNativeTokenIn = selectedTokenIn!.address === "0x1"
    const tokenNearNative = LIST_NATIVE_TOKENS.find(
      (token) => token.defuse_asset_id === "near:mainnet:0x1"
    )
    const storageBalanceTokenInAddress = isNativeTokenIn
      ? tokenNearNative!.routes
        ? tokenNearNative!.routes[0]
        : ""
      : selectedTokenIn!.address
    // Estimate if user did storage before in order to transfer tokens for swap
    const storageBalanceTokenIn = await getStorageBalance(
      storageBalanceTokenInAddress as string,
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

  const callRequestCreateIntent = async (
    inputs: CallRequestIntentProps,
    mutate?: (input: CallRequestIntentProps) => void
  ) => {
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

    setIsProcessing(true)

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
            token_id:
              selectedTokenIn!.address === "0x1"
                ? "wrap.near"
                : selectedTokenIn!.address,
            amount: unitsSendAmount,
          },
          receive: {
            token_id:
              selectedTokenOut!.address === "0x1"
                ? "wrap.near"
                : selectedTokenOut!.address,
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

    if (estimateQueue?.queueTransactionsTrack?.length === 1) {
      const currentQueue: QueueTransactions =
        estimateQueue!.queueTransactionsTrack[0]

      switch (currentQueue) {
        case QueueTransactions.DEPOSIT:
          if (selectedTokenIn?.address) {
            const unitsSendAmount = parseUnits(
              tokenIn.toString(),
              selectedTokenIn?.decimals as number
            ).toString()
            await callRequestNearDeposit(
              selectedTokenOut!.address as string,
              unitsSendAmount
            )
          }
          break

        case QueueTransactions.WITHDRAW:
          if (selectedTokenIn?.address) {
            const unitsSendAmount = parseUnits(
              tokenIn.toString(),
              selectedTokenIn?.decimals as number
            ).toString()
            await callRequestNearWithdraw(
              selectedTokenIn!.address as string,
              unitsSendAmount
            )
          }
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
    }

    const isNativeTokenIn = selectedTokenIn!.address === "0x1"
    const tokenNearNative = LIST_NATIVE_TOKENS.find(
      (token) => token.defuse_asset_id === "near:mainnet:0x1"
    )

    // Batches transactions and actions
    // TODO Move single and batch to separate functions
    const receiverIdIn = isNativeTokenIn
      ? tokenNearNative!.routes
        ? tokenNearNative!.routes[0]
        : ""
      : (selectedTokenIn!.address as string)
    const receiverIdOut = selectedTokenOut!.address as string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const transactions: { receiverId: string; actions: any }[] = []
    const mutateEstimateQueue = inputs.estimateQueue
    let tempQueueTransactionsTrack = []

    estimateQueue.queueTransactionsTrack.forEach((queueTransaction) => {
      switch (queueTransaction) {
        case QueueTransactions.DEPOSIT:
          if (selectedTokenIn?.address) {
            const unitsSendAmount = parseUnits(
              tokenIn.toString(),
              selectedTokenIn?.decimals as number
            ).toString()
            transactions.push({
              receiverId: receiverIdIn,
              actions: [
                {
                  type: "FunctionCall",
                  params: {
                    methodName: "near_deposit",
                    args: {},
                    gas: FT_STORAGE_DEPOSIT_GAS,
                    deposit: unitsSendAmount,
                  },
                },
              ],
            })
            mutateEstimateQueue.queueInTrack--
            tempQueueTransactionsTrack =
              mutateEstimateQueue.queueTransactionsTrack.filter(
                (queue) => queue !== QueueTransactions.DEPOSIT
              )
            mutateEstimateQueue.queueTransactionsTrack =
              tempQueueTransactionsTrack
          }
          break
        case QueueTransactions.STORAGE_DEPOSIT_TOKEN_IN:
          transactions.push({
            receiverId: receiverIdIn,
            actions: [
              {
                type: "FunctionCall",
                params: {
                  methodName: "storage_deposit",
                  args: {
                    account_id: accountId as string,
                    registration_only: true,
                  },
                  gas: FT_STORAGE_DEPOSIT_GAS,
                  deposit: FT_MINIMUM_STORAGE_BALANCE_LARGE,
                },
              },
            ],
          })
          mutateEstimateQueue.queueInTrack--
          tempQueueTransactionsTrack =
            mutateEstimateQueue.queueTransactionsTrack.filter(
              (queue) => queue !== QueueTransactions.STORAGE_DEPOSIT_TOKEN_IN
            )
          mutateEstimateQueue.queueTransactionsTrack =
            tempQueueTransactionsTrack
          break
        case QueueTransactions.STORAGE_DEPOSIT_TOKEN_OUT:
          transactions.push({
            receiverId: receiverIdOut,
            actions: [
              {
                type: "FunctionCall",
                params: {
                  methodName: "storage_deposit",
                  args: {
                    account_id: accountId as string,
                    registration_only: true,
                  },
                  gas: FT_STORAGE_DEPOSIT_GAS,
                  deposit: FT_MINIMUM_STORAGE_BALANCE_LARGE,
                },
              },
            ],
          })
          mutateEstimateQueue.queueInTrack--
          tempQueueTransactionsTrack =
            mutateEstimateQueue.queueTransactionsTrack.filter(
              (queue) => queue !== QueueTransactions.STORAGE_DEPOSIT_TOKEN_OUT
            )
          mutateEstimateQueue.queueTransactionsTrack =
            tempQueueTransactionsTrack
          break
        case QueueTransactions.CREATE_INTENT:
          transactions.push({
            receiverId: receiverIdIn,
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
          })
          break
      }
    })

    mutate &&
      mutate({
        ...inputs,
        estimateQueue: mutateEstimateQueue,
      })

    const wallet = await selector!.wallet()
    await wallet.signAndSendTransactions({
      transactions: transactions.filter((tx) => tx.actions.length),
    })

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
