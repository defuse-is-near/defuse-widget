"use client"

import React, { useEffect, useState } from "react"
import * as Toast from "@radix-ui/react-toast"
import { Text } from "@radix-ui/themes"
import Image from "next/image"

import { useNotificationStore } from "@src/providers/NotificationProvider"
import { Notification } from "@src/stores/notificationStore"

const Snackbar = () => {
  const { data, deleteNotification } = useNotificationStore((state) => state)
  const [openNotifications, setOpenNotifications] = useState<Notification[]>([])

  useEffect(() => {
    if (data.size) {
      const newOpenNotifications: Notification[] = []
      data.forEach((value) => {
        newOpenNotifications.push(value)
      })
      setOpenNotifications(newOpenNotifications)
    }
  }, [data])

  const handleOpenChange = (id: string) => {
    setOpenNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    )
    deleteNotification(id)
  }

  return (
    <Toast.Provider swipeDirection="right">
      {openNotifications.map(({ id, message }) => (
        <Toast.Root
          key={id}
          className="ToastRoot"
          open={Boolean(id) || false}
          onOpenChange={() => handleOpenChange(id)}
        >
          <Toast.Title className="ToastTitle">
            <Text size="1" weight="bold" className="mb-1">
              {message}
            </Text>
          </Toast.Title>
          <Toast.Description asChild>
            <time
              className="ToastDescription"
              dateTime={new Date().toISOString()}
            >
              <Text size="1" className="text-nowrap">
                {prettyDate(new Date())}
              </Text>
            </time>
          </Toast.Description>
          <Toast.Action
            className="ToastAction"
            asChild
            altText="Close notification"
          >
            <button>
              <Image
                src="/static/icons/close.svg"
                width={12}
                height={12}
                alt="Close"
              />
            </button>
          </Toast.Action>
        </Toast.Root>
      ))}
      <Toast.Viewport className="ToastViewport" />
    </Toast.Provider>
  )
}

function prettyDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "full",
    timeStyle: "short",
  }).format(date)
}

export default Snackbar
