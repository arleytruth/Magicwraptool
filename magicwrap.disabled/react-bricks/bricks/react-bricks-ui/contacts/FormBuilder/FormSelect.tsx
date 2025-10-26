import { types, wrapClientComponent } from 'react-bricks/rsc'
import { RegisterComponent } from 'react-bricks/rsc/client'

import blockNames from '../../blockNames'
import FormSelectClient, { FormSelectProps } from './FormSelectClient'

const schema: types.IBlockType<FormSelectProps> = {
  name: blockNames.FormSelect,
  label: 'Select',
  category: 'contact',
  hideFromAddMenu: true,

  getDefaultProps: () => ({
    fieldName: 'select',
    label: 'Choose a fruit',
    columns: '2',
    options: 'orange: Orange\napple: Apple',
    isRequired: false,
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
      name: 'options',
      label: 'Options',
      type: types.SideEditPropType.Textarea,
      helperText: 'Each line should have "value:label"',
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
  ],
}

export default wrapClientComponent({
  ClientComponent: FormSelectClient,
  RegisterComponent,
  schema,
})
