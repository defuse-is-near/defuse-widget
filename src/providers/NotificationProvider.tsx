"use client"

import { type ReactNode, createContext, useRef, useContext } from "react"
import { type StoreApi, useStore } from "zustand"

import {
  type NotificationStore,
  createNotificationStore,
  initNotificationStore,
} from "@src/stores/notificationStore"

export const NotificationStoreContext =
  createContext<StoreApi<NotificationStore> | null>(null)

export interface NotificationStoreProviderProps {
  children: ReactNode
}

export const NotificationStoreProvider = ({
  children,
}: NotificationStoreProviderProps) => {
  const storeRef = useRef<StoreApi<NotificationStore> | null>(null)
  if (!storeRef.current) {
    storeRef.current = createNotificationStore(initNotificationStore())
  }

  return (
    <NotificationStoreContext.Provider value={storeRef.current}>
      {children}
    </NotificationStoreContext.Provider>
  )
}

export const useNotificationStore = <T,>(
  selector: (store: NotificationStore) => T
): T => {
  const notificationStoreContext = useContext(NotificationStoreContext)

  if (!notificationStoreContext) {
    throw new Error(
      `useNotificationStore must be use within NotificationStoreProvider`
    )
  }

  return useStore(notificationStoreContext, selector)
}
