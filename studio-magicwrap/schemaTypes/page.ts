import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'page',
  title: 'Sayfalar',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Sayfa Başlığı',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Meta Açıklama',
      type: 'text',
      rows: 3,
      description: 'SEO için sayfa açıklaması',
      validation: (Rule) => Rule.max(160),
    }),
    defineField({
      name: 'content',
      title: 'İçerik',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H1', value: 'h1' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'H4', value: 'h4' },
            { title: 'Alıntı', value: 'blockquote' },
          ],
          lists: [
            { title: 'Madde İşareti', value: 'bullet' },
            { title: 'Numaralı', value: 'number' },
          ],
          marks: {
            decorators: [
              { title: 'Kalın', value: 'strong' },
              { title: 'İtalik', value: 'em' },
              { title: 'Altı Çizili', value: 'underline' },
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  {
                    name: 'href',
                    type: 'url',
                    title: 'URL',
                    validation: (Rule) => Rule.required(),
                  },
                ],
              },
            ],
          },
        },
        {
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alternatif Metin',
            },
            {
              name: 'caption',
              type: 'string',
              title: 'Başlık',
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'showInNav',
      title: 'Menüde Göster',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'navOrder',
      title: 'Menü Sırası',
      type: 'number',
      initialValue: 0,
      hidden: ({ document }) => !document?.showInNav,
    }),
    defineField({
      name: 'published',
      title: 'Yayında',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'slug.current',
    },
  },
})

