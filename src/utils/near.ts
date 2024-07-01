import { providers } from "near-api-js"
import { CodeResult } from "near-api-js/lib/providers/provider"
import { setNearProvider, getNearProvider } from "@near-eth/client"
import { BigNumber } from "ethers"

const NEAR_NODE_URL =
  (process?.env?.nearNodeAuroraRpc || process.env.nearNodeUrl) ??
  "https://rpc.testnet.near.org"

export async function storageBalance(contractId: string, accountId: string) {
  try {
    setNearProvider(new providers.JsonRpcProvider({ url: NEAR_NODE_URL }))

    const nearProvider = getNearProvider()
    const result = await nearProvider.query<CodeResult>({
      request_type: "call_function",
      account_id: contractId,
      method_name: "storage_balance_of",
      args_base64: Buffer.from(
        JSON.stringify({ account_id: accountId })
      ).toString("base64"),
      finality: "optimistic",
    })
    const balance = JSON.parse(Buffer.from(result.result).toString())
    console.log("Fetching near storage balance of result:", result)
    return BigNumber.from(balance?.total || "0")
  } catch (e) {
    console.error("Failed to check storage balance")
    return null
  }
}

export async function nearAccount(accountId: string) {
  try {
    setNearProvider(new providers.JsonRpcProvider({ url: NEAR_NODE_URL }))

    const nearProvider = getNearProvider()
    const result = await nearProvider.query<CodeResult>({
      request_type: "view_account",
      finality: "final",
      account_id: accountId,
    })
    console.log("Fetching near account result:", result)
    return result
  } catch (e) {
    console.error("Failed to fetch account or it doesn't exist ")
    return null
  }
}

export async function nep141Balance(
  accountId: string,
  contractId: string
): Promise<string | null> {
  try {
    setNearProvider(new providers.JsonRpcProvider({ url: NEAR_NODE_URL }))

    const nearProvider = getNearProvider()
    const storageBalance = await nearProvider.query<CodeResult>({
      request_type: "call_function",
      account_id: contractId,
      method_name: "ft_balance_of",
      args_base64: Buffer.from(
        JSON.stringify({ account_id: accountId })
      ).toString("base64"),
      finality: "optimistic",
    })
    console.log(
      `ft_balance_of ${contractId} for ${accountId} is ${storageBalance}`
    )
    return JSON.parse(Buffer.from(storageBalance.result).toString())
  } catch (e) {
    console.error("Failed to check storage balance")
    return null
  }
}

export async function intentStatus(
  contractId: string,
  intentId: string
): Promise<string | null> {
  try {
    setNearProvider(new providers.JsonRpcProvider({ url: NEAR_NODE_URL }))

    const nearProvider = getNearProvider()
    const result = await nearProvider.query<CodeResult>({
      request_type: "call_function",
      account_id: contractId,
      method_name: "get_intent",
      args_base64: Buffer.from(JSON.stringify({ id: intentId })).toString(
        "base64"
      ),
      finality: "optimistic",
    })
    console.log(`get_intent ${contractId} for ${intentId} status is ${result}`)
    const intent = JSON.parse(Buffer.from(result.result).toString())
    return intent
  } catch (e) {
    console.error("Failed to check storage balance")
    return null
  }
}
