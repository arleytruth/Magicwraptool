'use client'

import classNames from 'classnames'
import { useContext } from 'react'
import { Plain, Text, isAdmin } from 'react-bricks/rsc'

import { textColors } from '../../colors'
import { FormBuilderContext } from './FormBuilderProvider'

export interface FormTextareaProps {
  isRequired: boolean
  fieldName?: string
  requiredError?: string
  columns: '1' | '2'
  label: any
}

const FormTextareaClient: React.FC<FormTextareaProps> = ({
  fieldName = 'text area',
  isRequired = true,
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

      <textarea
        id={fieldName}
        className={classNames(
          'w-full px-[15px] py-[10px] bg-white dark:bg-gray-900 dark:text-white border rounded-sm outline-hidden focus:ring-3 focus:ring-opacity-50',
          errors[fieldName]
            ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
            : 'border-gray-300 dark:border-gray-500 focus:border-sky-500 dark:focus:border-white focus:ring-sky-200 dark:focus:ring-white/20'
        )}
        {...registerAttributes}
      />

      {errors[fieldName] && (
        <span className="block mt-1 text-xs text-red-500 font-bold">
          {errors[fieldName]?.type === 'required' && requiredError}
          {errors[fieldName]?.message &&
            `This field ${errors[fieldName]?.message}`}
        </span>
      )}
    </div>
  )
}

export default FormTextareaClient
