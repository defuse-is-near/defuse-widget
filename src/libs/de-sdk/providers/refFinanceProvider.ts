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
  getPoolByIds,
} from "@ref-finance/ref-sdk"
import { formatUnits } from "viem"

import {
  DataEstimateRequest,
  SwapEstimateProviderResponse,
} from "../types/interfaces"

// Forcing to use network
// init_env("testnet")

const REGISTRAR_ID = "ref.finance"

export const swapEstimateRefFinanceProvider = async (
  data: DataEstimateRequest
): Promise<SwapEstimateProviderResponse> => {
  const { ratedPools, unRatedPools, simplePools } = await fetchAllPools(200)
  const stablePools: Pool[] = unRatedPools.concat(ratedPools)
  const stablePoolsDetail: StablePool[] = await getStablePools(stablePools)

  const options: SwapOptions = {
    enableSmartRouting: true,
    stablePools,
    stablePoolsDetail,
  }

  const pools = await getPoolByIds([1, 2, 20])

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
  })

  if (!swapTodos.length) {
    return {
      registrarId: `${REGISTRAR_ID}:`,
      estimateOut: "0",
    } as SwapEstimateProviderResponse
  }

  const getSortedList = swapTodos.sort(
    (a, b) => Number(b.estimate) - Number(a.estimate)
  )
  console.log("swapEstimateRefFinanceProvider:", getSortedList)
  return {
    registrarId: `${REGISTRAR_ID}:${getSortedList[0].pool.id}`,
    estimateOut: getSortedList[0].estimate as string,
  } as SwapEstimateProviderResponse
}
