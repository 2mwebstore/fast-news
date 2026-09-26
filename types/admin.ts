import type { ArticleCard, ArticleDetail, ArticleStatus } from '~/types'

export interface UserRef {
  id: number
  name: string
  email: string
  avatarUrl?: string
  roleSlug: string
  roleName: string
  permissions: string[]
  author?: { id: number; slug: string; nameKh: string; nameEn?: string }
  lastLoginAt?: string
}

export interface AdminCard extends ArticleCard {
  status: ArticleStatus
  scheduledAt?: string
  updatedAt: string
  wordCount: number
  aiAssisted: boolean
}

export interface ChecklistItem {
  key: string
  label: string
  done: boolean
  required: boolean
}

export interface Checklist {
  items: ChecklistItem[]
  completed: number
  total: number
  readyToPublish: boolean
  note: string
}

/**
 * An article as the admin endpoint returns it: the public detail plus the
 * workflow status, which /api/news/:slug omits because it only ever serves
 * published articles.
 */
export interface AdminArticleDetail extends ArticleDetail {
  status: ArticleStatus
}

export interface AdminArticleResponse {
  article: AdminArticleDetail
  status: ArticleStatus
  sources: unknown[]
  checklist: Checklist
}

export interface Dashboard {
  news: {
    todayPublished: number; breaking: number; drafts: number
    reviewQueue: number; scheduled: number; totalPublished: number
  }
  traffic: { viewsToday: number; uniqueVisitorsToday: number; videoViews: number }
  ads: {
    activeAds: number; activeCampaigns: number; expiredCampaigns: number
    pendingApproval: number; impressionsToday: number; clicksToday: number; ctrToday: number
  }
  distribution: {
    telegramConfigured: boolean; telegramAutoPublish: boolean
    telegramPostsToday: number; telegramFailed: number
    pushSubscribers: number; websocketClients: number; telegramLastPostAt?: string
  }
  moderation: { pendingTips: number; pendingComments: number; openReports: number }
  system: { environment: string; serverTime: string }
}
