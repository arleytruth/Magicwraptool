import { client } from './client'

// Tüm sayfaları getir
export async function getAllPages() {
  return client.fetch(
    `*[_type == "page" && published == true && coalesce(archived, false) == false] | order(navOrder asc, title asc) {
      _id,
      title,
      slug,
      navLabel,
      showInNav,
      navOrder,
      published,
      archived
    }`
  )
}

// Slug'a göre sayfa getir
export async function getPageBySlug(slug: string) {
  return client.fetch(
    `*[_type == "page" && slug.current == $slug && published == true && coalesce(archived, false) == false][0] {
      _id,
      title,
      slug,
      hero,
      content[]{
        ...,
        _type == "image" => {
          ...,
          "url": asset->url
        },
        _type == "mediaBlock" => {
          ...,
          image{
            ...,
            asset->
          }
        }
      },
      navigationLinks,
      "metaDescription": coalesce(seo.metaDescription, metaDescription, description),
      seo,
      showInNav,
      navLabel,
      showInNav,
      navOrder,
      published,
      archived,
      form{
        enabled,
        title,
        description,
        endpoint,
        submitLabel,
        successMessage,
        fields[]{
          name,
          label,
          type,
          placeholder,
          options,
          required
        }
      },
      _updatedAt
    }`,
    { slug }
  )
}

// Tüm FAQ'ları getir
export async function getAllFaqs() {
  return client.fetch(
    `*[_type == "faq" && isActive == true] | order(order asc) {
      _id,
      question,
      answer,
      category,
      order,
      isActive
    }`
  )
}

// Kategoriye göre FAQ'ları getir
export async function getFaqsByCategory(category: string) {
  return client.fetch(
    `*[_type == "faq" && category == $category && isActive == true] | order(order asc) {
      _id,
      question,
      answer,
      category,
      order,
      isActive
    }`,
    { category }
  )
}

// Tüm pricing paketlerini getir
export async function getAllPricingPackages() {
  return client.fetch(
    `*[_type == "pricingPackage" && isActive == true] | order(sortOrder asc) {
      _id,
      title,
      slug,
      description,
      price,
      currency,
      features,
      isFeatured,
      badge,
      ctaLabel,
      sortOrder,
      isActive
    }`
  )
}

// Tüm testimonial'ları getir
export async function getAllTestimonials() {
  return client.fetch(
    `*[_type == "testimonial" && isActive == true] | order(order asc) {
      _id,
      name,
      role,
      company,
      content,
      rating,
      "avatarUrl": avatar.asset->url,
      order,
      isActive
    }`
  )
}

// Site ayarlarını getir
export async function getSiteSettings() {
  return client.fetch(
    `*[_type == "siteSettings"][0] {
      _id,
      title,
      description,
      "logo": logo.asset->url,
      "favicon": favicon.asset->url,
      contactEmail,
      contactPhone,
      socialMedia,
      metaTitle,
      metaDescription,
      _updatedAt
    }`
  )
}

// Tüm blog yazılarını getir
export async function getAllBlogPosts() {
  return client.fetch(
    `*[_type == "blogPost"] | order(publishedAt desc) {
      _id,
      title,
      slug,
      excerpt,
      status,
      "mainImageUrl": mainImage.asset->url,
      "authorName": author->name,
      "authorImage": author->image.asset->url,
      publishedAt,
      "categoryTitle": category->title,
      estimatedReadingTime
    }`
  )
}

// Slug'a göre blog yazısı getir
export async function getBlogPostBySlug(slug: string) {
  return client.fetch(
    `*[_type == "blogPost" && slug.current == $slug && status == "published"][0] {
      _id,
      title,
      slug,
      excerpt,
      "mainImageUrl": mainImage.asset->url,
      content,
      "authorName": author->name,
      "authorImage": author->image.asset->url,
      "authorBio": author->bio,
      publishedAt,
      "categoryTitle": category->title,
      tags,
      estimatedReadingTime,
      metaTitle,
      metaDescription,
      _updatedAt
    }`,
    { slug }
  )
}
