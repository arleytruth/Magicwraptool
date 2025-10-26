import { types, wrapClientComponent } from 'react-bricks/rsc'
import { RegisterComponent } from 'react-bricks/rsc/client'

import blockNames from '../../blockNames'
import FormCheckboxClient, { FormCheckboxProps } from './FormCheckboxClient'

const schema: types.IBlockType<FormCheckboxProps> = {
  name: blockNames.FormCheckbox,
  label: 'Checkbox',
  category: 'contact',
  hideFromAddMenu: true,

  getDefaultProps: () => ({
    label: 'I accept the processing of my data',
    columns: '2',
    isRequired: true,
    fieldName: 'privacy',
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
  ClientComponent: FormCheckboxClient,
  RegisterComponent,
  schema,
})
