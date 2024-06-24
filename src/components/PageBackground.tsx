import React from "react"

const PageBackground = () => {
  return (
    <div className="absolute bottom-0 w-full h-full -z-[1] bg-gray-50">
      <div className="w-full h-full bg-no-repeat bg-bottom bg-page-light--mobile md:bg-page-light dark:bg-page-dark"></div>
    </div>
  )
}

export default PageBackground
