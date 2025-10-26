import { types, wrapClientComponent } from 'react-bricks/rsc'
import { RegisterComponent } from 'react-bricks/rsc/client'

import {
  neutralBackgroundColorsEditProps,
  sectionDefaults,
} from '../../LayoutSideProps'
import blockNames from '../../blockNames'
import NewsletterSubscribeClient, {
  NewsletterProps,
  NewsletterProvider,
} from './NewsletterSubscribeClient'

const schema: types.IBlockType<NewsletterProps> = {
  name: blockNames.NewsletterSubscribe,
  label: 'Newsletter subscribe',
  category: 'call to action',
  hideFromAddMenu: false,
  previewImageUrl: `/bricks-preview-images/${blockNames.NewsletterSubscribe}.png`,
  getDefaultProps: () => ({
    ...sectionDefaults,
    title: 'Join our newsletter',
    text: 'Never miss our release and new blog articles.',
    text2: '6,500 developers and counting',
    buttonText: 'Join',
    mailchimpUrl: '',
    provider: NewsletterProvider.MailChimp,
    resultOkText: '',
  }),
  sideEditProps: [
    {
      groupName: 'Newsletter',
      defaultOpen: true,
      props: [
        neutralBackgroundColorsEditProps,
        {
          name: 'mailchimpUrl',
          label: 'Mailchimp Form URL',
          type: types.SideEditPropType.Text,
          validate: (value) =>
            value && value.length > 10 && value.indexOf('https://') !== -1,
          //&& value.indexOf('list-manage.com/subscribe/post?') !== -1,
        },
      ],
    },
  ],
}

export default wrapClientComponent({
  ClientComponent: NewsletterSubscribeClient,
  RegisterComponent,
  schema,
})
