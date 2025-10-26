import { types, wrapClientComponent } from 'react-bricks/rsc'
import { RegisterComponent } from 'react-bricks/rsc/client'

import blockNames from '../../blockNames'
import {
  containerWidthSideGroup,
  neutralBackgroundSideGroup,
  paddingBordersSideGroup,
  sectionDefaults,
} from '../../LayoutSideProps'
import CodeClient, { CodeProps } from './CodeClient'

const schema: types.IBlockType<CodeProps> = {
  name: blockNames.Code,
  label: 'Code',
  category: 'single column / blog',
  tags: ['blog', 'code', 'editor'],
  playgroundLinkLabel: 'View source code on Github',
  playgroundLinkUrl:
    'https://github.com/ReactBricks/react-bricks-ui/blob/master/src/blog/Code/Code.tsx',
  previewImageUrl: `/bricks-preview-images/${blockNames.Code}.png`,
  getDefaultProps: () => ({
    ...sectionDefaults,
    width: 'small',
    code: "import React from 'react'\nconsole.log('hello')\nconst a = 2\nlet b = 3",
    language: 'typescript',
    dataline: '',
    showLineNumbers: false,
  }),
  sideEditProps: [
    {
      groupName: 'Code',
      defaultOpen: true,
      props: [
        {
          name: 'language',
          label: 'Language',
          type: types.SideEditPropType.Select,
          selectOptions: {
            display: types.OptionsDisplay.Select,
            options: [
              { value: 'javascript', label: 'JavaScript' },
              { value: 'css', label: 'CSS' },
              { value: 'typescript', label: 'TypeScript' },
              { value: 'bash', label: 'Bash' },
              { value: 'jsx', label: 'JSX' },
              { value: 'tsx', label: 'TSX' },
            ],
          },
        },
        {
          name: 'dataline',
          label: 'Highlight line (ex: 1,2,3): ',
          type: types.SideEditPropType.Text,
        },
        {
          name: 'showLineNumbers',
          label: 'Show Line Numbers?',
          type: types.SideEditPropType.Boolean,
        },
        {
          name: 'helper',
          label: 'Warning',
          type: types.SideEditPropType.Custom,
          component: () => (
            <div className="text-sm">
              Highlighted lines and line numbers are visible only in preview
              mode and in the frontend site.
            </div>
          ),
        },
      ],
    },
    neutralBackgroundSideGroup,
    paddingBordersSideGroup,
    containerWidthSideGroup,
  ],
}

export default wrapClientComponent({
  ClientComponent: CodeClient,
  RegisterComponent,
  schema,
})
