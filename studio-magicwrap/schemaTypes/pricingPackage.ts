import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'pricingPackage',
  title: 'Fiyatlandırma Paketleri',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Paket Adı',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Açıklama',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'credits',
      title: 'Kredi Sayısı',
      type: 'number',
      validation: (Rule) => Rule.required().positive(),
    }),
    defineField({
      name: 'priceTRY',
      title: 'Fiyat (TRY)',
      type: 'number',
      validation: (Rule) => Rule.required().positive(),
    }),
    defineField({
      name: 'originalPriceTRY',
      title: 'Orijinal Fiyat (TRY)',
      type: 'number',
    }),
    defineField({
      name: 'priceEUR',
      title: 'Fiyat (EUR)',
      type: 'number',
      validation: (Rule) => Rule.positive(),
    }),
    defineField({
      name: 'originalPriceEUR',
      title: 'Orijinal Fiyat (EUR)',
      type: 'number',
    }),
    defineField({
      name: 'features',
      title: 'Özellikler',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'featured',
      title: 'Öne Çıkan',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'badgeText',
      title: 'Rozet Metni',
      type: 'string',
      description: 'Örn: "En Popüler", "En İyi Değer"',
    }),
    defineField({
      name: 'ctaLabel',
      title: 'Buton Metni',
      type: 'string',
      initialValue: 'Hemen Al',
    }),
    defineField({
      name: 'order',
      title: 'Sıralama',
      type: 'number',
      initialValue: 0,
    }),
    defineField({
      name: 'active',
      title: 'Aktif',
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
      subtitle: 'credits',
      priceTRY: 'priceTRY',
    },
    prepare({ title, subtitle, priceTRY }) {
      return {
        title,
        subtitle: `${subtitle} kredi - ${priceTRY} TRY`,
      }
    },
  },
})

