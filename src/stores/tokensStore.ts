"use client"

import { createStore } from "zustand/vanilla"

import { NetworkTokenWithSwapRoute } from "@src/types/interfaces"

export type TokensState = {
  data: Map<string, NetworkTokenWithSwapRoute>
  isLoading: boolean
  isFetched: boolean
}

export type TokensActions = {
  onLoad: () => void
  updateTokens: (data: NetworkTokenWithSwapRoute[]) => void
}

export type TokensStore = TokensState & TokensActions

export const initTokensStore = (): TokensState => {
  return {
    data: new Map(),
    isLoading: false,
    isFetched: false,
  }
}

export const defaultInitState: TokensState = {
  data: new Map(),
  isLoading: false,
  isFetched: false,
}

export const createTokensStore = (
  initState: TokensState = defaultInitState
) => {
  return createStore<TokensStore>()((set) => ({
    ...initState,
    onLoad: () => set({ isLoading: true }),
    updateTokens: (data: NetworkTokenWithSwapRoute[]) =>
      set((state) => {
        const updatedData = new Map(state.data)
        data.forEach((item) => updatedData.set(item.defuse_asset_id, item))
        return { data: updatedData, isFetched: true, isLoading: false }
      }),
  }))
}
