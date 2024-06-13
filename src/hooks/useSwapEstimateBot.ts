import { setSettings } from "@src/libs/de-sdk/settings"
import { concurrentEstimateSwap } from "@src/libs/de-sdk"
import { DataEstimateRequest } from "@src/libs/de-sdk/types/interfaces"

const useSwapEstimateBot = (externalProviders: unknown[] = []) => {
  const providerIds = externalProviders.filter(
    (provider): provider is string => typeof provider === "string"
  )

  setSettings({ providerIds })

  const getSwapEstimateBot = async (
    data: DataEstimateRequest
  ): Promise<string> => {
    console.log("getSwapEstimateBot data:", data)
    const estimates = await concurrentEstimateSwap(data)
    const sortEstimates = estimates.sort(
      (a, b) => Number(b.estimateOut) - Number(a.estimateOut)
    )
    console.log("useSwapEstimateBot: ", estimates)
    return sortEstimates[0].estimateOut
  }

  return {
    getSwapEstimateBot,
  }
}

export default useSwapEstimateBot
