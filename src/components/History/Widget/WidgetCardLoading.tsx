import { Skeleton } from "@radix-ui/themes"
import React from "react"

const WidgetCardLoading = () => {
  return (
    <Skeleton>
      <div className="max-w-full md:max-w-[370px] min-h-[36px] m-2.5"></div>
    </Skeleton>
  )
}

export default WidgetCardLoading
