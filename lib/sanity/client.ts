import { createClient } from 'next-sanity'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'r2yabxzn'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-10-24'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // Development için cache'i kapat - real-time preview için
  perspective: 'published', // Sadece yayınlanmış içeriği göster
})

// For server-side queries with authentication
export const clientWithToken = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_READ_TOKEN,
})

