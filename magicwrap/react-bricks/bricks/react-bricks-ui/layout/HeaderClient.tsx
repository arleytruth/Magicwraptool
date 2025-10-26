'use client'

import { useContext } from 'react'
import { FiMenu, FiX } from 'react-icons/fi'
import { useTheme } from 'next-themes'
import { BsMoonFill, BsSunFill } from 'react-icons/bs'

import { HeaderContext } from './HeaderProvider'

interface IHeaderClientProps {
  menuItems: any
}

const HeaderClient: React.FC<IHeaderClientProps> = ({ menuItems }) => {
  const { mounted, mobileRef, mobileMenuOpen, setMobileMenuOpen } =
    useContext(HeaderContext)
  const { theme, setTheme } = useTheme()

  return (
    <>
      <div className="relative ml-auto lg:hidden flex items-center h-full sm:gap-x-4">
        {/* DARK MODE BUTTON MOBILE */}
        {mounted && (
          <button
            type="button"
            className="flex items-center justify-center w-8 h-8 mr-4 sm:mr-0 sm:ml-4 md:ml-8 text-gray-400 dark:text-gray-200"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'light' ? (
              <BsMoonFill />
            ) : (
              <BsSunFill className="text-xl" />
            )}
          </button>
        )}

        <button
          className="group p-1 w-7 h-7 flex justify-center items-center rounded-[5px] bg-gray-200 dark:bg-transparent hover:bg-sky-500/20 dark:hover:bg-sky-500/40 hover:text-sky-600 dark:hover:text-sky-500 focus:bg-sky-500/20 dark:focus:bg-sky-500/40 focus:text-sky-600 dark:focus:text-sky-500"
          onClick={() => setMobileMenuOpen((current: any) => !current)}
        >
          {mobileMenuOpen ? (
            <FiX className="text-gray-600 dark:text-white" size={18} />
          ) : (
            <FiMenu className="text-gray-600 dark:text-white" size={20} />
          )}
        </button>
        {mobileMenuOpen && (
          <div
            ref={mobileRef}
            className="absolute top-8 right-0 w-64 bg-white p-5 border rounded-lg shadow-lg z-10"
          >
            {menuItems}
          </div>
        )}
      </div>

      {/* DARK MODE BUTTON DESKTOP */}
      {mounted && (
        <button
          type="button"
          className="hidden lg:flex items-center justify-center w-8 h-8 mr-4 sm:mr-0 sm:ml-4 md:ml-8 text-gray-400 dark:text-gray-200"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          {theme === 'light' ? (
            <BsMoonFill />
          ) : (
            <BsSunFill className="text-xl" />
          )}
        </button>
      )}
    </>
  )
}

export default HeaderClient
