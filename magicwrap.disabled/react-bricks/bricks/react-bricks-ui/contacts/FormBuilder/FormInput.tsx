import { types, wrapClientComponent } from 'react-bricks/rsc'
import { RegisterComponent } from 'react-bricks/rsc/client'

import blockNames from '../../blockNames'
import FormInputClient, { FormInputProps } from './FormInputClient'

const isRegex = (strRegex: string): boolean => {
  try {
    const testRegex = new RegExp(strRegex)
    return true
  } catch {
    return false
  }
}

const schema: types.IBlockType<FormInputProps> = {
  name: blockNames.FormInput,
  label: 'Input',
  category: 'contact',
  hideFromAddMenu: true,
  // tags: [],

  getDefaultProps: () => ({
    fieldName: 'firstname',
    isRequired: false,
    inputType: 'text',
    columns: '2',
    label: 'First Name',
    requiredError: '',
    pattern: '',
    patternError: '',
  }),

  sideEditProps: [
    {
      name: 'columns',
      label: 'Columns',
      type: types.SideEditPropType.Select,
      selectOptions: {
        display: types.OptionsDisplay.Radio,
        options: [
          { value: '1', label: 'One' },
          { value: '2', label: 'Two' },
        ],
      },
    },
    {
      name: 'fieldName',
      type: types.SideEditPropType.Text,
      label: 'Field Name',
    },

    {
      name: 'inputType',
      type: types.SideEditPropType.Select,
      label: 'Input type',
      selectOptions: {
        display: types.OptionsDisplay.Radio,
        options: [
          { value: 'text', label: 'Text' },
          { value: 'number', label: 'Number' },
          { value: 'date', label: 'Date' },
          { value: 'password', label: 'Password' },
          { value: 'email', label: 'Email' },
        ],
      },
    },
    {
      name: 'isRequired',
      type: types.SideEditPropType.Boolean,
      label: 'Field required',
    },
    {
      name: 'requiredError',
      type: types.SideEditPropType.Text,
      label: 'Required error message',
    },
    {
      name: 'pattern',
      type: types.SideEditPropType.Text,
      label: 'Pattern (RegEx)',
      validate: (value: string) => isRegex(value) || 'Invalid RegEx',
    },
    {
      name: 'patternError',
      type: types.SideEditPropType.Text,
      label: 'Pattern error message',
    },
  ],
}

export default wrapClientComponent({
  ClientComponent: FormInputClient,
  RegisterComponent,
  schema,
})
