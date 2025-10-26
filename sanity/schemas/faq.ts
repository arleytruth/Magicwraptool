import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'faq',
  title: 'SSS (Sık Sorulan Sorular)',
  type: 'document',
  fields: [
    defineField({
      name: 'question',
      title: 'Soru',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'answer',
      title: 'Cevap',
      type: 'text',
      rows: 5,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Kategori',
      type: 'string',
      options: {
        list: [
          { title: 'Genel', value: 'general' },
          { title: 'Fiyatlandırma', value: 'pricing' },
          { title: 'Teknik', value: 'technical' },
          { title: 'Kullanım', value: 'usage' },
        ],
      },
    }),
    defineField({
      name: 'order',
      title: 'Sıralama',
      type: 'number',
      initialValue: 0,
    }),
    defineField({
      name: 'published',
      title: 'Yayında',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  orderings: [
    {
      title: 'Sıralama',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'question',
      subtitle: 'category',
    },
  },
})

