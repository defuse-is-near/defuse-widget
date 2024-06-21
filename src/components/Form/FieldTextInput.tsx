import clsx from "clsx"
import { FieldValues, Path, UseFormRegister } from "react-hook-form"

interface Props<T extends FieldValues> {
  fieldName: Path<T>
  register?: UseFormRegister<T>
  required?: boolean
  placeholder?: string
  label?: string
}

export const FieldTextInputRegistryName = "FieldTextInput"

const FieldTextInput = <T extends FieldValues>({
  fieldName,
  register,
  required,
  placeholder = "",
  label,
}: Props<T>) => {
  if (!register) {
    return null
  }
  // TODO Error has to be propagated from parent Form
  const error = false
  return (
    <div
      className={clsx(
        "relative flex justify-between items-center px-5 py-[2.375rem] w-full bg-white rounded-[0.625rem]",
        !error && "pt-[2.375rem] pb-4"
      )}
    >
      {label && (
        <span className="absolute top-4 left-5 text-sm font-medium text-secondary">
          {label}
        </span>
      )}
      <input
        type="text"
        {...register(fieldName, { required })}
        placeholder={placeholder}
        className="text-base border-transparent focus:border-transparent focus:ring-0"
      />
    </div>
  )
}

FieldTextInput.displayName = FieldTextInputRegistryName

export default FieldTextInput
