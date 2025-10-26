import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'Site Ayarları',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Site Başlığı',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Site Açıklaması',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.max(160),
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'favicon',
      title: 'Favicon',
      type: 'image',
    }),
    defineField({
      name: 'socialMedia',
      title: 'Sosyal Medya',
      type: 'object',
      fields: [
        {
          name: 'twitter',
          title: 'Twitter/X',
          type: 'url',
        },
        {
          name: 'facebook',
          title: 'Facebook',
          type: 'url',
        },
        {
          name: 'instagram',
          title: 'Instagram',
          type: 'url',
        },
        {
          name: 'linkedin',
          title: 'LinkedIn',
          type: 'url',
        },
        {
          name: 'youtube',
          title: 'YouTube',
          type: 'url',
        },
      ],
    }),
    defineField({
      name: 'contactInfo',
      title: 'İletişim Bilgileri',
      type: 'object',
      fields: [
        {
          name: 'email',
          title: 'E-posta',
          type: 'string',
        },
        {
          name: 'phone',
          title: 'Telefon',
          type: 'string',
        },
        {
          name: 'address',
          title: 'Adres',
          type: 'text',
        },
      ],
    }),
    defineField({
      name: 'seo',
      title: 'SEO Ayarları',
      type: 'object',
      fields: [
        {
          name: 'metaTitle',
          title: 'Meta Başlık',
          type: 'string',
        },
        {
          name: 'metaDescription',
          title: 'Meta Açıklama',
          type: 'text',
          rows: 3,
        },
        {
          name: 'ogImage',
          title: 'Open Graph Görseli',
          type: 'image',
          description: 'Sosyal medyada paylaşıldığında görünecek görsel',
        },
      ],
    }),
    defineField({
      name: 'scripts',
      title: 'Scriptler',
      type: 'object',
      fields: [
        {
          name: 'googleAnalytics',
          title: 'Google Analytics ID',
          type: 'string',
          description: 'Örn: G-XXXXXXXXXX',
        },
        {
          name: 'facebookPixel',
          title: 'Facebook Pixel ID',
          type: 'string',
        },
        {
          name: 'customHead',
          title: 'Özel Head Script',
          type: 'text',
          description: 'Head tag içine eklenecek özel script',
        },
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Site Ayarları',
      }
    },
  },
})

