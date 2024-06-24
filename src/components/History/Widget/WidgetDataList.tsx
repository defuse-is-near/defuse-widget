"use client"

import { ComponentType } from "react"
import clsx from "clsx"

type Props<T> = {
  Component: ComponentType<T>
  data: T[]
  className?: string
}

const WidgetDataList = <T,>({ data, className, Component }: Props<T>) => {
  console.log("WidgetDataList: ", data)
  return (
    <div
      className={clsx(
        "flex flex-col max-h-[576px] overflow-auto",
        className && className
      )}
    >
      {data.map((props, index) => (
        <Component {...props} key={index} />
      ))}
    </div>
  )
}

export default WidgetDataList
