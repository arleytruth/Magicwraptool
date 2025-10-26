import React from 'react'
import { types } from 'react-bricks/rsc'
import bricks from './bricks'
import pageTypes from './pageTypes'

const config: types.ReactBricksConfig = {
  appId: process.env.NEXT_PUBLIC_APP_ID || '',
  apiKey: process.env.API_KEY || '',
  environment: process.env.NEXT_PUBLIC_ENVIRONMENT || 'production',
  bricks,
  pageTypes,
  customFields: [],
  logo: '/logo.svg',
  contentClassName: 'max-w-7xl mx-auto px-4',
  renderLocalLink: ({ href, children, className, activeClassName, isActive }) => {
    return (
      <a
        href={href}
        className={`${className} ${isActive ? activeClassName : ''}`}
      >
        {children}
      </a>
    )
  },
  loginPath: '/admin',
  editorPath: '/admin/editor',
  playgroundPath: '/admin/playground',
  appSettingsPath: '/admin/app-settings',
  useCssInJs: false,
  appRootElement: 'body',
  clickToEditSide: types.ClickToEditSide.BottomRight,
  enableAutoSave: true,
  disableSaveIfInvalidProps: false,
  enablePreview: true,
  enablePreviewImage: true,
  enableDefaultEmbedBrick: true,
  previewPath: '/preview',
}

export default config

