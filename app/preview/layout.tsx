import React from 'react'
import ReactBricksApp from '@/components/ReactBricksApp'

export default function PreviewLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ReactBricksApp>
      {children}
    </ReactBricksApp>
  )
}

