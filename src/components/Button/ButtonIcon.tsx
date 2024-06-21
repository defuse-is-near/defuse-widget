import Image from "next/image"
import React from "react"
import clsx from "clsx"

type Props = {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  icon: string
  className: string
  iconWidth?: number
  iconHeight?: number
}

const ButtonIcon = ({
  onClick,
  icon,
  className = "",
  iconWidth = 18,
  iconHeight = 18,
}: Props) => {
  return (
    <button
      className={clsx(
        "flex justify-center items-center w-[40px] h-[40px] rounded-md overflow-hidden bg-white",
        className && className
      )}
      onClick={onClick && onClick}
    >
      <div className="flex w-full h-full justify-center items-center bg-white-200">
        <Image
          src={icon}
          width={iconWidth as number}
          height={iconHeight as number}
          alt="button-icon"
        />
      </div>
    </button>
  )
}

export default ButtonIcon
