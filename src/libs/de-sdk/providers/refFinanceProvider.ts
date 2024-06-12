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

import {
  DataEstimateRequest,
  SwapEstimateProviderResponse,
} from "../types/interfaces"

// Forcing to use network
// init_env("testnet")

const REGISTRAR_NAME = "ref.finance"

const swapEstimateRefFinanceProvider = async (
  data: DataEstimateRequest
): Promise<SwapEstimateProviderResponse> => {
  // const tokenInWithMeta = await ftGetTokenMetadata(tokenIn)
  // const tokenOutWithMeta = await ftGetTokenMetadata(tokenOut)
  const { ratedPools, unRatedPools, simplePools } = await fetchAllPools(200)
  const stablePools: Pool[] = unRatedPools.concat(ratedPools)
  const stablePoolsDetail: StablePool[] = await getStablePools(stablePools)

  const options: SwapOptions = {
    enableSmartRouting: true,
    stablePools,
    stablePoolsDetail,
  }

  const pools = await getPoolByIds([1, 2, 20])

  const tokenIn = await ftGetTokenMetadata("ref.fakes.testnet")
  const tokenOut = await ftGetTokenMetadata("wrap.testnet")

  const swapTodos: EstimateSwapView[] = await estimateSwap({
    tokenIn: tokenIn,
    tokenOut: tokenOut,
    amountIn: "1",
    simplePools,
  })

  return {
    registrarName: REGISTRAR_NAME,
    data: swapTodos,
  } as unknown as SwapEstimateProviderResponse
}

export default swapEstimateRefFinanceProvider
