import { PropsWithChildren } from "react"

interface Props extends PropsWithChildren {
  title?: string
  description?: string
}

const Paper = ({ children, title, description }: Props) => {
  return (
    <div className="flex flex-col flex-1 justify-start items-center mt-[5.5rem]">
      <div className="w-full md:w-auto md:min-w-[512px]">
        <div className="flex flex-col mb-8 text-center">
          {title && <h1 className="mb-3 font-black">{title}</h1>}
          {description && (
            <span className="text-sm text-gray-600">{description}</span>
          )}
        </div>
        <div className="rounded-[1rem] p-5 shadow-paper bg-white">
          {children}
        </div>
      </div>
    </div>
  )
}

export default Paper
