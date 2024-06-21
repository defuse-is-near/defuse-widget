import axios from "axios"

const SOLVER_RELAY_0_URL = process?.env?.nearNodeUrl ?? ""

export type PublishAtomicNearIntentProps = {
  hash: string
  accountId: string
  defuseClientId: string
  defuseAssetIdIn: string
  defuseAssetIdOut: string
  unitsAmountIn: string
  unitsAmountOut: string
}

export const getPublishAtomicNearIntent = ({
  hash,
  defuseAssetIdIn,
  accountId,
  defuseClientId,
  defuseAssetIdOut,
  unitsAmountIn,
  unitsAmountOut,
}: PublishAtomicNearIntentProps) =>
  axios
    .post(SOLVER_RELAY_0_URL, {
      jsonrpc: "2.0",
      method: "publish_intent",
      params: {
        intent_type: "atomic_near",
        intent_creation_hash: hash,
        intent_id: defuseClientId,
        intent_initiator: accountId,
        defuse_asset_identifier_in: defuseAssetIdIn, //Data Dublication for Dev purpose. Should not be used in production
        defuse_asset_identifier_out: defuseAssetIdOut,
        amount_in: unitsAmountIn,
        amount_out_desired: unitsAmountOut,
      },
    })
    .then((resp) => resp.data)
