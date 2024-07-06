import axios, { AxiosRequestConfig } from "axios"
import { v4 } from "uuid"
import { formatUnits } from "viem"

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

const convertTokenToTokenSolver = (
  data: string
): Promise<SolverBaseResponse & SolverResult<SolverTokenList>> => {
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
        method: "discover_defuse_assets",
        params: [data],
      },
      config
    )
    .then((resp) => resp.data)
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

export const swapEstimateSolver0Provider = async (
  data: DataEstimateRequest
): Promise<SwapEstimateProviderResponse> => {
  const getTokenInToFormat = await convertTokenToTokenSolver(data.tokenIn)
  const getTokenOutToFormat = await convertTokenToTokenSolver(data.tokenOut)

  const getQuoteAssetPrices = await quoteAssetPrices({
    defuse_asset_identifier_in:
      getTokenInToFormat.result.tokens[0].defuse_asset_id,
    defuse_asset_identifier_out:
      getTokenOutToFormat.result.tokens[0].defuse_asset_id,
    amount_in: data.amountIn,
  })
  console.log("Solver0 getQuoteAssetPrices: ", getQuoteAssetPrices)
  if (!getQuoteAssetPrices.result?.length) {
    return {
      solver_id: `${REGISTRAR_ID}:`,
      amount_out: "0",
    } as SwapEstimateProviderResponse
  }

  const getSortedList = getQuoteAssetPrices.result.sort(
    (a, b) => Number(b.amount_out) - Number(a.amount_out)
  )
  console.log("swapEstimateSolver0Provider:", getSortedList)

  return {
    solver_id: `${REGISTRAR_ID}:${getSortedList[0].solver_id}`,
    amount_out: formatUnits(
      BigInt(getSortedList[0].amount_out),
      getTokenOutToFormat.result.tokens[0].decimals
    ).toString(),
    list: getSortedList,
  } as SwapEstimateProviderResponse
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
