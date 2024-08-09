import axios, { AxiosRequestConfig } from "axios"
import { v4 } from "uuid"

import {
  DataEstimateRequest,
  SwapEstimateProviderResponse,
} from "@src/libs/de-sdk/types/interfaces"

const REGISTRAR_ID = "solver_0"

interface SolverBaseResponse {
  id: number
  jsonrpc: string
}

interface SolverResult<T> {
  result: T
}

interface SolverTokenList {
  tokens: {
    defuse_asset_id: string
    decimals: number
    asset_name: string
    metadata_link: string
  }[]
}

interface SolverQuoteRequest {
  defuse_asset_identifier_in: string
  defuse_asset_identifier_out: string
  amount_in: string
}

export interface SolverQuoteResponse {
  solver_id: string
  amount_out: string
}

const quoteAssetPrices = (
  data: SolverQuoteRequest
): Promise<SolverBaseResponse & SolverResult<SolverQuoteResponse[]>> => {
  const config: AxiosRequestConfig = {
    headers: {
      "Content-Type": "application/json",
    },
  }
  return axios
    .post(
      "https://solver-relay.chaindefuser.com/rpc",
      {
        id: v4(),
        jsonrpc: "2.0",
        method: "quote",
        params: [data],
      },
      config
    )
    .then((resp) => resp.data)
}

function prepareQuoteData(defuseId: string) {
  if (defuseId === "near:mainnet:native") return "near:mainnet:wrap.near"
  return defuseId
}

export const swapEstimateSolver0Provider = async (
  data: DataEstimateRequest
): Promise<SwapEstimateProviderResponse> => {
  const getQuoteAssetPrices = await quoteAssetPrices({
    defuse_asset_identifier_in: prepareQuoteData(data.tokenIn),
    defuse_asset_identifier_out: prepareQuoteData(data.tokenOut),
    amount_in: data.amountIn,
  })

  if (!getQuoteAssetPrices.result?.length) {
    return []
  }

  return getQuoteAssetPrices.result
}

const getSupportTokenList = (): Promise<
  SolverBaseResponse & SolverResult<SolverTokenList>
> => {
  const config: AxiosRequestConfig = {
    headers: {
      "Content-Type": "application/json",
    },
  }
  return axios
    .post(
      "https://solver-relay.chaindefuser.com/rpc",
      {
        id: v4(),
        jsonrpc: "2.0",
        method: "supported_tokens",
        params: [],
      },
      config
    )
    .then((resp) => resp.data)
}

export const getSupportTokenListSolver0 = async () => {
  const tokenList = await getSupportTokenList()
  return tokenList.result.tokens
}
