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
import { formatUnits } from "viem"

import {
  DataEstimateRequest,
  SwapEstimateProviderResponse,
} from "../types/interfaces"

const environment =
  process?.env?.environment === "production" ? "mainnet" : "testnet"
init_env(environment)

export const REGISTRAR_ID_REF_FINANCE = "ref.finance"

export const swapEstimateRefFinanceProvider = async (
  data: DataEstimateRequest
): Promise<SwapEstimateProviderResponse> => {
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

    const formattedAmountOut = formatUnits(
      BigInt(data.amountIn),
      tokenInWithMeta.decimals
    )

    const swapTodos: EstimateSwapView[] = await estimateSwap({
      tokenIn: tokenInWithMeta,
      tokenOut: tokenOutWithMeta,
      amountIn: formattedAmountOut,
      simplePools,
      options,
    })

    if (!swapTodos.length) {
      return {
        solver_id: `${REGISTRAR_ID_REF_FINANCE}:`,
        amount_out: "0",
      } as SwapEstimateProviderResponse
    }

    const getSortedList = swapTodos.sort(
      (a, b) => Number(b?.estimate) - Number(a?.estimate)
    )
    console.log("swapEstimateRefFinanceProvider:", getSortedList)
    return {
      solver_id: `${REGISTRAR_ID_REF_FINANCE}:${getSortedList[0]?.pool?.id}`,
      amount_out: (getSortedList[0]?.estimate as string) ?? "0",
    } as SwapEstimateProviderResponse
  } catch (e) {
    console.log("swapEstimateRefFinanceProvider: ", e)
    return {
      solver_id: `${REGISTRAR_ID_REF_FINANCE}:0`,
      amount_out: "0",
    }
  }
}
