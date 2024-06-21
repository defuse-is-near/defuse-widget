import React from "react"
import clsx from "clsx"

import ButtonIcon from "@src/components/Button/ButtonIcon"

type Props = {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  icon?: string
  className?: string
}

const ButtonSwitch = ({
  onClick,
  icon = "/static/icons/arrow-down-black.svg",
  className = "",
}: Props) => {
  return (
    <div className="absolute top-[50%] left-[50%] -translate-x-2/4 -translate-y-2/4 z-10">
      <ButtonIcon
        onClick={onClick ? onClick : () => {}}
        icon={icon as string}
        className={clsx(
          "absolute top-[50%] left-[50%] -translate-x-2/4 -translate-y-2/4 z-10 flex justify-center items-center w-[40px] h-[40px] rounded-md overflow-hidden bg-white",
          className && className
        )}
      />
    </div>
  )
}

export default ButtonSwitch
