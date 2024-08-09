import {
  estimateSwap,
  fetchAllPools,
  EstimateSwapView,
  Pool,
  StablePool,
  ftGetTokenMetadata,
  getStablePools,
  SwapOptions,
  init_env,
} from "@ref-finance/ref-sdk"

import { DataEstimateRequest } from "../types/interfaces"

const environment =
  process?.env?.environment === "production" ? "mainnet" : "testnet"
init_env(environment)

export const REGISTRAR_ID_REF_FINANCE = "ref.finance"

export const swapEstimateRefFinanceProvider = async (
  data: DataEstimateRequest
): Promise<string> => {
  try {
    const { ratedPools, unRatedPools, simplePools } = await fetchAllPools()

    const stablePools: Pool[] = unRatedPools.concat(ratedPools)
    const stablePoolsDetail: StablePool[] = await getStablePools(stablePools)

    const options: SwapOptions = {
      enableSmartRouting: false,
      stablePools,
      stablePoolsDetail,
    }

    const tokenInWithMeta = await ftGetTokenMetadata(data.tokenIn)
    const tokenOutWithMeta = await ftGetTokenMetadata(data.tokenOut)

    const swapTodos: EstimateSwapView[] = await estimateSwap({
      tokenIn: tokenInWithMeta,
      tokenOut: tokenOutWithMeta,
      amountIn: data.amountIn,
      simplePools,
      options,
    })

    if (!swapTodos.length) {
      return "0"
    }

    const getSortedList = swapTodos.sort(
      (a, b) => Number(b?.estimate) - Number(a?.estimate)
    )

    return (getSortedList[0]?.estimate as string) ?? "0"
  } catch (e) {
    console.log("swapEstimateRefFinanceProvider: ", e)
    return "0"
  }
}
