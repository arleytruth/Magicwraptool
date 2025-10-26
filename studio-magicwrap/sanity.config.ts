import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'MagicWrap CMS',

  projectId: 'r2yabxzn',
  dataset: 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('İçerik Yönetimi')
          .items([
            // Site Settings (Singleton)
            S.listItem()
              .title('⚙️ Site Ayarları')
              .child(
                S.document()
                  .schemaType('siteSettings')
                  .documentId('siteSettings')
              ),
            
            S.divider(),
            
            // Main Content
            S.listItem()
              .title('📝 Blog Yazıları')
              .schemaType('blogPost')
              .child(S.documentTypeList('blogPost').title('Blog Yazıları')),
            
            S.listItem()
              .title('📄 Sayfalar')
              .schemaType('page')
              .child(S.documentTypeList('page').title('Sayfalar')),
            
            S.divider(),
            
            // Marketing
            S.listItem()
              .title('💰 Fiyatlandırma Paketleri')
              .schemaType('pricingPackage')
              .child(S.documentTypeList('pricingPackage').title('Paketler')),
            
            S.listItem()
              .title('❓ SSS')
              .schemaType('faq')
              .child(S.documentTypeList('faq').title('Sık Sorulan Sorular')),
            
            S.listItem()
              .title('⭐ Müşteri Yorumları')
              .schemaType('testimonial')
              .child(S.documentTypeList('testimonial').title('Yorumlar')),
          ]),
    }),
    
    // Vision Plugin - GROQ Sorguları için
    visionTool({
      defaultApiVersion: '2024-01-01',
      defaultDataset: 'production',
    }),
  ],

  schema: {
    types: schemaTypes,
  },
})
