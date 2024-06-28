"use client"

import { createStore } from "zustand/vanilla"

import { NearTX, NetworkToken } from "@src/types/interfaces"

export enum HistoryStatus {
  AVAILABLE = "Available",
  PROCESSING = "Processing",
  COMPLETED = "Completed",
  ROLLED_BACK = "RolledBack",
  EXPIRED = "Expired",
  FAILED = "Failed", // Internal status
}

export type HistoryData = {
  clientId: string
  hash: string
  timestamp: number
  status?: HistoryStatus
  errorMessage?: string
  isClosed?: false
  details?: {
    tokenIn?: string
    tokenOut?: string
    selectedTokenIn?: NetworkToken
    selectedTokenOut?: NetworkToken
  } & Partial<NearTX>
}

export type HistoryState = {
  active: boolean
  data: Map<string, HistoryData>
  isFetched: boolean
}

export type HistoryActions = {
  openWidget: () => void
  closeWidget: () => void
  toggleWidget: () => void
  updateHistory: (data: HistoryData[]) => void
}

export type HistoryStore = HistoryState & HistoryActions

export const initHistoryStore = (): HistoryState => {
  return { active: false, data: new Map(), isFetched: false }
}

export const defaultInitState: HistoryState = {
  active: false,
  data: new Map(),
  isFetched: false,
}

export const createHistoryStore = (
  initState: HistoryState = defaultInitState
) => {
  return createStore<HistoryStore>()((set) => ({
    ...initState,
    openWidget: () => set({ active: true }),
    closeWidget: () => set({ active: false }),
    toggleWidget: () => set((state) => ({ active: !state.active })),
    updateHistory: (data: HistoryData[]) =>
      set((state) => {
        const updatedData = new Map(state.data)
        data.forEach((item) => updatedData.set(item.hash, item))
        return { data: updatedData, isFetched: true }
      }),
  }))
}
