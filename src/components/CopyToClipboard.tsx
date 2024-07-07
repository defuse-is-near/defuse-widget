"use client"

import { PropsWithChildren, useState } from "react"
import { CopyToClipboard } from "react-copy-to-clipboard"
import clsx from "clsx"

interface Props extends PropsWithChildren {
  value: string
}

const Copy = ({ children, value }: Props) => {
  const [isCopied, setIsCopied] = useState(false)
  const animationStyle = "transition ease-in-out duration-150"
  return (
    <div className="relative cursor-pointer">
      <CopyToClipboard onCopy={() => setIsCopied(true)} text={value}>
        {children}
      </CopyToClipboard>
      <span
        className={clsx(
          "h-full absolute -top-[50%] -right-[62px] translate-y-1/2 text-xs leading-5 text-primary",
          animationStyle,
          isCopied ? "visible translate-x-0" : "invisible -translate-x-[5px]"
        )}
      >
        Copied
      </span>
    </div>
  )
}

export default Copy
