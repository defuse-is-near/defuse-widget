"use client"

import { useModalStore } from "@src/providers/ModalStoreProvider"
import ModalReviewSwap from "@src/components/Modal/ModalReviewSwap"
import ModalConfirmSwap from "@src/components/Modal/ModalConfirmSwap"

import { ModalType } from "../../stores/modalStore"

import ModalSelectAssets from "./ModalSelectAssets"

const Modal = () => {
  const { modalType } = useModalStore((state) => state)

  switch (modalType) {
    case ModalType.MODAL_SELECT_ASSETS:
      return <ModalSelectAssets />
    case ModalType.MODAL_REVIEW_SWAP:
      return <ModalReviewSwap />
    case ModalType.MODAL_CONFIRM_SWAP:
      return <ModalConfirmSwap />
  }
}

export default Modal
