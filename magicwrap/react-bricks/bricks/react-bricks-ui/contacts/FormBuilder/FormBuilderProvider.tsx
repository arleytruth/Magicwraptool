'use client'

import { createContext } from 'react'
import type {
  FieldErrorsImpl,
  FieldValues,
  UseFormHandleSubmit,
  UseFormRegister,
  UseFormSetError,
} from 'react-hook-form'
import { useForm } from 'react-hook-form'

interface IFormBuilderProvider {
  register?: UseFormRegister<FieldValues>
  handleSubmit?: UseFormHandleSubmit<FieldValues>
  errors?: FieldErrorsImpl<{
    [x: string]: any
  }>
  isSubmitSuccessful?: boolean
  isSubmitting?: boolean
  setError?: UseFormSetError<FieldValues>
}

export const FormBuilderContext = createContext<IFormBuilderProvider>({})

export default function FormBuilderProvider({ children }: any) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful, isSubmitting },
    setError,
  } = useForm()

  return (
    <FormBuilderContext.Provider
      value={{
        register,
        handleSubmit,
        errors,
        isSubmitSuccessful,
        isSubmitting,
        setError,
      }}
    >
      {children}
    </FormBuilderContext.Provider>
  )
}
