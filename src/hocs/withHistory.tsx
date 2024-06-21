"use client"

import React, { PropsWithChildren, useEffect } from "react"

import { useCombinedHistoryCollector } from "@src/hooks/useHistoryCollector"

export function withHistory<T extends React.ComponentType>(
  WrappedComponent: T
): React.FC<PropsWithChildren & React.ComponentProps<T>> {
  const displayName =
    WrappedComponent.displayName || WrappedComponent.name || "Component"

  const ComponentWithHistory: React.FC<PropsWithChildren> = ({
    children,
    ...rest
  }) => {
    const { runTransactionCollector } = useCombinedHistoryCollector()

    useEffect(() => {
      runTransactionCollector()
    }, [])

    return (
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      <WrappedComponent {...rest}>{children}</WrappedComponent>
    )
  }

  ComponentWithHistory.displayName = `WithHistory(${displayName})`

  return ComponentWithHistory as React.FC<
    PropsWithChildren & React.ComponentProps<T>
  >
}
