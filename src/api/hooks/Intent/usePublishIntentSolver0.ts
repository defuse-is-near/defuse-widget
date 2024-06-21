import { useMutation } from "@tanstack/react-query"

import {
  getPublishAtomicNearIntent,
  PublishAtomicNearIntentProps,
} from "@src/api/intent"

const intentKey = "intent"
export const getPublishIntentSolver0Key = [
  intentKey,
  "get-publish-intent-solver-0",
]

export const usePublishIntentSolver0 = (options = {}) =>
  useMutation({
    mutationKey: getPublishIntentSolver0Key,
    mutationFn: (props: PublishAtomicNearIntentProps) =>
      getPublishAtomicNearIntent(props),
    ...options,
  })
