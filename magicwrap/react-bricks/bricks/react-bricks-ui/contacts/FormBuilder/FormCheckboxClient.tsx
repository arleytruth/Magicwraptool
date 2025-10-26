'use client'

import classNames from 'classnames'
import { useContext } from 'react'
import { Plain, Text, isAdmin } from 'react-bricks/rsc'

import { textColors } from '../../colors'
import { FormBuilderContext } from './FormBuilderProvider'

export interface FormCheckboxProps {
  fieldName: string
  label: string
  isRequired: boolean

  requiredError?: string
  columns: '1' | '2'
}

const FormCheckboxClient: React.FC<FormCheckboxProps> = ({
  isRequired = true,
  fieldName,
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
        'col-span-2 py-1',
        columns === '1' && 'sm:col-span-1'
      )}
    >
      <div className="inline-flex items-center">
        <input
          id={fieldName}
          type="checkbox"
          className={classNames(
            'border-gray-300 focus:border-sky-300 focus:ring-3 focus:ring-opacity-50 text-sm rounded-xs text-sky-500 focus:ring-offset-0',
            errors[fieldName]
              ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
              : 'border-gray-300 dark:border-gray-500 focus:border-sky-500 dark:focus:border-white focus:ring-sky-200 dark:focus:ring-white/20'
          )}
          {...registerAttributes}
        />
        <label
          htmlFor={isAdmin() ? '' : fieldName}
          className={classNames(
            'ml-2',
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
                className={classNames(textColors.GRAY_800)}
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
      </div>
      {errors[fieldName] && (
        <div className="block mt-1 text-xs text-red-500 font-bold">
          {errors[fieldName]?.type === 'required' && requiredError}
          {errors[fieldName]?.message &&
            `This field ${errors[fieldName]?.message}`}
        </div>
      )}
    </div>
  )
}

export default FormCheckboxClient
