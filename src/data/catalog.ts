/* Auto-derived seed catalog from archive/shipment-hub.html */
export const COMPANIES = [
  {
    "id": 1,
    "name": "Yurtiçi Kargo",
    "fields": [
      "password",
      "apiKey"
    ]
  },
  {
    "id": 2,
    "name": "Aras Kargo",
    "fields": [
      "customerId",
      "apiKey"
    ]
  },
  {
    "id": 3,
    "name": "MNG Kargo",
    "fields": [
      "password"
    ]
  },
  {
    "id": 4,
    "name": "PTT Kargo",
    "fields": [
      "apiKey"
    ]
  },
  {
    "id": 5,
    "name": "Sürat Kargo",
    "fields": [
      "password",
      "apiKey"
    ]
  },
  {
    "id": 6,
    "name": "DHL eCommerce",
    "fields": [
      "password",
      "apiKey"
    ]
  },
  {
    "id": 7,
    "name": "Horoz Lojistik",
    "fields": [
      "customerId",
      "apiKey"
    ]
  },
  {
    "id": 8,
    "name": "Hepsijet",
    "fields": [
      "password"
    ]
  },
  {
    "id": 9,
    "name": "Kolay Gelsin",
    "fields": [
      "apiKey"
    ]
  },
  {
    "id": 10,
    "name": "Ceva Tedarik Zinciri",
    "fields": [
      "customerId",
      "apiKey"
    ]
  },
  {
    "id": 11,
    "name": "PointPost",
    "fields": [
      "apiKey"
    ]
  },
  {
    "id": 12,
    "name": "KuryeNet",
    "fields": [
      "password",
      "apiKey"
    ]
  },
  {
    "id": 13,
    "name": "Digital Kurye",
    "fields": [
      "apiKey"
    ]
  }
] as const

export type Company = (typeof COMPANIES)[number]

export const SHIPMENT_STATUS = {
  preparing: { badge: 'badge-warning' },
  in_transit: { badge: 'badge-info' },
  delivered: { badge: 'badge-active' },
  returned: { badge: 'badge-passive' },
  cancelled: { badge: 'badge-danger' },
  recalled: { badge: 'badge-danger' },
} as const

export type ShipmentStatus = keyof typeof SHIPMENT_STATUS

export const STATUS_CHART_COLORS: Record<ShipmentStatus, string> = {
  preparing: '#fa7319',
  in_transit: '#335cff',
  delivered: '#1fc16b',
  returned: '#94a0b4',
  cancelled: '#fb3748',
  recalled: '#ad1f2b',
}

export interface Shipment {
  id: number
  shipmentNo: number
  orderNo: number
  companyId: number
  trackingNo: string
  shipFrom: string
  shipTo: { district: string; province: string }
  shipTime: string
  status: ShipmentStatus
  cargoType: 'order' | 'return'
  referenceId: string
  packageNo: string
  customerName: string
  channel: string
  deliveryNote?: string
}

export const SEED_SHIPMENTS: Shipment[] = [
  {
    "id": 1,
    "shipmentNo": 8200145,
    "orderNo": 61234501,
    "companyId": 1,
    "trackingNo": "YK-2026-0091823-TR",
    "shipFrom": "İstanbul Ana Depo",
    "shipTo": {
      "district": "Kadıköy",
      "province": "İstanbul"
    },
    "shipTime": "2026-07-02T09:15:00",
    "status": "in_transit",
    "cargoType": "order",
    "referenceId": "REF-77812",
    "packageNo": "PKT-000145",
    "customerName": "Elif Yıldız",
    "channel": "Trendyol"
  },
  {
    "id": 2,
    "shipmentNo": 8200146,
    "orderNo": 61234502,
    "companyId": 2,
    "trackingNo": "ARAS-778812934",
    "shipFrom": "İzmir Depo",
    "shipTo": {
      "district": "Bornova",
      "province": "İzmir"
    },
    "shipTime": "2026-07-02T08:40:00",
    "status": "delivered",
    "cargoType": "order",
    "referenceId": "REF-77813",
    "packageNo": "PKT-000146",
    "customerName": "Mehmet Kaya",
    "channel": "Hepsiburada"
  },
  {
    "id": 3,
    "shipmentNo": 8200147,
    "orderNo": 61234503,
    "companyId": 3,
    "trackingNo": "MNG-2026556781",
    "shipFrom": "Bursa Depo",
    "shipTo": {
      "district": "Nilüfer",
      "province": "Bursa"
    },
    "shipTime": "2026-07-01T16:22:00",
    "status": "preparing",
    "cargoType": "order",
    "referenceId": "REF-77814",
    "packageNo": "PKT-000147",
    "customerName": "Ayşe Demir",
    "channel": "Kendi Web Sitesi"
  },
  {
    "id": 4,
    "shipmentNo": 8200148,
    "orderNo": 61234504,
    "companyId": 6,
    "trackingNo": "DHL-99001827734",
    "shipFrom": "Ankara Merkez",
    "shipTo": {
      "district": "Çankaya",
      "province": "Ankara"
    },
    "shipTime": "2026-07-01T11:05:00",
    "status": "in_transit",
    "cargoType": "order",
    "referenceId": "REF-77815",
    "packageNo": "PKT-000148",
    "customerName": "Burak Şahin",
    "channel": "N11"
  },
  {
    "id": 5,
    "shipmentNo": 8200149,
    "orderNo": 61234505,
    "companyId": 7,
    "trackingNo": "HRZ-2026-441209",
    "shipFrom": "İstanbul Anadolu",
    "shipTo": {
      "district": "Pendik",
      "province": "İstanbul"
    },
    "shipTime": "2026-06-30T14:50:00",
    "status": "delivered",
    "cargoType": "return",
    "referenceId": "REF-77816",
    "packageNo": "PKT-000149",
    "customerName": "Zeynep Arslan",
    "channel": "Trendyol"
  },
  {
    "id": 6,
    "shipmentNo": 8200150,
    "orderNo": 61234506,
    "companyId": 8,
    "trackingNo": "HPJ-778123456",
    "shipFrom": "İstanbul Anadolu",
    "shipTo": {
      "district": "Üsküdar",
      "province": "İstanbul"
    },
    "shipTime": "2026-06-30T10:12:00",
    "status": "cancelled",
    "cargoType": "order",
    "referenceId": "REF-77817",
    "packageNo": "PKT-000150",
    "customerName": "Can Öztürk",
    "channel": "Hepsiburada"
  },
  {
    "id": 7,
    "shipmentNo": 8200151,
    "orderNo": 61234507,
    "companyId": 4,
    "trackingNo": "PTT-2026-0093451",
    "shipFrom": "Konya Depo",
    "shipTo": {
      "district": "Selçuklu",
      "province": "Konya"
    },
    "shipTime": "2026-06-29T13:30:00",
    "status": "in_transit",
    "cargoType": "order",
    "referenceId": "REF-77818",
    "packageNo": "PKT-000151",
    "customerName": "Fatma Çelik",
    "channel": "Kendi Web Sitesi"
  },
  {
    "id": 8,
    "shipmentNo": 8200152,
    "orderNo": 61234508,
    "companyId": 5,
    "trackingNo": "SRT-88213456",
    "shipFrom": "Adana Depo",
    "shipTo": {
      "district": "Seyhan",
      "province": "Adana"
    },
    "shipTime": "2026-06-29T09:05:00",
    "status": "delivered",
    "cargoType": "order",
    "referenceId": "REF-77819",
    "packageNo": "PKT-000152",
    "customerName": "Emre Aydın",
    "channel": "N11"
  },
  {
    "id": 9,
    "shipmentNo": 8200153,
    "orderNo": 61234509,
    "companyId": 1,
    "trackingNo": "YK-2026-0091999-TR",
    "shipFrom": "İstanbul Ana Depo",
    "shipTo": {
      "district": "Beşiktaş",
      "province": "İstanbul"
    },
    "shipTime": "2026-06-28T17:40:00",
    "status": "returned",
    "cargoType": "return",
    "referenceId": "REF-77820",
    "packageNo": "PKT-000153",
    "customerName": "Selin Koç",
    "channel": "Trendyol"
  },
  {
    "id": 10,
    "shipmentNo": 8200154,
    "orderNo": 61234510,
    "companyId": 2,
    "trackingNo": "ARAS-778812999",
    "shipFrom": "İzmir Depo",
    "shipTo": {
      "district": "Karşıyaka",
      "province": "İzmir"
    },
    "shipTime": "2026-06-28T12:15:00",
    "status": "preparing",
    "cargoType": "order",
    "referenceId": "REF-77821",
    "packageNo": "PKT-000154",
    "customerName": "Onur Yavuz",
    "channel": "Hepsiburada"
  },
  {
    "id": 11,
    "shipmentNo": 8200155,
    "orderNo": 61234511,
    "companyId": 6,
    "trackingNo": "DHL-99001899234",
    "shipFrom": "Gaziantep Merkez",
    "shipTo": {
      "district": "Şahinbey",
      "province": "Gaziantep"
    },
    "shipTime": "2026-06-27T15:00:00",
    "status": "in_transit",
    "cargoType": "order",
    "referenceId": "REF-77822",
    "packageNo": "PKT-000155",
    "customerName": "Deniz Polat",
    "channel": "Kendi Web Sitesi"
  },
  {
    "id": 12,
    "shipmentNo": 8200156,
    "orderNo": 61234512,
    "companyId": 3,
    "trackingNo": "MNG-2026559981",
    "shipFrom": "Kayseri Depo",
    "shipTo": {
      "district": "Melikgazi",
      "province": "Kayseri"
    },
    "shipTime": "2026-06-27T08:20:00",
    "status": "delivered",
    "cargoType": "order",
    "referenceId": "REF-77823",
    "packageNo": "PKT-000156",
    "customerName": "Gizem Er",
    "channel": "N11"
  },
  {
    "id": 13,
    "shipmentNo": 8200157,
    "orderNo": 61234513,
    "companyId": 7,
    "trackingNo": "HRZ-2026-449912",
    "shipFrom": "İstanbul Anadolu",
    "shipTo": {
      "district": "Kartal",
      "province": "İstanbul"
    },
    "shipTime": "2026-06-26T10:45:00",
    "status": "delivered",
    "cargoType": "order",
    "referenceId": "REF-77824",
    "packageNo": "PKT-000157",
    "customerName": "Kerem Doğan",
    "channel": "Trendyol"
  },
  {
    "id": 14,
    "shipmentNo": 8200158,
    "orderNo": 61234514,
    "companyId": 8,
    "trackingNo": "HPJ-778199887",
    "shipFrom": "İstanbul Anadolu",
    "shipTo": {
      "district": "Ataşehir",
      "province": "İstanbul"
    },
    "shipTime": "2026-06-25T19:10:00",
    "status": "cancelled",
    "cargoType": "return",
    "referenceId": "REF-77825",
    "packageNo": "PKT-000158",
    "customerName": "Aslı Kurt",
    "channel": "Hepsiburada"
  },
  {
    "id": 15,
    "shipmentNo": 8200159,
    "orderNo": 61234515,
    "companyId": 4,
    "trackingNo": "PTT-2026-0093998",
    "shipFrom": "Diyarbakır Depo",
    "shipTo": {
      "district": "Bağlar",
      "province": "Diyarbakır"
    },
    "shipTime": "2026-06-24T11:35:00",
    "status": "in_transit",
    "cargoType": "order",
    "referenceId": "REF-77826",
    "packageNo": "PKT-000159",
    "customerName": "Yusuf Aksoy",
    "channel": "Kendi Web Sitesi"
  },
  {
    "id": 16,
    "shipmentNo": 8200160,
    "orderNo": 61234516,
    "companyId": 5,
    "trackingNo": "SRT-88219981",
    "shipFrom": "Antalya Merkez",
    "shipTo": {
      "district": "Muratpaşa",
      "province": "Antalya"
    },
    "shipTime": "2026-06-23T14:00:00",
    "status": "delivered",
    "cargoType": "order",
    "referenceId": "REF-77827",
    "packageNo": "PKT-000160",
    "customerName": "Pınar Şen",
    "channel": "Trendyol"
  },
  {
    "id": 17,
    "shipmentNo": 8200161,
    "orderNo": 61234517,
    "companyId": 1,
    "trackingNo": "YK-2026-0092456-TR",
    "shipFrom": "Ankara Merkez",
    "shipTo": {
      "district": "Keçiören",
      "province": "Ankara"
    },
    "shipTime": "2026-06-22T09:50:00",
    "status": "preparing",
    "cargoType": "order",
    "referenceId": "REF-77828",
    "packageNo": "PKT-000161",
    "customerName": "Hakan Uçar",
    "channel": "N11"
  },
  {
    "id": 18,
    "shipmentNo": 8200162,
    "orderNo": 61234518,
    "companyId": 2,
    "trackingNo": "ARAS-778899214",
    "shipFrom": "İstanbul Ana Depo",
    "shipTo": {
      "district": "Şişli",
      "province": "İstanbul"
    },
    "shipTime": "2026-06-21T16:25:00",
    "status": "delivered",
    "cargoType": "return",
    "referenceId": "REF-77829",
    "packageNo": "PKT-000162",
    "customerName": "Merve Bulut",
    "channel": "Hepsiburada"
  }
]

export const RETURN_REASONS: Record<string, string> = {
  begenmedim: 'Beğenmedim / Vazgeçtim',
  yanlis_urun: 'Yanlış Ürün Gönderildi',
  kusurlu: 'Kusurlu / Hasarlı Ürün',
  degisim: 'Değişim Talebi',
  diger: 'Diğer',
}

export type ReturnStatus = 'requested' | 'picked_up' | 'in_warehouse' | 'completed' | 'cancelled' | 'recalled'

export const RETURN_STATUS: Record<ReturnStatus, { badge: string }> = {
  requested: { badge: 'badge-info' },
  picked_up: { badge: 'badge-warning' },
  in_warehouse: { badge: 'badge-passive' },
  completed: { badge: 'badge-active' },
  cancelled: { badge: 'badge-danger' },
  recalled: { badge: 'badge-danger' },
}

export interface ReturnItem {
  id: number
  returnNo: number
  originalShipmentId: number
  reason: string
  status: ReturnStatus
  requestDate: string
  pickup: boolean
  note: string
  companyId?: number
  pickupAddress?: { district: string; province: string }
}

export const SEED_RETURNS: ReturnItem[] = [
  {
    "id": 1,
    "returnNo": 9300145,
    "originalShipmentId": 5,
    "reason": "begenmedim",
    "status": "completed",
    "requestDate": "2026-07-01T10:00:00",
    "pickup": true,
    "note": ""
  },
  {
    "id": 2,
    "returnNo": 9300146,
    "originalShipmentId": 9,
    "reason": "kusurlu",
    "status": "in_warehouse",
    "requestDate": "2026-07-02T11:30:00",
    "pickup": true,
    "note": "Ürün kırık geldi."
  },
  {
    "id": 3,
    "returnNo": 9300147,
    "originalShipmentId": 14,
    "reason": "yanlis_urun",
    "status": "picked_up",
    "requestDate": "2026-07-03T09:15:00",
    "pickup": true,
    "note": ""
  },
  {
    "id": 4,
    "returnNo": 9300148,
    "originalShipmentId": 18,
    "reason": "degisim",
    "status": "requested",
    "requestDate": "2026-07-04T14:20:00",
    "pickup": false,
    "note": "Beden değişimi istiyor."
  },
  {
    "id": 5,
    "returnNo": 9300149,
    "originalShipmentId": 2,
    "reason": "begenmedim",
    "status": "requested",
    "requestDate": "2026-07-05T16:45:00",
    "pickup": true,
    "note": ""
  },
  {
    "id": 6,
    "returnNo": 9300150,
    "originalShipmentId": 8,
    "reason": "diger",
    "status": "cancelled",
    "requestDate": "2026-06-29T08:00:00",
    "pickup": true,
    "note": "Müşteri vazgeçti."
  }
]

export type TransferStatus = 'preparing' | 'in_transit' | 'delivered' | 'cancelled' | 'recalled'

export const TRANSFER_STATUS: Record<TransferStatus, { badge: string }> = {
  preparing: { badge: 'badge-warning' },
  in_transit: { badge: 'badge-info' },
  delivered: { badge: 'badge-active' },
  cancelled: { badge: 'badge-danger' },
  recalled: { badge: 'badge-danger' },
}

export interface TransferItem {
  id: number
  transferNo: number
  fromNodeId: number
  toNodeId: number
  companyId: number
  trackingNo: string
  status: TransferStatus
  desi: number
  note: string
  createdAt: string
}

export const SEED_TRANSFERS: TransferItem[] = [
  {
    id: 1,
    transferNo: 7100201,
    fromNodeId: 1,
    toNodeId: 3,
    companyId: 1,
    trackingNo: 'YK-TR-2026-000201',
    status: 'in_transit',
    desi: 22,
    note: '',
    createdAt: '2026-07-05T09:30:00',
  },
  {
    id: 2,
    transferNo: 7100202,
    fromNodeId: 5,
    toNodeId: 6,
    companyId: 2,
    trackingNo: 'ARAS-TR-778234',
    status: 'delivered',
    desi: 14,
    note: '',
    createdAt: '2026-07-03T11:00:00',
  },
  {
    id: 3,
    transferNo: 7100203,
    fromNodeId: 3,
    toNodeId: 4,
    companyId: 3,
    trackingNo: 'MNG-TR-2026771',
    status: 'preparing',
    desi: 30,
    note: 'Acil sevkiyat',
    createdAt: '2026-07-06T08:15:00',
  },
  {
    id: 4,
    transferNo: 7100204,
    fromNodeId: 7,
    toNodeId: 8,
    companyId: 5,
    trackingNo: 'SRT-TR-882341',
    status: 'cancelled',
    desi: 18,
    note: '',
    createdAt: '2026-07-02T14:40:00',
  },
]

export interface RoutingRule {
  id: number
  name: string
  priority: number
  active: boolean
  conditions: { minDesi: number; maxDesi: number; provinceIds: number[]; minAmount: number | ''; maxAmount: number | '' }
  primaryCompanyId: number
  failoverCompanyId: number | null
}

export const SEED_ROUTING_RULES: RoutingRule[] = [
  {
    "id": 1,
    "name": "İstanbul İçi Ekonomik",
    "priority": 1,
    "active": true,
    "conditions": {
      "minDesi": 0,
      "maxDesi": 10,
      "provinceIds": [
        1
      ],
      "minAmount": "",
      "maxAmount": ""
    },
    "primaryCompanyId": 8,
    "failoverCompanyId": 1
  },
  {
    "id": 2,
    "name": "Yüksek Desi - Ağır Kargo",
    "priority": 2,
    "active": true,
    "conditions": {
      "minDesi": 30,
      "maxDesi": 999,
      "provinceIds": [],
      "minAmount": "",
      "maxAmount": ""
    },
    "primaryCompanyId": 7,
    "failoverCompanyId": 10
  },
  {
    "id": 3,
    "name": "Yüksek Tutarlı Siparişler",
    "priority": 3,
    "active": true,
    "conditions": {
      "minDesi": 0,
      "maxDesi": 999,
      "provinceIds": [],
      "minAmount": 2000,
      "maxAmount": ""
    },
    "primaryCompanyId": 6,
    "failoverCompanyId": 2
  },
  {
    "id": 4,
    "name": "Ege Bölgesi Standart",
    "priority": 4,
    "active": true,
    "conditions": {
      "minDesi": 0,
      "maxDesi": 30,
      "provinceIds": [
        3
      ],
      "minAmount": "",
      "maxAmount": ""
    },
    "primaryCompanyId": 2,
    "failoverCompanyId": 5
  },
  {
    "id": 5,
    "name": "Genel Varsayılan",
    "priority": 5,
    "active": true,
    "conditions": {
      "minDesi": 0,
      "maxDesi": 999,
      "provinceIds": [],
      "minAmount": "",
      "maxAmount": ""
    },
    "primaryCompanyId": 1,
    "failoverCompanyId": 3
  }
]

export interface RoutingHistoryItem {
  id: number
  time: string
  action: string
  ruleName: string
  detail: string
}

export const SEED_ROUTING_HISTORY: RoutingHistoryItem[] = [
  {
    "id": 1,
    "time": "2026-06-20T09:00:00",
    "action": "created",
    "ruleName": "Genel Varsayılan",
    "detail": "Kural oluşturuldu."
  },
  {
    "id": 2,
    "time": "2026-06-25T14:30:00",
    "action": "updated",
    "ruleName": "İstanbul İçi Ekonomik",
    "detail": "Birincil taşıyıcı değiştirildi."
  },
  {
    "id": 3,
    "time": "2026-07-01T11:15:00",
    "action": "toggled",
    "ruleName": "Ege Bölgesi Standart",
    "detail": "Kural pasife alındı."
  }
]

export interface CarrierPricing {
  id: number
  companyId: number
  minDesi: number
  maxDesi: number
  price: number
}

export const SEED_CARRIER_PRICING: CarrierPricing[] = [
  {
    "id": 1,
    "companyId": 1,
    "minDesi": 0,
    "maxDesi": 10,
    "price": 45
  },
  {
    "id": 2,
    "companyId": 1,
    "minDesi": 11,
    "maxDesi": 30,
    "price": 75
  },
  {
    "id": 3,
    "companyId": 1,
    "minDesi": 31,
    "maxDesi": 999,
    "price": 120
  },
  {
    "id": 4,
    "companyId": 2,
    "minDesi": 0,
    "maxDesi": 10,
    "price": 42
  },
  {
    "id": 5,
    "companyId": 2,
    "minDesi": 11,
    "maxDesi": 30,
    "price": 70
  },
  {
    "id": 6,
    "companyId": 6,
    "minDesi": 0,
    "maxDesi": 10,
    "price": 68
  },
  {
    "id": 7,
    "companyId": 8,
    "minDesi": 0,
    "maxDesi": 10,
    "price": 39
  }
]

export interface CarrierInvoice {
  id: number
  companyId: number
  shipmentNo: number
  invoiceNo: string
  expectedCost: number
  realCost: number
  invoiceDate: string
  status: 'pending' | 'matched' | 'disputed'
}

export const SEED_CARRIER_INVOICES: CarrierInvoice[] = [
  {
    "id": 1,
    "companyId": 1,
    "shipmentNo": 8200145,
    "invoiceNo": "FTR-2026-00234",
    "expectedCost": 45,
    "realCost": 52,
    "invoiceDate": "2026-07-03T10:00:00",
    "status": "matched"
  },
  {
    "id": 2,
    "companyId": 2,
    "shipmentNo": 8200146,
    "invoiceNo": "FTR-2026-00235",
    "expectedCost": 42,
    "realCost": 42,
    "invoiceDate": "2026-07-03T11:20:00",
    "status": "matched"
  },
  {
    "id": 3,
    "companyId": 6,
    "shipmentNo": 8200148,
    "invoiceNo": "FTR-2026-00236",
    "expectedCost": 68,
    "realCost": 89,
    "invoiceDate": "2026-07-02T09:00:00",
    "status": "disputed"
  },
  {
    "id": 4,
    "companyId": 8,
    "shipmentNo": 8200150,
    "invoiceNo": "FTR-2026-00237",
    "expectedCost": 39,
    "realCost": 39,
    "invoiceDate": "2026-07-01T15:40:00",
    "status": "matched"
  },
  {
    "id": 5,
    "companyId": 1,
    "shipmentNo": 8200153,
    "invoiceNo": "FTR-2026-00238",
    "expectedCost": 75,
    "realCost": 75,
    "invoiceDate": "2026-06-30T08:15:00",
    "status": "pending"
  }
]

export const INVOICE_STATUS = {
  pending: { label: 'Beklemede', badge: 'badge-warning' },
  matched: { label: 'Eşleşti', badge: 'badge-active' },
  disputed: { label: 'İtiraz Edildi', badge: 'badge-danger' },
} as const

export interface CarrierQuota {
  companyId: number
  monthlyLimit: number
  usedThisMonth: number
}

export const SEED_CARRIER_QUOTAS: CarrierQuota[] = [
  {
    "companyId": 1,
    "monthlyLimit": 5000,
    "usedThisMonth": 3120
  },
  {
    "companyId": 2,
    "monthlyLimit": 3000,
    "usedThisMonth": 2890
  },
  {
    "companyId": 3,
    "monthlyLimit": 2000,
    "usedThisMonth": 640
  },
  {
    "companyId": 6,
    "monthlyLimit": 1500,
    "usedThisMonth": 1410
  },
  {
    "companyId": 7,
    "monthlyLimit": 1000,
    "usedThisMonth": 210
  },
  {
    "companyId": 8,
    "monthlyLimit": 2500,
    "usedThisMonth": 1980
  }
]

export type HealthStatus = 'up' | 'degraded' | 'down'
export interface CarrierHealth {
  companyId: number
  status: HealthStatus
  avgResponseMs: number | null
  lastCheck: string
}

export const SEED_CARRIER_HEALTH: CarrierHealth[] = [
  {
    "companyId": 1,
    "status": "up",
    "avgResponseMs": 180,
    "lastCheck": "2026-07-06T17:08:00"
  },
  {
    "companyId": 2,
    "status": "up",
    "avgResponseMs": 210,
    "lastCheck": "2026-07-06T17:08:00"
  },
  {
    "companyId": 3,
    "status": "degraded",
    "avgResponseMs": 1450,
    "lastCheck": "2026-07-06T17:07:30"
  },
  {
    "companyId": 4,
    "status": "up",
    "avgResponseMs": 320,
    "lastCheck": "2026-07-06T17:08:00"
  },
  {
    "companyId": 5,
    "status": "up",
    "avgResponseMs": 195,
    "lastCheck": "2026-07-06T17:08:00"
  },
  {
    "companyId": 6,
    "status": "up",
    "avgResponseMs": 240,
    "lastCheck": "2026-07-06T17:08:00"
  },
  {
    "companyId": 7,
    "status": "down",
    "avgResponseMs": null,
    "lastCheck": "2026-07-06T16:52:00"
  },
  {
    "companyId": 8,
    "status": "up",
    "avgResponseMs": 165,
    "lastCheck": "2026-07-06T17:08:00"
  },
  {
    "companyId": 9,
    "status": "up",
    "avgResponseMs": 275,
    "lastCheck": "2026-07-06T17:08:00"
  },
  {
    "companyId": 10,
    "status": "up",
    "avgResponseMs": 305,
    "lastCheck": "2026-07-06T17:08:00"
  },
  {
    "companyId": 11,
    "status": "degraded",
    "avgResponseMs": 980,
    "lastCheck": "2026-07-06T17:06:00"
  },
  {
    "companyId": 12,
    "status": "up",
    "avgResponseMs": 220,
    "lastCheck": "2026-07-06T17:08:00"
  },
  {
    "companyId": 13,
    "status": "up",
    "avgResponseMs": 260,
    "lastCheck": "2026-07-06T17:08:00"
  }
]

export const HEALTH_STATUS_META: Record<HealthStatus, { label: string; dot: string }> = {
  up: { label: 'Ayakta', dot: '#1fc16b' },
  degraded: { label: 'Yavaş', dot: '#fa7319' },
  down: { label: 'Düşük', dot: '#fb3748' },
}

export interface ErrorLog {
  id: number
  shipmentNo: number
  companyId: number
  errorMessage: string
  time: string
  status: 'retrying' | 'manual' | 'resolved'
}

export const SEED_ERROR_LOGS: ErrorLog[] = [
  {
    "id": 1,
    "shipmentNo": 8200156,
    "companyId": 7,
    "errorMessage": "HTTP 503 Service Unavailable: kargo firması entegrasyon servisi yanıt vermiyor.",
    "time": "2026-07-06T16:40:00",
    "status": "retrying"
  },
  {
    "id": 2,
    "shipmentNo": 8200159,
    "companyId": 3,
    "errorMessage": "Timeout: 30000ms içinde yanıt alınamadı.",
    "time": "2026-07-06T15:12:00",
    "status": "manual"
  },
  {
    "id": 3,
    "shipmentNo": 8200148,
    "companyId": 11,
    "errorMessage": "422 Unprocessable Entity: \"district\" alanı eşlenemedi (mapping hatası).",
    "time": "2026-07-06T11:05:00",
    "status": "resolved"
  },
  {
    "id": 4,
    "shipmentNo": 8200151,
    "companyId": 7,
    "errorMessage": "Connection refused: API endpoint erişilemez durumda.",
    "time": "2026-07-05T22:31:00",
    "status": "resolved"
  }
]

export const ERROR_STATUS_META = {
  retrying: { label: 'Yeniden deniyor', badge: 'badge-warning' },
  manual: { label: 'Manuel müdahale', badge: 'badge-danger' },
  resolved: { label: 'Çözüldü', badge: 'badge-active' },
} as const

export interface WebhookItem {
  id: number
  companyId: number
  eventType: string
  attempt: number
  nextRetry: string
}

export const SEED_WEBHOOK_QUEUE: WebhookItem[] = [
  {
    "id": 1,
    "companyId": 7,
    "eventType": "shipment.status_changed",
    "attempt": 3,
    "nextRetry": "2026-07-06T17:20:00"
  },
  {
    "id": 2,
    "companyId": 3,
    "eventType": "shipment.delivered",
    "attempt": 1,
    "nextRetry": "2026-07-06T17:15:00"
  },
  {
    "id": 3,
    "companyId": 11,
    "eventType": "shipment.status_changed",
    "attempt": 2,
    "nextRetry": "2026-07-06T17:25:00"
  }
]

export const PERMISSION_MATRIX_MODULES = ['Gönderiler', 'İade Yönetimi', 'Kargo Firmaları', 'Akıllı Yönlendirme', 'Stok Merkezleri', 'Raporlama', 'Kullanıcılar'] as const

export type PermissionMatrix = Record<'admin' | 'operation' | 'reporting', boolean[]>

export const SEED_PERMISSION_MATRIX: PermissionMatrix = {
  "admin": [
    true,
    true,
    true,
    true,
    true,
    true,
    true
  ],
  "operation": [
    true,
    true,
    true,
    false,
    true,
    false,
    false
  ],
  "reporting": [
    false,
    false,
    false,
    false,
    false,
    true,
    false
  ]
}

export type TemplateType = 'sms' | 'email'
export interface NotifyTemplate {
  id: number
  name: string
  type: TemplateType
  trigger: string
  subject: string
  body: string
  active: boolean
}

export const SEED_TEMPLATES: NotifyTemplate[] = [
  {
    "id": 1,
    "name": "Gönderi Oluşturuldu (SMS)",
    "type": "sms",
    "trigger": "created",
    "subject": "",
    "body": "Sayın {{musteri_adi}}, {{siparis_no}} numaralı siparişiniz kargoya hazırlanıyor. Takip no: {{takip_no}}",
    "active": true
  },
  {
    "id": 2,
    "name": "Kargoya Verildi (SMS)",
    "type": "sms",
    "trigger": "in_transit",
    "subject": "",
    "body": "{{siparis_no}} numaralı siparişiniz {{kargo_firmasi}} ile yola çıktı. Takip: {{takip_no}}",
    "active": true
  },
  {
    "id": 3,
    "name": "Teslim Edildi (Email)",
    "type": "email",
    "trigger": "delivered",
    "subject": "Siparişiniz teslim edildi",
    "body": "Sayın {{musteri_adi}},\n\n{{siparis_no}} numaralı siparişiniz teslim edilmiştir. Bizi tercih ettiğiniz için teşekkür ederiz.",
    "active": true
  },
  {
    "id": 4,
    "name": "İade Alındı (Email)",
    "type": "email",
    "trigger": "return_received",
    "subject": "İade talebiniz alındı",
    "body": "Sayın {{musteri_adi}},\n\n{{siparis_no}} numaralı siparişinize ait iade talebiniz alınmıştır. Süreç en kısa sürede tamamlanacaktır.",
    "active": true
  },
  {
    "id": 5,
    "name": "Teslimat Gecikmesi (SMS)",
    "type": "sms",
    "trigger": "delayed",
    "subject": "",
    "body": "{{siparis_no}} numaralı siparişinizin teslimatında gecikme yaşanmaktadır. Anlayışınız için teşekkür ederiz.",
    "active": false
  }
]

export const TEMPLATE_TRIGGERS: Record<string, string> = {
  created: 'Gönderi Oluşturuldu',
  in_transit: 'Kargoya Verildi',
  delivered: 'Teslim Edildi',
  return_received: 'İade Alındı',
  delayed: 'Teslimat Gecikmesi',
}

export const TEMPLATE_VARS = ['musteri_adi', 'siparis_no', 'takip_no', 'kargo_firmasi'] as const

export interface BarcodeTemplate {
  id: number
  name: string
  companyId: number | null
  format: string
  requiredFields: string[]
  active: boolean
}

export const SEED_BARCODE_TEMPLATES: BarcodeTemplate[] = [
  {
    "id": 1,
    "name": "Standart Kargo Etiketi",
    "companyId": 1,
    "format": "pdf",
    "requiredFields": [
      "trackingNo",
      "companyName",
      "address"
    ],
    "active": true
  },
  {
    "id": 2,
    "name": "Termal Yazıcı Etiketi (ZPL)",
    "companyId": 2,
    "format": "zpl",
    "requiredFields": [
      "trackingNo",
      "to",
      "address"
    ],
    "active": true
  },
  {
    "id": 3,
    "name": "İade Etiketi",
    "companyId": null,
    "format": "pdf",
    "requiredFields": [
      "trackingNo",
      "docNo"
    ],
    "active": false
  }
]

export const BARCODE_TEMPLATE_FIELDS: Record<string, string> = {
  trackingNo: 'Takip No',
  companyName: 'Kargo Firması',
  docNo: 'Belge No',
  from: 'Gönderen Adresi',
  to: 'Alıcı Adı',
  address: 'Alıcı Adresi',
}

export const BARCODE_FORMATS = [
  { key: 'pdf', label: 'PDF' },
  { key: 'zpl', label: 'ZPL' },
  { key: 'png', label: 'PNG' },
] as const

export const PROVINCES = [
  { id: 1, name: 'İstanbul', districts: ['Adalar','Arnavutköy','Ataşehir','Avcılar','Bağcılar','Bahçelievler','Bakırköy','Başakşehir','Beşiktaş','Beykoz','Beylikdüzü','Beyoğlu','Büyükçekmece','Çatalca','Çekmeköy','Esenler','Esenyurt','Eyüpsultan','Fatih','Gaziosmanpaşa','Güngören','Kadıköy','Kağıthane','Kartal','Küçükçekmece','Maltepe','Pendik','Sancaktepe','Sarıyer','Şile','Şişli','Sultanbeyli','Sultangazi','Tuzla','Ümraniye','Üsküdar','Zeytinburnu'] },
  { id: 2, name: 'Ankara', districts: ['Altındağ','Akyurt','Ayaş','Bala','Beypazarı','Çankaya','Çubuk','Elmadağ','Etimesgut','Evren','Gölbaşı','Güdül','Haymana','Kahramankazan','Keçiören','Mamak','Pursaklar','Sincan','Yenimahalle'] },
  { id: 3, name: 'İzmir', districts: ['Aliağa','Balçova','Bayındır','Bayraklı','Bergama','Bornova','Buca','Çeşme','Çiğli','Dikili','Foça','Gaziemir','Güzelbahçe','Karabağlar','Karşıyaka','Kemalpaşa','Konak','Menemen','Narlıdere','Torbalı','Urla'] },
  { id: 4, name: 'Bursa', districts: ['Gemlik','Gürsu','İnegöl','İznik','Karacabey','Kestel','Mudanya','Mustafakemalpaşa','Nilüfer','Osmangazi','Orhangazi','Yenişehir','Yıldırım'] },
  { id: 5, name: 'Antalya', districts: ['Akseki','Aksu','Alanya','Döşemealtı','Elmalı','Finike','Gazipaşa','Kaş','Kemer','Kepez','Konyaaltı','Korkuteli','Kumluca','Manavgat','Muratpaşa','Serik'] },
  { id: 6, name: 'Adana', districts: ['Aladağ','Ceyhan','Çukurova','Feke','İmamoğlu','Karaisalı','Karataş','Kozan','Pozantı','Saimbeyli','Sarıçam','Seyhan','Tufanbeyli','Yumurtalık','Yüreğir'] },
  { id: 7, name: 'Konya', districts: ['Akşehir','Beyşehir','Bozkır','Cihanbeyli','Çumra','Ereğli','Ilgın','Kadınhanı','Karapınar','Karatay','Meram','Sarayönü','Selçuklu','Seydişehir','Yunak'] },
  { id: 8, name: 'Gaziantep', districts: ['Araban','İslahiye','Karkamış','Nizip','Nurdağı','Oğuzeli','Şahinbey','Şehitkamil','Yavuzeli'] },
  { id: 9, name: 'Trabzon', districts: ['Akçaabat','Araklı','Arsin','Beşikdüzü','Çaykara','Düzköy','Hayrat','Maçka','Of','Ortahisar','Sürmene','Tonya','Vakfıkebir','Yomra'] },
  { id: 10, name: 'Van', districts: ['Bahçesaray','Başkale','Çaldıran','Çatak','Edremit','Erciş','Gevaş','Gürpınar','İpekyolu','Muradiye','Özalp','Saray','Tuşba'] },
  { id: 11, name: 'Diyarbakır', districts: ['Bağlar','Bismil','Çermik','Çınar','Dicle','Eğil','Ergani','Hazro','Kayapınar','Kocaköy','Kulp','Lice','Silvan','Sur','Yenişehir'] },
  { id: 12, name: 'Kayseri', districts: ['Akkışla','Bünyan','Develi','Felahiye','Hacılar','İncesu','Kocasinan','Melikgazi','Özvatan','Pınarbaşı','Sarıoğlan','Sarız','Talas','Tomarza','Yahyalı','Yeşilhisar'] },
] as const

export function getCompany(id: number, companies: readonly Company[] = COMPANIES) {
  return companies.find((c) => c.id === id)
}

export function shipmentDeliveryDays(s: Shipment) {
  return 1 + (s.id % 4) * 0.5
}

export function isDamagedFor(shipmentId: number) {
  return shipmentId % 11 === 0
}

export function pickupTimeHoursFor(shipmentId: number) {
  return 1 + (shipmentId % 6)
}

export function plannedDeliveryDate(s: Shipment) {
  const d = new Date(s.shipTime)
  d.setDate(d.getDate() + Math.ceil(shipmentDeliveryDays(s)))
  return d.toISOString()
}

export function actualDeliveryDate(s: Shipment) {
  if (s.status !== 'delivered' && s.status !== 'returned') return null
  const d = new Date(s.shipTime)
  d.setHours(d.getHours() + 20 + (s.id % 30))
  return d.toISOString()
}

export type ContractStatus = 'active' | 'passive'

export interface ContractCredentialNode {
  id: number
  name: string
  code: string
}

export interface ContractCredential {
  id: number
  name: string
  password: string
  apiKey: string
  customerId: string
  nodes: ContractCredentialNode[]
}

export interface CoveredRegion {
  provinceId: number
  provinceName: string
  districts: string[]
}

export interface Contract {
  id: number
  companyId: number
  name: string
  status: ContractStatus
  createdAt: string
  orderShipping: boolean
  returnShipping: boolean
  transferShipping?: boolean
  minDesi: number
  maxDesi: number
  minOrderAmount: number | ''
  maxOrderAmount: number | ''
  coveredRegions: CoveredRegion[]
  credentials: ContractCredential[]
  isDefault?: boolean
  productTypes?: string[]
  customerSegments?: string[]
  packageTypes?: string[]
  channels?: string[]
  paymentTypes?: string[]
}

export interface ContractForm {
  companyId: number | ''
  name: string
  isDefault: boolean
  minDesi: string | number
  maxDesi: string | number
  minOrderAmount: string | number
  maxOrderAmount: string | number
  orderShipping: boolean
  returnShipping: boolean
  transferShipping: boolean
  productTypes: string[]
  customerSegments: string[]
  packageTypes: string[]
  channels: string[]
  paymentTypes: string[]
  coveredRegions: CoveredRegion[]
  search2: string
  activeProvinceId2: number | ''
  credentials: ContractCredential[]
}

export const PRODUCT_TYPES: Record<string, string> = {
  gida: 'Gıda',
  elektronik: 'Elektronik',
  tekstil: 'Tekstil',
}

export const CUSTOMER_SEGMENTS: Record<string, string> = {
  vip: 'VIP',
  standart: 'Standart',
  kurumsal: 'Kurumsal',
}

export const PACKAGE_TYPES: Record<string, string> = {
  kirilacak: 'Kırılacak Eşya',
  soguk_zincir: 'Soğuk Zincir',
  standart: 'Standart Paket',
}

export const ORDER_PAYMENT_TYPES: Record<string, string> = {
  kapida_odeme: 'Kapıda Ödeme',
  kredi_karti: 'Kredi Kartı',
  on_odemeli: 'Ön Ödemeli',
}

export const SHIPMENT_CHANNELS = ['Trendyol', 'Hepsiburada', 'N11', 'Kendi Web Sitesi'] as const

export const SEED_CONTRACTS: Contract[] = [
  {
    id: 1,
    companyId: 1,
    name: 'Yurtiçi - Ana Depo',
    status: 'active',
    createdAt: '2026-01-10',
    orderShipping: true,
    returnShipping: true,
    minDesi: 1,
    maxDesi: 30,
    minOrderAmount: '',
    maxOrderAmount: 3000,
    coveredRegions: [
      { provinceId: 1, provinceName: 'İstanbul', districts: [] },
      { provinceId: 2, provinceName: 'Ankara', districts: [] },
      { provinceId: 3, provinceName: 'İzmir', districts: ['Bornova', 'Konak', 'Karşıyaka', 'Buca', 'Bayraklı'] },
      { provinceId: 4, provinceName: 'Bursa', districts: [] },
    ],
    credentials: [
      {
        id: 1,
        name: 'Prod Hesabı 1',
        password: 'P@ssw0rd123',
        apiKey: 'YK-API-9f8e7d6c5b4a',
        customerId: '',
        nodes: [
          { id: 1, name: 'İstanbul Ana Depo', code: 'IST001' },
          { id: 3, name: 'Ankara Merkez', code: 'ANK001' },
        ],
      },
      {
        id: 2,
        name: 'Test Hesabı',
        password: 'TestPass456',
        apiKey: 'YK-API-TEST-abc123',
        customerId: '',
        nodes: [{ id: 5, name: 'İzmir Depo', code: 'IZM001' }],
      },
    ],
  },
  {
    id: 2,
    companyId: 2,
    name: 'Aras - İstanbul',
    status: 'active',
    createdAt: '2026-02-15',
    orderShipping: true,
    returnShipping: false,
    minDesi: 1,
    maxDesi: 50,
    minOrderAmount: 100,
    maxOrderAmount: '',
    coveredRegions: [],
    credentials: [
      {
        id: 1,
        name: 'Aras Prod',
        password: '',
        apiKey: 'ARAS-API-xyz789',
        customerId: 'ARAS-CUS-78901',
        nodes: [
          { id: 1, name: 'İstanbul Ana Depo', code: 'IST001' },
          { id: 2, name: 'İstanbul Anadolu', code: 'IST002' },
        ],
      },
    ],
  },
  {
    id: 3,
    companyId: 3,
    name: 'MNG - Eski Sözleşme',
    status: 'passive',
    createdAt: '2025-11-20',
    orderShipping: true,
    returnShipping: true,
    minDesi: 0,
    maxDesi: 100,
    minOrderAmount: '',
    maxOrderAmount: '',
    coveredRegions: [
      { provinceId: 4, provinceName: 'Bursa', districts: [] },
      {
        provinceId: 1,
        provinceName: 'İstanbul',
        districts: ['Kadıköy', 'Şişli', 'Beşiktaş', 'Beyoğlu', 'Fatih'],
      },
    ],
    credentials: [
      {
        id: 1,
        name: 'MNG API Prod',
        password: 'MNG2025!@',
        apiKey: '',
        customerId: '',
        nodes: [
          { id: 6, name: 'Bursa Depo', code: 'BRS001' },
          { id: 15, name: 'Kocaeli Depo', code: 'KOC001' },
        ],
      },
    ],
  },
  {
    id: 4,
    companyId: 4,
    name: 'PTT - Uzak Bölgeler',
    status: 'active',
    createdAt: '2026-03-05',
    orderShipping: false,
    returnShipping: true,
    minDesi: 5,
    maxDesi: 200,
    minOrderAmount: '',
    maxOrderAmount: '',
    coveredRegions: [],
    credentials: [
      {
        id: 1,
        name: 'PTT API Hesabı',
        password: '',
        apiKey: 'PTT-API-2026-SECURE-KEY',
        customerId: '',
        nodes: [
          { id: 3, name: 'Ankara Merkez', code: 'ANK001' },
          { id: 10, name: 'Konya Depo', code: 'KNY001' },
          { id: 13, name: 'Diyarbakır Depo', code: 'DYB001' },
        ],
      },
    ],
  },
  {
    id: 5,
    companyId: 6,
    name: 'DHL Genel Sözleşme',
    status: 'active',
    createdAt: '2026-03-01',
    orderShipping: true,
    returnShipping: true,
    minDesi: 1,
    maxDesi: 150,
    minOrderAmount: '',
    maxOrderAmount: '',
    coveredRegions: [],
    credentials: [
      {
        id: 1,
        name: 'DHL Prod Hesabı',
        password: 'DHLPass123',
        apiKey: 'DHL-KEY-xyz',
        customerId: '',
        nodes: [
          { id: 1, name: 'İstanbul Ana Depo', code: 'IST001' },
          { id: 2, name: 'İstanbul Anadolu', code: 'IST002' },
          { id: 3, name: 'Ankara Merkez', code: 'ANK001' },
        ],
      },
    ],
  },
  {
    id: 6,
    companyId: 7,
    name: 'Horoz Ağır Taşıma',
    status: 'active',
    createdAt: '2026-03-05',
    orderShipping: true,
    returnShipping: true,
    minDesi: 30,
    maxDesi: 500,
    minOrderAmount: '',
    maxOrderAmount: '',
    coveredRegions: [],
    credentials: [
      {
        id: 1,
        name: 'Horoz Ana Hesap',
        password: '',
        apiKey: 'HOROZ-KEY',
        customerId: 'H-CUS-99',
        nodes: [{ id: 2, name: 'İstanbul Anadolu', code: 'IST002' }],
      },
    ],
  },
  {
    id: 7,
    companyId: 8,
    name: 'Hepsijet Standart',
    status: 'active',
    createdAt: '2026-03-10',
    orderShipping: true,
    returnShipping: true,
    minDesi: 0,
    maxDesi: 100,
    minOrderAmount: '',
    maxOrderAmount: '',
    coveredRegions: [],
    credentials: [
      {
        id: 1,
        name: 'Hepsijet API',
        password: 'JetPassWord',
        apiKey: '',
        customerId: '',
        nodes: [{ id: 2, name: 'İstanbul Anadolu', code: 'IST002' }],
      },
    ],
  },
]

export function getProvince(id: number) {
  return PROVINCES.find((p) => p.id === +id)
}
