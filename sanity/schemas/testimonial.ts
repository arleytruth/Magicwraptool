import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'testimonial',
  title: 'Müşteri Yorumları',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'İsim',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Rol / Meslek',
      type: 'string',
      description: 'Örn: "Grafik Tasarımcı", "Araç Tuning Uzmanı"',
    }),
    defineField({
      name: 'company',
      title: 'Şirket / Kurum',
      type: 'string',
    }),
    defineField({
      name: 'image',
      title: 'Profil Fotoğrafı',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'testimonial',
      title: 'Yorum',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required().max(500),
    }),
    defineField({
      name: 'rating',
      title: 'Puan',
      type: 'number',
      validation: (Rule) => Rule.required().min(1).max(5),
      initialValue: 5,
    }),
    defineField({
      name: 'featured',
      title: 'Ana Sayfada Göster',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'order',
      title: 'Sıralama',
      type: 'number',
      initialValue: 0,
    }),
    defineField({
      name: 'active',
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
      title: 'name',
      subtitle: 'role',
      media: 'image',
    },
  },
})

