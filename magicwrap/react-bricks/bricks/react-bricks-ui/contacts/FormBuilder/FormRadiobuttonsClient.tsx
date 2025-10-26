'use client'

import classNames from 'classnames'
import { useContext } from 'react'
import { Plain, Repeater, Text, types } from 'react-bricks/rsc'

import { textColors } from '../../colors'
import { FormBuilderContext } from './FormBuilderProvider'

export interface FormRadiobuttonsProps {
  fieldName: string
  label: string
  isRequired: boolean
  requiredError?: string
  columns: '1' | '2'
  radioButtons: types.RepeaterItems
}

const FormRadiobuttonsClient: React.FC<FormRadiobuttonsProps> = ({
  fieldName,
  label,
  isRequired,
  requiredError,
  columns,
  radioButtons,
}) => {
  const { register, errors } = useContext(FormBuilderContext)

  if (!register || !errors) {
    return null
  }

  const labelTextContent =
    typeof label === 'string' ? label : Plain.serialize(label)

  return (
    <div
      className={classNames(
        'w-full py-1 col-span-2',
        columns === '1' && 'sm:col-span-1'
      )}
    >
      <div
        className={classNames(
          'mb-1',
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
      </div>
      <Repeater
        propName="radioButtons"
        items={radioButtons}
        itemProps={{
          fieldName,
          register,
          isRequired,
          errors,
        }}
      />
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

export default FormRadiobuttonsClient
