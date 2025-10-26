import React from 'react'
import { PageViewer, fetchPage, fetchPages, cleanPage, types } from 'react-bricks/rsc'
import config from '@/react-bricks/config'
import { notFound } from 'next/navigation'
import ReactBricksApp from '@/components/ReactBricksApp'

export async function generateStaticParams() {
  const pages = await fetchPages(config.apiKey!)

  return pages.map((page) => ({
    slug: page.slug,
  }))
}

export async function generateMetadata({ 
  params 
}: { 
  params: { slug: string } 
}) {
  const { slug } = params

  try {
    const page = await fetchPage(slug, config.apiKey!, undefined, config)

    return {
      title: page?.meta?.title || 'React Bricks Page',
      description: page?.meta?.description,
    }
  } catch {
    return {
      title: 'Page Not Found',
    }
  }
}

export default async function Page({ 
  params 
}: { 
  params: { slug: string } 
}) {
  const { slug } = params

  try {
    const page = await fetchPage(slug, config.apiKey!, undefined, config)

    if (!page) {
      notFound()
    }

    const pageOk = page ? cleanPage(page, config.pageTypes!, config.bricks!) : null

    return (
      <ReactBricksApp>
        <div className="min-h-screen bg-background">
          <PageViewer page={pageOk!} />
        </div>
      </ReactBricksApp>
    )
  } catch (error) {
    notFound()
  }
}

export const revalidate = 1

