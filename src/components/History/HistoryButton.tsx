"use client"
import Image from "next/image"
import clsx from "clsx"
import { ButtonHTMLAttributes } from "react"

type Props = {
  active?: boolean
}
const HistoryButton = ({
  active,
  ...rest
}: Props & ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      className={clsx(
        "hidden md:flex justify-center items-center h-[64px] w-[64px] bg-black-600 rounded-full shadow-widget dark:bg-gray-600",
        active && "bg-white"
      )}
      {...rest}
    >
      {active ? (
        <Image
          src={"/static/icons/close.svg"}
          width={16}
          height={16}
          alt="Widget Clock"
        />
      ) : (
        <Image
          src={"/static/icons/clock.svg"}
          width={24}
          height={24}
          alt="Widget Clock"
        />
      )}
    </button>
  )
}

export default HistoryButton
