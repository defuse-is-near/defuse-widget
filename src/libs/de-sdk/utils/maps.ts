import { INDEXER } from "@src/constants/contracts"
import { CallRequestIntentProps } from "@src/hooks/useSwap"
import {
  prepareCreateIntent0,
  prepareCreateIntent1,
} from "@src/libs/de-sdk/utils/intents"

enum MapsEnum {
  NEAR_MAINNET = "near:mainnet",
  ETH_BASE = "eth:8453",
}

export interface MapCreateIntentProps {
  tokenIn: CallRequestIntentProps["tokenIn"]
  tokenOut: CallRequestIntentProps["tokenOut"]
  selectedTokenIn: CallRequestIntentProps["selectedTokenIn"]
  selectedTokenOut: CallRequestIntentProps["selectedTokenOut"]
  clientId: CallRequestIntentProps["clientId"]
  blockHeight: number
  accountId: string | null
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type MapCreateIntentResult = [number, any][]

/**
 * Function prepares a transaction call data depends on inputs for different intents.
 *
 * @param {Type} inputs - Swap parameters within tokenIn, tokenOut, selectedTokenIn, selectedTokenOut and clientId.
 * @returns {ReturnType} - Array with transaction call data.
 *
 * Additional Notes:
 * - Use Near chain ids - mainnet or testnet.
 * - Use EVM chain ids - "1" or other.
 * - Use TON chain ids - "1100" or other.
 * - Use Solana chain ids - mainnet or other.
 */
export const mapCreateIntentTransactionCall = (
  inputs: MapCreateIntentProps
): MapCreateIntentResult => {
  const [network, id] = inputs.selectedTokenIn.defuse_asset_id.split(":")
  switch (`${network}:${id}` as MapsEnum) {
    case MapsEnum.NEAR_MAINNET:
      // Notes: In future each map will have not only one intent,
      //        as example here `[[INDEXER.INTENT_0, tx],...,[INDEXER.INTENT_N, tx_N]]`
      return [[INDEXER.INTENT_0, prepareCreateIntent0(inputs)]]
    case MapsEnum.ETH_BASE:
      return [[INDEXER.INTENT_1, prepareCreateIntent1(inputs)]]
    default:
      return []
  }
}