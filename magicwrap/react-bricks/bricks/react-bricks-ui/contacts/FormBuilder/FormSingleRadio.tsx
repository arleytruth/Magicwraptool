import { types, wrapClientComponent } from 'react-bricks/rsc'
import { RegisterComponent } from 'react-bricks/rsc/client'

import blockNames from '../../blockNames'
import FormSingleRadioClient, {
  FormSingleRadioProps,
} from './FormSingleRadioClient'

const schema: types.IBlockType<FormSingleRadioProps> = {
  name: blockNames.FormSingleRadio,
  label: 'Radio option',
  category: 'contact',
  hideFromAddMenu: true,
  // tags: [],

  // Defaults when a new brick is added
  getDefaultProps: () => ({
    label: 'New option',
    value: 'new-option',
  }),

  // Sidebar Edit controls for props
  sideEditProps: [
    { name: 'value', type: types.SideEditPropType.Text, label: 'Value' },
  ],
}

export default wrapClientComponent({
  ClientComponent: FormSingleRadioClient,
  RegisterComponent,
  schema,
})
