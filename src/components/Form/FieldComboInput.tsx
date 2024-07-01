import React from "react"
import {
  Path,
  FieldValues,
  FieldErrors,
  FieldError,
  UseFormRegister,
} from "react-hook-form"
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
  errors?: FieldErrors
}

export const FieldComboInputRegistryName = "FieldComboInput"

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
  errors,
}: Props<T>) => {
  if (!register) {
    return null
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const allowedKeys = [
      "Backspace",
      "Tab",
      "ArrowLeft",
      "ArrowRight",
      "Delete", // control keys
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9", // numeric keys
      ".", // decimal point
    ]

    if (!allowedKeys.includes(event.key) && !event.ctrlKey) {
      event.preventDefault()
    }

    // Ensure only one dot is allowed
    const inputValue = (event.target as HTMLInputElement).value
    if (event.key === "." && inputValue.includes(".")) {
      event.preventDefault()
    }
  }

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    const paste = event.clipboardData.getData("text")

    if (!/^[0-9.,]+$/.test(paste)) {
      event.preventDefault()
    }
  }

  return (
    <div
      className={clsx(
        "relative flex justify-between items-center px-5 py-[2.375rem] w-full bg-gray-50",
        !label && "pt-5",
        !price && !balance && errors && !errors[fieldName] && "pb-5",
        className && className
      )}
    >
      {label && (
        <span className="absolute top-4 left-5 text-sm font-medium text-secondary">
          {label}
        </span>
      )}
      <input
        {...register(fieldName, {
          required: "This field is required",
          pattern: {
            value: /^(?!0(\.0+)?$)(\d+(\.\d+)?|\.\d+)$/, // Valid result "100", "1.000", "0.000123", etc.
            message: "Please enter a valid number",
          },
        })}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        placeholder={placeholder}
        className={clsx(
          "grow flex-1 bg-gray-50 max-w-[140px] md:max-w-[none] md:min-w-[calc(100%-210px)] text-3xl font-medium placeholder-black border-transparent focus:border-transparent focus:ring-0"
        )}
      />
      {errors && errors[fieldName] ? (
        <span className="absolute bottom-4 left-5 text-sm font-medium text-red-400">
          {(errors[fieldName] as FieldError).message}
        </span>
      ) : null}
      {price && errors && !errors[fieldName] ? (
        <span className="absolute bottom-4 left-5 text-sm font-medium text-secondary">
          ~${price}
        </span>
      ) : null}
      <div className="flex justify-end items-center">
        <AssetsSelect selected={selected} handleSelect={handleSelect} />
      </div>
      {balance && (
        <div className="absolute bottom-4 right-5 flex justify-center items-center gap-2">
          <span className="text-sm text-gray-600">Balance:</span>
          <span className="text-xs px-2 py-0.5 bg-red-100 text-red-400 rounded-full">
            {balance.toString()}
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

FieldComboInput.displayName = FieldComboInputRegistryName

export default FieldComboInput
