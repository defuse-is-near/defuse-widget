import axios, { AxiosRequestConfig } from "axios"

import {
  DataEstimateRequest,
  SwapEstimateProviderResponse,
} from "../types/interfaces"

const REGISTRAR_NAME = "coingecko"

const coingeckoApiKey = process?.env?.coingeckoApiKey ?? ""
const appOriginUrl = process.env.appUrl ?? "*"

const getExchangesList = () => {
  const config: AxiosRequestConfig = {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": appOriginUrl,
      "x-cg-pro-api-key": coingeckoApiKey,
    },
  }
  const id = "coinbase"
  return axios
    .get(`https://pro-api.coingecko.com/api/v3/exchanges/list`, config)
    .then((resp) => resp.data)
}

export const getTrendingList = (id = "binance") => {
  const config: AxiosRequestConfig = {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": appOriginUrl,
      "x-cg-pro-api-key": coingeckoApiKey,
    },
  }
  return axios
    .get(`https://pro-api.coingecko.com/api/v3/exchanges/${id}/tickers`, config)
    .then((resp) => resp.data)
}

export const getCoinsListWithMarketData = (currency = "usd") => {
  const config: AxiosRequestConfig = {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": appOriginUrl,
      "x-cg-pro-api-key": coingeckoApiKey,
    },
  }
  return axios
    .get(
      `https://pro-api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}`,
      config
    )
    .then((resp) => resp.data)
}

export const swapEstimateCoingeckoProvider = async (
  data: DataEstimateRequest
): Promise<SwapEstimateProviderResponse> => {
  const getExchangesListResponse = await getExchangesList()
  const getTrendingListResponse = await getTrendingList()
  console.log(getExchangesListResponse, "getExchangesListResponse")
  console.log(getTrendingListResponse, "getTrendingListResponse")

  return {
    registrarName: REGISTRAR_NAME,
  } as unknown as SwapEstimateProviderResponse
}
