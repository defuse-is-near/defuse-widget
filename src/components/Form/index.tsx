"use client"

import React, {
  PropsWithChildren,
  Children,
  cloneElement,
  isValidElement,
  ReactElement,
  FormEventHandler,
} from "react"
import {
  UseFormRegister,
  FieldValues,
  UseFormHandleSubmit,
} from "react-hook-form"

// Define an interface for components that accept register as a prop
interface RegisterProps<T extends FieldValues> {
  register: UseFormRegister<T>
}

interface Props<T extends FieldValues> extends PropsWithChildren {
  register: UseFormRegister<T>
  handleSubmit: UseFormHandleSubmit<T> | FormEventHandler<T> | undefined
}

const Form = <T extends FieldValues>({
  children,
  handleSubmit,
  register,
}: Props<T>) => {
  const childrenWithProps = Children.map(children, (child) => {
    if (isValidElement(child)) {
      // Ensure that the child is a ReactElement and pass the register prop correctly
      return cloneElement(child as ReactElement<RegisterProps<T>>, {
        register,
      })
    }
    return child
  })

  /* eslint-disable  @typescript-eslint/no-explicit-any */
  return <form onSubmit={handleSubmit as any}>{childrenWithProps}</form>
}

export default Form
