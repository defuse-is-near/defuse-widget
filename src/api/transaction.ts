import axios from "axios"
import { v4 } from "uuid"

const NEAR_NODE_URL = process?.env?.nearNodeUrl ?? ""

export const getTransactionDetails = (
  transactionHash: string,
  accountId: string
) =>
  axios
    .post(NEAR_NODE_URL, {
      jsonrpc: "2.0",
      id: v4(),
      method: "tx",
      params: {
        tx_hash: transactionHash,
        sender_account_id: accountId,
        wait_until: "EXECUTED",
      },
    })
    .then((resp) => resp.data)
