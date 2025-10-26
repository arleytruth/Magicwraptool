import React from 'react'
import ReactBricksApp from '@/components/ReactBricksApp'

export default function AdminLayout({
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

