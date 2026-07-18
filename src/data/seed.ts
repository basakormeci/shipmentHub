export type Lang = 'tr' | 'en'
export type UserRole = 'admin' | 'operation' | 'reporting'
export type UserStatus = 'active' | 'passive'

export interface User {
  id: number
  name: string
  email: string
  role: UserRole
  status: UserStatus
  lastLogin: string
}

export type NodeType = 'store' | 'warehouse'

export interface NodeWorkingHours {
  day: number // 0=Pazartesi .. 6=Pazar
  enabled: boolean
  start: string
  end: string
  shippingDeadline: string
}

export interface NodeFulfillment {
  pickupFromStore: boolean
  pickupPoint: boolean
  shipFromStore: boolean
}

export interface StockNode {
  id: number
  name: string
  code: string
  type?: NodeType
  country?: string
  provinceId?: number
  district?: string
  address?: string
  group?: string
  dailyAssignmentLimit?: number
  workingHours?: NodeWorkingHours[]
  fulfillment?: NodeFulfillment
  contactName?: string
  contactEmail?: string
  contactPhone?: string
  contactNationalId?: string
}

export interface NodeUsage {
  companyId: number
  companyName: string
  credentialName: string
  contractId: number
  contractName: string
  contractStatus: 'active' | 'passive'
}

export const AUTH_PASSWORD = 'basakharikadir'

export const USER_ROLES: Record<UserRole, { label: string; badge: string }> = {
  admin: { label: 'Sistem Yöneticisi', badge: 'badge-danger' },
  operation: { label: 'Operasyon Kullanıcısı', badge: 'badge-info' },
  reporting: { label: 'Raporlama Kullanıcısı', badge: 'badge-passive' },
}

export const SEED_USERS: User[] = [
  { id: 1, name: 'Basak', email: 'basak@omnitive.com', role: 'admin', status: 'active', lastLogin: '2026-07-06T09:12:00' },
  { id: 2, name: 'Kemal', email: 'kemal@omnitive.com', role: 'operation', status: 'active', lastLogin: '2026-07-06T08:40:00' },
  { id: 3, name: 'Berkay', email: 'berkay@omnitive.com', role: 'operation', status: 'active', lastLogin: '2026-07-05T18:22:00' },
  { id: 4, name: 'Seyma', email: 'seyma@omnitive.com', role: 'reporting', status: 'active', lastLogin: '2026-07-04T13:05:00' },
  { id: 5, name: 'Caner', email: 'caner@omnitive.com', role: 'operation', status: 'active', lastLogin: '2026-06-18T10:00:00' },
]

export const SEED_NODES: StockNode[] = [
  { id: 1, name: 'İstanbul Ana Depo', code: 'IST001' },
  { id: 2, name: 'İstanbul Anadolu', code: 'IST002' },
  { id: 3, name: 'Ankara Merkez', code: 'ANK001' },
  { id: 4, name: 'Ankara Ostim', code: 'ANK002' },
  { id: 5, name: 'İzmir Depo', code: 'IZM001' },
  { id: 6, name: 'Bursa Depo', code: 'BRS001' },
  { id: 7, name: 'Antalya Merkez', code: 'ANT001' },
  { id: 8, name: 'Adana Depo', code: 'ADA001' },
  { id: 9, name: 'Gaziantep Merkez', code: 'GAZ001' },
  { id: 10, name: 'Konya Depo', code: 'KNY001' },
  { id: 11, name: 'Kayseri Depo', code: 'KYS001' },
  { id: 12, name: 'Trabzon Merkez', code: 'TRB001' },
  { id: 13, name: 'Diyarbakır Depo', code: 'DYB001' },
  { id: 14, name: 'Samsun Depo', code: 'SMS001' },
  { id: 15, name: 'Kocaeli Depo', code: 'KOC001' },
]
