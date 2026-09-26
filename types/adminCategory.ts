export interface AdminCategory {
  id: number
  slug: string
  nameKh: string
  nameEn: string
  inNav: boolean
  parentNameKh?: string
  parentNameEn?: string
  articleCount: number
}
