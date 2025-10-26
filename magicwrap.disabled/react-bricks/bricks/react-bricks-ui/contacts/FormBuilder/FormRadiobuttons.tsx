import { types, wrapClientComponent } from 'react-bricks/rsc'
import { RegisterComponent } from 'react-bricks/rsc/client'

import blockNames from '../../blockNames'
import FormRadiobuttonsClient, {
  FormRadiobuttonsProps,
} from './FormRadiobuttonsClient'

const schema: types.IBlockType<FormRadiobuttonsProps> = {
  name: blockNames.FormRadiobuttons,
  label: 'Radio buttons',
  category: 'contact',
  hideFromAddMenu: true,

  // Defaults when a new brick is added
  getDefaultProps: () => ({
    columns: '2',
    fieldName: 'color',
    label: 'Choose a color',
    radioButtons: [
      {
        label: 'Blue',
        value: 'blue',
      },
      {
        label: 'Green',
        value: 'green',
      },
    ],
    isRequired: false,
  }),

  repeaterItems: [
    {
      name: 'radiobuttons',
      itemType: blockNames.FormSingleRadio,
      min: 1,
    },
  ],

  // Sidebar Edit controls for props
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
  ClientComponent: FormRadiobuttonsClient,
  RegisterComponent,
  schema,
})
