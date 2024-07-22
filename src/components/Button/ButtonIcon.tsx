import Image from "next/image"
import { MouseEvent, PropsWithChildren } from "react"
import clsx from "clsx"

interface Props extends PropsWithChildren {
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void
  icon?: string
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
  children,
}: Props) => {
  return (
    <button
      className={clsx(
        "flex justify-center items-center w-[40px] h-[40px] rounded-md overflow-hidden bg-white dark:bg-black",
        className && className
      )}
      onClick={onClick && onClick}
    >
      <div className="flex w-full h-full justify-center items-center bg-white-200 dark:bg-black-800">
        {icon && (
          <Image
            src={icon}
            width={iconWidth as number}
            height={iconHeight as number}
            alt="button-icon"
          />
        )}
        {children}
      </div>
    </button>
  )
}

export default ButtonIcon
