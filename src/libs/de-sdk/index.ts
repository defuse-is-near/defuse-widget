import {
  DataEstimateRequest,
  SwapEstimateProviderResponse,
} from "@src/libs/de-sdk/types/interfaces"
import { estimateProviders } from "@src/libs/de-sdk/providers"

import { getSettings, setSettings } from "./settings"

setSettings(estimateProviders)

export const concurrentEstimateSwap = async (
  data: DataEstimateRequest
): Promise<SwapEstimateProviderResponse[]> => {
  const { providerIds } = getSettings()

  return Promise.all(providerIds.map(async (provider) => await provider(data)))
}
