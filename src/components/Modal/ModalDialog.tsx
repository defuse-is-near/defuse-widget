import {
  PropsWithChildren,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react"
import { Dialog } from "@radix-ui/themes"

import { useModalStore } from "@src/providers/ModalStoreProvider"
import useResize from "@src/hooks/useResize"

const ModalDialog = ({ children }: PropsWithChildren) => {
  const { onCloseModal } = useModalStore((state) => state)
  const [open, setOpen] = useState(true)
  const [containerWidth, setContainerWidth] = useState<number>(0)
  const divRef = useRef<HTMLDivElement>(null)
  const { width } = useResize(divRef)

  const defaultMaxWidth = "512px"

  const handleCloseModal = useCallback(() => {
    if (!open) onCloseModal()
  }, [open, onCloseModal])

  useEffect(() => {
    handleCloseModal()
  }, [handleCloseModal])

  useEffect(() => {
    setContainerWidth(divRef.current!.offsetWidth || 0)
    return () => {
      setContainerWidth(0)
    }
  }, [divRef.current, width])

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Content
        maxWidth={
          containerWidth
            ? containerWidth < 768
              ? "100%"
              : defaultMaxWidth
            : defaultMaxWidth
        }
        className="p-0 dark:bg-black-800"
      >
        <div ref={divRef}>{children}</div>
      </Dialog.Content>
    </Dialog.Root>
  )
}

export default ModalDialog
