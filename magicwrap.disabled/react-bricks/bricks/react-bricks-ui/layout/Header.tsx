import { Image, Link, Repeater, types } from 'react-bricks/rsc'

import {
  LayoutProps,
  backgroundColorsEditProps,
  borderBottomEditProp,
  sectionDefaults,
} from '../LayoutSideProps'
import blockNames from '../blockNames'
import { bgColors, buttonColors } from '../colors'
import Section from '../shared/components/Section'
import HeaderClient from './HeaderClient'
import HeaderProvider from './HeaderProvider'

interface HeaderProps extends LayoutProps {
  logo: types.IImageSource
  menuItems: types.RepeaterItems
  buttons: types.RepeaterItems
}

const Header: types.Brick<HeaderProps> = ({
  backgroundColor,
  borderBottom,
  logo,
  menuItems,
  buttons,
}) => {
  return (
    <HeaderProvider>
      <Section
        backgroundColor={backgroundColor}
        borderBottom={borderBottom ? 'full' : 'none'}
      >
        <nav className="py-5 px-5 sm:mx-[5.55555%] xl:mx-[11.1111%] flex justify-start items-center">
          <Link
            href="/"
            aria-label="home"
            className="inline-flex py-1.5 px-2 mr-6"
          >
            <Image
              propName="logo"
              source={logo}
              alt="Logo"
              maxWidth={300}
              imageClassName="block w-32 h-7 object-contain object-left"
            />
          </Link>
          <div className="hidden lg:flex items-center space-x-2">
            <Repeater propName="menuItems" items={menuItems} />
          </div>
          <div className="hidden lg:block ml-auto">
            <Repeater
              propName="buttons"
              items={buttons}
              // No local link to avoid prefetching
              // of the Admin bundle in case of link
              // to Edit content
              itemProps={{ simpleAnchorLink: true }}
              renderWrapper={(item) => (
                <div
                  key={item.key}
                  className="flex flex-row space-x-5 items-center justify-end"
                >
                  {item}
                </div>
              )}
            />
          </div>

          <HeaderClient
            menuItems={<Repeater propName="menuItems" items={menuItems} />}
          ></HeaderClient>
        </nav>
      </Section>
    </HeaderProvider>
  )
}

Header.schema = {
  name: blockNames.Header,
  label: 'Header',
  category: 'layout',
  tags: ['header', 'menu'],
  previewImageUrl: `/bricks-preview-images/${blockNames.Header}.png`,
  repeaterItems: [
    {
      name: 'menuItems',
      itemType: blockNames.HeaderMenuItem,
      itemLabel: 'Item',
      min: 0,
      max: 6,
    },
    {
      name: 'buttons',
      itemType: blockNames.Button,
      itemLabel: 'Button',
      min: 0,
      max: 2,
    },
  ],
  sideEditProps: [
    {
      groupName: 'Layout',
      defaultOpen: true,
      props: [backgroundColorsEditProps, borderBottomEditProp],
    },
  ],
  getDefaultProps: () => ({
    backgroundColor: bgColors.WHITE.value,
    borderBottom: 'none',
    menuItems: [
      {
        linkPath: '/',
        linkText: 'Home',
      },
      {
        linkPath: '/about-us',
        linkText: 'About us',
      },
      {
        linkPath: '',
        linkText: 'Features',
        submenuItems: [
          {
            linkText: 'Visual editing',
            linkDescription:
              'The best visual experience for your content editors',
            linkPath: '/',
          },
        ],
      },
    ],
    logo: {
      src: 'https://images.reactbricks.com/original/8d0eb40f-6e1a-4f6c-9895-a06767fcf5fa.svg',
      placeholderSrc:
        'https://images.reactbricks.com/original/8d0eb40f-6e1a-4f6c-9895-a06767fcf5fa.svg',
      srcSet: '',
      width: 450,
      height: 100,
      alt: 'React Bricks',
      seoName: 'react-bricks',
    },
    buttons: [
      {
        text: 'Edit content',
        href: '/admin',
        isTargetBlank: false,
        buttonColor: buttonColors.SKY.value,
        type: 'solid',
        padding: 'small',
      },
    ],
  }),
  stories: [
    {
      id: 'header-dark',
      name: 'Header dark',
      previewImageUrl: `/bricks-preview-images/header-dark.png`,
      showAsBrick: true,
      props: {
        ...sectionDefaults,
        borderBottom: 'none',
        backgroundColor: bgColors.DARK_GRAY.value,
        menuItems: [
          {
            linkPath: '/docs',
            linkText: 'Docs',
          },
          {
            linkPath: '/contacts',
            linkText: 'Contacts',
          },
        ],
        logo: {
          src: 'https://images.reactbricks.com/original/881feb54-54af-46d5-8825-31e22ccbac25.webp',
          placeholderSrc:
            'https://images.reactbricks.com/placeholder/881feb54-54af-46d5-8825-31e22ccbac25.jpg',
          srcSet:
            'https://images.reactbricks.com/src_set/881feb54-54af-46d5-8825-31e22ccbac25-600.webp 600w,\nhttps://images.reactbricks.com/src_set/881feb54-54af-46d5-8825-31e22ccbac25-450.webp 450w,\nhttps://images.reactbricks.com/src_set/881feb54-54af-46d5-8825-31e22ccbac25-300.webp 300w,\nhttps://images.reactbricks.com/src_set/881feb54-54af-46d5-8825-31e22ccbac25-150.webp 150w,\nhttps://images.reactbricks.com/src_set/881feb54-54af-46d5-8825-31e22ccbac25-75.webp 75w',
          width: 5314,
          height: 1181,
          alt: 'React Bricks',
          seoName: 'react-bricks',
          fallbackSrc:
            'https://images.reactbricks.com/original/881feb54-54af-46d5-8825-31e22ccbac25.png',
          fallbackSrcSet:
            'https://images.reactbricks.com/src_set/881feb54-54af-46d5-8825-31e22ccbac25-600.png 600w,\nhttps://images.reactbricks.com/src_set/881feb54-54af-46d5-8825-31e22ccbac25-450.png 450w,\nhttps://images.reactbricks.com/src_set/881feb54-54af-46d5-8825-31e22ccbac25-300.png 300w,\nhttps://images.reactbricks.com/src_set/881feb54-54af-46d5-8825-31e22ccbac25-150.png 150w,\nhttps://images.reactbricks.com/src_set/881feb54-54af-46d5-8825-31e22ccbac25-75.png 75w',
          fallbackType: 'image/png',
        },
        buttons: [],
      },
    },
  ],
}

export default Header
