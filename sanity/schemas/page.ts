import { defineType, defineField, defineArrayMember } from 'sanity'

const linkFieldFields = [
  defineField({
    name: 'label',
    title: 'Etiket',
    type: 'string',
    validation: (Rule) => Rule.required(),
  }),
  defineField({
    name: 'href',
    title: 'URL',
    type: 'string',
    validation: (Rule) => Rule.required(),
  }),
  defineField({
    name: 'openInNewTab',
    title: 'Yeni sekmede aç',
    type: 'boolean',
    initialValue: false,
  }),
]

const linkField = {
  name: 'link',
  title: 'Bağlantı',
  type: 'object',
  fields: linkFieldFields,
  preview: {
    select: {
      title: 'label',
      subtitle: 'href',
    },
  },
}

export default defineType({
  name: 'page',
  title: 'Sayfalar',
  type: 'document',
  groups: [
    { name: 'content', title: 'İçerik', default: true },
    { name: 'navigation', title: 'Navigasyon' },
    { name: 'seo', title: 'SEO' },
    { name: 'form', title: 'Form' },
    { name: 'settings', title: 'Ayarlar' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Sayfa Başlığı',
      type: 'string',
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'navigation',
      options: {
        source: 'title',
        maxLength: 96,
        isUnique: (value, context) => context.defaultIsUnique(value, context),
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'hero',
      title: 'Hero Bölümü',
      type: 'object',
      group: 'content',
      fields: [
        defineField({
          name: 'enabled',
          title: 'Hero bölümünü göster',
          type: 'boolean',
          initialValue: true,
        }),
        defineField({
          name: 'eyebrow',
          title: 'Üst Başlık',
          type: 'string',
        }),
        defineField({
          name: 'heading',
          title: 'Başlık',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'subheading',
          title: 'Alt Başlık',
          type: 'text',
          rows: 3,
        }),
        defineField({
          name: 'primaryCta',
          title: 'Birincil CTA',
          type: 'object',
          fields: [
            defineField({
              name: 'label',
              title: 'Etiket',
              type: 'string',
            }),
            defineField({
              name: 'href',
              title: 'URL',
              type: 'string',
            }),
          ],
        }),
        defineField({
          name: 'secondaryCta',
          title: 'İkincil CTA',
          type: 'object',
          fields: [
            defineField({
              name: 'label',
              title: 'Etiket',
              type: 'string',
            }),
            defineField({
              name: 'href',
              title: 'URL',
              type: 'string',
            }),
          ],
        }),
        defineField({
          name: 'media',
          title: 'Görsel',
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({
              name: 'alt',
              title: 'Alternatif Metin',
              type: 'string',
            }),
          ],
        }),
        defineField({
          name: 'backgroundStyle',
          title: 'Arka Plan Stili',
          type: 'string',
          initialValue: 'muted',
          options: {
            list: [
              { title: 'Varsayılan', value: 'muted' },
              { title: 'Açık', value: 'light' },
              { title: 'Koyu', value: 'dark' },
            ],
            layout: 'radio',
          },
        }),
      ],
      preview: {
        select: {
          title: 'heading',
          subtitle: 'subheading',
          media: 'media',
        },
      },
    }),
    defineField({
      name: 'content',
      title: 'İçerik Bölümleri',
      type: 'array',
      group: 'content',
      validation: (Rule) => Rule.min(1),
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H1', value: 'h1' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
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
                  defineField({
                    name: 'href',
                    title: 'URL',
                    type: 'url',
                    validation: (Rule) => Rule.required(),
                  }),
                  defineField({
                    name: 'openInNewTab',
                    title: 'Yeni sekmede aç',
                    type: 'boolean',
                    initialValue: false,
                  }),
                ],
              },
            ],
          },
        },
        defineArrayMember({
          name: 'ctaSection',
          title: 'CTA Bölümü',
          type: 'object',
          fields: [
            defineField({
              name: 'badge',
              title: 'Küçük Başlık',
              type: 'string',
            }),
            defineField({
              name: 'heading',
              title: 'Başlık',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'body',
              title: 'Açıklama',
              type: 'text',
              rows: 4,
            }),
            defineField({
              name: 'alignment',
              title: 'Hizalama',
              type: 'string',
              initialValue: 'center',
              options: {
                list: [
                  { title: 'Sola yasla', value: 'left' },
                  { title: 'Ortala', value: 'center' },
                  { title: 'Sağa yasla', value: 'right' },
                ],
                layout: 'radio',
              },
            }),
            defineField({
              name: 'background',
              title: 'Arka Plan',
              type: 'string',
              initialValue: 'subtle',
              options: {
                list: [
                  { title: 'Yumuşak', value: 'subtle' },
                  { title: 'Vurgulu', value: 'accent' },
                  { title: 'Koyu', value: 'dark' },
                ],
                layout: 'radio',
              },
            }),
            defineField({
              name: 'primaryCta',
              title: 'Birincil CTA',
              type: 'object',
              fields: [
                defineField({
                  name: 'label',
                  title: 'Etiket',
                  type: 'string',
                }),
                defineField({
                  name: 'href',
                  title: 'URL',
                  type: 'string',
                }),
              ],
            }),
            defineField({
              name: 'secondaryCta',
              title: 'İkincil CTA',
              type: 'object',
              fields: [
                defineField({
                  name: 'label',
                  title: 'Etiket',
                  type: 'string',
                }),
                defineField({
                  name: 'href',
                  title: 'URL',
                  type: 'string',
                }),
              ],
            }),
          ],
          preview: {
            select: {
              title: 'heading',
              subtitle: 'primaryCta.label',
            },
            prepare({ title, subtitle }) {
              return {
                title: title || 'CTA Bölümü',
                subtitle: subtitle ? `CTA: ${subtitle}` : undefined,
              }
            },
          },
        }),
        defineArrayMember({
          name: 'mediaBlock',
          title: 'Görsel & Metin',
          type: 'object',
          fields: [
            defineField({
              name: 'layout',
              title: 'Yerleşim',
              type: 'string',
              initialValue: 'imageRight',
              options: {
                list: [
                  { title: 'Görsel Sağda', value: 'imageRight' },
                  { title: 'Görsel Solda', value: 'imageLeft' },
                ],
                layout: 'radio',
              },
            }),
            defineField({
              name: 'title',
              title: 'Başlık',
              type: 'string',
            }),
            defineField({
              name: 'body',
              title: 'Açıklama',
              type: 'text',
              rows: 4,
            }),
            defineField({
              name: 'image',
              title: 'Görsel',
              type: 'image',
              options: { hotspot: true },
              fields: [
                defineField({
                  name: 'alt',
                  title: 'Alternatif Metin',
                  type: 'string',
                }),
              ],
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {
              title: 'title',
              media: 'image',
            },
            prepare({ title, media }) {
              return {
                title: title || 'Görsel & Metin',
                media,
              }
            },
          },
        }),
        defineArrayMember({
          name: 'linkList',
          title: 'Bağlantı Listesi',
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Başlık',
              type: 'string',
            }),
            defineField({
              name: 'layout',
              title: 'Görünüm',
              type: 'string',
              initialValue: 'list',
              options: {
                list: [
                  { title: 'Liste', value: 'list' },
                  { title: 'Kart Izgara', value: 'grid' },
                ],
                layout: 'radio',
              },
            }),
            defineField({
              name: 'items',
              title: 'Bağlantılar',
              type: 'array',
              of: [
                defineArrayMember({
                  name: 'linkItem',
                  title: 'Bağlantı',
                  type: 'object',
                  fields: [
                    ...linkFieldFields,
                    defineField({
                      name: 'description',
                      title: 'Açıklama',
                      type: 'text',
                      rows: 3,
                    }),
                  ],
                }),
              ],
              validation: (Rule) => Rule.min(1),
            }),
          ],
          preview: {
            select: {
              title: 'title',
              count: 'items.length',
            },
            prepare({ title, count }) {
              return {
                title: title || 'Bağlantı Listesi',
                subtitle: count ? `${count} bağlantı` : undefined,
              }
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'navigationLinks',
      title: 'Sayfa içi bağlantılar',
      type: 'array',
      group: 'navigation',
      of: [defineArrayMember(linkField)],
    }),
    defineField({
      name: 'showInNav',
      title: 'Üst menüde göster',
      type: 'boolean',
      group: 'navigation',
      initialValue: false,
    }),
    defineField({
      name: 'navLabel',
      title: 'Menü Etiketi',
      type: 'string',
      group: 'navigation',
      hidden: ({ document }) => !document?.showInNav,
    }),
    defineField({
      name: 'navOrder',
      title: 'Menü Sırası',
      type: 'number',
      group: 'navigation',
      initialValue: 0,
      hidden: ({ document }) => !document?.showInNav,
    }),
    defineField({
      name: 'seo',
      title: 'SEO Ayarları',
      type: 'object',
      group: 'seo',
      fields: [
        defineField({
          name: 'metaTitle',
          title: 'Meta Başlık',
          type: 'string',
          description: '60 karakteri geçmemeye çalışın.',
          validation: (Rule) => Rule.max(60),
        }),
        defineField({
          name: 'metaDescription',
          title: 'Meta Açıklama',
          type: 'text',
          rows: 4,
          description: 'Arama sonuçları için 150-160 karakter idealdir.',
          validation: (Rule) => Rule.max(160),
        }),
        defineField({
          name: 'ogImage',
          title: 'Sosyal Paylaşım Görseli',
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({
              name: 'alt',
              title: 'Alternatif Metin',
              type: 'string',
            }),
          ],
        }),
        defineField({
          name: 'noIndex',
          title: 'Arama motorlarında indeksleme',
          description: 'Eğer işaretlenirse sayfa arama motorlarında gizlenir.',
          type: 'boolean',
          initialValue: false,
        }),
      ],
    }),
    defineField({
      name: 'form',
      title: 'Form Ayarları',
      type: 'object',
      group: 'form',
      fields: [
        defineField({
          name: 'enabled',
          title: 'Formu etkinleştir',
          type: 'boolean',
          initialValue: false,
        }),
        defineField({
          name: 'title',
          title: 'Form Başlığı',
          type: 'string',
          hidden: ({ parent }) => !parent?.enabled,
        }),
        defineField({
          name: 'description',
          title: 'Form Açıklaması',
          type: 'text',
          rows: 3,
          hidden: ({ parent }) => !parent?.enabled,
        }),
        defineField({
          name: 'endpoint',
          title: 'Form gönderim URL\'si',
          description: 'Form verilerinin gönderileceği URL (örn. webhook, Formspree, Netlify vb.)',
          type: 'url',
          hidden: ({ parent }) => !parent?.enabled,
        }),
        defineField({
          name: 'submitLabel',
          title: 'Buton Etiketi',
          type: 'string',
          initialValue: 'Gönder',
          hidden: ({ parent }) => !parent?.enabled,
        }),
        defineField({
          name: 'successMessage',
          title: 'Başarı Mesajı',
          type: 'text',
          rows: 2,
          hidden: ({ parent }) => !parent?.enabled,
        }),
        defineField({
          name: 'fields',
          title: 'Form Alanları',
          type: 'array',
          hidden: ({ parent }) => !parent?.enabled,
          of: [
            defineArrayMember({
              name: 'formField',
              title: 'Form Alanı',
              type: 'object',
              fields: [
                defineField({
                  name: 'name',
                  title: 'Alan Anahtarı',
                  type: 'string',
                  description: 'Tekil ve İngilizce/URL uyumlu bir anahtar girin. (örn. email, fullName)',
                  validation: (Rule) => Rule.required(),
                }),
                defineField({
                  name: 'label',
                  title: 'Etiket',
                  type: 'string',
                  validation: (Rule) => Rule.required(),
                }),
                defineField({
                  name: 'type',
                  title: 'Alan Tipi',
                  type: 'string',
                  initialValue: 'text',
                  options: {
                    list: [
                      { title: 'Metin', value: 'text' },
                      { title: 'E-posta', value: 'email' },
                      { title: 'Telefon', value: 'tel' },
                      { title: 'Textarea', value: 'textarea' },
                      { title: 'Seçim', value: 'select' },
                    ],
                    layout: 'radio',
                  },
                }),
                defineField({
                  name: 'placeholder',
                  title: 'Placeholder',
                  type: 'string',
                }),
                defineField({
                  name: 'options',
                  title: 'Seçenekler',
                  description: 'Seçim alanı için seçenekler (her satırda bir seçenek).',
                  type: 'array',
                  of: [{ type: 'string' }],
                  hidden: ({ parent }) => parent?.type !== 'select',
                  validation: (Rule) =>
                    Rule.custom((options, context) => {
                      const parent = context?.parent as { type?: string } | undefined;
                      if (parent?.type === 'select' && (!options || options.length === 0)) {
                        return 'Seçim alanı için en az bir seçenek ekleyin.'
                      }
                      return true
                    }),
                }),
                defineField({
                  name: 'required',
                  title: 'Zorunlu',
                  type: 'boolean',
                  initialValue: true,
                }),
              ],
              preview: {
                select: {
                  title: 'label',
                  subtitle: 'type',
                },
                prepare({ title, subtitle }) {
                  return {
                    title: title || 'Form Alanı',
                    subtitle: subtitle ? `Tip: ${subtitle}` : undefined,
                  }
                },
              },
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'published',
      title: 'Yayında',
      type: 'boolean',
      group: 'settings',
      initialValue: false,
    }),
    defineField({
      name: 'archived',
      title: 'Arşivlenmiş',
      type: 'boolean',
      group: 'settings',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'slug.current',
      media: 'hero.media',
    },
  },
})
