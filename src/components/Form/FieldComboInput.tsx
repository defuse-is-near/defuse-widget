import React from "react"
import { Path, FieldValues, UseFormRegister } from "react-hook-form"
import clsx from "clsx"
import { BigNumber } from "ethers"

import AssetsSelect from "@src/components/Network/SelectAssets"
import { NetworkToken } from "@src/types/interfaces"

interface Props<T extends FieldValues> {
  fieldName: Path<T>
  register?: UseFormRegister<T>
  required?: boolean
  placeholder?: string
  label?: string
  price?: string
  balance?: string | BigNumber
  handleSetMax?: (e: React.MouseEvent<HTMLButtonElement>) => void
  selected?: NetworkToken
  handleSelect?: () => void
  className?: string
}

const FieldComboInput = <T extends FieldValues>({
  fieldName,
  register,
  required,
  placeholder = "0",
  label,
  price,
  balance,
  handleSetMax,
  selected,
  handleSelect,
  className,
}: Props<T>) => {
  if (!register) {
    return null
  }
  // TODO Error has to be propagated from parent Form
  const error = false
  return (
    <div
      className={clsx(
        "relative flex justify-between items-center px-5 py-[2.375rem] w-full bg-gray-50",
        !label && "pt-5",
        !price && !balance && !error && "pb-5",
        className && className
      )}
    >
      {label && (
        <span className="absolute top-4 left-5 text-sm font-medium text-secondary">
          {label}
        </span>
      )}
      <input
        {...register(fieldName, { required })}
        placeholder={placeholder}
        className={clsx(
          "grow flex-1 bg-gray-50 max-w-[140px] md:min-w-[calc(100%-210px)] text-3xl font-medium placeholder-black border-transparent focus:border-transparent focus:ring-0"
        )}
      />
      {price && (
        <span className="absolute bottom-4 left-5 text-sm font-medium text-secondary">
          ~${price}
        </span>
      )}
      <div className="grow flex-1 flex justify-end items-center">
        <AssetsSelect selected={selected} handleSelect={handleSelect} />
      </div>
      {balance && (
        <div className="absolute bottom-4 right-5 flex justify-center items-center gap-2">
          <span className="text-xs text-secondary">
            Balance: ${balance.toString()}
          </span>
          {handleSetMax && (
            <button className="text-xs uppercase" onClick={handleSetMax}>
              max
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default FieldComboInput
