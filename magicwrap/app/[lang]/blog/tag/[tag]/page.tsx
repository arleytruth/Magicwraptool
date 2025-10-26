import type { Metadata } from 'next'
import Link from 'next/link'
import { fetchPages, fetchTags, types } from 'react-bricks/rsc'

import PostListItem from '@/components/PostListItem'
import TagListItem from '@/components/TagListItem'
import ErrorNoKeys from '@/components/errorNoKeys'
import config from '@/react-bricks/config'

const getData = async (
  tag: string,
  locale: string
): Promise<{
  pagesByTag: types.PageFromList[] | null
  tags: string[] | null
  errorNoKeys: boolean
  errorPage: boolean
}> => {
  let errorNoKeys: boolean = false
  let errorPage: boolean = false

  if (!config.apiKey) {
    errorNoKeys = true

    return {
      pagesByTag: null,
      tags: null,
      errorNoKeys,
      errorPage,
    }
  }

  const [pagesByTag, tags] = await Promise.all([
    fetchPages({
      tag: tag.toString(),
      type: 'blog',
      pageSize: 1000,
      sort: '-publishedAt',
      config,
      fetchOptions: { next: { revalidate: 3 } },
    }).catch(() => {
      errorPage = true
      return null
    }),
    fetchTags(config.apiKey, undefined, undefined, undefined, {
      next: { revalidate: 3 },
    }),
  ])

  return {
    pagesByTag,
    tags: tags.items.sort(),
    errorNoKeys,
    errorPage,
  }
}

export async function generateStaticParams({
  params,
}: {
  params: { lang: string }
}) {
  if (!config.apiKey) {
    return []
  }

  const { items: tags } = await fetchTags(config.apiKey, undefined, undefined, {
    language: params.lang,
  })

  return tags
}

export async function generateMetadata(props: {
  params: Promise<{ lang: string; tag: string }>
}): Promise<Metadata> {
  const params = await props.params
  return {
    title: params.tag,
    description: params.tag,
  }
}

export default async function Page(props: {
  params: Promise<{ lang: string; tag: string }>
}) {
  const params = await props.params
  const { pagesByTag, tags, errorNoKeys } = await getData(
    params.tag,
    params.lang
  )

  const tag = decodeURIComponent(params.tag)

  return (
    <>
      {!errorNoKeys && (
        <>
          <div className="bg-white dark:bg-gray-900">
            <div className="max-w-6xl mx-auto px-8 py-16">
              <div className="flex items-center justify-between  text-gray-900 dark:text-white pb-4 mt-10 sm:mt-12 mb-4">
                <h1 className="max-w-2xl text-4xl sm:text-6xl lg:text-4xl font-bold tracking-tight">
                  {tag} articles
                </h1>

                <Link
                  href="/blog"
                  className="hover:-translate-x-2 transition-transform duration-300"
                >
                  &laquo; Return to blog
                </Link>
              </div>

              <div className="flex flex-wrap items-center">
                {tags?.map((tag) => (
                  <TagListItem tag={tag} key={tag} />
                ))}
              </div>

              <hr className="mt-6 mb-10 dark:border-gray-600" />

              <div className="grid lg:grid-cols-2 xl:grid-cols-3 sm:gap-12">
                {pagesByTag?.map((post) => (
                  <PostListItem
                    key={post.id}
                    title={post.meta.title || ''}
                    href={post.slug}
                    content={post.meta.description || ''}
                    author={post.author}
                    date={post.publishedAt || ''}
                    featuredImg={post.meta.image}
                  />
                ))}
              </div>
            </div>
          </div>
        </>
      )}
      {errorNoKeys && <ErrorNoKeys />}
    </>
  )
}
