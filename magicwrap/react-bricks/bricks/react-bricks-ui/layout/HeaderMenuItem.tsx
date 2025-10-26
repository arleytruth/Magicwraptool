import { Link, Plain, Repeater, Text, types } from 'react-bricks/rsc'

import blockNames from '../blockNames'
import HeaderMenuItemClient from './HeaderMenuItemClient'
import HeaderMenuItemProvider from './HeaderMenuItemProvider'
import { ItemMenuClient } from './ItemMenuClient'

interface HeaderMenuItemProps {
  linkPath: string
  linkText: types.TextValue
  submenuItems: types.RepeaterItems
}

const HeaderMenuItem: types.Brick<HeaderMenuItemProps> = (props) => {
  const { linkPath, linkText, submenuItems } = props

  if (!submenuItems || !submenuItems.length) {
    return (
      <div>
        <Link
          href={linkPath}
          className="hidden lg:inline-flex justify-center items-center text-sm font-bold py-1.5 px-2 rounded-[5px] transition-colors ease-out text-gray-600 dark:text-white hover:bg-sky-500/20 dark:hover:bg-sky-500/40 hover:text-sky-600"
          activeClassName="text-sky-600 bg-sky-500/10 dark:bg-sky-500/30"
        >
          <Text
            propName="linkText"
            value={linkText}
            placeholder="Type a text..."
            renderBlock={({ children }) => <span>{children}</span>}
          />
        </Link>
        <Link
          href={linkPath}
          className="block lg:hidden text-sm mb-3 transition-colors ease-out text-gray-800 hover:text-sky-600"
        >
          <ItemMenuClient
            type="DIV"
            clickAction="SET_MOBILE_MENU_OPEN_FALSE"
            refName="NONE"
          >
            {' '}
            {typeof linkText === 'string'
              ? linkText
              : Plain.serialize(linkText)}
          </ItemMenuClient>
        </Link>
      </div>
    )
  }

  return (
    <HeaderMenuItemProvider>
      <div>
        <HeaderMenuItemClient
          menuItemText={
            <Text
              propName="linkText"
              value={linkText}
              placeholder="Type a text..."
              renderBlock={({ children }) => <div>{children}</div>}
            />
          }
          submenuItems={
            <Repeater
              propName="submenuItems"
              items={submenuItems}
              renderItemWrapper={(item) => (
                <ItemMenuClient
                  key={item.key}
                  type="DIV"
                  clickAction="SET_OPEN"
                  refName="NONE"
                >
                  {item}
                </ItemMenuClient>
              )}
            />
          }
          menuItemTextMobile={
            typeof linkText === 'string' ? linkText : Plain.serialize(linkText)
          }
          submenuItemsMobile={
            <Repeater
              propName="submenuItems"
              items={submenuItems}
              renderItemWrapper={(item: any) => (
                <ItemMenuClient
                  key={item.key}
                  type="DIV"
                  clickAction="SET_MOBILE_MENU_OPEN_FALSE"
                  refName="NONE"
                >
                  {item}
                </ItemMenuClient>
              )}
            />
          }
        ></HeaderMenuItemClient>
      </div>
    </HeaderMenuItemProvider>
  )
}

HeaderMenuItem.schema = {
  name: blockNames.HeaderMenuItem,
  label: 'Menu Item',
  category: 'layout',
  hideFromAddMenu: true,

  repeaterItems: [
    {
      name: 'submenuItems',
      itemType: blockNames.HeaderMenuSubItem,
    },
  ],

  getDefaultProps: () => ({
    linkPath: '/about-us',
    linkText: 'About us',
  }),

  sideEditProps: [
    {
      name: 'linkPath',
      label: 'Link to...',
      type: types.SideEditPropType.Text,
    },
  ],
}

export default HeaderMenuItem
