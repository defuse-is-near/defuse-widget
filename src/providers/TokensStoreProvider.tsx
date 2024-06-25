"use client"

import { type ReactNode, createContext, useRef, useContext } from "react"
import { type StoreApi, useStore } from "zustand"

import {
  createTokensStore,
  initTokensStore,
  TokensStore,
} from "@src/stores/tokensStore"

export const TokensStoreContext = createContext<StoreApi<TokensStore> | null>(
  null
)

export interface TokensStoreProviderProps {
  children: ReactNode
}

export const TokensStoreProvider = ({ children }: TokensStoreProviderProps) => {
  const storeRef = useRef<StoreApi<TokensStore> | null>(null)
  if (!storeRef.current) {
    storeRef.current = createTokensStore(initTokensStore())
  }

  return (
    <TokensStoreContext.Provider value={storeRef.current}>
      {children}
    </TokensStoreContext.Provider>
  )
}

export const useTokensStore = <T,>(selector: (store: TokensStore) => T): T => {
  const tokensStoreContext = useContext(TokensStoreContext)

  if (!tokensStoreContext) {
    throw new Error(`useTokensStore must be use within TokensStoreProvider`)
  }

  return useStore(tokensStoreContext, selector)
}
