"use client"

import { createStore } from "zustand/vanilla"

import { NearTX, NetworkToken, RecoverDetails } from "@src/types/interfaces"
import { NEAR_COLLECTOR_KEY } from "@src/constants/contracts"

export enum HistoryStatus {
  AVAILABLE = "Available",
  PROCESSING = "Processing",
  COMPLETED = "Completed",
  ROLLED_BACK = "RolledBack",
  EXPIRED = "Expired",
  FAILED = "Failed", // Internal status
  WITHDRAW = "Withdraw", // Internal status
  DEPOSIT = "Deposit", // Internal status
  STORAGE_DEPOSIT = "Storage Deposit", // Internal status
}

export type HistoryData = {
  clientId: string
  hash: string
  timestamp: number
  status?: HistoryStatus
  errorMessage?: string
  isClosed?: boolean
  details?: {
    tokenIn?: string
    tokenOut?: string
    selectedTokenIn?: NetworkToken
    selectedTokenOut?: NetworkToken
    recoverDetails?: RecoverDetails
  } & Partial<NearTX>
}

export type HistoryState = {
  active: boolean
  activePreview?: string
  data: Map<string, HistoryData>
  isFetched: boolean
}

export type HistoryActions = {
  openWidget: () => void
  closeWidget: () => void
  togglePreview: (hash: string | undefined) => void
  toggleWidget: () => void
  updateHistory: (data: HistoryData[]) => void
  updateOneHistory: (data: HistoryData) => void
  closeHistoryItem: (hash: HistoryData["hash"]) => void
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

const helperHistoryLocalStore = (data: HistoryState["data"]): void => {
  const getHistoryFromStore: HistoryData[] = []
  data.forEach((value) => getHistoryFromStore.push(value))
  localStorage.setItem(
    NEAR_COLLECTOR_KEY,
    JSON.stringify({ data: getHistoryFromStore })
  )
}

export const createHistoryStore = (
  initState: HistoryState = defaultInitState
) => {
  return createStore<HistoryStore>()((set) => ({
    ...initState,
    openWidget: () => set({ active: true }),
    closeWidget: () => set({ active: false }),
    togglePreview: (hash: string | undefined) => set({ activePreview: hash }),
    toggleWidget: () => set((state) => ({ active: !state.active })),
    updateHistory: (data: HistoryData[]) =>
      set((state) => {
        const updatedData = new Map(state.data)
        data.forEach((item) => updatedData.set(item.hash, item))
        helperHistoryLocalStore(updatedData as HistoryState["data"])
        return { data: updatedData, isFetched: true }
      }),
    updateOneHistory: (one: HistoryData) =>
      set((state) => {
        const updatedData = new Map(state.data)
        updatedData.set(one.hash, one)
        return { data: updatedData }
      }),
    closeHistoryItem: (hash: HistoryData["hash"]) =>
      set((state) => {
        const currentData = state.data
        const getItem = currentData.get(hash)
        currentData.set(hash, {
          ...getItem,
          isClosed: true,
        } as HistoryData)
        helperHistoryLocalStore(currentData)
        return { data: currentData }
      }),
  }))
}
