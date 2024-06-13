import {
  DataEstimateRequest,
  SwapEstimateProviderResponse,
} from "@src/libs/de-sdk/types/interfaces"

import { getSettings, setSettings } from "./settings"
import { estimateProviders } from "./providers"

const IS_DISABLE_QUOTING_FROM_SOLVER_0 =
  process.env.NEXT_PUBLIC_DISABLE_QUOTING_FROM_SOLVER_0 === "true"
const IS_DISABLE_QUOTING_FROM_REF =
  process.env.NEXT_PUBLIC_DISABLE_QUOTING_FROM_REF === "true"
const IS_DISABLE_QUOTING_FROM_COINGECKO =
  process.env.NEXT_PUBLIC_DISABLE_QUOTING_FROM_COINGECKO === "true"

const solverProviders = [IS_DISABLE_QUOTING_FROM_SOLVER_0]
const defaultProviders = [
  ...solverProviders,
  IS_DISABLE_QUOTING_FROM_REF,
  IS_DISABLE_QUOTING_FROM_COINGECKO,
]

export const concurrentEstimateSwap = async (
  data: DataEstimateRequest
): Promise<SwapEstimateProviderResponse[]> => {
  const { providerIds } = getSettings()

  const enabledProviders = estimateProviders.filter((provider, index) => {
    return (
      !defaultProviders[index] &&
      (providerIds.length === 0 || providerIds.includes(index.toString()))
    )
  })

  return Promise.all(
    enabledProviders.map(async (provider) => await provider(data))
  )
}
