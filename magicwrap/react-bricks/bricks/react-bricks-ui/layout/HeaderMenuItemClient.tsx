'use client'

import React, { useContext } from 'react'
// import { HeaderContext } from './HeaderProvider'
import { HeaderMenuItemContext } from './HeaderMenuItemProvider'
import classNames from 'classnames'

interface HeaderMenuItemProps {
  menuItemText: any
  submenuItems: any
  menuItemTextMobile: any
  submenuItemsMobile: any
}

const HeaderMenuItemClient: React.FC<HeaderMenuItemProps> = ({
  menuItemText,
  submenuItems,
  menuItemTextMobile,
  submenuItemsMobile,
}) => {
  // const { mobileRef, setMobileMenuOpen } = useContext(HeaderContext)
  const { ref, open, setOpen } = useContext(HeaderMenuItemContext)

  return (
    <div>
      <div ref={ref} className="hidden lg:block relative">
        <button
          className={classNames(
            'text-gray-600 dark:text-white hover:bg-sky-500/20 hover:text-sky-600 dark:hover:bg-sky-500/40 inline-flex justify-center items-center text-sm font-bold py-1.5 px-2 rounded-[5px] transition-colors ease-out',
            { 'bg-sky-500/20 dark:bg-sky-500/40 text-sky-600': open }
          )}
          onClick={() => setOpen((current: any) => !current)}
        >
          {menuItemText}
          {open ? (
            <svg
              viewBox="0 0 14 14"
              width="14px"
              height="14px"
              className="inline-block w-[10px] h-[10px] ml-[5px]"
            >
              <path
                d="m7.35 2.9 5.5 5.5a.5.5 0 0 1-.7.7L7 3.96 1.85 9.1a.5.5 0 1 1-.7-.7l5.5-5.5c.2-.2.5-.2.7 0Z"
                fill="currentColor"
              ></path>
            </svg>
          ) : (
            <svg
              viewBox="0 0 14 14"
              width="14px"
              height="14px"
              className="inline-block w-[10px] h-[10px] ml-[5px]"
            >
              <path
                d="m1.15 5.6 5.5 5.5c.2.2.5.2.7 0l5.5-5.5a.5.5 0 0 0-.7-.7L7 10.04 1.85 4.9a.5.5 0 1 0-.7.7Z"
                fill="currentColor"
              ></path>
            </svg>
          )}
        </button>
        {open && (
          <div className="w-64 bg-white p-3 border rounded-md shadow-lg absolute top-9 z-1000">
            {submenuItems}
          </div>
        )}
      </div>

      <div className="lg:hidden mb-6" role="group">
        <div
          className={`text-xs font-extrabold text-gray-500 uppercase tracking-[0.35rem] mb-4`}
        >
          {menuItemTextMobile}
        </div>
        {submenuItemsMobile}
      </div>
    </div>
  )
}

export default HeaderMenuItemClient
