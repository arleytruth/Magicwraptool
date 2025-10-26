import type { StructureResolver } from 'sanity/structure'

const documentTypePriority = ['page']

export const structure: StructureResolver = (S) => {
  const defaultItems = S.documentTypeListItems().filter(
    (listItem) => !documentTypePriority.includes(listItem.getId() || ''),
  )

  return S.list()
    .title('İçerik')
    .items([
      S.listItem()
        .title('Sayfalar')
        .child(
          S.list()
            .title('Sayfa Durumu')
            .items([
              S.listItem()
                .title('Yayınlanan sayfalar')
                .child(
                  S.documentList()
                    .title('Yayınlanan')
                    .filter('_type == "page" && published == true && coalesce(archived, false) == false')
                    .defaultOrdering([{ field: 'navOrder', direction: 'asc' }]),
                ),
              S.listItem()
                .title('Taslaklar')
                .child(
                  S.documentList()
                    .title('Taslaklar')
                    .filter('_type == "page" && published != true && coalesce(archived, false) == false')
                    .defaultOrdering([{ field: '_createdAt', direction: 'desc' }]),
                ),
              S.listItem()
                .title('Arşivlenmiş')
                .child(
                  S.documentList()
                    .title('Arşivlenmiş Sayfalar')
                    .filter('_type == "page" && coalesce(archived, false) == true')
                    .defaultOrdering([{ field: '_updatedAt', direction: 'desc' }]),
                ),
            ]),
        ),
      ...defaultItems,
    ])
}
