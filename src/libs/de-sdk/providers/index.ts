import { swapEstimateSolver0Provider } from "./solver_0Provider"
import { swapEstimateRefFinanceProvider } from "./refFinanceProvider"
import { swapEstimateCoingeckoProvider } from "./coingeckoProvider"

export const estimateProviders = [
  swapEstimateSolver0Provider,
  swapEstimateRefFinanceProvider,
  swapEstimateCoingeckoProvider,
]
