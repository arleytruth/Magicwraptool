import { types, wrapClientComponent } from 'react-bricks/rsc'
import { RegisterComponent } from 'react-bricks/rsc/client'

import MapClient, { MapProps } from './MapClient'

const MAPTILER_ACCESS_TOKEN = '' // Insert access token

const schema: types.IBlockType<MapProps> = {
  name: 'map',
  label: 'Map',
  category: 'contact',
  tags: ['contacts', 'map'],
  playgroundLinkLabel: 'View source code on Github',
  playgroundLinkUrl:
    'https://github.com/ReactBricks/react-bricks-ui/blob/master/src/website/Map/Map.tsx',
  previewImageUrl: `/bricks-preview-images/map.png`,
  getDefaultProps: () => ({
    lat: '45.6782509',
    lng: '9.5669407',
    zoom: '6',
  }),
  sideEditProps: [
    {
      name: 'zoom',
      label: 'Zoom',
      type: types.SideEditPropType.Number,
    },
    {
      name: 'lat',
      label: 'Latitude',
      type: types.SideEditPropType.Number,
    },
    {
      name: 'lng',
      label: 'Longitude',
      type: types.SideEditPropType.Number,
    },
    {
      name: 'maptiler',
      label: 'MapTiler',
      type: types.SideEditPropType.Custom,
      show: () => !MAPTILER_ACCESS_TOKEN,
      component: () => {
        if (!MAPTILER_ACCESS_TOKEN) {
          return (
            <p className="text-sm">
              For better maps, please create a MapTiler free account and set the{' '}
              <code className="text-xs">MAPTILER_ACCESS_TOKEN</code> string.
            </p>
          )
        }
        return null
      },
    },
  ],
}

export default wrapClientComponent({
  ClientComponent: MapClient,
  RegisterComponent,
  schema,
})
