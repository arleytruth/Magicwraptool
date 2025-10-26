import blockNames from '../blockNames'
import React from 'react'
import { Text, types, Link } from 'react-bricks/rsc'
import classNames from 'classnames'
import { FiChevronRight } from 'react-icons/fi'

interface HeaderMenuSubItemProps {
  linkPath: string
  linkText: types.TextValue
  linkDescription: types.TextValue
}

const HeaderMenuSubItem: types.Brick<HeaderMenuSubItemProps> = ({
  linkPath,
  linkText,
  linkDescription,
}) => {
  return (
    <Link href={linkPath} className="group p-0 mb-3 lg:p-3 flex items-start">
      <div className="text-sky-500 lg:hidden mr-2">
        <FiChevronRight />
      </div>
      <div className="flex-1 overflow-hidden lg:overflow-auto">
        <Text
          propName="linkText"
          value={linkText}
          placeholder="Type a text..."
          renderBlock={({ children }) => (
            <div
              className={classNames(
                'text-sm truncate lg:overflow-auto lg:whitespace-normal lg:font-bold transition-colors ease-out text-gray-900 group-hover:text-sky-600'
              )}
            >
              {children}
            </div>
          )}
        />
        <div className="hidden lg:block">
          <Text
            propName="linkDescription"
            value={linkDescription}
            placeholder="Type a text..."
            renderBlock={({ children }) => (
              <div
                className={classNames(
                  'text-sm transition-colors ease-out text-gray-600'
                )}
              >
                {children}
              </div>
            )}
          />
        </div>
      </div>
    </Link>
  )
}

HeaderMenuSubItem.schema = {
  name: blockNames.HeaderMenuSubItem,
  label: 'Submenu Item',
  category: 'layout',
  hideFromAddMenu: true,

  getDefaultProps: () => ({
    linkText: 'Changelog',
    linkDescription: 'Release notes for all React Bricks versions',
    linkPath: '/',
  }),

  sideEditProps: [
    {
      name: 'linkPath',
      label: 'Link to...',
      type: types.SideEditPropType.Text,
    },
  ],
}

export default HeaderMenuSubItem
