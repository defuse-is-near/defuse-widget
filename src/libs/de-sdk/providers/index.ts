import { Settings } from "@src/libs/de-sdk/types/interfaces"

import { swapEstimateSolver0Provider } from "./solver_0Provider"

const IS_DISABLE_QUOTING_FROM_SOLVER_0 =
  process?.env?.NEXT_PUBLIC_DISABLE_QUOTING_FROM_SOLVER_0 === "true"

// All other Solver Providers have to be included there
// Example:
//          swapEstimateSolver1Provider,
//          swapEstimateSolver2Provider,
//          ...,
export const estimateProviders: Settings = {
  providerIds: [],
}

if (!IS_DISABLE_QUOTING_FROM_SOLVER_0) {
  Object.assign(estimateProviders, {
    providerIds: [
      ...estimateProviders.providerIds,
      swapEstimateSolver0Provider,
    ],
  })
}
