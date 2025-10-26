'use client'

import React from 'react'
import { ReactBricks } from 'react-bricks/rsc'
import config from '@/react-bricks/config'

interface ReactBricksAppProps {
  children: React.ReactNode
}

const ReactBricksApp: React.FC<ReactBricksAppProps> = ({ children }) => {
  return <ReactBricks {...config}>{children}</ReactBricks>
}

export default ReactBricksApp

