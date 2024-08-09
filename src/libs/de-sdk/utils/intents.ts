import { parseUnits } from "viem"
import * as borsh from "borsh"

import {
  CONTRACTS_REGISTER,
  CREATE_INTENT_EXPIRATION_BLOCK_BOOST,
  INDEXER,
  MAX_GAS_TRANSACTION,
} from "@src/constants/contracts"
import { MapCreateIntentProps } from "@src/libs/de-sdk/utils/maps"
import { LIST_NATIVE_TOKENS } from "@src/constants/tokens"
import { swapSchema } from "@src/utils/schema"
import { NearIntent1Create } from "@src/types/interfaces"

const REFERRAL_ACCOUNT = process.env.REFERRAL_ACCOUNT ?? ""

export const prepareCreateIntent0 = (inputs: MapCreateIntentProps) => {
  const isNativeTokenIn = inputs.selectedTokenIn.address === "native"
  const tokenNearNative = LIST_NATIVE_TOKENS.find(
    (token) => token.defuse_asset_id === "near:mainnet:native"
  )
  const receiverIdIn = isNativeTokenIn
    ? tokenNearNative!.routes
      ? tokenNearNative!.routes[0]
      : ""
    : inputs.selectedTokenIn.address

  const unitsSendAmount = parseUnits(
    inputs.tokenIn,
    inputs.selectedTokenIn.decimals as number
  ).toString()
  const estimateUnitsBackAmount = parseUnits(
    inputs.tokenOut,
    inputs.selectedTokenOut.decimals as number
  ).toString()

  const msg = {
    CreateIntent: {
      id: inputs.clientId,
      IntentStruct: {
        initiator: inputs.accountId,
        send: {
          token_id:
            inputs.selectedTokenIn.address === "native"
              ? "wrap.near"
              : inputs.selectedTokenIn.address,
          amount: unitsSendAmount,
        },
        receive: {
          token_id:
            inputs.selectedTokenOut.address === "native"
              ? "wrap.near"
              : inputs.selectedTokenOut.address,
          amount: estimateUnitsBackAmount,
        },
        expiration: {
          Block: inputs.blockHeight + CREATE_INTENT_EXPIRATION_BLOCK_BOOST,
        },
        referral: {
          Some: REFERRAL_ACCOUNT,
        },
      },
    },
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const msgBorsh = borsh.serialize(swapSchema as any, msg)

  return {
    receiverId: receiverIdIn,
    actions: [
      {
        type: "FunctionCall",
        params: {
          methodName: "ft_transfer_call",
          args: {
            receiver_id: CONTRACTS_REGISTER[INDEXER.INTENT_0],
            amount: unitsSendAmount,
            memo: "Execute intent: NEP-141 to NEP-141",
            msg: Buffer.from(msgBorsh).toString("base64"),
          },
          gas: MAX_GAS_TRANSACTION,
          deposit: "1",
        },
      },
    ],
  }
}

export const prepareCreateIntent1 = (inputs: MapCreateIntentProps) => {
  const receiverIdIn = inputs.selectedTokenIn.address
  const unitsSendAmount = parseUnits(
    inputs.tokenIn,
    inputs.selectedTokenIn.decimals as number
  ).toString()
  const estimateUnitsBackAmount = parseUnits(
    inputs.tokenOut,
    inputs.selectedTokenOut.decimals as number
  ).toString()

  const msg: NearIntent1Create = {
    type: "create",
    id: inputs.clientId as string,
    asset_out: {
      type: "cross_chain",
      oracle: inputs.solverId as string,
      asset: inputs.selectedTokenOut.defuse_asset_id,
      amount: estimateUnitsBackAmount,
      account: inputs.accountTo as string,
    },
    lockup_until: {
      block_number: inputs.blockHeight + CREATE_INTENT_EXPIRATION_BLOCK_BOOST,
    },
    expiration: {
      block_number: inputs.blockHeight + CREATE_INTENT_EXPIRATION_BLOCK_BOOST,
    },
    referral: REFERRAL_ACCOUNT,
  }

  return {
    receiverId: receiverIdIn,
    actions: [
      {
        type: "FunctionCall",
        params: {
          methodName: "ft_transfer_call",
          args: {
            receiver_id: CONTRACTS_REGISTER[INDEXER.INTENT_1],
            amount: unitsSendAmount,
            memo: `Execute intent: ${inputs.selectedTokenIn.defuse_asset_id} to ${inputs.selectedTokenOut.defuse_asset_id}`,
            msg: JSON.stringify(msg),
          },
          gas: MAX_GAS_TRANSACTION,
          deposit: "1",
        },
      },
    ],
  }
}
