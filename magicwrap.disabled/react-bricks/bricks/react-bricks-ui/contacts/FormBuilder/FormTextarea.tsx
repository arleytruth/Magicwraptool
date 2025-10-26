import { types, wrapClientComponent } from 'react-bricks/rsc'
import { RegisterComponent } from 'react-bricks/rsc/client'

import blockNames from '../../blockNames'
import FormTextareaClient, { FormTextareaProps } from './FormTextareaClient'

const schema: types.IBlockType<FormTextareaProps> = {
  name: blockNames.FormTextArea,
  label: 'Textarea',
  category: 'contact',
  hideFromAddMenu: true,

  getDefaultProps: () => ({
    columns: '2',
    fieldName: 'message',
    label: 'Message',
    isRequired: false,
    requiredError: '',
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
  ClientComponent: FormTextareaClient,
  RegisterComponent,
  schema,
})
