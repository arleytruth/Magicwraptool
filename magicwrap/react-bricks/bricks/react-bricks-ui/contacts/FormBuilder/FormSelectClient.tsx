'use client'

import classNames from 'classnames'
import { useContext } from 'react'
import { Plain, Text, isAdmin } from 'react-bricks/rsc'

import { textColors } from '../../colors'
import { FormBuilderContext } from './FormBuilderProvider'

export interface FormSelectProps {
  fieldName?: string
  label: string
  options?: string
  isRequired: boolean

  requiredError?: string
  columns: '1' | '2'
}

const FormSelectClient: React.FC<FormSelectProps> = ({
  options,
  isRequired,
  fieldName = 'select',
  label,

  requiredError,
  columns,
}) => {
  const { register, errors } = useContext(FormBuilderContext)

  if (!register || !errors) {
    return null
  }

  const labelTextContent =
    typeof label === 'string' ? label : Plain.serialize(label)

  const registerAttributes = fieldName
    ? register(
        fieldName?.replace(/\s/g, '').toLowerCase(),
        //@ts-ignore
        {
          required: isRequired,
        }
      )
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
              className={classNames(textColors.GRAY_600, ' mb-1 text-sm')}
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
      <select
        id={fieldName}
        className={classNames(
          'block w-full mt-1 px-4 py-2 bg-white dark:bg-gray-900 dark:text-white border border-gray-300 rounded-sm outline-hidden focus:ring-3 focus:ring-opacity-50',
          errors[fieldName]
            ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
            : 'border-gray-300 dark:border-gray-500 focus:border-sky-500 dark:focus:border-white focus:ring-sky-200 dark:focus:ring-white/20'
        )}
        {...registerAttributes}
      >
        {options?.split('\n').map((valuelabel, index) => {
          const [value, label] = valuelabel.trim().split(':')
          if (label) {
            return (
              <option key={index} value={value}>
                {label.trim()}
              </option>
            )
          }
          return (
            <option key={index} value={value}>
              {value}
            </option>
          )
        })}
      </select>
      {errors[fieldName] && (
        <span className="block mt-2 text-xs text-red-500 font-bold">
          {errors[fieldName]?.type === 'required' && requiredError}
          {errors[fieldName]?.message &&
            `This field ${errors[fieldName]?.message}`}
        </span>
      )}
    </div>
  )
}

export default FormSelectClient
