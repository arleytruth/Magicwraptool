import { types } from 'react-bricks/rsc'

const pageTypes: types.IPageType[] = [
  {
    name: 'page',
    pluralName: 'pages',
    defaultLocked: false,
    defaultStatus: types.PageStatus.Published,
    getDefaultContent: () => [],
    allowedBlockTypes: [
      'title',
      'paragraph',
      'button',
      'hero-section',
    ],
  },
]

export default pageTypes

