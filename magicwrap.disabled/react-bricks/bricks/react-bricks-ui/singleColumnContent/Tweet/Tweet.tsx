import * as React from 'react'
import { types } from 'react-bricks/rsc'
import { Tweet as ReactTweet } from 'react-tweet'

import blockNames from '../../blockNames'

import Container from '../../shared/components/Container'
import Section from '../../shared/components/Section'
import {
  LayoutProps,
  neutralBackgroundSideGroup,
  paddingBordersSideGroup,
  sectionDefaults,
} from '../../LayoutSideProps'

export interface TweetProps extends LayoutProps {
  id: string
  placeholder: string
  align: string
  cards: string
  conversation: string
  theme: string
}

const Tweet: types.Brick<TweetProps> = ({
  id,
  backgroundColor,
  borderTop,
  borderBottom,
  paddingTop,
  paddingBottom,
}) => {
  return (
    <Section
      backgroundColor={backgroundColor}
      borderTop={borderTop}
      borderBottom={borderBottom}
    >
      <Container
        size="full"
        paddingTop={paddingTop}
        paddingBottom={paddingBottom}
      >
        <div className="flex justify-center">
          <ReactTweet id={id} />
        </div>
      </Container>
    </Section>
  )
}

Tweet.schema = {
  name: blockNames.Tweet,
  label: 'Tweet',
  category: 'single column / blog',
  playgroundLinkLabel: 'View source code on Github',
  playgroundLinkUrl:
    'https://github.com/ReactBricks/react-bricks-ui/blob/master/src/blog/Tweet/Tweet.tsx',
  previewImageUrl: `/bricks-preview-images/${blockNames.Tweet}.png`,
  getDefaultProps: () => ({
    ...sectionDefaults,
    id: '1237840583982329857',
    placeholder: 'Loading Tweet',
    position: 'center',
    cards: 'hidden',
    conversation: 'none',
    theme: 'auto',
    align: 'center',
  }),
  sideEditProps: [
    {
      groupName: 'Tweet',
      defaultOpen: true,
      props: [
        {
          name: 'id',
          label: 'Tweet ID',
          type: types.SideEditPropType.Text,
        },
      ],
    },

    neutralBackgroundSideGroup,
    paddingBordersSideGroup,
  ],
}

export default Tweet
