'use client'

import classNames from 'classnames'
import { useContext } from 'react'
import { Plain, Text, isAdmin } from 'react-bricks/rsc'

import { textColors } from '../../colors'
import { FormBuilderContext } from './FormBuilderProvider'

export interface FormSingleRadioProps {
  fieldName: string
  label: string
  value: string

  isRequired: boolean
}

const FormSingleRadioClient: React.FC<FormSingleRadioProps> = ({
  fieldName,
  label,
  value,

  isRequired,
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
    <div className="flex items-center">
      <input
        id={value}
        className={classNames(
          'border-gray-300 focus:border-sky-300 focus:ring-3 focus:ring-opacity-50 text-sm rounded-full text-sky-500 focus:ring-offset-0',
          errors[fieldName]
            ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
            : 'border-gray-300 dark:border-gray-500 focus:border-sky-500 dark:focus:border-white focus:ring-sky-200 dark:focus:ring-white/20'
        )}
        {...registerAttributes}
        type="radio"
        value={value}
      />
      <label
        htmlFor={isAdmin() ? '' : value}
        className={classNames('ml-2 block w-full min-w-[70px]')}
      >
        <Text
          propName="label"
          value={label}
          placeholder="label..."
          renderBlock={(props) => (
            <span
              className={classNames(textColors.GRAY_900)}
              {...props.attributes}
            >
              {props.children}
            </span>
          )}
        />
      </label>
    </div>
  )
}

export default FormSingleRadioClient
