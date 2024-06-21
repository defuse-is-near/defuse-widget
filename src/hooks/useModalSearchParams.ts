"use client"

import { useSearchParams } from "next/navigation"
import { useEffect } from "react"

import { useModalStore } from "@src/providers/ModalStoreProvider"
import { ModalType } from "@src/stores/modalStore"

export const useModalSearchParams = () => {
  const { setModalType } = useModalStore((state) => state)
  const searchParams = useSearchParams()

  useEffect(() => {
    const modalType = searchParams.get("modalType") as string | null
    if (
      modalType &&
      Object.values(ModalType).includes(modalType as ModalType)
    ) {
      setModalType(modalType as ModalType)
    }
  }, [])
}
