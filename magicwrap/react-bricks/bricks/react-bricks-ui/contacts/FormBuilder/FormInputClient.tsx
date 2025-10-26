'use client'

import classNames from 'classnames'
import { useContext } from 'react'
import { Plain, Text, isAdmin } from 'react-bricks/rsc'

import { textColors } from '../../colors'
import { FormBuilderContext } from './FormBuilderProvider'

export interface FormInputProps {
  fieldName?: string
  label?: any
  isRequired: boolean
  inputType: 'text' | 'number' | 'date' | 'email'
  pattern?: string
  patternError?: string
  requiredError?: string
  columns: '1' | '2'
}

const isRegex = (strRegex: string): boolean => {
  try {
    const testRegex = new RegExp(strRegex)
    return true
  } catch {
    return false
  }
}

const strToRegex = (strRegex: string | undefined): RegExp | undefined => {
  try {
    const testRegex = strRegex ? new RegExp(strRegex) : undefined
    return testRegex
  } catch {
    return undefined
  }
}

const FormInputClient: React.FC<FormInputProps> = ({
  isRequired = true,
  fieldName = '',
  label,
  inputType,
  pattern,
  patternError,
  requiredError,
  columns,
}) => {
  const { register, errors } = useContext(FormBuilderContext)

  if (!register || !errors) {
    return null
  }

  const labelTextContent =
    typeof label === 'string' ? label : Plain.serialize(label)

  const patternObj:
    | {
        pattern?: RegExp
        valueAsNumber?: false
        valueAsDate?: false
      }
    | {
        pattern?: undefined
        valueAsNumber?: false
        valueAsDate?: true
      }
    | {
        pattern?: undefined
        valueAsNumber?: true
        valueAsDate?: false
      } =
    inputType === 'number'
      ? {
          pattern: undefined,
          valueAsNumber: true,
          valueAsDate: false,
        }
      : inputType === 'date'
      ? {
          pattern: undefined,
          valueAsNumber: false,
          valueAsDate: true,
        }
      : {
          pattern: strToRegex(pattern),
          valueAsNumber: false,
          valueAsDate: false,
        }

  const registerAttributes = fieldName
    ? register(fieldName?.replace(/\s/g, '').toLowerCase(), {
        required: isRequired,
        ...patternObj,
      })
    : {}

  return (
    <div
      className={classNames(
        'py-1 group block col-span-2',
        columns === '1' && 'sm:col-span-1'
      )}
    >
      <label
        htmlFor={isAdmin() ? '' : fieldName}
        className={classNames(
          isRequired
            ? labelTextContent === ''
              ? 'block w-full'
              : 'flex items-center space-x-1'
            : 'block w-full'
        )}
      >
        <Text
          propName="label"
          value={label}
          placeholder="label..."
          renderBlock={(props) => (
            <span
              className={classNames(textColors.GRAY_600, 'mb-1 text-sm')}
              {...props.attributes}
            >
              {props.children}
            </span>
          )}
        />

        {isRequired &&
          (labelTextContent === '' ? null : (
            <span className="text-red-600">*</span>
          ))}
      </label>

      <input
        id={fieldName}
        type={inputType}
        className={classNames(
          'w-full px-[15px] py-[10px] bg-white dark:bg-gray-900 dark:text-white border rounded-sm outline-hidden focus:ring-3 focus:ring-opacity-50',
          errors[fieldName]
            ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
            : 'border-gray-300 dark:border-gray-500 focus:border-sky-500 dark:focus:border-white focus:ring-sky-200 dark:focus:ring-white/20'
        )}
        {...registerAttributes}
      />

      {errors[fieldName] && (
        <div className="block mt-1 text-xs text-red-500 font-bold">
          {errors[fieldName]?.type === 'required' && requiredError}
          {errors[fieldName]?.type === 'pattern' && patternError}
          {errors[fieldName]?.message &&
            `This field ${errors[fieldName]?.message}`}
        </div>
      )}
    </div>
  )
}

export default FormInputClient
