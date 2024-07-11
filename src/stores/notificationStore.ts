"use client"

import { createStore } from "zustand/vanilla"

export enum NotificationType {
  SUCCESS = "success",
  INFORMATION = "information",
  ERROR = "error",
}

export type Notification = {
  id: string
  message: string
  type: NotificationType
}

export type NotificationState = {
  data: Map<string, Notification>
}

export type NotificationActions = {
  setNotification: (notification: Notification) => void
  deleteNotification: (key: string) => void
}

export type NotificationStore = NotificationState & NotificationActions

export const initNotificationStore = (): NotificationState => {
  return { data: new Map() }
}
export const defaultInitState: NotificationState = {
  data: new Map(),
}

export const createNotificationStore = (
  initState: NotificationState = defaultInitState
) => {
  return createStore<NotificationStore>()((set) => ({
    ...initState,
    setNotification: (notification: Notification) =>
      set((state) => {
        const updatedData = new Map(state.data)
        updatedData.set(notification.id, notification)
        return { data: updatedData }
      }),
    deleteNotification: (key: string) =>
      set((state) => {
        const currentData = state.data
        currentData.delete(key)
        return { data: currentData }
      }),
  }))
}
