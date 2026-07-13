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
  preparing: '#f0a869',
  in_transit: '#85a0f2',
  delivered: '#7ecca0',
  returned: '#aab3c2',
  cancelled: '#f28d97',
  recalled: '#bb717a',
}

export interface Shipment {
  id: number
  shipmentNo: number
  orderNo: number
  companyId: number
  trackingNo: string
  shipFrom: string
  shipTo: { district: string; province: string; addressLine?: string; phone?: string; email?: string }
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
    "shipmentNo": 8200001,
    "orderNo": 61200001,
    "companyId": 3,
    "trackingNo": "MNG-2026-0100037",
    "shipFrom": "Ankara Merkez",
    "shipTo": {
      "district": "Konyaaltı",
      "province": "Antalya"
    },
    "shipTime": "2026-04-10T07:41:00",
    "status": "delivered",
    "cargoType": "order",
    "referenceId": "REF-70013",
    "packageNo": "PKT-000001",
    "customerName": "Ahmet Güneş",
    "channel": "Hepsiburada"
  },
  {
    "id": 2,
    "shipmentNo": 8200002,
    "orderNo": 61200002,
    "companyId": 1,
    "trackingNo": "YK-2026-0100074",
    "shipFrom": "İstanbul Anadolu",
    "shipTo": {
      "district": "Nilüfer",
      "province": "Bursa"
    },
    "shipTime": "2026-04-11T11:56:00",
    "status": "delivered",
    "cargoType": "order",
    "referenceId": "REF-70026",
    "packageNo": "PKT-000002",
    "customerName": "Aslı Aydın",
    "channel": "Trendyol"
  },
  {
    "id": 3,
    "shipmentNo": 8200003,
    "orderNo": 61200003,
    "companyId": 1,
    "trackingNo": "YK-2026-0100111",
    "shipFrom": "İzmir Depo",
    "shipTo": {
      "district": "Yüreğir",
      "province": "Adana"
    },
    "shipTime": "2026-04-12T07:47:00",
    "status": "delivered",
    "cargoType": "order",
    "referenceId": "REF-70039",
    "packageNo": "PKT-000003",
    "customerName": "Gizem Aksoy",
    "channel": "Trendyol"
  },
  {
    "id": 4,
    "shipmentNo": 8200004,
    "orderNo": 61200004,
    "companyId": 4,
    "trackingNo": "PTT-2026-0100148",
    "shipFrom": "Bursa Depo",
    "shipTo": {
      "district": "Keçiören",
      "province": "Ankara"
    },
    "shipTime": "2026-04-12T11:16:00",
    "status": "delivered",
    "cargoType": "order",
    "referenceId": "REF-70052",
    "packageNo": "PKT-000004",
    "customerName": "Selin Kurt",
    "channel": "Hepsiburada"
  },
  {
    "id": 5,
    "shipmentNo": 8200005,
    "orderNo": 61200005,
    "companyId": 3,
    "trackingNo": "MNG-2026-0100185",
    "shipFrom": "İzmir Depo",
    "shipTo": {
      "district": "Kepez",
      "province": "Antalya"
    },
    "shipTime": "2026-04-14T07:05:00",
    "status": "delivered",
    "cargoType": "order",
    "referenceId": "REF-70065",
    "packageNo": "PKT-000005",
    "customerName": "Furkan Aksoy",
    "channel": "Trendyol"
  },
  {
    "id": 6,
    "shipmentNo": 8200006,
    "orderNo": 61200006,
    "companyId": 2,
    "trackingNo": "ARAS-2026-0100222",
    "shipFrom": "İzmir Depo",
    "shipTo": {
      "district": "Maltepe",
      "province": "İstanbul"
    },
    "shipTime": "2026-04-14T09:48:00",
    "status": "delivered",
    "cargoType": "order",
    "referenceId": "REF-70078",
    "packageNo": "PKT-000006",
    "customerName": "Onur Bulut",
    "channel": "Trendyol"
  },
  {
    "id": 7,
    "shipmentNo": 8200007,
    "orderNo": 61200007,
    "companyId": 1,
    "trackingNo": "YK-2026-0100259",
    "shipFrom": "İstanbul Ana Depo",
    "shipTo": {
      "district": "Ortahisar",
      "province": "Trabzon"
    },
    "shipTime": "2026-04-15T07:27:00",
    "status": "delivered",
    "cargoType": "order",
    "referenceId": "REF-70091",
    "packageNo": "PKT-000007",
    "customerName": "Doğan Yıldız",
    "channel": "Kendi Web Sitesi"
  },
  {
    "id": 8,
    "shipmentNo": 8200008,
    "orderNo": 61200008,
    "companyId": 1,
    "trackingNo": "YK-2026-0100296",
    "shipFrom": "Ankara Ostim",
    "shipTo": {
      "district": "Seyhan",
      "province": "Adana"
    },
    "shipTime": "2026-04-15T11:11:00",
    "status": "delivered",
    "cargoType": "order",
    "referenceId": "REF-70104",
    "packageNo": "PKT-000008",
    "customerName": "Gül Bulut",
    "channel": "Hepsiburada"
  },
  {
    "id": 9,
    "shipmentNo": 8200009,
    "orderNo": 61200009,
    "companyId": 4,
    "trackingNo": "PTT-2026-0100333",
    "shipFrom": "İzmir Depo",
    "shipTo": {
      "district": "Beşiktaş",
      "province": "İstanbul"
    },
    "shipTime": "2026-04-16T08:22:00",
    "status": "returned",
    "cargoType": "return",
    "referenceId": "REF-70117",
    "packageNo": "PKT-000009",
    "customerName": "Burak Kaya",
    "channel": "Trendyol"
  },
  {
    "id": 10,
    "shipmentNo": 8200010,
    "orderNo": 61200010,
    "companyId": 3,
    "trackingNo": "MNG-2026-0100370",
    "shipFrom": "Bursa Depo",
    "shipTo": {
      "district": "Ortahisar",
      "province": "Trabzon"
    },
    "shipTime": "2026-04-16T11:01:00",
    "status": "delivered",
    "cargoType": "order",
    "referenceId": "REF-70130",
    "packageNo": "PKT-000010",
    "customerName": "Kerem Kaya",
    "channel": "Kendi Web Sitesi"
  },
  {
    "id": 11,
    "shipmentNo": 8200011,
    "orderNo": 61200011,
    "companyId": 1,
    "trackingNo": "YK-2026-0100407",
    "shipFrom": "Ankara Ostim",
    "shipTo": {
      "district": "Kocasinan",
      "province": "Kayseri"
    },
    "shipTime": "2026-04-16T11:41:00",
    "status": "returned",
    "cargoType": "order",
    "referenceId": "REF-70143",
    "packageNo": "PKT-000011",
    "customerName": "Mustafa Erdoğan",
    "channel": "Hepsiburada"
  },
  {
    "id": 12,
    "shipmentNo": 8200012,
    "orderNo": 61200012,
    "companyId": 7,
    "trackingNo": "HRZ-2026-0100444",
    "shipFrom": "Bursa Depo",
    "shipTo": {
      "district": "Etimesgut",
      "province": "Ankara"
    },
    "shipTime": "2026-04-18T12:51:00",
    "status": "delivered",
    "cargoType": "order",
    "referenceId": "REF-70156",
    "packageNo": "PKT-000012",
    "customerName": "Zeynep Yılmaz",
    "channel": "Hepsiburada"
  },
  {
    "id": 13,
    "shipmentNo": 8200013,
    "orderNo": 61200013,
    "companyId": 2,
    "trackingNo": "ARAS-2026-0100481",
    "shipFrom": "Ankara Merkez",
    "shipTo": {
      "district": "Selçuklu",
      "province": "Konya"
    },
    "shipTime": "2026-04-18T13:55:00",
    "status": "delivered",
    "cargoType": "order",
    "referenceId": "REF-70169",
    "packageNo": "PKT-000013",
    "customerName": "Fatma Yıldız",
    "channel": "Trendyol"
  },
  {
    "id": 14,
    "shipmentNo": 8200014,
    "orderNo": 61200014,
    "companyId": 2,
    "trackingNo": "ARAS-2026-0100518",
    "shipFrom": "İzmir Depo",
    "shipTo": {
      "district": "Şehitkamil",
      "province": "Gaziantep"
    },
    "shipTime": "2026-04-19T08:27:00",
    "status": "recalled",
    "cargoType": "order",
    "referenceId": "REF-70182",
    "packageNo": "PKT-000014",
    "customerName": "Serkan Demir",
    "channel": "N11"
  },
  {
    "id": 15,
    "shipmentNo": 8200015,
    "orderNo": 61200015,
    "companyId": 2,
    "trackingNo": "ARAS-2026-0100555",
    "shipFrom": "Ankara Ostim",
    "shipTo": {
      "district": "Yıldırım",
      "province": "Bursa"
    },
    "shipTime": "2026-04-21T12:16:00",
    "status": "delivered",
    "cargoType": "order",
    "referenceId": "REF-70195",
    "packageNo": "PKT-000015",
    "customerName": "Barış Arslan",
    "channel": "Hepsiburada"
  },
  {
    "id": 16,
    "shipmentNo": 8200016,
    "orderNo": 61200016,
    "companyId": 2,
    "trackingNo": "ARAS-2026-0100592",
    "shipFrom": "Ankara Ostim",
    "shipTo": {
      "district": "Ortahisar",
      "province": "Trabzon"
    },
    "shipTime": "2026-04-22T11:05:00",
    "status": "delivered",
    "cargoType": "order",
    "referenceId": "REF-70208",
    "packageNo": "PKT-000016",
    "customerName": "Onur Arslan",
    "channel": "Kendi Web Sitesi"
  },
  {
    "id": 17,
    "shipmentNo": 8200017,
    "orderNo": 61200017,
    "companyId": 3,
    "trackingNo": "MNG-2026-0100629",
    "shipFrom": "İstanbul Anadolu",
    "shipTo": {
      "district": "Melikgazi",
      "province": "Kayseri"
    },
    "shipTime": "2026-04-22T13:28:00",
    "status": "delivered",
    "cargoType": "order",
    "referenceId": "REF-70221",
    "packageNo": "PKT-000017",
    "customerName": "Deniz Öztürk",
    "channel": "Hepsiburada"
  },
  {
    "id": 18,
    "shipmentNo": 8200018,
    "orderNo": 61200018,
    "companyId": 3,
    "trackingNo": "MNG-2026-0100666",
    "shipFrom": "Ankara Ostim",
    "shipTo": {
      "district": "Şehitkamil",
      "province": "Gaziantep"
    },
    "shipTime": "2026-04-23T07:51:00",
    "status": "delivered",
    "cargoType": "order",
    "referenceId": "REF-70234",
    "packageNo": "PKT-000018",
    "customerName": "Mehmet Doğan",
    "channel": "Trendyol"
  },
  {
    "id": 19,
    "shipmentNo": 8200019,
    "orderNo": 61200019,
    "companyId": 6,
    "trackingNo": "DHL-2026-0100703",
    "shipFrom": "İzmir Depo",
    "shipTo": {
      "district": "Kocasinan",
      "province": "Kayseri"
    },
    "shipTime": "2026-04-23T08:35:00",
    "status": "delivered",
    "cargoType": "order",
    "referenceId": "REF-70247",
    "packageNo": "PKT-000019",
    "customerName": "Elif Yavuz",
    "channel": "Trendyol"
  },
  {
    "id": 20,
    "shipmentNo": 8200020,
    "orderNo": 61200020,
    "companyId": 1,
    "trackingNo": "YK-2026-0100740",
    "shipFrom": "Ankara Merkez",
    "shipTo": {
      "district": "Muratpaşa",
      "province": "Antalya"
    },
    "shipTime": "2026-04-23T09:40:00",
    "status": "delivered",
    "cargoType": "order",
    "referenceId": "REF-70260",
    "packageNo": "PKT-000020",
    "customerName": "Aslı Bulut",
    "channel": "Kendi Web Sitesi"
  },
  {
    "id": 21,
    "shipmentNo": 8200021,
    "orderNo": 61200021,
    "companyId": 1,
    "trackingNo": "YK-2026-0100777",
    "shipFrom": "Bursa Depo",
    "shipTo": {
      "district": "Melikgazi",
      "province": "Kayseri"
    },
    "shipTime": "2026-04-23T14:40:00",
    "status": "delivered",
    "cargoType": "order",
    "referenceId": "REF-70273",
    "packageNo": "PKT-000021",
    "customerName": "İrem Özdemir",
    "channel": "Trendyol"
  },
  {
    "id": 22,
    "shipmentNo": 8200022,
    "orderNo": 61200022,
    "companyId": 4,
    "trackingNo": "PTT-2026-0100814",
    "shipFrom": "İstanbul Ana Depo",
    "shipTo": {
      "district": "Ortahisar",
      "province": "Trabzon"
    },
    "shipTime": "2026-04-24T10:19:00",
    "status": "delivered",
    "cargoType": "order",
    "referenceId": "REF-70286",
    "packageNo": "PKT-000022",
    "customerName": "Gül Erdoğan",
    "channel": "Kendi Web Sitesi"
  },
  {
    "id": 23,
    "shipmentNo": 8200023,
    "orderNo": 61200023,
    "companyId": 6,
    "trackingNo": "DHL-2026-0100851",
    "shipFrom": "İstanbul Anadolu",
    "shipTo": {
      "district": "Kocasinan",
      "province": "Kayseri"
    },
    "shipTime": "2026-04-25T06:06:00",
    "status": "delivered",
    "cargoType": "order",
    "referenceId": "REF-70299",
    "packageNo": "PKT-000023",
    "customerName": "Gizem Şimşek",
    "channel": "Trendyol"
  },
  {
    "id": 24,
    "shipmentNo": 8200024,
    "orderNo": 61200024,
    "companyId": 2,
    "trackingNo": "ARAS-2026-0100888",
    "shipFrom": "Ankara Ostim",
    "shipTo": {
      "district": "Beşiktaş",
      "province": "İstanbul"
    },
    "shipTime": "2026-04-26T05:12:00",
    "status": "delivered",
    "cargoType": "order",
    "referenceId": "REF-70312",
    "packageNo": "PKT-000024",
    "customerName": "Deniz Arslan",
    "channel": "Trendyol"
  },
  {
    "id": 25,
    "shipmentNo": 8200025,
    "orderNo": 61200025,
    "companyId": 1,
    "trackingNo": "YK-2026-0100925",
    "shipFrom": "Ankara Merkez",
    "shipTo": {
      "district": "Melikgazi",
      "province": "Kayseri"
    },
    "shipTime": "2026-04-26T09:21:00",
    "status": "delivered",
    "cargoType": "order",
    "referenceId": "REF-70325",
    "packageNo": "PKT-000025",
    "customerName": "Kaan Güneş",
    "channel": "Trendyol"
  },
  {
    "id": 26,
    "shipmentNo": 8200026,
    "orderNo": 61200026,
    "companyId": 1,
    "trackingNo": "YK-2026-0100962",
    "shipFrom": "Ankara Merkez",
    "shipTo": {
      "district": "Şahinbey",
      "province": "Gaziantep"
    },
    "shipTime": "2026-04-28T05:40:00",
    "status": "delivered",
    "cargoType": "order",
    "referenceId": "REF-70338",
    "packageNo": "PKT-000026",
    "customerName": "Deniz Yılmaz",
    "channel": "N11"
  },
  {
    "id": 27,
    "shipmentNo": 8200027,
    "orderNo": 61200027,
    "companyId": 1,
    "trackingNo": "YK-2026-0100999",
    "shipFrom": "İstanbul Ana Depo",
    "shipTo": {
      "district": "Yenimahalle",
      "province": "Ankara"
    },
    "shipTime": "2026-04-28T07:24:00",
    "status": "delivered",
    "cargoType": "order",
    "referenceId": "REF-70351",
    "packageNo": "PKT-000027",
    "customerName": "Merve Koç",
    "channel": "Trendyol"
  },
  {
    "id": 28,
    "shipmentNo": 8200028,
    "orderNo": 61200028,
    "companyId": 2,
    "trackingNo": "ARAS-2026-0101036",
    "shipFrom": "İstanbul Anadolu",
    "shipTo": {
      "district": "Melikgazi",
      "province": "Kayseri"
    },
    "shipTime": "2026-04-28T08:09:00",
    "status": "delivered",
    "cargoType": "order",
    "referenceId": "REF-70364",
    "packageNo": "PKT-000028",
    "customerName": "Doğan Özdemir",
    "channel": "Trendyol"
  },
  {
    "id": 29,
    "shipmentNo": 8200029,
    "orderNo": 61200029,
    "companyId": 1,
    "trackingNo": "YK-2026-0101073",
    "shipFrom": "Ankara Ostim",
    "shipTo": {
      "district": "Muratpaşa",
      "province": "Antalya"
    },
    "shipTime": "2026-04-28T08:14:00",
    "status": "delivered",
    "cargoType": "order",
    "referenceId": "REF-70377",
    "packageNo": "PKT-000029",
    "customerName": "Ebru Yavuz",
    "channel": "N11"
  },
  {
    "id": 30,
    "shipmentNo": 8200030,
    "orderNo": 61200030,
    "companyId": 8,
    "trackingNo": "HPS-2026-0101110",
    "shipFrom": "Ankara Merkez",
    "shipTo": {
      "district": "Karatay",
      "province": "Konya"
    },
    "shipTime": "2026-04-28T12:41:00",
    "status": "delivered",
    "cargoType": "order",
    "referenceId": "REF-70390",
    "packageNo": "PKT-000030",
    "customerName": "Cem Erdoğan",
    "channel": "Trendyol"
  },
  {
    "id": 31,
    "shipmentNo": 8200031,
    "orderNo": 61200031,
    "companyId": 6,
    "trackingNo": "DHL-2026-0101147",
    "shipFrom": "Ankara Merkez",
    "shipTo": {
      "district": "Melikgazi",
      "province": "Kayseri"
    },
    "shipTime": "2026-04-29T10:21:00",
    "status": "delivered",
    "cargoType": "order",
    "referenceId": "REF-70403",
    "packageNo": "PKT-000031",
    "customerName": "Serkan Erdoğan",
    "channel": "Trendyol"
  },
  {
    "id": 32,
    "shipmentNo": 8200032,
    "orderNo": 61200032,
    "companyId": 3,
    "trackingNo": "MNG-2026-0101184",
    "shipFrom": "Ankara Merkez",
    "shipTo": {
      "district": "Mamak",
      "province": "Ankara"
    },
    "shipTime": "2026-04-29T12:35:00",
    "status": "delivered",
    "cargoType": "order",
    "referenceId": "REF-70416",
    "packageNo": "PKT-000032",
    "customerName": "Kerem Doğan",
    "channel": "Hepsiburada"
  },
  {
    "id": 33,
    "shipmentNo": 8200033,
    "orderNo": 61200033,
    "companyId": 2,
    "trackingNo": "ARAS-2026-0101221",
    "shipFrom": "Ankara Ostim",
    "shipTo": {
      "district": "Ortahisar",
      "province": "Trabzon"
    },
    "shipTime": "2026-04-29T13:51:00",
    "status": "delivered",
    "cargoType": "return",
    "referenceId": "REF-70429",
    "packageNo": "PKT-000033",
    "customerName": "Ayşe Polat",
    "channel": "Trendyol"
  },
  {
    "id": 34,
    "shipmentNo": 8200034,
    "orderNo": 61200034,
    "companyId": 3,
    "trackingNo": "MNG-2026-0101258",
    "shipFrom": "Ankara Ostim",
    "shipTo": {
      "district": "Pendik",
      "province": "İstanbul"
    },
    "shipTime": "2026-05-02T07:19:00",
    "status": "cancelled",
    "cargoType": "order",
    "referenceId": "REF-70442",
    "packageNo": "PKT-000034",
    "customerName": "Burak Aksoy",
    "channel": "Trendyol"
  },
  {
    "id": 35,
    "shipmentNo": 8200035,
    "orderNo": 61200035,
    "companyId": 3,
    "trackingNo": "MNG-2026-0101295",
    "shipFrom": "İzmir Depo",
    "shipTo": {
      "district": "Osmangazi",
      "province": "Bursa"
    },
    "shipTime": "2026-05-02T10:35:00",
    "status": "returned",
    "cargoType": "order",
    "referenceId": "REF-70455",
    "packageNo": "PKT-000035",
    "customerName": "Gül Doğan",
    "channel": "Hepsiburada"
  },
  {
    "id": 36,
    "shipmentNo": 8200036,
    "orderNo": 61200036,
    "companyId": 2,
    "trackingNo": "ARAS-2026-0101332",
    "shipFrom": "Ankara Merkez",
    "shipTo": {
      "district": "Yenimahalle",
      "province": "Ankara"
    },
    "shipTime": "2026-05-02T12:59:00",
    "status": "delivered",
    "cargoType": "order",
    "referenceId": "REF-70468",
    "packageNo": "PKT-000036",
    "customerName": "Hakan Özdemir",
    "channel": "Hepsiburada"
  },
  {
    "id": 37,
    "shipmentNo": 8200037,
    "orderNo": 61200037,
    "companyId": 4,
    "trackingNo": "PTT-2026-0101369",
    "shipFrom": "Bursa Depo",
    "shipTo": {
      "district": "Bornova",
      "province": "İzmir"
    },
    "shipTime": "2026-05-02T13:39:00",
    "status": "delivered",
    "cargoType": "order",
    "referenceId": "REF-70481",
    "packageNo": "PKT-000037",
    "customerName": "Selin Yavuz",
    "channel": "Trendyol"
  },
  {
    "id": 38,
    "shipmentNo": 8200038,
    "orderNo": 61200038,
    "companyId": 1,
    "trackingNo": "YK-2026-0101406",
    "shipFrom": "Bursa Depo",
    "shipTo": {
      "district": "Melikgazi",
      "province": "Kayseri"
    },
    "shipTime": "2026-05-03T05:24:00",
    "status": "delivered",
    "cargoType": "return",
    "referenceId": "REF-70494",
    "packageNo": "PKT-000038",
    "customerName": "Fatma Özdemir",
    "channel": "Hepsiburada"
  },
  {
    "id": 39,
    "shipmentNo": 8200039,
    "orderNo": 61200039,
    "companyId": 2,
    "trackingNo": "ARAS-2026-0101443",
    "shipFrom": "Bursa Depo",
    "shipTo": {
      "district": "Melikgazi",
      "province": "Kayseri"
    },
    "shipTime": "2026-05-03T06:29:00",
    "status": "returned",
    "cargoType": "order",
    "referenceId": "REF-70507",
    "packageNo": "PKT-000039",
    "customerName": "Hakan Aksoy",
    "channel": "Hepsiburada"
  },
  {
    "id": 40,
    "shipmentNo": 8200040,
    "orderNo": 61200040,
    "companyId": 1,
    "trackingNo": "YK-2026-0101480",
    "shipFrom": "İstanbul Anadolu",
    "shipTo": {
      "district": "Nilüfer",
      "province": "Bursa"
    },
    "shipTime": "2026-05-03T07:05:00",
    "status": "delivered",
    "cargoType": "return",
    "referenceId": "REF-70520",
    "packageNo": "PKT-000040",
    "customerName": "Mustafa Güneş",
    "channel": "Hepsiburada"
  },
  {
    "id": 41,
    "shipmentNo": 8200041,
    "orderNo": 61200041,
    "companyId": 3,
    "trackingNo": "MNG-2026-0101517",
    "shipFrom": "İzmir Depo",
    "shipTo": {
      "district": "Selçuklu",
      "province": "Konya"
    },
    "shipTime": "2026-05-04T13:25:00",
    "status": "delivered",
    "cargoType": "order",
    "referenceId": "REF-70533",
    "packageNo": "PKT-000041",
    "customerName": "Yusuf Kaya",
    "channel": "Hepsiburada"
  },
  {
    "id": 42,
    "shipmentNo": 8200042,
    "orderNo": 61200042,
    "companyId": 1,
    "trackingNo": "YK-2026-0101554",
    "shipFrom": "İzmir Depo",
    "shipTo": {
      "district": "Keçiören",
      "province": "Ankara"
    },
    "shipTime": "2026-05-04T14:34:00",
    "status": "returned",
    "cargoType": "order",
    "referenceId": "REF-70546",
    "packageNo": "PKT-000042",
    "customerName": "Ceren Polat",
    "channel": "N11"
  },
  {
    "id": 43,
    "shipmentNo": 8200043,
    "orderNo": 61200043,
    "companyId": 1,
    "trackingNo": "YK-2026-0101591",
    "shipFrom": "İstanbul Ana Depo",
    "shipTo": {
      "district": "Akçaabat",
      "province": "Trabzon"
    },
    "shipTime": "2026-05-06T05:29:00",
    "status": "delivered",
    "cargoType": "order",
    "referenceId": "REF-70559",
    "packageNo": "PKT-000043",
    "customerName": "Zeynep Öztürk",
    "channel": "N11"
  },
  {
    "id": 44,
    "shipmentNo": 8200044,
    "orderNo": 61200044,
    "companyId": 1,
    "trackingNo": "YK-2026-0101628",
    "shipFrom": "İzmir Depo",
    "shipTo": {
      "district": "Yüreğir",
      "province": "Adana"
    },
    "shipTime": "2026-05-06T05:50:00",
    "status": "delivered",
    "cargoType": "return",
    "referenceId": "REF-70572",
    "packageNo": "PKT-000044",
    "customerName": "Deniz Polat",
    "channel": "Hepsiburada"
  },
  {
    "id": 45,
    "shipmentNo": 8200045,
    "orderNo": 61200045,
    "companyId": 1,
    "trackingNo": "YK-2026-0101665",
    "shipFrom": "Ankara Ostim",
    "shipTo": {
      "district": "Bornova",
      "province": "İzmir"
    },
    "shipTime": "2026-05-06T09:54:00",
    "status": "delivered",
    "cargoType": "order",
    "referenceId": "REF-70585",
    "packageNo": "PKT-000045",
    "customerName": "İrem Aksoy",
    "channel": "Trendyol"
  },
  {
    "id": 46,
    "shipmentNo": 8200046,
    "orderNo": 61200046,
    "companyId": 1,
    "trackingNo": "YK-2026-0101702",
    "shipFrom": "İstanbul Ana Depo",
    "shipTo": {
      "district": "Çukurova",
      "province": "Adana"
    },
    "shipTime": "2026-05-07T09:54:00",
    "status": "delivered",
    "cargoType": "order",
    "referenceId": "REF-70598",
    "packageNo": "PKT-000046",
    "customerName": "Mehmet Öztürk",
    "channel": "Kendi Web Sitesi"
  },
  {
    "id": 47,
    "shipmentNo": 8200047,
    "orderNo": 61200047,
    "companyId": 3,
    "trackingNo": "MNG-2026-0101739",
    "shipFrom": "Bursa Depo",
    "shipTo": {
      "district": "Yüreğir",
      "province": "Adana"
    },
    "shipTime": "2026-05-07T13:38:00",
    "status": "delivered",
    "cargoType": "order",
    "referenceId": "REF-70611",
    "packageNo": "PKT-000047",
    "customerName": "Cem Doğan",
    "channel": "Hepsiburada"
  },
  {
    "id": 48,
    "shipmentNo": 8200048,
    "orderNo": 61200048,
    "companyId": 2,
    "trackingNo": "ARAS-2026-0101776",
    "shipFrom": "Ankara Merkez",
    "shipTo": {
      "district": "Kocasinan",
      "province": "Kayseri"
    },
    "shipTime": "2026-05-09T08:37:00",
    "status": "cancelled",
    "cargoType": "order",
    "referenceId": "REF-70624",
    "packageNo": "PKT-000048",
    "customerName": "Mustafa Aydın",
    "channel": "Trendyol"
  },
  {
    "id": 49,
    "shipmentNo": 8200049,
    "orderNo": 61200049,
    "companyId": 1,
    "trackingNo": "YK-2026-0101813",
    "shipFrom": "İstanbul Ana Depo",
    "shipTo": {
      "district": "Etimesgut",
      "province": "Ankara"
    },
    "shipTime": "2026-05-09T12:16:00",
    "status": "delivered",
    "cargoType": "order",
    "referenceId": "REF-70637",
    "packageNo": "PKT-000049",
    "customerName": "Kaan Bulut",
    "channel": "Trendyol"
  },
  {
    "id": 50,
    "shipmentNo": 8200050,
    "orderNo": 61200050,
    "companyId": 3,
    "trackingNo": "MNG-2026-0101850",
    "shipFrom": "İstanbul Anadolu",
    "shipTo": {
      "district": "Kocasinan",
      "province": "Kayseri"
    },
    "shipTime": "2026-05-10T10:01:00",
    "status": "delivered",
    "cargoType": "order",
    "referenceId": "REF-70650",
    "packageNo": "PKT-000050",
    "customerName": "İrem Erdoğan",
    "channel": "Hepsiburada"
  },
  {
    "id": 51,
    "shipmentNo": 8200051,
    "orderNo": 61200051,
    "companyId": 8,
    "trackingNo": "HPS-2026-0101887",
    "shipFrom": "İzmir Depo",
    "shipTo": {
      "district": "Kocasinan",
      "province": "Kayseri"
    },
    "shipTime": "2026-05-10T13:34:00",
    "status": "cancelled",
    "cargoType": "order",
    "referenceId": "REF-70663",
    "packageNo": "PKT-000051",
    "customerName": "Onur Yılmaz",
    "channel": "Kendi Web Sitesi"
  },
  {
    "id": 52,
    "shipmentNo": 8200052,
    "orderNo": 61200052,
    "companyId": 1,
    "trackingNo": "YK-2026-0101924",
    "shipFrom": "İzmir Depo",
    "shipTo": {
      "district": "Pendik",
      "province": "İstanbul"
    },
    "shipTime": "2026-05-11T06:55:00",
    "status": "delivered",
    "cargoType": "order",
    "referenceId": "REF-70676",
    "packageNo": "PKT-000052",
    "customerName": "Kaan Koç",
    "channel": "Hepsiburada"
  },
  {
    "id": 53,
    "shipmentNo": 8200053,
    "orderNo": 61200053,
    "companyId": 3,
    "trackingNo": "MNG-2026-0101961",
    "shipFrom": "İstanbul Anadolu",
    "shipTo": {
      "district": "Ortahisar",
      "province": "Trabzon"
    },
    "shipTime": "2026-05-12T06:12:00",
    "status": "delivered",
    "cargoType": "order",
    "referenceId": "REF-70689",
    "packageNo": "PKT-000053",
    "customerName": "Aslı Aksoy",
    "channel": "Kendi Web Sitesi"
  },
  {
    "id": 54,
    "shipmentNo": 8200054,
    "orderNo": 61200054,
    "companyId": 1,
    "trackingNo": "YK-2026-0101998",
    "shipFrom": "Bursa Depo",
    "shipTo": {
      "district": "Şahinbey",
      "province": "Gaziantep"
    },
    "shipTime": "2026-05-12T10:44:00",
    "status": "delivered",
    "cargoType": "order",
    "referenceId": "REF-70702",
    "packageNo": "PKT-000054",
    "customerName": "Furkan Koç",
    "channel": "Trendyol"
  },
  {
    "id": 55,
    "shipmentNo": 8200055,
    "orderNo": 61200055,
    "companyId": 1,
    "trackingNo": "YK-2026-0102035",
    "shipFrom": "Bursa Depo",
    "shipTo": {
      "district": "Şişli",
      "province": "İstanbul"
    },
    "shipTime": "2026-05-12T11:14:00",
    "status": "delivered",
    "cargoType": "order",
    "referenceId": "REF-70715",
    "packageNo": "PKT-000055",
    "customerName": "Ebru Yılmaz",
    "channel": "Kendi Web Sitesi"
  },
  {
    "id": 56,
    "shipmentNo": 8200056,
    "orderNo": 61200056,
    "companyId": 3,
    "trackingNo": "MNG-2026-0102072",
    "shipFrom": "Ankara Merkez",
    "shipTo": {
      "district": "Ortahisar",
      "province": "Trabzon"
    },
    "shipTime": "2026-05-12T12:23:00",
    "status": "delivered",
    "cargoType": "return",
    "referenceId": "REF-70728",
    "packageNo": "PKT-000056",
    "customerName": "Gül Aksoy",
    "channel": "Hepsiburada"
  },
  {
    "id": 57,
    "shipmentNo": 8200057,
    "orderNo": 61200057,
    "companyId": 6,
    "trackingNo": "DHL-2026-0102109",
    "shipFrom": "Ankara Ostim",
    "shipTo": {
      "district": "Kocasinan",
      "province": "Kayseri"
    },
    "shipTime": "2026-05-13T07:58:00",
    "status": "delivered",
    "cargoType": "order",
    "referenceId": "REF-70741",
    "packageNo": "PKT-000057",
    "customerName": "Fatma Özdemir",
    "channel": "Trendyol"
  },
  {
    "id": 58,
    "shipmentNo": 8200058,
    "orderNo": 61200058,
    "companyId": 2,
    "trackingNo": "ARAS-2026-0102146",
    "shipFrom": "Bursa Depo",
    "shipTo": {
      "district": "Melikgazi",
      "province": "Kayseri"
    },
    "shipTime": "2026-05-14T07:00:00",
    "status": "delivered",
    "cargoType": "order",
    "referenceId": "REF-70754",
    "packageNo": "PKT-000058",
    "customerName": "Tuğçe Kurt",
    "channel": "Trendyol"
  },
  {
    "id": 59,
    "shipmentNo": 8200059,
    "orderNo": 61200059,
    "companyId": 3,
    "trackingNo": "MNG-2026-0102183",
    "shipFrom": "İstanbul Ana Depo",
    "shipTo": {
      "district": "Kocasinan",
      "province": "Kayseri"
    },
    "shipTime": "2026-05-14T12:41:00",
    "status": "returned",
    "cargoType": "return",
    "referenceId": "REF-70767",
    "packageNo": "PKT-000059",
    "customerName": "Merve Çelik",
    "channel": "Hepsiburada"
  },
  {
    "id": 60,
    "shipmentNo": 8200060,
    "orderNo": 61200060,
    "companyId": 6,
    "trackingNo": "DHL-2026-0102220",
    "shipFrom": "Ankara Ostim",
    "shipTo": {
      "district": "Kocasinan",
      "province": "Kayseri"
    },
    "shipTime": "2026-05-15T09:41:00",
    "status": "delivered",
    "cargoType": "order",
    "referenceId": "REF-70780",
    "packageNo": "PKT-000060",
    "customerName": "Yusuf Koç",
    "channel": "Hepsiburada"
  },
  {
    "id": 61,
    "shipmentNo": 8200061,
    "orderNo": 61200061,
    "companyId": 2,
    "trackingNo": "ARAS-2026-0102257",
    "shipFrom": "İstanbul Ana Depo",
    "shipTo": {
      "district": "Kocasinan",
      "province": "Kayseri"
    },
    "shipTime": "2026-05-15T12:50:00",
    "status": "delivered",
    "cargoType": "order",
    "referenceId": "REF-70793",
    "packageNo": "PKT-000061",
    "customerName": "Aslı Demir",
    "channel": "N11"
  },
  {
    "id": 62,
    "shipmentNo": 8200062,
    "orderNo": 61200062,
    "companyId": 3,
    "trackingNo": "MNG-2026-0102294",
    "shipFrom": "İstanbul Ana Depo",
    "shipTo": {
      "district": "Beşiktaş",
      "province": "İstanbul"
    },
    "shipTime": "2026-05-19T07:44:00",
    "status": "delivered",
    "cargoType": "return",
    "referenceId": "REF-70806",
    "packageNo": "PKT-000062",
    "customerName": "Pınar Yılmaz",
    "channel": "Trendyol"
  },
  {
    "id": 63,
    "shipmentNo": 8200063,
    "orderNo": 61200063,
    "companyId": 3,
    "trackingNo": "MNG-2026-0102331",
    "shipFrom": "Ankara Merkez",
    "shipTo": {
      "district": "Melikgazi",
      "province": "Kayseri"
    },
    "shipTime": "2026-05-20T05:04:00",
    "status": "delivered",
    "cargoType": "order",
    "referenceId": "REF-70819",
    "packageNo": "PKT-000063",
    "customerName": "Barış Güneş",
    "channel": "Trendyol"
  },
  {
    "id": 64,
    "shipmentNo": 8200064,
    "orderNo": 61200064,
    "companyId": 3,
    "trackingNo": "MNG-2026-0102368",
    "shipFrom": "İstanbul Anadolu",
    "shipTo": {
      "district": "Çankaya",
      "province": "Ankara"
    },
    "shipTime": "2026-05-20T05:31:00",
    "status": "delivered",
    "cargoType": "order",
    "referenceId": "REF-70832",
    "packageNo": "PKT-000064",
    "customerName": "Ebru Demir",
    "channel": "Trendyol"
  },
  {
    "id": 65,
    "shipmentNo": 8200065,
    "orderNo": 61200065,
    "companyId": 1,
    "trackingNo": "YK-2026-0102405",
    "shipFrom": "İzmir Depo",
    "shipTo": {
      "district": "Çukurova",
      "province": "Adana"
    },
    "shipTime": "2026-05-20T09:46:00",
    "status": "cancelled",
    "cargoType": "return",
    "referenceId": "REF-70845",
    "packageNo": "PKT-000065",
    "customerName": "Gül Yavuz",
    "channel": "Hepsiburada"
  },
  {
    "id": 66,
    "shipmentNo": 8200066,
    "orderNo": 61200066,
    "companyId": 6,
    "trackingNo": "DHL-2026-0102442",
    "shipFrom": "Bursa Depo",
    "shipTo": {
      "district": "Çukurova",
      "province": "Adana"
    },
    "shipTime": "2026-05-20T14:33:00",
    "status": "delivered",
    "cargoType": "order",
    "referenceId": "REF-70858",
    "packageNo": "PKT-000066",
    "customerName": "Mehmet Koç",
    "channel": "Trendyol"
  },
  {
    "id": 67,
    "shipmentNo": 8200067,
    "orderNo": 61200067,
    "companyId": 7,
    "trackingNo": "HRZ-2026-0102479",
    "shipFrom": "Bursa Depo",
    "shipTo": {
      "district": "Nilüfer",
      "province": "Bursa"
    },
    "shipTime": "2026-05-21T08:07:00",
    "status": "delivered",
    "cargoType": "order",
    "referenceId": "REF-70871",
    "packageNo": "PKT-000067",
    "customerName": "Serkan Bulut",
    "channel": "Hepsiburada"
  },
  {
    "id": 68,
    "shipmentNo": 8200068,
    "orderNo": 61200068,
    "companyId": 1,
    "trackingNo": "YK-2026-0102516",
    "shipFrom": "İzmir Depo",
    "shipTo": {
      "district": "Kocasinan",
      "province": "Kayseri"
    },
    "shipTime": "2026-05-21T09:33:00",
    "status": "delivered",
    "cargoType": "order",
    "referenceId": "REF-70884",
    "packageNo": "PKT-000068",
    "customerName": "Kaan Bulut",
    "channel": "Hepsiburada"
  },
  {
    "id": 69,
    "shipmentNo": 8200069,
    "orderNo": 61200069,
    "companyId": 7,
    "trackingNo": "HRZ-2026-0102553",
    "shipFrom": "İstanbul Anadolu",
    "shipTo": {
      "district": "Maltepe",
      "province": "İstanbul"
    },
    "shipTime": "2026-05-21T12:53:00",
    "status": "delivered",
    "cargoType": "order",
    "referenceId": "REF-70897",
    "packageNo": "PKT-000069",
    "customerName": "İrem Polat",
    "channel": "Hepsiburada"
  },
  {
    "id": 70,
    "shipmentNo": 8200070,
    "orderNo": 61200070,
    "companyId": 2,
    "trackingNo": "ARAS-2026-0102590",
    "shipFrom": "Ankara Ostim",
    "shipTo": {
      "district": "Kocasinan",
      "province": "Kayseri"
    },
    "shipTime": "2026-05-22T05:23:00",
    "status": "delivered",
    "cargoType": "order",
    "referenceId": "REF-70910",
    "packageNo": "PKT-000070",
    "customerName": "Gizem Bulut",
    "channel": "Hepsiburada"
  },
  {
    "id": 71,
    "shipmentNo": 8200071,
    "orderNo": 61200071,
    "companyId": 1,
    "trackingNo": "YK-2026-0102627",
    "shipFrom": "İstanbul Anadolu",
    "shipTo": {
      "district": "Maltepe",
      "province": "İstanbul"
    },
    "shipTime": "2026-05-22T07:01:00",
    "status": "delivered",
    "cargoType": "order",
    "referenceId": "REF-70923",
    "packageNo": "PKT-000071",
    "customerName": "Doğan Kurt",
    "channel": "Trendyol"
  },
  {
    "id": 72,
    "shipmentNo": 8200072,
    "orderNo": 61200072,
    "companyId": 8,
    "trackingNo": "HPS-2026-0102664",
    "shipFrom": "Bursa Depo",
    "shipTo": {
      "district": "Etimesgut",
      "province": "Ankara"
    },
    "shipTime": "2026-05-23T06:20:00",
    "status": "delivered",
    "cargoType": "return",
    "referenceId": "REF-70936",
    "packageNo": "PKT-000072",
    "customerName": "Gizem Bulut",
    "channel": "Trendyol"
  },
  {
    "id": 73,
    "shipmentNo": 8200073,
    "orderNo": 61200073,
    "companyId": 1,
    "trackingNo": "YK-2026-0102701",
    "shipFrom": "İzmir Depo",
    "shipTo": {
      "district": "Karatay",
      "province": "Konya"
    },
    "shipTime": "2026-05-23T07:54:00",
    "status": "returned",
    "cargoType": "order",
    "referenceId": "REF-70949",
    "packageNo": "PKT-000073",
    "customerName": "Fatma Çelik",
    "channel": "Trendyol"
  },
  {
    "id": 74,
    "shipmentNo": 8200074,
    "orderNo": 61200074,
    "companyId": 3,
    "trackingNo": "MNG-2026-0102738",
    "shipFrom": "Bursa Depo",
    "shipTo": {
      "district": "Yıldırım",
      "province": "Bursa"
    },
    "shipTime": "2026-05-23T10:48:00",
    "status": "delivered",
    "cargoType": "order",
    "referenceId": "REF-70962",
    "packageNo": "PKT-000074",
    "customerName": "Aslı Aksoy",
    "channel": "Trendyol"
  },
  {
    "id": 75,
    "shipmentNo": 8200075,
    "orderNo": 61200075,
    "companyId": 1,
    "trackingNo": "YK-2026-0102775",
    "shipFrom": "İzmir Depo",
    "shipTo": {
      "district": "Meram",
      "province": "Konya"
    },
    "shipTime": "2026-05-23T12:06:00",
    "status": "delivered",
    "cargoType": "order",
    "referenceId": "REF-70975",
    "packageNo": "PKT-000075",
    "customerName": "Fatma Aydın",
    "channel": "Kendi Web Sitesi"
  },
  {
    "id": 76,
    "shipmentNo": 8200076,
    "orderNo": 61200076,
    "companyId": 7,
    "trackingNo": "HRZ-2026-0102812",
    "shipFrom": "Ankara Ostim",
    "shipTo": {
      "district": "Ortahisar",
      "province": "Trabzon"
    },
    "shipTime": "2026-05-23T14:05:00",
    "status": "delivered",
    "cargoType": "order",
    "referenceId": "REF-70988",
    "packageNo": "PKT-000076",
    "customerName": "Gül Öztürk",
    "channel": "N11"
  },
  {
    "id": 77,
    "shipmentNo": 8200077,
    "orderNo": 61200077,
    "companyId": 1,
    "trackingNo": "YK-2026-0102849",
    "shipFrom": "İstanbul Anadolu",
    "shipTo": {
      "district": "Yenimahalle",
      "province": "Ankara"
    },
    "shipTime": "2026-05-24T07:55:00",
    "status": "delivered",
    "cargoType": "order",
    "referenceId": "REF-71001",
    "packageNo": "PKT-000077",
    "customerName": "Onur Arslan",
    "channel": "Trendyol"
  },
  {
    "id": 78,
    "shipmentNo": 8200078,
    "orderNo": 61200078,
    "companyId": 2,
    "trackingNo": "ARAS-2026-0102886",
    "shipFrom": "İstanbul Ana Depo",
    "shipTo": {
      "district": "Şehitkamil",
      "province": "Gaziantep"
    },
    "shipTime": "2026-05-24T14:55:00",
    "status": "delivered",
    "cargoType": "order",
    "referenceId": "REF-71014",
    "packageNo": "PKT-000078",
    "customerName": "İrem Şahin",
    "channel": "Hepsiburada"
  },
  {
    "id": 79,
    "shipmentNo": 8200079,
    "orderNo": 61200079,
    "companyId": 2,
    "trackingNo": "ARAS-2026-0102923",
    "shipFrom": "Ankara Ostim",
    "shipTo": {
      "district": "Konak",
      "province": "İzmir"
    },
    "shipTime": "2026-05-25T05:21:00",
    "status": "delivered",
    "cargoType": "order",
    "referenceId": "REF-71027",
    "packageNo": "PKT-000079",
    "customerName": "Kerem Bulut",
    "channel": "Trendyol"
  },
  {
    "id": 80,
    "shipmentNo": 8200080,
    "orderNo": 61200080,
    "companyId": 1,
    "trackingNo": "YK-2026-0102960",
    "shipFrom": "Ankara Merkez",
    "shipTo": {
      "district": "Çukurova",
      "province": "Adana"
    },
    "shipTime": "2026-05-25T06:17:00",
    "status": "delivered",
    "cargoType": "order",
    "referenceId": "REF-71040",
    "packageNo": "PKT-000080",
    "customerName": "Aslı Aksoy",
    "channel": "Hepsiburada"
  },
  {
    "id": 81,
    "shipmentNo": 8200081,
    "orderNo": 61200081,
    "companyId": 7,
    "trackingNo": "HRZ-2026-0102997",
    "shipFrom": "İzmir Depo",
    "shipTo": {
      "district": "Kocasinan",
      "province": "Kayseri"
    },
    "shipTime": "2026-05-26T10:17:00",
    "status": "delivered",
    "cargoType": "order",
    "referenceId": "REF-71053",
    "packageNo": "PKT-000081",
    "customerName": "Gül Erdoğan",
    "channel": "Kendi Web Sitesi"
  },
  {
    "id": 82,
    "shipmentNo": 8200082,
    "orderNo": 61200082,
    "companyId": 1,
    "trackingNo": "YK-2026-0103034",
    "shipFrom": "İstanbul Anadolu",
    "shipTo": {
      "district": "Selçuklu",
      "province": "Konya"
    },
    "shipTime": "2026-05-26T13:44:00",
    "status": "delivered",
    "cargoType": "return",
    "referenceId": "REF-71066",
    "packageNo": "PKT-000082",
    "customerName": "Mehmet Koç",
    "channel": "Trendyol"
  },
  {
    "id": 83,
    "shipmentNo": 8200083,
    "orderNo": 61200083,
    "companyId": 8,
    "trackingNo": "HPS-2026-0103071",
    "shipFrom": "Ankara Ostim",
    "shipTo": {
      "district": "Keçiören",
      "province": "Ankara"
    },
    "shipTime": "2026-05-27T11:17:00",
    "status": "returned",
    "cargoType": "order",
    "referenceId": "REF-71079",
    "packageNo": "PKT-000083",
    "customerName": "Ebru Aksoy",
    "channel": "Trendyol"
  },
  {
    "id": 84,
    "shipmentNo": 8200084,
    "orderNo": 61200084,
    "companyId": 1,
    "trackingNo": "YK-2026-0103108",
    "shipFrom": "Ankara Ostim",
    "shipTo": {
      "district": "Kocasinan",
      "province": "Kayseri"
    },
    "shipTime": "2026-05-27T12:56:00",
    "status": "cancelled",
    "cargoType": "order",
    "referenceId": "REF-71092",
    "packageNo": "PKT-000084",
    "customerName": "Doğan Aksoy",
    "channel": "N11"
  },
  {
    "id": 85,
    "shipmentNo": 8200085,
    "orderNo": 61200085,
    "companyId": 7,
    "trackingNo": "HRZ-2026-0103145",
    "shipFrom": "Ankara Ostim",
    "shipTo": {
      "district": "Çukurova",
      "province": "Adana"
    },
    "shipTime": "2026-05-28T11:45:00",
    "status": "delivered",
    "cargoType": "return",
    "referenceId": "REF-71105",
    "packageNo": "PKT-000085",
    "customerName": "Selin Doğan",
    "channel": "Trendyol"
  },
  {
    "id": 86,
    "shipmentNo": 8200086,
    "orderNo": 61200086,
    "companyId": 2,
    "trackingNo": "ARAS-2026-0103182",
    "shipFrom": "İstanbul Anadolu",
    "shipTo": {
      "district": "Yıldırım",
      "province": "Bursa"
    },
    "shipTime": "2026-05-28T13:10:00",
    "status": "delivered",
    "cargoType": "order",
    "referenceId": "REF-71118",
    "packageNo": "PKT-000086",
    "customerName": "Onur Arslan",
    "channel": "Hepsiburada"
  },
  {
    "id": 87,
    "shipmentNo": 8200087,
    "orderNo": 61200087,
    "companyId": 2,
    "trackingNo": "ARAS-2026-0103219",
    "shipFrom": "Ankara Merkez",
    "shipTo": {
      "district": "Selçuklu",
      "province": "Konya"
    },
    "shipTime": "2026-05-29T07:58:00",
    "status": "delivered",
    "cargoType": "order",
    "referenceId": "REF-71131",
    "packageNo": "PKT-000087",
    "customerName": "Emre Yıldız",
    "channel": "Trendyol"
  },
  {
    "id": 88,
    "shipmentNo": 8200088,
    "orderNo": 61200088,
    "companyId": 1,
    "trackingNo": "YK-2026-0103256",
    "shipFrom": "Bursa Depo",
    "shipTo": {
      "district": "Seyhan",
      "province": "Adana"
    },
    "shipTime": "2026-05-29T11:11:00",
    "status": "delivered",
    "cargoType": "order",
    "referenceId": "REF-71144",
    "packageNo": "PKT-000088",
    "customerName": "Mehmet Kaya",
    "channel": "Hepsiburada"
  },
  {
    "id": 89,
    "shipmentNo": 8200089,
    "orderNo": 61200089,
    "companyId": 1,
    "trackingNo": "YK-2026-0103293",
    "shipFrom": "Ankara Ostim",
    "shipTo": {
      "district": "Çukurova",
      "province": "Adana"
    },
    "shipTime": "2026-05-29T11:52:00",
    "status": "delivered",
    "cargoType": "order",
    "referenceId": "REF-71157",
    "packageNo": "PKT-000089",
    "customerName": "Elif Şahin",
    "channel": "Trendyol"
  },
  {
    "id": 90,
    "shipmentNo": 8200090,
    "orderNo": 61200090,
    "companyId": 2,
    "trackingNo": "ARAS-2026-0103330",
    "shipFrom": "Bursa Depo",
    "shipTo": {
      "district": "Şahinbey",
      "province": "Gaziantep"
    },
    "shipTime": "2026-05-30T11:14:00",
    "status": "delivered",
    "cargoType": "order",
    "referenceId": "REF-71170",
    "packageNo": "PKT-000090",
    "customerName": "Kerem Özdemir",
    "channel": "Kendi Web Sitesi"
  },
  {
    "id": 91,
    "shipmentNo": 8200091,
    "orderNo": 61200091,
    "companyId": 4,
    "trackingNo": "PTT-2026-0103367",
    "shipFrom": "Ankara Merkez",
    "shipTo": {
      "district": "Pendik",
      "province": "İstanbul"
    },
    "shipTime": "2026-05-31T14:16:00",
    "status": "returned",
    "cargoType": "order",
    "referenceId": "REF-71183",
    "packageNo": "PKT-000091",
    "customerName": "Gül Özdemir",
    "channel": "Trendyol"
  },
  {
    "id": 92,
    "shipmentNo": 8200092,
    "orderNo": 61200092,
    "companyId": 1,
    "trackingNo": "YK-2026-0103404",
    "shipFrom": "İzmir Depo",
    "shipTo": {
      "district": "Yıldırım",
      "province": "Bursa"
    },
    "shipTime": "2026-06-01T09:28:00",
    "status": "delivered",
    "cargoType": "order",
    "referenceId": "REF-71196",
    "packageNo": "PKT-000092",
    "customerName": "İrem Erdoğan",
    "channel": "N11"
  },
  {
    "id": 93,
    "shipmentNo": 8200093,
    "orderNo": 61200093,
    "companyId": 2,
    "trackingNo": "ARAS-2026-0103441",
    "shipFrom": "İstanbul Anadolu",
    "shipTo": {
      "district": "Akçaabat",
      "province": "Trabzon"
    },
    "shipTime": "2026-06-02T13:04:00",
    "status": "delivered",
    "cargoType": "order",
    "referenceId": "REF-71209",
    "packageNo": "PKT-000093",
    "customerName": "Ceren Yıldız",
    "channel": "N11"
  },
  {
    "id": 94,
    "shipmentNo": 8200094,
    "orderNo": 61200094,
    "companyId": 6,
    "trackingNo": "DHL-2026-0103478",
    "shipFrom": "Bursa Depo",
    "shipTo": {
      "district": "Yüreğir",
      "province": "Adana"
    },
    "shipTime": "2026-06-03T06:33:00",
    "status": "delivered",
    "cargoType": "order",
    "referenceId": "REF-71222",
    "packageNo": "PKT-000094",
    "customerName": "Ayşe Doğan",
    "channel": "Trendyol"
  },
  {
    "id": 95,
    "shipmentNo": 8200095,
    "orderNo": 61200095,
    "companyId": 3,
    "trackingNo": "MNG-2026-0103515",
    "shipFrom": "İstanbul Anadolu",
    "shipTo": {
      "district": "Kepez",
      "province": "Antalya"
    },
    "shipTime": "2026-06-03T08:40:00",
    "status": "delivered",
    "cargoType": "order",
    "referenceId": "REF-71235",
    "packageNo": "PKT-000095",
    "customerName": "Merve Çelik",
    "channel": "Trendyol"
  },
  {
    "id": 96,
    "shipmentNo": 8200096,
    "orderNo": 61200096,
    "companyId": 7,
    "trackingNo": "HRZ-2026-0103552",
    "shipFrom": "İstanbul Anadolu",
    "shipTo": {
      "district": "Seyhan",
      "province": "Adana"
    },
    "shipTime": "2026-06-03T10:42:00",
    "status": "delivered",
    "cargoType": "order",
    "referenceId": "REF-71248",
    "packageNo": "PKT-000096",
    "customerName": "Serkan Kurt",
    "channel": "Trendyol"
  },
  {
    "id": 97,
    "shipmentNo": 8200097,
    "orderNo": 61200097,
    "companyId": 1,
    "trackingNo": "YK-2026-0103589",
    "shipFrom": "İzmir Depo",
    "shipTo": {
      "district": "Çiğli",
      "province": "İzmir"
    },
    "shipTime": "2026-06-03T12:00:00",
    "status": "delivered",
    "cargoType": "return",
    "referenceId": "REF-71261",
    "packageNo": "PKT-000097",
    "customerName": "Serkan Doğan",
    "channel": "Hepsiburada"
  },
  {
    "id": 98,
    "shipmentNo": 8200098,
    "orderNo": 61200098,
    "companyId": 2,
    "trackingNo": "ARAS-2026-0103626",
    "shipFrom": "İstanbul Anadolu",
    "shipTo": {
      "district": "Çiğli",
      "province": "İzmir"
    },
    "shipTime": "2026-06-05T13:13:00",
    "status": "delivered",
    "cargoType": "order",
    "referenceId": "REF-71274",
    "packageNo": "PKT-000098",
    "customerName": "Zeynep Demir",
    "channel": "N11"
  },
  {
    "id": 99,
    "shipmentNo": 8200099,
    "orderNo": 61200099,
    "companyId": 3,
    "trackingNo": "MNG-2026-0103663",
    "shipFrom": "İzmir Depo",
    "shipTo": {
      "district": "Seyhan",
      "province": "Adana"
    },
    "shipTime": "2026-06-05T14:38:00",
    "status": "delivered",
    "cargoType": "order",
    "referenceId": "REF-71287",
    "packageNo": "PKT-000099",
    "customerName": "Tuğçe Özdemir",
    "channel": "Trendyol"
  },
  {
    "id": 100,
    "shipmentNo": 8200100,
    "orderNo": 61200100,
    "companyId": 3,
    "trackingNo": "MNG-2026-0103700",
    "shipFrom": "İstanbul Ana Depo",
    "shipTo": {
      "district": "Mamak",
      "province": "Ankara"
    },
    "shipTime": "2026-06-06T08:00:00",
    "status": "delivered",
    "cargoType": "order",
    "referenceId": "REF-71300",
    "packageNo": "PKT-000100",
    "customerName": "Serkan Koç",
    "channel": "Trendyol"
  },
  {
    "id": 101,
    "shipmentNo": 8200101,
    "orderNo": 61200101,
    "companyId": 3,
    "trackingNo": "MNG-2026-0103737",
    "shipFrom": "Ankara Merkez",
    "shipTo": {
      "district": "Mamak",
      "province": "Ankara"
    },
    "shipTime": "2026-06-06T12:22:00",
    "status": "delivered",
    "cargoType": "order",
    "referenceId": "REF-71313",
    "packageNo": "PKT-000101",
    "customerName": "Kerem Aydın",
    "channel": "N11"
  },
  {
    "id": 102,
    "shipmentNo": 8200102,
    "orderNo": 61200102,
    "companyId": 4,
    "trackingNo": "PTT-2026-0103774",
    "shipFrom": "İstanbul Anadolu",
    "shipTo": {
      "district": "Ortahisar",
      "province": "Trabzon"
    },
    "shipTime": "2026-06-08T05:30:00",
    "status": "delivered",
    "cargoType": "order",
    "referenceId": "REF-71326",
    "packageNo": "PKT-000102",
    "customerName": "Barış Bulut",
    "channel": "Trendyol"
  },
  {
    "id": 103,
    "shipmentNo": 8200103,
    "orderNo": 61200103,
    "companyId": 1,
    "trackingNo": "YK-2026-0103811",
    "shipFrom": "İzmir Depo",
    "shipTo": {
      "district": "Akçaabat",
      "province": "Trabzon"
    },
    "shipTime": "2026-06-11T05:43:00",
    "status": "delivered",
    "cargoType": "order",
    "referenceId": "REF-71339",
    "packageNo": "PKT-000103",
    "customerName": "Onur Kurt",
    "channel": "Trendyol"
  },
  {
    "id": 104,
    "shipmentNo": 8200104,
    "orderNo": 61200104,
    "companyId": 2,
    "trackingNo": "ARAS-2026-0103848",
    "shipFrom": "Bursa Depo",
    "shipTo": {
      "district": "Meram",
      "province": "Konya"
    },
    "shipTime": "2026-06-11T06:01:00",
    "status": "delivered",
    "cargoType": "order",
    "referenceId": "REF-71352",
    "packageNo": "PKT-000104",
    "customerName": "Yusuf Yıldız",
    "channel": "N11"
  },
  {
    "id": 105,
    "shipmentNo": 8200105,
    "orderNo": 61200105,
    "companyId": 7,
    "trackingNo": "HRZ-2026-0103885",
    "shipFrom": "Ankara Ostim",
    "shipTo": {
      "district": "Akçaabat",
      "province": "Trabzon"
    },
    "shipTime": "2026-06-11T07:10:00",
    "status": "delivered",
    "cargoType": "order",
    "referenceId": "REF-71365",
    "packageNo": "PKT-000105",
    "customerName": "Barış Polat",
    "channel": "Trendyol"
  },
  {
    "id": 106,
    "shipmentNo": 8200106,
    "orderNo": 61200106,
    "companyId": 1,
    "trackingNo": "YK-2026-0103922",
    "shipFrom": "Bursa Depo",
    "shipTo": {
      "district": "Pendik",
      "province": "İstanbul"
    },
    "shipTime": "2026-06-11T08:25:00",
    "status": "delivered",
    "cargoType": "order",
    "referenceId": "REF-71378",
    "packageNo": "PKT-000106",
    "customerName": "Deniz Erdoğan",
    "channel": "Kendi Web Sitesi"
  },
  {
    "id": 107,
    "shipmentNo": 8200107,
    "orderNo": 61200107,
    "companyId": 7,
    "trackingNo": "HRZ-2026-0103959",
    "shipFrom": "İstanbul Anadolu",
    "shipTo": {
      "district": "Seyhan",
      "province": "Adana"
    },
    "shipTime": "2026-06-11T10:06:00",
    "status": "delivered",
    "cargoType": "order",
    "referenceId": "REF-71391",
    "packageNo": "PKT-000107",
    "customerName": "Gül Demir",
    "channel": "Hepsiburada"
  },
  {
    "id": 108,
    "shipmentNo": 8200108,
    "orderNo": 61200108,
    "companyId": 3,
    "trackingNo": "MNG-2026-0103996",
    "shipFrom": "İstanbul Anadolu",
    "shipTo": {
      "district": "Seyhan",
      "province": "Adana"
    },
    "shipTime": "2026-06-11T12:29:00",
    "status": "delivered",
    "cargoType": "order",
    "referenceId": "REF-71404",
    "packageNo": "PKT-000108",
    "customerName": "Barış Özdemir",
    "channel": "Trendyol"
  },
  {
    "id": 109,
    "shipmentNo": 8200109,
    "orderNo": 61200109,
    "companyId": 1,
    "trackingNo": "YK-2026-0104033",
    "shipFrom": "Ankara Ostim",
    "shipTo": {
      "district": "Ortahisar",
      "province": "Trabzon"
    },
    "shipTime": "2026-06-12T05:20:00",
    "status": "delivered",
    "cargoType": "order",
    "referenceId": "REF-71417",
    "packageNo": "PKT-000109",
    "customerName": "Hakan Şimşek",
    "channel": "N11"
  },
  {
    "id": 110,
    "shipmentNo": 8200110,
    "orderNo": 61200110,
    "companyId": 1,
    "trackingNo": "YK-2026-0104070",
    "shipFrom": "Ankara Ostim",
    "shipTo": {
      "district": "Kepez",
      "province": "Antalya"
    },
    "shipTime": "2026-06-12T07:59:00",
    "status": "delivered",
    "cargoType": "order",
    "referenceId": "REF-71430",
    "packageNo": "PKT-000110",
    "customerName": "Burak Aydın",
    "channel": "Hepsiburada"
  },
  {
    "id": 111,
    "shipmentNo": 8200111,
    "orderNo": 61200111,
    "companyId": 1,
    "trackingNo": "YK-2026-0104107",
    "shipFrom": "İstanbul Ana Depo",
    "shipTo": {
      "district": "Selçuklu",
      "province": "Konya"
    },
    "shipTime": "2026-06-12T08:49:00",
    "status": "delivered",
    "cargoType": "order",
    "referenceId": "REF-71443",
    "packageNo": "PKT-000111",
    "customerName": "Serkan Arslan",
    "channel": "Trendyol"
  },
  {
    "id": 112,
    "shipmentNo": 8200112,
    "orderNo": 61200112,
    "companyId": 6,
    "trackingNo": "DHL-2026-0104144",
    "shipFrom": "Ankara Merkez",
    "shipTo": {
      "district": "Osmangazi",
      "province": "Bursa"
    },
    "shipTime": "2026-06-12T08:54:00",
    "status": "delivered",
    "cargoType": "order",
    "referenceId": "REF-71456",
    "packageNo": "PKT-000112",
    "customerName": "Barış Polat",
    "channel": "Trendyol"
  },
  {
    "id": 113,
    "shipmentNo": 8200113,
    "orderNo": 61200113,
    "companyId": 3,
    "trackingNo": "MNG-2026-0104181",
    "shipFrom": "Bursa Depo",
    "shipTo": {
      "district": "Seyhan",
      "province": "Adana"
    },
    "shipTime": "2026-06-13T12:26:00",
    "status": "delivered",
    "cargoType": "order",
    "referenceId": "REF-71469",
    "packageNo": "PKT-000113",
    "customerName": "Yusuf Şahin",
    "channel": "Trendyol"
  },
  {
    "id": 114,
    "shipmentNo": 8200114,
    "orderNo": 61200114,
    "companyId": 3,
    "trackingNo": "MNG-2026-0104218",
    "shipFrom": "Ankara Merkez",
    "shipTo": {
      "district": "Şişli",
      "province": "İstanbul"
    },
    "shipTime": "2026-06-14T09:31:00",
    "status": "delivered",
    "cargoType": "order",
    "referenceId": "REF-71482",
    "packageNo": "PKT-000114",
    "customerName": "Pınar Çelik",
    "channel": "Trendyol"
  },
  {
    "id": 115,
    "shipmentNo": 8200115,
    "orderNo": 61200115,
    "companyId": 2,
    "trackingNo": "ARAS-2026-0104255",
    "shipFrom": "İstanbul Ana Depo",
    "shipTo": {
      "district": "Şişli",
      "province": "İstanbul"
    },
    "shipTime": "2026-06-15T11:39:00",
    "status": "delivered",
    "cargoType": "order",
    "referenceId": "REF-71495",
    "packageNo": "PKT-000115",
    "customerName": "Kerem Koç",
    "channel": "Hepsiburada"
  },
  {
    "id": 116,
    "shipmentNo": 8200116,
    "orderNo": 61200116,
    "companyId": 3,
    "trackingNo": "MNG-2026-0104292",
    "shipFrom": "İstanbul Anadolu",
    "shipTo": {
      "district": "Akçaabat",
      "province": "Trabzon"
    },
    "shipTime": "2026-06-16T07:36:00",
    "status": "delivered",
    "cargoType": "order",
    "referenceId": "REF-71508",
    "packageNo": "PKT-000116",
    "customerName": "Deniz Kurt",
    "channel": "Hepsiburada"
  },
  {
    "id": 117,
    "shipmentNo": 8200117,
    "orderNo": 61200117,
    "companyId": 1,
    "trackingNo": "YK-2026-0104329",
    "shipFrom": "İstanbul Anadolu",
    "shipTo": {
      "district": "Üsküdar",
      "province": "İstanbul"
    },
    "shipTime": "2026-06-16T09:32:00",
    "status": "recalled",
    "cargoType": "order",
    "referenceId": "REF-71521",
    "packageNo": "PKT-000117",
    "customerName": "Tuğçe Kaya",
    "channel": "Trendyol"
  },
  {
    "id": 118,
    "shipmentNo": 8200118,
    "orderNo": 61200118,
    "companyId": 4,
    "trackingNo": "PTT-2026-0104366",
    "shipFrom": "İstanbul Ana Depo",
    "shipTo": {
      "district": "Yıldırım",
      "province": "Bursa"
    },
    "shipTime": "2026-06-16T10:41:00",
    "status": "delivered",
    "cargoType": "order",
    "referenceId": "REF-71534",
    "packageNo": "PKT-000118",
    "customerName": "Kerem Bulut",
    "channel": "Trendyol"
  },
  {
    "id": 119,
    "shipmentNo": 8200119,
    "orderNo": 61200119,
    "companyId": 1,
    "trackingNo": "YK-2026-0104403",
    "shipFrom": "Ankara Merkez",
    "shipTo": {
      "district": "Melikgazi",
      "province": "Kayseri"
    },
    "shipTime": "2026-06-16T12:41:00",
    "status": "delivered",
    "cargoType": "order",
    "referenceId": "REF-71547",
    "packageNo": "PKT-000119",
    "customerName": "Doğan Bulut",
    "channel": "Kendi Web Sitesi"
  },
  {
    "id": 120,
    "shipmentNo": 8200120,
    "orderNo": 61200120,
    "companyId": 2,
    "trackingNo": "ARAS-2026-0104440",
    "shipFrom": "İstanbul Anadolu",
    "shipTo": {
      "district": "Konak",
      "province": "İzmir"
    },
    "shipTime": "2026-06-17T06:31:00",
    "status": "returned",
    "cargoType": "return",
    "referenceId": "REF-71560",
    "packageNo": "PKT-000120",
    "customerName": "Barış Yıldız",
    "channel": "Kendi Web Sitesi"
  },
  {
    "id": 121,
    "shipmentNo": 8200121,
    "orderNo": 61200121,
    "companyId": 2,
    "trackingNo": "ARAS-2026-0104477",
    "shipFrom": "Ankara Merkez",
    "shipTo": {
      "district": "Şahinbey",
      "province": "Gaziantep"
    },
    "shipTime": "2026-06-17T10:39:00",
    "status": "delivered",
    "cargoType": "order",
    "referenceId": "REF-71573",
    "packageNo": "PKT-000121",
    "customerName": "Hakan Yavuz",
    "channel": "Kendi Web Sitesi"
  },
  {
    "id": 122,
    "shipmentNo": 8200122,
    "orderNo": 61200122,
    "companyId": 6,
    "trackingNo": "DHL-2026-0104514",
    "shipFrom": "Ankara Ostim",
    "shipTo": {
      "district": "Mamak",
      "province": "Ankara"
    },
    "shipTime": "2026-06-17T12:20:00",
    "status": "delivered",
    "cargoType": "order",
    "referenceId": "REF-71586",
    "packageNo": "PKT-000122",
    "customerName": "Serkan Demir",
    "channel": "N11"
  },
  {
    "id": 123,
    "shipmentNo": 8200123,
    "orderNo": 61200123,
    "companyId": 7,
    "trackingNo": "HRZ-2026-0104551",
    "shipFrom": "İstanbul Anadolu",
    "shipTo": {
      "district": "Buca",
      "province": "İzmir"
    },
    "shipTime": "2026-06-17T14:16:00",
    "status": "delivered",
    "cargoType": "order",
    "referenceId": "REF-71599",
    "packageNo": "PKT-000123",
    "customerName": "Ceren Öztürk",
    "channel": "Trendyol"
  },
  {
    "id": 124,
    "shipmentNo": 8200124,
    "orderNo": 61200124,
    "companyId": 1,
    "trackingNo": "YK-2026-0104588",
    "shipFrom": "Bursa Depo",
    "shipTo": {
      "district": "Yüreğir",
      "province": "Adana"
    },
    "shipTime": "2026-06-18T06:45:00",
    "status": "cancelled",
    "cargoType": "order",
    "referenceId": "REF-71612",
    "packageNo": "PKT-000124",
    "customerName": "Ayşe Kaya",
    "channel": "Hepsiburada"
  },
  {
    "id": 125,
    "shipmentNo": 8200125,
    "orderNo": 61200125,
    "companyId": 2,
    "trackingNo": "ARAS-2026-0104625",
    "shipFrom": "İstanbul Anadolu",
    "shipTo": {
      "district": "Melikgazi",
      "province": "Kayseri"
    },
    "shipTime": "2026-06-18T14:02:00",
    "status": "delivered",
    "cargoType": "order",
    "referenceId": "REF-71625",
    "packageNo": "PKT-000125",
    "customerName": "Burak Bulut",
    "channel": "Hepsiburada"
  },
  {
    "id": 126,
    "shipmentNo": 8200126,
    "orderNo": 61200126,
    "companyId": 4,
    "trackingNo": "PTT-2026-0104662",
    "shipFrom": "İstanbul Ana Depo",
    "shipTo": {
      "district": "Çukurova",
      "province": "Adana"
    },
    "shipTime": "2026-06-19T06:03:00",
    "status": "delivered",
    "cargoType": "order",
    "referenceId": "REF-71638",
    "packageNo": "PKT-000126",
    "customerName": "Emre Koç",
    "channel": "Trendyol"
  },
  {
    "id": 127,
    "shipmentNo": 8200127,
    "orderNo": 61200127,
    "companyId": 1,
    "trackingNo": "YK-2026-0104699",
    "shipFrom": "İstanbul Anadolu",
    "shipTo": {
      "district": "Kocasinan",
      "province": "Kayseri"
    },
    "shipTime": "2026-06-20T06:40:00",
    "status": "delivered",
    "cargoType": "order",
    "referenceId": "REF-71651",
    "packageNo": "PKT-000127",
    "customerName": "Ceren Erdoğan",
    "channel": "Trendyol"
  },
  {
    "id": 128,
    "shipmentNo": 8200128,
    "orderNo": 61200128,
    "companyId": 2,
    "trackingNo": "ARAS-2026-0104736",
    "shipFrom": "Ankara Ostim",
    "shipTo": {
      "district": "Akçaabat",
      "province": "Trabzon"
    },
    "shipTime": "2026-06-20T12:06:00",
    "status": "delivered",
    "cargoType": "order",
    "referenceId": "REF-71664",
    "packageNo": "PKT-000128",
    "customerName": "Ceren Öztürk",
    "channel": "Trendyol"
  },
  {
    "id": 129,
    "shipmentNo": 8200129,
    "orderNo": 61200129,
    "companyId": 4,
    "trackingNo": "PTT-2026-0104773",
    "shipFrom": "Bursa Depo",
    "shipTo": {
      "district": "Çiğli",
      "province": "İzmir"
    },
    "shipTime": "2026-06-21T10:55:00",
    "status": "delivered",
    "cargoType": "order",
    "referenceId": "REF-71677",
    "packageNo": "PKT-000129",
    "customerName": "Ceren Şimşek",
    "channel": "Trendyol"
  },
  {
    "id": 130,
    "shipmentNo": 8200130,
    "orderNo": 61200130,
    "companyId": 8,
    "trackingNo": "HPS-2026-0104810",
    "shipFrom": "İstanbul Anadolu",
    "shipTo": {
      "district": "Ortahisar",
      "province": "Trabzon"
    },
    "shipTime": "2026-06-21T12:04:00",
    "status": "recalled",
    "cargoType": "order",
    "referenceId": "REF-71690",
    "packageNo": "PKT-000130",
    "customerName": "Gizem Çelik",
    "channel": "Trendyol"
  },
  {
    "id": 131,
    "shipmentNo": 8200131,
    "orderNo": 61200131,
    "companyId": 7,
    "trackingNo": "HRZ-2026-0104847",
    "shipFrom": "İstanbul Ana Depo",
    "shipTo": {
      "district": "Seyhan",
      "province": "Adana"
    },
    "shipTime": "2026-06-21T13:05:00",
    "status": "preparing",
    "cargoType": "order",
    "referenceId": "REF-71703",
    "packageNo": "PKT-000131",
    "customerName": "Burak Güneş",
    "channel": "Kendi Web Sitesi"
  },
  {
    "id": 132,
    "shipmentNo": 8200132,
    "orderNo": 61200132,
    "companyId": 3,
    "trackingNo": "MNG-2026-0104884",
    "shipFrom": "İstanbul Ana Depo",
    "shipTo": {
      "district": "Çukurova",
      "province": "Adana"
    },
    "shipTime": "2026-06-22T12:16:00",
    "status": "preparing",
    "cargoType": "order",
    "referenceId": "REF-71716",
    "packageNo": "PKT-000132",
    "customerName": "Serkan Koç",
    "channel": "Trendyol"
  },
  {
    "id": 133,
    "shipmentNo": 8200133,
    "orderNo": 61200133,
    "companyId": 1,
    "trackingNo": "YK-2026-0104921",
    "shipFrom": "İstanbul Anadolu",
    "shipTo": {
      "district": "Yenimahalle",
      "province": "Ankara"
    },
    "shipTime": "2026-06-22T14:34:00",
    "status": "in_transit",
    "cargoType": "order",
    "referenceId": "REF-71729",
    "packageNo": "PKT-000133",
    "customerName": "Emre Öztürk",
    "channel": "N11"
  },
  {
    "id": 134,
    "shipmentNo": 8200134,
    "orderNo": 61200134,
    "companyId": 3,
    "trackingNo": "MNG-2026-0104958",
    "shipFrom": "Bursa Depo",
    "shipTo": {
      "district": "Seyhan",
      "province": "Adana"
    },
    "shipTime": "2026-06-23T06:08:00",
    "status": "preparing",
    "cargoType": "order",
    "referenceId": "REF-71742",
    "packageNo": "PKT-000134",
    "customerName": "Deniz Koç",
    "channel": "N11"
  },
  {
    "id": 135,
    "shipmentNo": 8200135,
    "orderNo": 61200135,
    "companyId": 1,
    "trackingNo": "YK-2026-0104995",
    "shipFrom": "Ankara Merkez",
    "shipTo": {
      "district": "Keçiören",
      "province": "Ankara"
    },
    "shipTime": "2026-06-23T08:44:00",
    "status": "in_transit",
    "cargoType": "order",
    "referenceId": "REF-71755",
    "packageNo": "PKT-000135",
    "customerName": "Kerem Özdemir",
    "channel": "N11"
  },
  {
    "id": 136,
    "shipmentNo": 8200136,
    "orderNo": 61200136,
    "companyId": 6,
    "trackingNo": "DHL-2026-0105032",
    "shipFrom": "Ankara Ostim",
    "shipTo": {
      "district": "Karatay",
      "province": "Konya"
    },
    "shipTime": "2026-06-23T13:37:00",
    "status": "preparing",
    "cargoType": "order",
    "referenceId": "REF-71768",
    "packageNo": "PKT-000136",
    "customerName": "Gül Demir",
    "channel": "Hepsiburada"
  },
  {
    "id": 137,
    "shipmentNo": 8200137,
    "orderNo": 61200137,
    "companyId": 6,
    "trackingNo": "DHL-2026-0105069",
    "shipFrom": "Bursa Depo",
    "shipTo": {
      "district": "Karatay",
      "province": "Konya"
    },
    "shipTime": "2026-06-24T07:40:00",
    "status": "preparing",
    "cargoType": "order",
    "referenceId": "REF-71781",
    "packageNo": "PKT-000137",
    "customerName": "Yusuf Polat",
    "channel": "Hepsiburada"
  },
  {
    "id": 138,
    "shipmentNo": 8200138,
    "orderNo": 61200138,
    "companyId": 6,
    "trackingNo": "DHL-2026-0105106",
    "shipFrom": "Ankara Ostim",
    "shipTo": {
      "district": "Kepez",
      "province": "Antalya"
    },
    "shipTime": "2026-06-24T09:58:00",
    "status": "preparing",
    "cargoType": "order",
    "referenceId": "REF-71794",
    "packageNo": "PKT-000138",
    "customerName": "Elif Demir",
    "channel": "Hepsiburada"
  },
  {
    "id": 139,
    "shipmentNo": 8200139,
    "orderNo": 61200139,
    "companyId": 3,
    "trackingNo": "MNG-2026-0105143",
    "shipFrom": "Ankara Ostim",
    "shipTo": {
      "district": "Şehitkamil",
      "province": "Gaziantep"
    },
    "shipTime": "2026-06-25T09:14:00",
    "status": "in_transit",
    "cargoType": "order",
    "referenceId": "REF-71807",
    "packageNo": "PKT-000139",
    "customerName": "Serkan Çelik",
    "channel": "Trendyol"
  },
  {
    "id": 140,
    "shipmentNo": 8200140,
    "orderNo": 61200140,
    "companyId": 6,
    "trackingNo": "DHL-2026-0105180",
    "shipFrom": "İstanbul Ana Depo",
    "shipTo": {
      "district": "Yıldırım",
      "province": "Bursa"
    },
    "shipTime": "2026-06-27T06:05:00",
    "status": "preparing",
    "cargoType": "order",
    "referenceId": "REF-71820",
    "packageNo": "PKT-000140",
    "customerName": "Emre Yıldız",
    "channel": "Hepsiburada"
  },
  {
    "id": 141,
    "shipmentNo": 8200141,
    "orderNo": 61200141,
    "companyId": 1,
    "trackingNo": "YK-2026-0105217",
    "shipFrom": "Bursa Depo",
    "shipTo": {
      "district": "Ortahisar",
      "province": "Trabzon"
    },
    "shipTime": "2026-06-28T07:03:00",
    "status": "in_transit",
    "cargoType": "order",
    "referenceId": "REF-71833",
    "packageNo": "PKT-000141",
    "customerName": "Mustafa Koç",
    "channel": "Kendi Web Sitesi"
  },
  {
    "id": 142,
    "shipmentNo": 8200142,
    "orderNo": 61200142,
    "companyId": 1,
    "trackingNo": "YK-2026-0105254",
    "shipFrom": "Bursa Depo",
    "shipTo": {
      "district": "Karşıyaka",
      "province": "İzmir"
    },
    "shipTime": "2026-06-28T07:29:00",
    "status": "preparing",
    "cargoType": "order",
    "referenceId": "REF-71846",
    "packageNo": "PKT-000142",
    "customerName": "Furkan Demir",
    "channel": "Hepsiburada"
  },
  {
    "id": 143,
    "shipmentNo": 8200143,
    "orderNo": 61200143,
    "companyId": 1,
    "trackingNo": "YK-2026-0105291",
    "shipFrom": "Ankara Merkez",
    "shipTo": {
      "district": "Seyhan",
      "province": "Adana"
    },
    "shipTime": "2026-06-28T11:37:00",
    "status": "in_transit",
    "cargoType": "order",
    "referenceId": "REF-71859",
    "packageNo": "PKT-000143",
    "customerName": "Kaan Aksoy",
    "channel": "Trendyol"
  },
  {
    "id": 144,
    "shipmentNo": 8200144,
    "orderNo": 61200144,
    "companyId": 1,
    "trackingNo": "YK-2026-0105328",
    "shipFrom": "Ankara Ostim",
    "shipTo": {
      "district": "Akçaabat",
      "province": "Trabzon"
    },
    "shipTime": "2026-06-29T08:08:00",
    "status": "in_transit",
    "cargoType": "order",
    "referenceId": "REF-71872",
    "packageNo": "PKT-000144",
    "customerName": "Ceren Yılmaz",
    "channel": "Kendi Web Sitesi"
  },
  {
    "id": 145,
    "shipmentNo": 8200145,
    "orderNo": 61200145,
    "companyId": 1,
    "trackingNo": "YK-2026-0105365",
    "shipFrom": "İzmir Depo",
    "shipTo": {
      "district": "Yüreğir",
      "province": "Adana"
    },
    "shipTime": "2026-06-29T10:45:00",
    "status": "in_transit",
    "cargoType": "order",
    "referenceId": "REF-71885",
    "packageNo": "PKT-000145",
    "customerName": "Aslı Çelik",
    "channel": "Trendyol"
  },
  {
    "id": 146,
    "shipmentNo": 8200146,
    "orderNo": 61200146,
    "companyId": 2,
    "trackingNo": "ARAS-2026-0105402",
    "shipFrom": "İstanbul Anadolu",
    "shipTo": {
      "district": "Kocasinan",
      "province": "Kayseri"
    },
    "shipTime": "2026-06-30T06:26:00",
    "status": "in_transit",
    "cargoType": "order",
    "referenceId": "REF-71898",
    "packageNo": "PKT-000146",
    "customerName": "Yusuf Yavuz",
    "channel": "Hepsiburada"
  },
  {
    "id": 147,
    "shipmentNo": 8200147,
    "orderNo": 61200147,
    "companyId": 6,
    "trackingNo": "DHL-2026-0105439",
    "shipFrom": "Ankara Ostim",
    "shipTo": {
      "district": "Melikgazi",
      "province": "Kayseri"
    },
    "shipTime": "2026-06-30T11:10:00",
    "status": "preparing",
    "cargoType": "order",
    "referenceId": "REF-71911",
    "packageNo": "PKT-000147",
    "customerName": "Pınar Şimşek",
    "channel": "Kendi Web Sitesi"
  },
  {
    "id": 148,
    "shipmentNo": 8200148,
    "orderNo": 61200148,
    "companyId": 1,
    "trackingNo": "YK-2026-0105476",
    "shipFrom": "Ankara Ostim",
    "shipTo": {
      "district": "Karşıyaka",
      "province": "İzmir"
    },
    "shipTime": "2026-07-01T06:08:00",
    "status": "in_transit",
    "cargoType": "order",
    "referenceId": "REF-71924",
    "packageNo": "PKT-000148",
    "customerName": "Merve Kurt",
    "channel": "Trendyol"
  },
  {
    "id": 149,
    "shipmentNo": 8200149,
    "orderNo": 61200149,
    "companyId": 1,
    "trackingNo": "YK-2026-0105513",
    "shipFrom": "Ankara Ostim",
    "shipTo": {
      "district": "Şahinbey",
      "province": "Gaziantep"
    },
    "shipTime": "2026-07-01T07:47:00",
    "status": "in_transit",
    "cargoType": "order",
    "referenceId": "REF-71937",
    "packageNo": "PKT-000149",
    "customerName": "Gül Polat",
    "channel": "Trendyol"
  },
  {
    "id": 150,
    "shipmentNo": 8200150,
    "orderNo": 61200150,
    "companyId": 1,
    "trackingNo": "YK-2026-0105550",
    "shipFrom": "İzmir Depo",
    "shipTo": {
      "district": "Melikgazi",
      "province": "Kayseri"
    },
    "shipTime": "2026-07-01T11:34:00",
    "status": "preparing",
    "cargoType": "order",
    "referenceId": "REF-71950",
    "packageNo": "PKT-000150",
    "customerName": "Cem Koç",
    "channel": "N11"
  },
  {
    "id": 151,
    "shipmentNo": 8200151,
    "orderNo": 61200151,
    "companyId": 1,
    "trackingNo": "YK-2026-0105587",
    "shipFrom": "Bursa Depo",
    "shipTo": {
      "district": "Karatay",
      "province": "Konya"
    },
    "shipTime": "2026-07-01T14:02:00",
    "status": "in_transit",
    "cargoType": "order",
    "referenceId": "REF-71963",
    "packageNo": "PKT-000151",
    "customerName": "Ahmet Arslan",
    "channel": "Kendi Web Sitesi"
  },
  {
    "id": 152,
    "shipmentNo": 8200152,
    "orderNo": 61200152,
    "companyId": 1,
    "trackingNo": "YK-2026-0105624",
    "shipFrom": "İstanbul Ana Depo",
    "shipTo": {
      "district": "Şişli",
      "province": "İstanbul"
    },
    "shipTime": "2026-07-02T05:08:00",
    "status": "preparing",
    "cargoType": "order",
    "referenceId": "REF-71976",
    "packageNo": "PKT-000152",
    "customerName": "Pınar Aksoy",
    "channel": "Hepsiburada"
  },
  {
    "id": 153,
    "shipmentNo": 8200153,
    "orderNo": 61200153,
    "companyId": 7,
    "trackingNo": "HRZ-2026-0105661",
    "shipFrom": "Ankara Ostim",
    "shipTo": {
      "district": "Beşiktaş",
      "province": "İstanbul"
    },
    "shipTime": "2026-07-02T09:25:00",
    "status": "in_transit",
    "cargoType": "order",
    "referenceId": "REF-71989",
    "packageNo": "PKT-000153",
    "customerName": "Serkan Demir",
    "channel": "Trendyol"
  },
  {
    "id": 154,
    "shipmentNo": 8200154,
    "orderNo": 61200154,
    "companyId": 1,
    "trackingNo": "YK-2026-0105698",
    "shipFrom": "Bursa Depo",
    "shipTo": {
      "district": "Çukurova",
      "province": "Adana"
    },
    "shipTime": "2026-07-02T14:18:00",
    "status": "in_transit",
    "cargoType": "order",
    "referenceId": "REF-72002",
    "packageNo": "PKT-000154",
    "customerName": "Onur Şimşek",
    "channel": "Kendi Web Sitesi"
  },
  {
    "id": 155,
    "shipmentNo": 8200155,
    "orderNo": 61200155,
    "companyId": 3,
    "trackingNo": "MNG-2026-0105735",
    "shipFrom": "İstanbul Anadolu",
    "shipTo": {
      "district": "Çukurova",
      "province": "Adana"
    },
    "shipTime": "2026-07-03T05:47:00",
    "status": "in_transit",
    "cargoType": "order",
    "referenceId": "REF-72015",
    "packageNo": "PKT-000155",
    "customerName": "Yusuf Çelik",
    "channel": "Hepsiburada"
  },
  {
    "id": 156,
    "shipmentNo": 8200156,
    "orderNo": 61200156,
    "companyId": 7,
    "trackingNo": "HRZ-2026-0105772",
    "shipFrom": "Bursa Depo",
    "shipTo": {
      "district": "Ortahisar",
      "province": "Trabzon"
    },
    "shipTime": "2026-07-03T06:27:00",
    "status": "in_transit",
    "cargoType": "order",
    "referenceId": "REF-72028",
    "packageNo": "PKT-000156",
    "customerName": "Elif Şahin",
    "channel": "Trendyol"
  },
  {
    "id": 157,
    "shipmentNo": 8200157,
    "orderNo": 61200157,
    "companyId": 1,
    "trackingNo": "YK-2026-0105809",
    "shipFrom": "Ankara Merkez",
    "shipTo": {
      "district": "Konyaaltı",
      "province": "Antalya"
    },
    "shipTime": "2026-07-03T10:21:00",
    "status": "in_transit",
    "cargoType": "order",
    "referenceId": "REF-72041",
    "packageNo": "PKT-000157",
    "customerName": "Burak Aydın",
    "channel": "Hepsiburada"
  },
  {
    "id": 158,
    "shipmentNo": 8200158,
    "orderNo": 61200158,
    "companyId": 2,
    "trackingNo": "ARAS-2026-0105846",
    "shipFrom": "Ankara Ostim",
    "shipTo": {
      "district": "Şehitkamil",
      "province": "Gaziantep"
    },
    "shipTime": "2026-07-03T13:13:00",
    "status": "preparing",
    "cargoType": "order",
    "referenceId": "REF-72054",
    "packageNo": "PKT-000158",
    "customerName": "Gül Koç",
    "channel": "Hepsiburada"
  },
  {
    "id": 159,
    "shipmentNo": 8200159,
    "orderNo": 61200159,
    "companyId": 6,
    "trackingNo": "DHL-2026-0105883",
    "shipFrom": "İzmir Depo",
    "shipTo": {
      "district": "Çankaya",
      "province": "Ankara"
    },
    "shipTime": "2026-07-04T11:35:00",
    "status": "in_transit",
    "cargoType": "order",
    "referenceId": "REF-72067",
    "packageNo": "PKT-000159",
    "customerName": "Emre Erdoğan",
    "channel": "Trendyol"
  },
  {
    "id": 160,
    "shipmentNo": 8200160,
    "orderNo": 61200160,
    "companyId": 4,
    "trackingNo": "PTT-2026-0105920",
    "shipFrom": "İzmir Depo",
    "shipTo": {
      "district": "Çukurova",
      "province": "Adana"
    },
    "shipTime": "2026-07-04T13:33:00",
    "status": "in_transit",
    "cargoType": "order",
    "referenceId": "REF-72080",
    "packageNo": "PKT-000160",
    "customerName": "Cem Bulut",
    "channel": "Hepsiburada"
  },
  {
    "id": 161,
    "shipmentNo": 8200161,
    "orderNo": 61200161,
    "companyId": 2,
    "trackingNo": "ARAS-2026-0105957",
    "shipFrom": "Bursa Depo",
    "shipTo": {
      "district": "Yüreğir",
      "province": "Adana"
    },
    "shipTime": "2026-07-04T13:46:00",
    "status": "in_transit",
    "cargoType": "order",
    "referenceId": "REF-72093",
    "packageNo": "PKT-000161",
    "customerName": "Furkan Doğan",
    "channel": "Trendyol"
  },
  {
    "id": 162,
    "shipmentNo": 8200162,
    "orderNo": 61200162,
    "companyId": 1,
    "trackingNo": "YK-2026-0105994",
    "shipFrom": "İstanbul Ana Depo",
    "shipTo": {
      "district": "Yıldırım",
      "province": "Bursa"
    },
    "shipTime": "2026-07-05T05:15:00",
    "status": "in_transit",
    "cargoType": "order",
    "referenceId": "REF-72106",
    "packageNo": "PKT-000162",
    "customerName": "Doğan Doğan",
    "channel": "Trendyol"
  },
  {
    "id": 163,
    "shipmentNo": 8200163,
    "orderNo": 61200163,
    "companyId": 1,
    "trackingNo": "YK-2026-0106031",
    "shipFrom": "Bursa Depo",
    "shipTo": {
      "district": "Muratpaşa",
      "province": "Antalya"
    },
    "shipTime": "2026-07-05T08:04:00",
    "status": "in_transit",
    "cargoType": "order",
    "referenceId": "REF-72119",
    "packageNo": "PKT-000163",
    "customerName": "Barış Doğan",
    "channel": "Trendyol"
  },
  {
    "id": 164,
    "shipmentNo": 8200164,
    "orderNo": 61200164,
    "companyId": 3,
    "trackingNo": "MNG-2026-0106068",
    "shipFrom": "İstanbul Ana Depo",
    "shipTo": {
      "district": "Üsküdar",
      "province": "İstanbul"
    },
    "shipTime": "2026-07-05T10:04:00",
    "status": "preparing",
    "cargoType": "order",
    "referenceId": "REF-72132",
    "packageNo": "PKT-000164",
    "customerName": "Gül Çelik",
    "channel": "Trendyol"
  },
  {
    "id": 165,
    "shipmentNo": 8200165,
    "orderNo": 61200165,
    "companyId": 3,
    "trackingNo": "MNG-2026-0106105",
    "shipFrom": "Ankara Merkez",
    "shipTo": {
      "district": "Pendik",
      "province": "İstanbul"
    },
    "shipTime": "2026-07-06T05:16:00",
    "status": "in_transit",
    "cargoType": "order",
    "referenceId": "REF-72145",
    "packageNo": "PKT-000165",
    "customerName": "Barış Arslan",
    "channel": "Kendi Web Sitesi"
  },
  {
    "id": 166,
    "shipmentNo": 8200166,
    "orderNo": 61200166,
    "companyId": 1,
    "trackingNo": "YK-2026-0106142",
    "shipFrom": "İzmir Depo",
    "shipTo": {
      "district": "Kocasinan",
      "province": "Kayseri"
    },
    "shipTime": "2026-07-06T14:35:00",
    "status": "in_transit",
    "cargoType": "order",
    "referenceId": "REF-72158",
    "packageNo": "PKT-000166",
    "customerName": "Selin Şahin",
    "channel": "Trendyol"
  },
  {
    "id": 167,
    "shipmentNo": 8200167,
    "orderNo": 61200167,
    "companyId": 2,
    "trackingNo": "ARAS-2026-0106179",
    "shipFrom": "İstanbul Ana Depo",
    "shipTo": {
      "district": "Yıldırım",
      "province": "Bursa"
    },
    "shipTime": "2026-07-07T08:56:00",
    "status": "preparing",
    "cargoType": "order",
    "referenceId": "REF-72171",
    "packageNo": "PKT-000167",
    "customerName": "Fatma Güneş",
    "channel": "Trendyol"
  },
  {
    "id": 168,
    "shipmentNo": 8200168,
    "orderNo": 61200168,
    "companyId": 6,
    "trackingNo": "DHL-2026-0106216",
    "shipFrom": "Ankara Merkez",
    "shipTo": {
      "district": "Muratpaşa",
      "province": "Antalya"
    },
    "shipTime": "2026-07-07T12:43:00",
    "status": "in_transit",
    "cargoType": "order",
    "referenceId": "REF-72184",
    "packageNo": "PKT-000168",
    "customerName": "Hakan Yılmaz",
    "channel": "Trendyol"
  },
  {
    "id": 169,
    "shipmentNo": 8200169,
    "orderNo": 61200169,
    "companyId": 6,
    "trackingNo": "DHL-2026-0106253",
    "shipFrom": "Ankara Merkez",
    "shipTo": {
      "district": "Yüreğir",
      "province": "Adana"
    },
    "shipTime": "2026-07-07T12:54:00",
    "status": "in_transit",
    "cargoType": "order",
    "referenceId": "REF-72197",
    "packageNo": "PKT-000169",
    "customerName": "Hakan Aksoy",
    "channel": "N11"
  },
  {
    "id": 170,
    "shipmentNo": 8200170,
    "orderNo": 61200170,
    "companyId": 2,
    "trackingNo": "ARAS-2026-0106290",
    "shipFrom": "Bursa Depo",
    "shipTo": {
      "district": "Konak",
      "province": "İzmir"
    },
    "shipTime": "2026-07-08T11:21:00",
    "status": "in_transit",
    "cargoType": "order",
    "referenceId": "REF-72210",
    "packageNo": "PKT-000170",
    "customerName": "Ebru Şahin",
    "channel": "N11"
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

export const RETURN_STATUS_CHART_COLORS: Record<ReturnStatus, string> = {
  requested: '#85a0f2',
  picked_up: '#f0a869',
  in_warehouse: '#aab3c2',
  completed: '#7ecca0',
  cancelled: '#f28d97',
  recalled: '#bb717a',
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
    "returnNo": 9300001,
    "originalShipmentId": 2,
    "reason": "kusurlu",
    "status": "completed",
    "requestDate": "2026-04-14T01:06:29",
    "pickup": true,
    "note": ""
  },
  {
    "id": 2,
    "returnNo": 9300002,
    "originalShipmentId": 4,
    "reason": "degisim",
    "status": "completed",
    "requestDate": "2026-04-21T21:09:36",
    "pickup": true,
    "note": ""
  },
  {
    "id": 3,
    "returnNo": 9300003,
    "originalShipmentId": 13,
    "reason": "kusurlu",
    "status": "completed",
    "requestDate": "2026-04-23T09:25:03",
    "pickup": true,
    "note": ""
  },
  {
    "id": 4,
    "returnNo": 9300004,
    "originalShipmentId": 20,
    "reason": "diger",
    "status": "completed",
    "requestDate": "2026-04-27T14:11:44",
    "pickup": true,
    "note": ""
  },
  {
    "id": 5,
    "returnNo": 9300005,
    "originalShipmentId": 28,
    "reason": "begenmedim",
    "status": "completed",
    "requestDate": "2026-05-01T13:59:10",
    "pickup": true,
    "note": ""
  },
  {
    "id": 6,
    "returnNo": 9300006,
    "originalShipmentId": 16,
    "reason": "begenmedim",
    "status": "completed",
    "requestDate": "2026-05-02T13:52:50",
    "pickup": true,
    "note": ""
  },
  {
    "id": 7,
    "returnNo": 9300007,
    "originalShipmentId": 30,
    "reason": "degisim",
    "status": "completed",
    "requestDate": "2026-05-02T19:17:17",
    "pickup": true,
    "note": ""
  },
  {
    "id": 8,
    "returnNo": 9300008,
    "originalShipmentId": 33,
    "reason": "yanlis_urun",
    "status": "completed",
    "requestDate": "2026-05-07T05:26:59",
    "pickup": true,
    "note": ""
  },
  {
    "id": 9,
    "returnNo": 9300009,
    "originalShipmentId": 36,
    "reason": "begenmedim",
    "status": "completed",
    "requestDate": "2026-05-08T06:03:41",
    "pickup": true,
    "note": ""
  },
  {
    "id": 10,
    "returnNo": 9300010,
    "originalShipmentId": 32,
    "reason": "begenmedim",
    "status": "completed",
    "requestDate": "2026-05-08T14:25:53",
    "pickup": true,
    "note": ""
  },
  {
    "id": 11,
    "returnNo": 9300011,
    "originalShipmentId": 35,
    "reason": "begenmedim",
    "status": "completed",
    "requestDate": "2026-05-10T09:09:17",
    "pickup": false,
    "note": ""
  },
  {
    "id": 12,
    "returnNo": 9300012,
    "originalShipmentId": 18,
    "reason": "kusurlu",
    "status": "completed",
    "requestDate": "2026-05-10T19:23:50",
    "pickup": true,
    "note": ""
  },
  {
    "id": 13,
    "returnNo": 9300013,
    "originalShipmentId": 46,
    "reason": "degisim",
    "status": "completed",
    "requestDate": "2026-05-11T16:06:33",
    "pickup": false,
    "note": ""
  },
  {
    "id": 14,
    "returnNo": 9300014,
    "originalShipmentId": 45,
    "reason": "begenmedim",
    "status": "completed",
    "requestDate": "2026-05-11T19:19:17",
    "pickup": true,
    "note": ""
  },
  {
    "id": 15,
    "returnNo": 9300015,
    "originalShipmentId": 42,
    "reason": "diger",
    "status": "cancelled",
    "requestDate": "2026-05-12T04:05:30",
    "pickup": false,
    "note": ""
  },
  {
    "id": 16,
    "returnNo": 9300016,
    "originalShipmentId": 39,
    "reason": "yanlis_urun",
    "status": "cancelled",
    "requestDate": "2026-05-13T05:14:02",
    "pickup": true,
    "note": ""
  },
  {
    "id": 17,
    "returnNo": 9300017,
    "originalShipmentId": 57,
    "reason": "kusurlu",
    "status": "cancelled",
    "requestDate": "2026-05-16T02:54:24",
    "pickup": true,
    "note": ""
  },
  {
    "id": 18,
    "returnNo": 9300018,
    "originalShipmentId": 41,
    "reason": "diger",
    "status": "recalled",
    "requestDate": "2026-05-16T18:56:58",
    "pickup": true,
    "note": ""
  },
  {
    "id": 19,
    "returnNo": 9300019,
    "originalShipmentId": 53,
    "reason": "diger",
    "status": "in_warehouse",
    "requestDate": "2026-05-17T05:22:19",
    "pickup": false,
    "note": ""
  },
  {
    "id": 20,
    "returnNo": 9300020,
    "originalShipmentId": 52,
    "reason": "kusurlu",
    "status": "in_warehouse",
    "requestDate": "2026-05-25T15:13:40",
    "pickup": true,
    "note": ""
  },
  {
    "id": 21,
    "returnNo": 9300021,
    "originalShipmentId": 77,
    "reason": "diger",
    "status": "in_warehouse",
    "requestDate": "2026-05-27T04:27:22",
    "pickup": true,
    "note": ""
  },
  {
    "id": 22,
    "returnNo": 9300022,
    "originalShipmentId": 66,
    "reason": "yanlis_urun",
    "status": "in_warehouse",
    "requestDate": "2026-05-30T14:22:48",
    "pickup": true,
    "note": ""
  },
  {
    "id": 23,
    "returnNo": 9300023,
    "originalShipmentId": 68,
    "reason": "kusurlu",
    "status": "in_warehouse",
    "requestDate": "2026-06-04T00:37:07",
    "pickup": true,
    "note": ""
  },
  {
    "id": 24,
    "returnNo": 9300024,
    "originalShipmentId": 96,
    "reason": "begenmedim",
    "status": "in_warehouse",
    "requestDate": "2026-06-05T15:49:09",
    "pickup": true,
    "note": ""
  },
  {
    "id": 25,
    "returnNo": 9300025,
    "originalShipmentId": 75,
    "reason": "degisim",
    "status": "in_warehouse",
    "requestDate": "2026-06-06T06:09:15",
    "pickup": true,
    "note": ""
  },
  {
    "id": 26,
    "returnNo": 9300026,
    "originalShipmentId": 70,
    "reason": "yanlis_urun",
    "status": "in_warehouse",
    "requestDate": "2026-06-09T15:20:19",
    "pickup": true,
    "note": ""
  },
  {
    "id": 27,
    "returnNo": 9300027,
    "originalShipmentId": 102,
    "reason": "diger",
    "status": "picked_up",
    "requestDate": "2026-06-11T05:01:37",
    "pickup": true,
    "note": ""
  },
  {
    "id": 28,
    "returnNo": 9300028,
    "originalShipmentId": 74,
    "reason": "begenmedim",
    "status": "picked_up",
    "requestDate": "2026-06-11T22:59:12",
    "pickup": true,
    "note": ""
  },
  {
    "id": 29,
    "returnNo": 9300029,
    "originalShipmentId": 94,
    "reason": "begenmedim",
    "status": "picked_up",
    "requestDate": "2026-06-14T00:24:11",
    "pickup": true,
    "note": ""
  },
  {
    "id": 30,
    "returnNo": 9300030,
    "originalShipmentId": 83,
    "reason": "degisim",
    "status": "picked_up",
    "requestDate": "2026-06-14T08:25:56",
    "pickup": true,
    "note": ""
  },
  {
    "id": 31,
    "returnNo": 9300031,
    "originalShipmentId": 111,
    "reason": "diger",
    "status": "picked_up",
    "requestDate": "2026-06-15T03:41:53",
    "pickup": true,
    "note": ""
  },
  {
    "id": 32,
    "returnNo": 9300032,
    "originalShipmentId": 98,
    "reason": "kusurlu",
    "status": "picked_up",
    "requestDate": "2026-06-16T21:15:22",
    "pickup": true,
    "note": ""
  },
  {
    "id": 33,
    "returnNo": 9300033,
    "originalShipmentId": 90,
    "reason": "degisim",
    "status": "requested",
    "requestDate": "2026-06-18T13:21:21",
    "pickup": true,
    "note": ""
  },
  {
    "id": 34,
    "returnNo": 9300034,
    "originalShipmentId": 107,
    "reason": "yanlis_urun",
    "status": "requested",
    "requestDate": "2026-06-21T23:44:44",
    "pickup": true,
    "note": ""
  },
  {
    "id": 35,
    "returnNo": 9300035,
    "originalShipmentId": 116,
    "reason": "diger",
    "status": "requested",
    "requestDate": "2026-06-23T02:33:36",
    "pickup": true,
    "note": ""
  },
  {
    "id": 36,
    "returnNo": 9300036,
    "originalShipmentId": 108,
    "reason": "kusurlu",
    "status": "requested",
    "requestDate": "2026-06-24T08:46:59",
    "pickup": true,
    "note": ""
  },
  {
    "id": 37,
    "returnNo": 9300037,
    "originalShipmentId": 127,
    "reason": "kusurlu",
    "status": "requested",
    "requestDate": "2026-06-25T07:58:48",
    "pickup": true,
    "note": ""
  },
  {
    "id": 38,
    "returnNo": 9300038,
    "originalShipmentId": 101,
    "reason": "degisim",
    "status": "requested",
    "requestDate": "2026-06-26T09:09:09",
    "pickup": true,
    "note": ""
  },
  {
    "id": 39,
    "returnNo": 9300039,
    "originalShipmentId": 113,
    "reason": "diger",
    "status": "requested",
    "requestDate": "2026-06-30T10:07:29",
    "pickup": true,
    "note": ""
  },
  {
    "id": 40,
    "returnNo": 9300040,
    "originalShipmentId": 114,
    "reason": "degisim",
    "status": "requested",
    "requestDate": "2026-06-30T19:24:30",
    "pickup": true,
    "note": ""
  },
  {
    "id": 41,
    "returnNo": 9300041,
    "originalShipmentId": 128,
    "reason": "diger",
    "status": "requested",
    "requestDate": "2026-07-05T16:51:47",
    "pickup": true,
    "note": ""
  },
  {
    "id": 42,
    "returnNo": 9300042,
    "originalShipmentId": 129,
    "reason": "yanlis_urun",
    "status": "requested",
    "requestDate": "2026-07-08T15:00:00",
    "pickup": true,
    "note": ""
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

export const TRANSFER_STATUS_CHART_COLORS: Record<TransferStatus, string> = {
  preparing: '#f0a869',
  in_transit: '#85a0f2',
  delivered: '#7ecca0',
  cancelled: '#f28d97',
  recalled: '#bb717a',
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
    "id": 1,
    "transferNo": 7100001,
    "fromNodeId": 4,
    "toNodeId": 2,
    "companyId": 1,
    "trackingNo": "YK-TR-200041",
    "status": "delivered",
    "desi": 21,
    "note": "",
    "createdAt": "2026-04-10T09:40:00"
  },
  {
    "id": 2,
    "transferNo": 7100002,
    "fromNodeId": 9,
    "toNodeId": 13,
    "companyId": 2,
    "trackingNo": "ARAS-TR-200082",
    "status": "delivered",
    "desi": 40,
    "note": "",
    "createdAt": "2026-04-13T05:48:00"
  },
  {
    "id": 3,
    "transferNo": 7100003,
    "fromNodeId": 15,
    "toNodeId": 3,
    "companyId": 1,
    "trackingNo": "YK-TR-200123",
    "status": "delivered",
    "desi": 29,
    "note": "",
    "createdAt": "2026-04-13T06:07:00"
  },
  {
    "id": 4,
    "transferNo": 7100004,
    "fromNodeId": 14,
    "toNodeId": 9,
    "companyId": 3,
    "trackingNo": "MNG-TR-200164",
    "status": "delivered",
    "desi": 20,
    "note": "",
    "createdAt": "2026-04-14T10:11:00"
  },
  {
    "id": 5,
    "transferNo": 7100005,
    "fromNodeId": 6,
    "toNodeId": 9,
    "companyId": 1,
    "trackingNo": "YK-TR-200205",
    "status": "delivered",
    "desi": 36,
    "note": "",
    "createdAt": "2026-04-14T10:32:00"
  },
  {
    "id": 6,
    "transferNo": 7100006,
    "fromNodeId": 13,
    "toNodeId": 1,
    "companyId": 3,
    "trackingNo": "MNG-TR-200246",
    "status": "delivered",
    "desi": 30,
    "note": "",
    "createdAt": "2026-04-17T06:11:00"
  },
  {
    "id": 7,
    "transferNo": 7100007,
    "fromNodeId": 13,
    "toNodeId": 11,
    "companyId": 2,
    "trackingNo": "ARAS-TR-200287",
    "status": "delivered",
    "desi": 33,
    "note": "",
    "createdAt": "2026-04-17T13:55:00"
  },
  {
    "id": 8,
    "transferNo": 7100008,
    "fromNodeId": 3,
    "toNodeId": 2,
    "companyId": 2,
    "trackingNo": "ARAS-TR-200328",
    "status": "delivered",
    "desi": 30,
    "note": "",
    "createdAt": "2026-04-18T12:13:00"
  },
  {
    "id": 9,
    "transferNo": 7100009,
    "fromNodeId": 4,
    "toNodeId": 1,
    "companyId": 2,
    "trackingNo": "ARAS-TR-200369",
    "status": "delivered",
    "desi": 32,
    "note": "",
    "createdAt": "2026-04-19T10:28:00"
  },
  {
    "id": 10,
    "transferNo": 7100010,
    "fromNodeId": 11,
    "toNodeId": 15,
    "companyId": 1,
    "trackingNo": "YK-TR-200410",
    "status": "delivered",
    "desi": 10,
    "note": "",
    "createdAt": "2026-04-19T11:34:00"
  },
  {
    "id": 11,
    "transferNo": 7100011,
    "fromNodeId": 10,
    "toNodeId": 8,
    "companyId": 1,
    "trackingNo": "YK-TR-200451",
    "status": "delivered",
    "desi": 27,
    "note": "",
    "createdAt": "2026-04-20T05:11:00"
  },
  {
    "id": 12,
    "transferNo": 7100012,
    "fromNodeId": 6,
    "toNodeId": 3,
    "companyId": 2,
    "trackingNo": "ARAS-TR-200492",
    "status": "delivered",
    "desi": 34,
    "note": "",
    "createdAt": "2026-04-20T06:28:00"
  },
  {
    "id": 13,
    "transferNo": 7100013,
    "fromNodeId": 6,
    "toNodeId": 11,
    "companyId": 2,
    "trackingNo": "ARAS-TR-200533",
    "status": "delivered",
    "desi": 17,
    "note": "",
    "createdAt": "2026-04-20T07:47:00"
  },
  {
    "id": 14,
    "transferNo": 7100014,
    "fromNodeId": 9,
    "toNodeId": 11,
    "companyId": 1,
    "trackingNo": "YK-TR-200574",
    "status": "delivered",
    "desi": 32,
    "note": "",
    "createdAt": "2026-04-20T12:49:00"
  },
  {
    "id": 15,
    "transferNo": 7100015,
    "fromNodeId": 7,
    "toNodeId": 3,
    "companyId": 1,
    "trackingNo": "YK-TR-200615",
    "status": "delivered",
    "desi": 16,
    "note": "",
    "createdAt": "2026-04-21T05:41:00"
  },
  {
    "id": 16,
    "transferNo": 7100016,
    "fromNodeId": 7,
    "toNodeId": 3,
    "companyId": 2,
    "trackingNo": "ARAS-TR-200656",
    "status": "recalled",
    "desi": 10,
    "note": "",
    "createdAt": "2026-04-22T13:55:00"
  },
  {
    "id": 17,
    "transferNo": 7100017,
    "fromNodeId": 12,
    "toNodeId": 2,
    "companyId": 1,
    "trackingNo": "YK-TR-200697",
    "status": "delivered",
    "desi": 25,
    "note": "",
    "createdAt": "2026-04-25T09:51:00"
  },
  {
    "id": 18,
    "transferNo": 7100018,
    "fromNodeId": 3,
    "toNodeId": 8,
    "companyId": 7,
    "trackingNo": "HRZ-TR-200738",
    "status": "delivered",
    "desi": 18,
    "note": "",
    "createdAt": "2026-04-29T09:00:00"
  },
  {
    "id": 19,
    "transferNo": 7100019,
    "fromNodeId": 15,
    "toNodeId": 10,
    "companyId": 3,
    "trackingNo": "MNG-TR-200779",
    "status": "delivered",
    "desi": 8,
    "note": "",
    "createdAt": "2026-05-03T07:50:00"
  },
  {
    "id": 20,
    "transferNo": 7100020,
    "fromNodeId": 2,
    "toNodeId": 1,
    "companyId": 2,
    "trackingNo": "ARAS-TR-200820",
    "status": "cancelled",
    "desi": 21,
    "note": "",
    "createdAt": "2026-05-03T08:18:00"
  },
  {
    "id": 21,
    "transferNo": 7100021,
    "fromNodeId": 8,
    "toNodeId": 7,
    "companyId": 2,
    "trackingNo": "ARAS-TR-200861",
    "status": "delivered",
    "desi": 37,
    "note": "",
    "createdAt": "2026-05-05T09:11:00"
  },
  {
    "id": 22,
    "transferNo": 7100022,
    "fromNodeId": 7,
    "toNodeId": 13,
    "companyId": 3,
    "trackingNo": "MNG-TR-200902",
    "status": "delivered",
    "desi": 14,
    "note": "",
    "createdAt": "2026-05-07T12:38:00"
  },
  {
    "id": 23,
    "transferNo": 7100023,
    "fromNodeId": 14,
    "toNodeId": 2,
    "companyId": 7,
    "trackingNo": "HRZ-TR-200943",
    "status": "delivered",
    "desi": 19,
    "note": "",
    "createdAt": "2026-05-08T14:08:00"
  },
  {
    "id": 24,
    "transferNo": 7100024,
    "fromNodeId": 4,
    "toNodeId": 14,
    "companyId": 2,
    "trackingNo": "ARAS-TR-200984",
    "status": "delivered",
    "desi": 18,
    "note": "",
    "createdAt": "2026-05-09T14:33:00"
  },
  {
    "id": 25,
    "transferNo": 7100025,
    "fromNodeId": 12,
    "toNodeId": 8,
    "companyId": 3,
    "trackingNo": "MNG-TR-201025",
    "status": "delivered",
    "desi": 17,
    "note": "",
    "createdAt": "2026-05-10T06:23:00"
  },
  {
    "id": 26,
    "transferNo": 7100026,
    "fromNodeId": 13,
    "toNodeId": 4,
    "companyId": 7,
    "trackingNo": "HRZ-TR-201066",
    "status": "delivered",
    "desi": 17,
    "note": "",
    "createdAt": "2026-05-10T06:29:00"
  },
  {
    "id": 27,
    "transferNo": 7100027,
    "fromNodeId": 13,
    "toNodeId": 6,
    "companyId": 6,
    "trackingNo": "DHL-TR-201107",
    "status": "delivered",
    "desi": 27,
    "note": "",
    "createdAt": "2026-05-10T12:04:00"
  },
  {
    "id": 28,
    "transferNo": 7100028,
    "fromNodeId": 1,
    "toNodeId": 14,
    "companyId": 2,
    "trackingNo": "ARAS-TR-201148",
    "status": "delivered",
    "desi": 32,
    "note": "",
    "createdAt": "2026-05-11T08:37:00"
  },
  {
    "id": 29,
    "transferNo": 7100029,
    "fromNodeId": 2,
    "toNodeId": 5,
    "companyId": 6,
    "trackingNo": "DHL-TR-201189",
    "status": "delivered",
    "desi": 14,
    "note": "",
    "createdAt": "2026-05-13T11:33:00"
  },
  {
    "id": 30,
    "transferNo": 7100030,
    "fromNodeId": 5,
    "toNodeId": 9,
    "companyId": 1,
    "trackingNo": "YK-TR-201230",
    "status": "delivered",
    "desi": 27,
    "note": "",
    "createdAt": "2026-05-14T05:17:00"
  },
  {
    "id": 31,
    "transferNo": 7100031,
    "fromNodeId": 8,
    "toNodeId": 10,
    "companyId": 1,
    "trackingNo": "YK-TR-201271",
    "status": "cancelled",
    "desi": 34,
    "note": "",
    "createdAt": "2026-05-15T07:44:00"
  },
  {
    "id": 32,
    "transferNo": 7100032,
    "fromNodeId": 6,
    "toNodeId": 14,
    "companyId": 7,
    "trackingNo": "HRZ-TR-201312",
    "status": "delivered",
    "desi": 25,
    "note": "",
    "createdAt": "2026-05-16T09:31:00"
  },
  {
    "id": 33,
    "transferNo": 7100033,
    "fromNodeId": 9,
    "toNodeId": 11,
    "companyId": 1,
    "trackingNo": "YK-TR-201353",
    "status": "delivered",
    "desi": 18,
    "note": "",
    "createdAt": "2026-05-16T13:46:00"
  },
  {
    "id": 34,
    "transferNo": 7100034,
    "fromNodeId": 14,
    "toNodeId": 11,
    "companyId": 1,
    "trackingNo": "YK-TR-201394",
    "status": "recalled",
    "desi": 7,
    "note": "",
    "createdAt": "2026-05-17T13:11:00"
  },
  {
    "id": 35,
    "transferNo": 7100035,
    "fromNodeId": 1,
    "toNodeId": 15,
    "companyId": 1,
    "trackingNo": "YK-TR-201435",
    "status": "delivered",
    "desi": 16,
    "note": "",
    "createdAt": "2026-05-23T14:30:00"
  },
  {
    "id": 36,
    "transferNo": 7100036,
    "fromNodeId": 10,
    "toNodeId": 2,
    "companyId": 6,
    "trackingNo": "DHL-TR-201476",
    "status": "delivered",
    "desi": 17,
    "note": "",
    "createdAt": "2026-05-23T14:56:00"
  },
  {
    "id": 37,
    "transferNo": 7100037,
    "fromNodeId": 15,
    "toNodeId": 12,
    "companyId": 1,
    "trackingNo": "YK-TR-201517",
    "status": "delivered",
    "desi": 11,
    "note": "",
    "createdAt": "2026-05-24T08:07:00"
  },
  {
    "id": 38,
    "transferNo": 7100038,
    "fromNodeId": 6,
    "toNodeId": 2,
    "companyId": 6,
    "trackingNo": "DHL-TR-201558",
    "status": "cancelled",
    "desi": 32,
    "note": "",
    "createdAt": "2026-05-24T13:42:00"
  },
  {
    "id": 39,
    "transferNo": 7100039,
    "fromNodeId": 6,
    "toNodeId": 8,
    "companyId": 6,
    "trackingNo": "DHL-TR-201599",
    "status": "cancelled",
    "desi": 24,
    "note": "",
    "createdAt": "2026-05-25T09:21:00"
  },
  {
    "id": 40,
    "transferNo": 7100040,
    "fromNodeId": 6,
    "toNodeId": 5,
    "companyId": 1,
    "trackingNo": "YK-TR-201640",
    "status": "delivered",
    "desi": 28,
    "note": "",
    "createdAt": "2026-05-25T13:30:00"
  },
  {
    "id": 41,
    "transferNo": 7100041,
    "fromNodeId": 10,
    "toNodeId": 14,
    "companyId": 2,
    "trackingNo": "ARAS-TR-201681",
    "status": "delivered",
    "desi": 34,
    "note": "",
    "createdAt": "2026-05-26T10:21:00"
  },
  {
    "id": 42,
    "transferNo": 7100042,
    "fromNodeId": 12,
    "toNodeId": 15,
    "companyId": 3,
    "trackingNo": "MNG-TR-201722",
    "status": "delivered",
    "desi": 28,
    "note": "",
    "createdAt": "2026-05-26T12:50:00"
  },
  {
    "id": 43,
    "transferNo": 7100043,
    "fromNodeId": 14,
    "toNodeId": 11,
    "companyId": 3,
    "trackingNo": "MNG-TR-201763",
    "status": "delivered",
    "desi": 17,
    "note": "",
    "createdAt": "2026-05-27T14:59:00"
  },
  {
    "id": 44,
    "transferNo": 7100044,
    "fromNodeId": 4,
    "toNodeId": 11,
    "companyId": 2,
    "trackingNo": "ARAS-TR-201804",
    "status": "delivered",
    "desi": 35,
    "note": "",
    "createdAt": "2026-05-28T14:35:00"
  },
  {
    "id": 45,
    "transferNo": 7100045,
    "fromNodeId": 3,
    "toNodeId": 13,
    "companyId": 1,
    "trackingNo": "YK-TR-201845",
    "status": "delivered",
    "desi": 21,
    "note": "",
    "createdAt": "2026-05-29T09:24:00"
  },
  {
    "id": 46,
    "transferNo": 7100046,
    "fromNodeId": 12,
    "toNodeId": 3,
    "companyId": 3,
    "trackingNo": "MNG-TR-201886",
    "status": "delivered",
    "desi": 38,
    "note": "",
    "createdAt": "2026-05-29T14:28:00"
  },
  {
    "id": 47,
    "transferNo": 7100047,
    "fromNodeId": 1,
    "toNodeId": 10,
    "companyId": 3,
    "trackingNo": "MNG-TR-201927",
    "status": "delivered",
    "desi": 30,
    "note": "",
    "createdAt": "2026-05-30T06:29:00"
  },
  {
    "id": 48,
    "transferNo": 7100048,
    "fromNodeId": 13,
    "toNodeId": 10,
    "companyId": 2,
    "trackingNo": "ARAS-TR-201968",
    "status": "delivered",
    "desi": 6,
    "note": "",
    "createdAt": "2026-05-30T10:42:00"
  },
  {
    "id": 49,
    "transferNo": 7100049,
    "fromNodeId": 3,
    "toNodeId": 4,
    "companyId": 1,
    "trackingNo": "YK-TR-202009",
    "status": "delivered",
    "desi": 11,
    "note": "",
    "createdAt": "2026-05-31T08:17:00"
  },
  {
    "id": 50,
    "transferNo": 7100050,
    "fromNodeId": 10,
    "toNodeId": 13,
    "companyId": 7,
    "trackingNo": "HRZ-TR-202050",
    "status": "delivered",
    "desi": 8,
    "note": "",
    "createdAt": "2026-06-01T06:16:00"
  },
  {
    "id": 51,
    "transferNo": 7100051,
    "fromNodeId": 2,
    "toNodeId": 12,
    "companyId": 1,
    "trackingNo": "YK-TR-202091",
    "status": "delivered",
    "desi": 7,
    "note": "",
    "createdAt": "2026-06-01T08:27:00"
  },
  {
    "id": 52,
    "transferNo": 7100052,
    "fromNodeId": 7,
    "toNodeId": 2,
    "companyId": 1,
    "trackingNo": "YK-TR-202132",
    "status": "delivered",
    "desi": 14,
    "note": "",
    "createdAt": "2026-06-03T11:50:00"
  },
  {
    "id": 53,
    "transferNo": 7100053,
    "fromNodeId": 11,
    "toNodeId": 10,
    "companyId": 1,
    "trackingNo": "YK-TR-202173",
    "status": "preparing",
    "desi": 28,
    "note": "",
    "createdAt": "2026-06-03T11:51:00"
  },
  {
    "id": 54,
    "transferNo": 7100054,
    "fromNodeId": 1,
    "toNodeId": 13,
    "companyId": 3,
    "trackingNo": "MNG-TR-202214",
    "status": "in_transit",
    "desi": 23,
    "note": "",
    "createdAt": "2026-06-05T05:13:00"
  },
  {
    "id": 55,
    "transferNo": 7100055,
    "fromNodeId": 14,
    "toNodeId": 3,
    "companyId": 6,
    "trackingNo": "DHL-TR-202255",
    "status": "preparing",
    "desi": 35,
    "note": "",
    "createdAt": "2026-06-05T11:03:00"
  },
  {
    "id": 56,
    "transferNo": 7100056,
    "fromNodeId": 14,
    "toNodeId": 12,
    "companyId": 1,
    "trackingNo": "YK-TR-202296",
    "status": "in_transit",
    "desi": 8,
    "note": "",
    "createdAt": "2026-06-06T08:05:00"
  },
  {
    "id": 57,
    "transferNo": 7100057,
    "fromNodeId": 7,
    "toNodeId": 8,
    "companyId": 1,
    "trackingNo": "YK-TR-202337",
    "status": "in_transit",
    "desi": 31,
    "note": "",
    "createdAt": "2026-06-06T13:07:00"
  },
  {
    "id": 58,
    "transferNo": 7100058,
    "fromNodeId": 11,
    "toNodeId": 9,
    "companyId": 2,
    "trackingNo": "ARAS-TR-202378",
    "status": "preparing",
    "desi": 24,
    "note": "",
    "createdAt": "2026-06-07T09:42:00"
  },
  {
    "id": 59,
    "transferNo": 7100059,
    "fromNodeId": 6,
    "toNodeId": 1,
    "companyId": 1,
    "trackingNo": "YK-TR-202419",
    "status": "preparing",
    "desi": 27,
    "note": "",
    "createdAt": "2026-06-08T13:51:00"
  },
  {
    "id": 60,
    "transferNo": 7100060,
    "fromNodeId": 8,
    "toNodeId": 13,
    "companyId": 1,
    "trackingNo": "YK-TR-202460",
    "status": "preparing",
    "desi": 36,
    "note": "",
    "createdAt": "2026-06-10T14:04:00"
  },
  {
    "id": 61,
    "transferNo": 7100061,
    "fromNodeId": 3,
    "toNodeId": 13,
    "companyId": 1,
    "trackingNo": "YK-TR-202501",
    "status": "in_transit",
    "desi": 25,
    "note": "",
    "createdAt": "2026-06-12T06:57:00"
  },
  {
    "id": 62,
    "transferNo": 7100062,
    "fromNodeId": 9,
    "toNodeId": 7,
    "companyId": 2,
    "trackingNo": "ARAS-TR-202542",
    "status": "in_transit",
    "desi": 36,
    "note": "",
    "createdAt": "2026-06-12T07:41:00"
  },
  {
    "id": 63,
    "transferNo": 7100063,
    "fromNodeId": 6,
    "toNodeId": 1,
    "companyId": 3,
    "trackingNo": "MNG-TR-202583",
    "status": "preparing",
    "desi": 12,
    "note": "",
    "createdAt": "2026-06-12T09:19:00"
  },
  {
    "id": 64,
    "transferNo": 7100064,
    "fromNodeId": 4,
    "toNodeId": 5,
    "companyId": 1,
    "trackingNo": "YK-TR-202624",
    "status": "in_transit",
    "desi": 7,
    "note": "",
    "createdAt": "2026-06-15T06:42:00"
  },
  {
    "id": 65,
    "transferNo": 7100065,
    "fromNodeId": 6,
    "toNodeId": 5,
    "companyId": 2,
    "trackingNo": "ARAS-TR-202665",
    "status": "in_transit",
    "desi": 11,
    "note": "",
    "createdAt": "2026-06-15T13:39:00"
  },
  {
    "id": 66,
    "transferNo": 7100066,
    "fromNodeId": 1,
    "toNodeId": 5,
    "companyId": 3,
    "trackingNo": "MNG-TR-202706",
    "status": "in_transit",
    "desi": 17,
    "note": "",
    "createdAt": "2026-06-16T09:43:00"
  },
  {
    "id": 67,
    "transferNo": 7100067,
    "fromNodeId": 9,
    "toNodeId": 2,
    "companyId": 2,
    "trackingNo": "ARAS-TR-202747",
    "status": "in_transit",
    "desi": 38,
    "note": "",
    "createdAt": "2026-06-17T10:22:00"
  },
  {
    "id": 68,
    "transferNo": 7100068,
    "fromNodeId": 14,
    "toNodeId": 4,
    "companyId": 3,
    "trackingNo": "MNG-TR-202788",
    "status": "in_transit",
    "desi": 6,
    "note": "",
    "createdAt": "2026-06-18T07:18:00"
  },
  {
    "id": 69,
    "transferNo": 7100069,
    "fromNodeId": 2,
    "toNodeId": 13,
    "companyId": 1,
    "trackingNo": "YK-TR-202829",
    "status": "in_transit",
    "desi": 34,
    "note": "",
    "createdAt": "2026-06-19T05:12:00"
  },
  {
    "id": 70,
    "transferNo": 7100070,
    "fromNodeId": 6,
    "toNodeId": 8,
    "companyId": 1,
    "trackingNo": "YK-TR-202870",
    "status": "in_transit",
    "desi": 33,
    "note": "",
    "createdAt": "2026-06-22T05:48:00"
  },
  {
    "id": 71,
    "transferNo": 7100071,
    "fromNodeId": 7,
    "toNodeId": 6,
    "companyId": 1,
    "trackingNo": "YK-TR-202911",
    "status": "in_transit",
    "desi": 35,
    "note": "",
    "createdAt": "2026-06-22T06:28:00"
  },
  {
    "id": 72,
    "transferNo": 7100072,
    "fromNodeId": 7,
    "toNodeId": 8,
    "companyId": 2,
    "trackingNo": "ARAS-TR-202952",
    "status": "preparing",
    "desi": 20,
    "note": "",
    "createdAt": "2026-06-22T10:49:00"
  },
  {
    "id": 73,
    "transferNo": 7100073,
    "fromNodeId": 2,
    "toNodeId": 4,
    "companyId": 1,
    "trackingNo": "YK-TR-202993",
    "status": "preparing",
    "desi": 32,
    "note": "",
    "createdAt": "2026-06-25T06:04:00"
  },
  {
    "id": 74,
    "transferNo": 7100074,
    "fromNodeId": 6,
    "toNodeId": 8,
    "companyId": 6,
    "trackingNo": "DHL-TR-203034",
    "status": "preparing",
    "desi": 16,
    "note": "",
    "createdAt": "2026-06-25T10:13:00"
  },
  {
    "id": 75,
    "transferNo": 7100075,
    "fromNodeId": 1,
    "toNodeId": 14,
    "companyId": 1,
    "trackingNo": "YK-TR-203075",
    "status": "in_transit",
    "desi": 14,
    "note": "",
    "createdAt": "2026-06-27T11:23:00"
  },
  {
    "id": 76,
    "transferNo": 7100076,
    "fromNodeId": 10,
    "toNodeId": 13,
    "companyId": 1,
    "trackingNo": "YK-TR-203116",
    "status": "preparing",
    "desi": 24,
    "note": "",
    "createdAt": "2026-06-29T06:35:00"
  },
  {
    "id": 77,
    "transferNo": 7100077,
    "fromNodeId": 14,
    "toNodeId": 7,
    "companyId": 2,
    "trackingNo": "ARAS-TR-203157",
    "status": "in_transit",
    "desi": 18,
    "note": "",
    "createdAt": "2026-06-29T08:46:00"
  },
  {
    "id": 78,
    "transferNo": 7100078,
    "fromNodeId": 7,
    "toNodeId": 2,
    "companyId": 2,
    "trackingNo": "ARAS-TR-203198",
    "status": "in_transit",
    "desi": 9,
    "note": "",
    "createdAt": "2026-07-03T14:25:00"
  },
  {
    "id": 79,
    "transferNo": 7100079,
    "fromNodeId": 3,
    "toNodeId": 5,
    "companyId": 2,
    "trackingNo": "ARAS-TR-203239",
    "status": "in_transit",
    "desi": 34,
    "note": "",
    "createdAt": "2026-07-05T05:38:00"
  },
  {
    "id": 80,
    "transferNo": 7100080,
    "fromNodeId": 7,
    "toNodeId": 3,
    "companyId": 6,
    "trackingNo": "DHL-TR-203280",
    "status": "in_transit",
    "desi": 23,
    "note": "",
    "createdAt": "2026-07-07T12:34:00"
  }
]

export type RoutingCargoType = 'shipment' | 'transfer' | 'return'

export interface RoutingRule {
  id: number
  name: string
  priority: number
  active: boolean
  conditions: { minDesi: number; maxDesi: number; provinceIds: number[]; minAmount: number | ''; maxAmount: number | '' }
  primaryCompanyId: number
  failoverCompanyId: number | null
  cargoTypes: RoutingCargoType[]
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
    "failoverCompanyId": 1,
    "cargoTypes": ["shipment", "transfer", "return"]
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
    "failoverCompanyId": 10,
    "cargoTypes": ["shipment", "transfer", "return"]
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
    "failoverCompanyId": 2,
    "cargoTypes": ["shipment", "transfer", "return"]
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
    "failoverCompanyId": 5,
    "cargoTypes": ["shipment", "transfer", "return"]
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
    "failoverCompanyId": 3,
    "cargoTypes": ["shipment", "transfer", "return"]
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
    "companyId": 3,
    "shipmentNo": 8200001,
    "invoiceNo": "FTR-2026-00301",
    "expectedCost": 46,
    "realCost": 61,
    "invoiceDate": "2026-04-11T19:10:17",
    "status": "disputed"
  },
  {
    "id": 2,
    "companyId": 1,
    "shipmentNo": 8200002,
    "invoiceNo": "FTR-2026-00302",
    "expectedCost": 76,
    "realCost": 76,
    "invoiceDate": "2026-04-14T18:32:15",
    "status": "matched"
  },
  {
    "id": 3,
    "companyId": 1,
    "shipmentNo": 8200003,
    "invoiceNo": "FTR-2026-00303",
    "expectedCost": 76,
    "realCost": 76,
    "invoiceDate": "2026-04-15T20:05:10",
    "status": "matched"
  },
  {
    "id": 4,
    "companyId": 4,
    "shipmentNo": 8200004,
    "invoiceNo": "FTR-2026-00304",
    "expectedCost": 48,
    "realCost": 52,
    "invoiceDate": "2026-04-14T22:15:23",
    "status": "matched"
  },
  {
    "id": 5,
    "companyId": 3,
    "shipmentNo": 8200005,
    "invoiceNo": "FTR-2026-00305",
    "expectedCost": 73,
    "realCost": 84,
    "invoiceDate": "2026-04-17T17:53:05",
    "status": "disputed"
  },
  {
    "id": 6,
    "companyId": 2,
    "shipmentNo": 8200006,
    "invoiceNo": "FTR-2026-00306",
    "expectedCost": 76,
    "realCost": 76,
    "invoiceDate": "2026-04-18T21:10:52",
    "status": "matched"
  },
  {
    "id": 7,
    "companyId": 1,
    "shipmentNo": 8200007,
    "invoiceNo": "FTR-2026-00307",
    "expectedCost": 75,
    "realCost": 77,
    "invoiceDate": "2026-04-16T21:01:28",
    "status": "matched"
  },
  {
    "id": 8,
    "companyId": 1,
    "shipmentNo": 8200008,
    "invoiceNo": "FTR-2026-00308",
    "expectedCost": 47,
    "realCost": 47,
    "invoiceDate": "2026-04-17T19:29:06",
    "status": "matched"
  },
  {
    "id": 9,
    "companyId": 4,
    "shipmentNo": 8200009,
    "invoiceNo": "FTR-2026-00309",
    "expectedCost": 72,
    "realCost": 75,
    "invoiceDate": "2026-04-18T11:44:45",
    "status": "matched"
  },
  {
    "id": 10,
    "companyId": 3,
    "shipmentNo": 8200010,
    "invoiceNo": "FTR-2026-00310",
    "expectedCost": 75,
    "realCost": 96,
    "invoiceDate": "2026-04-18T02:38:27",
    "status": "disputed"
  },
  {
    "id": 11,
    "companyId": 1,
    "shipmentNo": 8200011,
    "invoiceNo": "FTR-2026-00311",
    "expectedCost": 44,
    "realCost": 49,
    "invoiceDate": "2026-04-19T18:05:10",
    "status": "matched"
  },
  {
    "id": 12,
    "companyId": 7,
    "shipmentNo": 8200012,
    "invoiceNo": "FTR-2026-00312",
    "expectedCost": 74,
    "realCost": 74,
    "invoiceDate": "2026-04-20T00:17:19",
    "status": "matched"
  },
  {
    "id": 13,
    "companyId": 2,
    "shipmentNo": 8200013,
    "invoiceNo": "FTR-2026-00313",
    "expectedCost": 78,
    "realCost": 80,
    "invoiceDate": "2026-04-23T09:40:37",
    "status": "matched"
  },
  {
    "id": 14,
    "companyId": 2,
    "shipmentNo": 8200015,
    "invoiceNo": "FTR-2026-00314",
    "expectedCost": 48,
    "realCost": 56,
    "invoiceDate": "2026-04-22T14:29:50",
    "status": "disputed"
  },
  {
    "id": 15,
    "companyId": 2,
    "shipmentNo": 8200016,
    "invoiceNo": "FTR-2026-00315",
    "expectedCost": 78,
    "realCost": 78,
    "invoiceDate": "2026-04-24T07:18:34",
    "status": "matched"
  },
  {
    "id": 16,
    "companyId": 3,
    "shipmentNo": 8200017,
    "invoiceNo": "FTR-2026-00316",
    "expectedCost": 78,
    "realCost": 98,
    "invoiceDate": "2026-04-23T20:06:36",
    "status": "disputed"
  },
  {
    "id": 17,
    "companyId": 3,
    "shipmentNo": 8200018,
    "invoiceNo": "FTR-2026-00317",
    "expectedCost": 43,
    "realCost": 55,
    "invoiceDate": "2026-04-26T08:29:10",
    "status": "disputed"
  },
  {
    "id": 18,
    "companyId": 6,
    "shipmentNo": 8200019,
    "invoiceNo": "FTR-2026-00318",
    "expectedCost": 78,
    "realCost": 78,
    "invoiceDate": "2026-04-27T17:32:18",
    "status": "matched"
  },
  {
    "id": 19,
    "companyId": 1,
    "shipmentNo": 8200020,
    "invoiceNo": "FTR-2026-00319",
    "expectedCost": 78,
    "realCost": 78,
    "invoiceDate": "2026-04-26T15:49:00",
    "status": "matched"
  },
  {
    "id": 20,
    "companyId": 1,
    "shipmentNo": 8200021,
    "invoiceNo": "FTR-2026-00320",
    "expectedCost": 77,
    "realCost": 84,
    "invoiceDate": "2026-04-26T20:29:15",
    "status": "matched"
  },
  {
    "id": 21,
    "companyId": 4,
    "shipmentNo": 8200022,
    "invoiceNo": "FTR-2026-00321",
    "expectedCost": 42,
    "realCost": 42,
    "invoiceDate": "2026-04-28T01:16:30",
    "status": "matched"
  },
  {
    "id": 22,
    "companyId": 6,
    "shipmentNo": 8200023,
    "invoiceNo": "FTR-2026-00322",
    "expectedCost": 72,
    "realCost": 72,
    "invoiceDate": "2026-04-30T05:30:53",
    "status": "matched"
  },
  {
    "id": 23,
    "companyId": 2,
    "shipmentNo": 8200024,
    "invoiceNo": "FTR-2026-00323",
    "expectedCost": 72,
    "realCost": 74,
    "invoiceDate": "2026-04-30T15:48:45",
    "status": "matched"
  },
  {
    "id": 24,
    "companyId": 1,
    "shipmentNo": 8200025,
    "invoiceNo": "FTR-2026-00324",
    "expectedCost": 45,
    "realCost": 46,
    "invoiceDate": "2026-04-29T12:54:20",
    "status": "matched"
  },
  {
    "id": 25,
    "companyId": 1,
    "shipmentNo": 8200026,
    "invoiceNo": "FTR-2026-00325",
    "expectedCost": 42,
    "realCost": 42,
    "invoiceDate": "2026-04-29T20:40:11",
    "status": "matched"
  },
  {
    "id": 26,
    "companyId": 1,
    "shipmentNo": 8200027,
    "invoiceNo": "FTR-2026-00326",
    "expectedCost": 73,
    "realCost": 73,
    "invoiceDate": "2026-04-30T05:45:45",
    "status": "matched"
  },
  {
    "id": 27,
    "companyId": 2,
    "shipmentNo": 8200028,
    "invoiceNo": "FTR-2026-00327",
    "expectedCost": 74,
    "realCost": 74,
    "invoiceDate": "2026-05-01T19:48:04",
    "status": "matched"
  },
  {
    "id": 28,
    "companyId": 1,
    "shipmentNo": 8200029,
    "invoiceNo": "FTR-2026-00328",
    "expectedCost": 44,
    "realCost": 45,
    "invoiceDate": "2026-05-03T00:30:29",
    "status": "matched"
  },
  {
    "id": 29,
    "companyId": 8,
    "shipmentNo": 8200030,
    "invoiceNo": "FTR-2026-00329",
    "expectedCost": 79,
    "realCost": 80,
    "invoiceDate": "2026-04-29T22:19:15",
    "status": "matched"
  },
  {
    "id": 30,
    "companyId": 6,
    "shipmentNo": 8200031,
    "invoiceNo": "FTR-2026-00330",
    "expectedCost": 79,
    "realCost": 79,
    "invoiceDate": "2026-05-01T23:45:40",
    "status": "matched"
  },
  {
    "id": 31,
    "companyId": 3,
    "shipmentNo": 8200032,
    "invoiceNo": "FTR-2026-00331",
    "expectedCost": 78,
    "realCost": 98,
    "invoiceDate": "2026-05-04T01:02:50",
    "status": "disputed"
  },
  {
    "id": 32,
    "companyId": 2,
    "shipmentNo": 8200033,
    "invoiceNo": "FTR-2026-00332",
    "expectedCost": 43,
    "realCost": 44,
    "invoiceDate": "2026-05-02T03:25:26",
    "status": "matched"
  },
  {
    "id": 33,
    "companyId": 3,
    "shipmentNo": 8200035,
    "invoiceNo": "FTR-2026-00333",
    "expectedCost": 76,
    "realCost": 89,
    "invoiceDate": "2026-05-06T05:02:26",
    "status": "disputed"
  },
  {
    "id": 34,
    "companyId": 2,
    "shipmentNo": 8200036,
    "invoiceNo": "FTR-2026-00334",
    "expectedCost": 43,
    "realCost": 43,
    "invoiceDate": "2026-05-03T14:09:48",
    "status": "matched"
  },
  {
    "id": 35,
    "companyId": 4,
    "shipmentNo": 8200037,
    "invoiceNo": "FTR-2026-00335",
    "expectedCost": 75,
    "realCost": 75,
    "invoiceDate": "2026-05-06T00:33:51",
    "status": "matched"
  },
  {
    "id": 36,
    "companyId": 1,
    "shipmentNo": 8200038,
    "invoiceNo": "FTR-2026-00336",
    "expectedCost": 79,
    "realCost": 79,
    "invoiceDate": "2026-05-07T10:11:03",
    "status": "matched"
  },
  {
    "id": 37,
    "companyId": 2,
    "shipmentNo": 8200039,
    "invoiceNo": "FTR-2026-00337",
    "expectedCost": 73,
    "realCost": 73,
    "invoiceDate": "2026-05-08T05:35:04",
    "status": "matched"
  },
  {
    "id": 38,
    "companyId": 1,
    "shipmentNo": 8200040,
    "invoiceNo": "FTR-2026-00338",
    "expectedCost": 44,
    "realCost": 44,
    "invoiceDate": "2026-05-04T17:37:22",
    "status": "matched"
  },
  {
    "id": 39,
    "companyId": 3,
    "shipmentNo": 8200041,
    "invoiceNo": "FTR-2026-00339",
    "expectedCost": 73,
    "realCost": 87,
    "invoiceDate": "2026-05-07T03:56:44",
    "status": "disputed"
  },
  {
    "id": 40,
    "companyId": 1,
    "shipmentNo": 8200042,
    "invoiceNo": "FTR-2026-00340",
    "expectedCost": 76,
    "realCost": 76,
    "invoiceDate": "2026-05-06T09:13:19",
    "status": "matched"
  },
  {
    "id": 41,
    "companyId": 1,
    "shipmentNo": 8200043,
    "invoiceNo": "FTR-2026-00341",
    "expectedCost": 45,
    "realCost": 45,
    "invoiceDate": "2026-05-11T02:38:47",
    "status": "matched"
  },
  {
    "id": 42,
    "companyId": 1,
    "shipmentNo": 8200044,
    "invoiceNo": "FTR-2026-00342",
    "expectedCost": 75,
    "realCost": 75,
    "invoiceDate": "2026-05-08T18:26:15",
    "status": "matched"
  },
  {
    "id": 43,
    "companyId": 1,
    "shipmentNo": 8200045,
    "invoiceNo": "FTR-2026-00343",
    "expectedCost": 78,
    "realCost": 79,
    "invoiceDate": "2026-05-10T08:52:57",
    "status": "matched"
  },
  {
    "id": 44,
    "companyId": 1,
    "shipmentNo": 8200046,
    "invoiceNo": "FTR-2026-00344",
    "expectedCost": 79,
    "realCost": 79,
    "invoiceDate": "2026-05-10T05:50:16",
    "status": "matched"
  },
  {
    "id": 45,
    "companyId": 3,
    "shipmentNo": 8200047,
    "invoiceNo": "FTR-2026-00345",
    "expectedCost": 45,
    "realCost": 58,
    "invoiceDate": "2026-05-10T23:02:59",
    "status": "disputed"
  },
  {
    "id": 46,
    "companyId": 1,
    "shipmentNo": 8200049,
    "invoiceNo": "FTR-2026-00346",
    "expectedCost": 76,
    "realCost": 76,
    "invoiceDate": "2026-05-11T09:38:36",
    "status": "matched"
  },
  {
    "id": 47,
    "companyId": 3,
    "shipmentNo": 8200050,
    "invoiceNo": "FTR-2026-00347",
    "expectedCost": 48,
    "realCost": 62,
    "invoiceDate": "2026-05-14T21:12:52",
    "status": "disputed"
  },
  {
    "id": 48,
    "companyId": 1,
    "shipmentNo": 8200052,
    "invoiceNo": "FTR-2026-00348",
    "expectedCost": 76,
    "realCost": 77,
    "invoiceDate": "2026-05-12T11:47:30",
    "status": "matched"
  },
  {
    "id": 49,
    "companyId": 3,
    "shipmentNo": 8200053,
    "invoiceNo": "FTR-2026-00349",
    "expectedCost": 77,
    "realCost": 89,
    "invoiceDate": "2026-05-13T13:38:55",
    "status": "disputed"
  },
  {
    "id": 50,
    "companyId": 1,
    "shipmentNo": 8200054,
    "invoiceNo": "FTR-2026-00350",
    "expectedCost": 46,
    "realCost": 47,
    "invoiceDate": "2026-05-13T16:31:55",
    "status": "matched"
  },
  {
    "id": 51,
    "companyId": 1,
    "shipmentNo": 8200055,
    "invoiceNo": "FTR-2026-00351",
    "expectedCost": 77,
    "realCost": 87,
    "invoiceDate": "2026-05-16T09:49:53",
    "status": "matched"
  },
  {
    "id": 52,
    "companyId": 3,
    "shipmentNo": 8200056,
    "invoiceNo": "FTR-2026-00352",
    "expectedCost": 76,
    "realCost": 97,
    "invoiceDate": "2026-05-15T17:48:44",
    "status": "disputed"
  },
  {
    "id": 53,
    "companyId": 6,
    "shipmentNo": 8200057,
    "invoiceNo": "FTR-2026-00353",
    "expectedCost": 78,
    "realCost": 89,
    "invoiceDate": "2026-05-15T06:07:45",
    "status": "matched"
  },
  {
    "id": 54,
    "companyId": 2,
    "shipmentNo": 8200058,
    "invoiceNo": "FTR-2026-00354",
    "expectedCost": 42,
    "realCost": 47,
    "invoiceDate": "2026-05-19T06:06:02",
    "status": "matched"
  },
  {
    "id": 55,
    "companyId": 3,
    "shipmentNo": 8200059,
    "invoiceNo": "FTR-2026-00355",
    "expectedCost": 75,
    "realCost": 98,
    "invoiceDate": "2026-05-18T13:35:18",
    "status": "disputed"
  },
  {
    "id": 56,
    "companyId": 6,
    "shipmentNo": 8200060,
    "invoiceNo": "FTR-2026-00356",
    "expectedCost": 74,
    "realCost": 74,
    "invoiceDate": "2026-05-19T19:14:48",
    "status": "matched"
  },
  {
    "id": 57,
    "companyId": 2,
    "shipmentNo": 8200061,
    "invoiceNo": "FTR-2026-00357",
    "expectedCost": 48,
    "realCost": 48,
    "invoiceDate": "2026-05-18T06:31:52",
    "status": "matched"
  },
  {
    "id": 58,
    "companyId": 3,
    "shipmentNo": 8200062,
    "invoiceNo": "FTR-2026-00358",
    "expectedCost": 72,
    "realCost": 95,
    "invoiceDate": "2026-05-20T13:46:18",
    "status": "disputed"
  },
  {
    "id": 59,
    "companyId": 3,
    "shipmentNo": 8200063,
    "invoiceNo": "FTR-2026-00359",
    "expectedCost": 78,
    "realCost": 100,
    "invoiceDate": "2026-05-22T07:32:59",
    "status": "disputed"
  },
  {
    "id": 60,
    "companyId": 3,
    "shipmentNo": 8200064,
    "invoiceNo": "FTR-2026-00360",
    "expectedCost": 73,
    "realCost": 84,
    "invoiceDate": "2026-05-22T02:12:58",
    "status": "disputed"
  },
  {
    "id": 61,
    "companyId": 6,
    "shipmentNo": 8200066,
    "invoiceNo": "FTR-2026-00361",
    "expectedCost": 75,
    "realCost": 75,
    "invoiceDate": "2026-05-25T01:52:36",
    "status": "matched"
  },
  {
    "id": 62,
    "companyId": 7,
    "shipmentNo": 8200067,
    "invoiceNo": "FTR-2026-00362",
    "expectedCost": 78,
    "realCost": 78,
    "invoiceDate": "2026-05-23T20:31:35",
    "status": "matched"
  },
  {
    "id": 63,
    "companyId": 1,
    "shipmentNo": 8200068,
    "invoiceNo": "FTR-2026-00363",
    "expectedCost": 44,
    "realCost": 45,
    "invoiceDate": "2026-05-24T08:07:17",
    "status": "matched"
  },
  {
    "id": 64,
    "companyId": 7,
    "shipmentNo": 8200069,
    "invoiceNo": "FTR-2026-00364",
    "expectedCost": 78,
    "realCost": 80,
    "invoiceDate": "2026-05-22T20:46:23",
    "status": "matched"
  },
  {
    "id": 65,
    "companyId": 2,
    "shipmentNo": 8200070,
    "invoiceNo": "FTR-2026-00365",
    "expectedCost": 77,
    "realCost": 85,
    "invoiceDate": "2026-05-24T15:17:58",
    "status": "matched"
  },
  {
    "id": 66,
    "companyId": 1,
    "shipmentNo": 8200071,
    "invoiceNo": "FTR-2026-00366",
    "expectedCost": 79,
    "realCost": 80,
    "invoiceDate": "2026-05-26T10:22:30",
    "status": "matched"
  },
  {
    "id": 67,
    "companyId": 8,
    "shipmentNo": 8200072,
    "invoiceNo": "FTR-2026-00367",
    "expectedCost": 46,
    "realCost": 49,
    "invoiceDate": "2026-05-25T10:20:36",
    "status": "matched"
  },
  {
    "id": 68,
    "companyId": 1,
    "shipmentNo": 8200073,
    "invoiceNo": "FTR-2026-00368",
    "expectedCost": 72,
    "realCost": 72,
    "invoiceDate": "2026-05-27T22:37:41",
    "status": "matched"
  },
  {
    "id": 69,
    "companyId": 3,
    "shipmentNo": 8200074,
    "invoiceNo": "FTR-2026-00369",
    "expectedCost": 74,
    "realCost": 89,
    "invoiceDate": "2026-05-24T23:27:20",
    "status": "disputed"
  },
  {
    "id": 70,
    "companyId": 1,
    "shipmentNo": 8200075,
    "invoiceNo": "FTR-2026-00370",
    "expectedCost": 47,
    "realCost": 48,
    "invoiceDate": "2026-05-26T13:35:07",
    "status": "matched"
  },
  {
    "id": 71,
    "companyId": 7,
    "shipmentNo": 8200076,
    "invoiceNo": "FTR-2026-00371",
    "expectedCost": 49,
    "realCost": 50,
    "invoiceDate": "2026-05-28T12:36:44",
    "status": "matched"
  },
  {
    "id": 72,
    "companyId": 1,
    "shipmentNo": 8200077,
    "invoiceNo": "FTR-2026-00372",
    "expectedCost": 75,
    "realCost": 76,
    "invoiceDate": "2026-05-27T15:34:02",
    "status": "matched"
  },
  {
    "id": 73,
    "companyId": 2,
    "shipmentNo": 8200078,
    "invoiceNo": "FTR-2026-00373",
    "expectedCost": 74,
    "realCost": 74,
    "invoiceDate": "2026-05-28T21:46:11",
    "status": "matched"
  },
  {
    "id": 74,
    "companyId": 2,
    "shipmentNo": 8200079,
    "invoiceNo": "FTR-2026-00374",
    "expectedCost": 45,
    "realCost": 45,
    "invoiceDate": "2026-05-28T16:56:55",
    "status": "matched"
  },
  {
    "id": 75,
    "companyId": 1,
    "shipmentNo": 8200080,
    "invoiceNo": "FTR-2026-00375",
    "expectedCost": 73,
    "realCost": 75,
    "invoiceDate": "2026-05-29T16:36:51",
    "status": "matched"
  },
  {
    "id": 76,
    "companyId": 7,
    "shipmentNo": 8200081,
    "invoiceNo": "FTR-2026-00376",
    "expectedCost": 78,
    "realCost": 79,
    "invoiceDate": "2026-05-30T10:04:46",
    "status": "matched"
  },
  {
    "id": 77,
    "companyId": 1,
    "shipmentNo": 8200082,
    "invoiceNo": "FTR-2026-00377",
    "expectedCost": 79,
    "realCost": 92,
    "invoiceDate": "2026-05-29T23:11:33",
    "status": "disputed"
  },
  {
    "id": 78,
    "companyId": 8,
    "shipmentNo": 8200083,
    "invoiceNo": "FTR-2026-00378",
    "expectedCost": 42,
    "realCost": 43,
    "invoiceDate": "2026-05-29T09:05:17",
    "status": "matched"
  },
  {
    "id": 79,
    "companyId": 7,
    "shipmentNo": 8200085,
    "invoiceNo": "FTR-2026-00379",
    "expectedCost": 76,
    "realCost": 76,
    "invoiceDate": "2026-05-30T21:10:38",
    "status": "matched"
  },
  {
    "id": 80,
    "companyId": 2,
    "shipmentNo": 8200086,
    "invoiceNo": "FTR-2026-00380",
    "expectedCost": 42,
    "realCost": 43,
    "invoiceDate": "2026-06-01T12:03:46",
    "status": "matched"
  },
  {
    "id": 81,
    "companyId": 2,
    "shipmentNo": 8200087,
    "invoiceNo": "FTR-2026-00381",
    "expectedCost": 79,
    "realCost": 81,
    "invoiceDate": "2026-06-02T18:24:25",
    "status": "matched"
  },
  {
    "id": 82,
    "companyId": 1,
    "shipmentNo": 8200088,
    "invoiceNo": "FTR-2026-00382",
    "expectedCost": 78,
    "realCost": 82,
    "invoiceDate": "2026-06-03T01:29:02",
    "status": "matched"
  },
  {
    "id": 83,
    "companyId": 1,
    "shipmentNo": 8200089,
    "invoiceNo": "FTR-2026-00383",
    "expectedCost": 72,
    "realCost": 72,
    "invoiceDate": "2026-05-30T12:24:10",
    "status": "matched"
  },
  {
    "id": 84,
    "companyId": 2,
    "shipmentNo": 8200090,
    "invoiceNo": "FTR-2026-00384",
    "expectedCost": 47,
    "realCost": 47,
    "invoiceDate": "2026-06-01T02:39:17",
    "status": "matched"
  },
  {
    "id": 85,
    "companyId": 4,
    "shipmentNo": 8200091,
    "invoiceNo": "FTR-2026-00385",
    "expectedCost": 76,
    "realCost": 76,
    "invoiceDate": "2026-06-04T22:22:14",
    "status": "matched"
  },
  {
    "id": 86,
    "companyId": 1,
    "shipmentNo": 8200092,
    "invoiceNo": "FTR-2026-00386",
    "expectedCost": 79,
    "realCost": 79,
    "invoiceDate": "2026-06-04T21:14:22",
    "status": "matched"
  },
  {
    "id": 87,
    "companyId": 2,
    "shipmentNo": 8200093,
    "invoiceNo": "FTR-2026-00387",
    "expectedCost": 44,
    "realCost": 44,
    "invoiceDate": "2026-06-05T21:02:38",
    "status": "matched"
  },
  {
    "id": 88,
    "companyId": 6,
    "shipmentNo": 8200094,
    "invoiceNo": "FTR-2026-00388",
    "expectedCost": 74,
    "realCost": 74,
    "invoiceDate": "2026-06-05T09:57:53",
    "status": "matched"
  },
  {
    "id": 89,
    "companyId": 3,
    "shipmentNo": 8200095,
    "invoiceNo": "FTR-2026-00389",
    "expectedCost": 78,
    "realCost": 104,
    "invoiceDate": "2026-06-08T04:24:30",
    "status": "disputed"
  },
  {
    "id": 90,
    "companyId": 7,
    "shipmentNo": 8200096,
    "invoiceNo": "FTR-2026-00390",
    "expectedCost": 77,
    "realCost": 84,
    "invoiceDate": "2026-06-06T20:34:40",
    "status": "matched"
  },
  {
    "id": 91,
    "companyId": 1,
    "shipmentNo": 8200097,
    "invoiceNo": "FTR-2026-00391",
    "expectedCost": 45,
    "realCost": 45,
    "invoiceDate": "2026-06-05T00:58:46",
    "status": "matched"
  },
  {
    "id": 92,
    "companyId": 2,
    "shipmentNo": 8200098,
    "invoiceNo": "FTR-2026-00392",
    "expectedCost": 72,
    "realCost": 72,
    "invoiceDate": "2026-06-10T02:37:15",
    "status": "matched"
  },
  {
    "id": 93,
    "companyId": 3,
    "shipmentNo": 8200099,
    "invoiceNo": "FTR-2026-00393",
    "expectedCost": 75,
    "realCost": 97,
    "invoiceDate": "2026-06-08T10:44:55",
    "status": "disputed"
  },
  {
    "id": 94,
    "companyId": 3,
    "shipmentNo": 8200100,
    "invoiceNo": "FTR-2026-00394",
    "expectedCost": 42,
    "realCost": 53,
    "invoiceDate": "2026-06-10T11:17:40",
    "status": "disputed"
  },
  {
    "id": 95,
    "companyId": 3,
    "shipmentNo": 8200101,
    "invoiceNo": "FTR-2026-00395",
    "expectedCost": 46,
    "realCost": 60,
    "invoiceDate": "2026-06-09T10:16:03",
    "status": "disputed"
  },
  {
    "id": 96,
    "companyId": 4,
    "shipmentNo": 8200102,
    "invoiceNo": "FTR-2026-00396",
    "expectedCost": 79,
    "realCost": 88,
    "invoiceDate": "2026-06-12T21:47:17",
    "status": "matched"
  },
  {
    "id": 97,
    "companyId": 1,
    "shipmentNo": 8200103,
    "invoiceNo": "FTR-2026-00397",
    "expectedCost": 72,
    "realCost": 73,
    "invoiceDate": "2026-06-13T03:49:11",
    "status": "matched"
  },
  {
    "id": 98,
    "companyId": 2,
    "shipmentNo": 8200104,
    "invoiceNo": "FTR-2026-00398",
    "expectedCost": 42,
    "realCost": 42,
    "invoiceDate": "2026-06-14T22:54:35",
    "status": "matched"
  },
  {
    "id": 99,
    "companyId": 7,
    "shipmentNo": 8200105,
    "invoiceNo": "FTR-2026-00399",
    "expectedCost": 79,
    "realCost": 92,
    "invoiceDate": "2026-06-15T15:48:34",
    "status": "disputed"
  },
  {
    "id": 100,
    "companyId": 1,
    "shipmentNo": 8200106,
    "invoiceNo": "FTR-2026-00400",
    "expectedCost": 78,
    "realCost": 78,
    "invoiceDate": "2026-06-13T06:32:08",
    "status": "matched"
  },
  {
    "id": 101,
    "companyId": 7,
    "shipmentNo": 8200107,
    "invoiceNo": "FTR-2026-00401",
    "expectedCost": 77,
    "realCost": 77,
    "invoiceDate": "2026-06-15T05:34:00",
    "status": "matched"
  },
  {
    "id": 102,
    "companyId": 3,
    "shipmentNo": 8200108,
    "invoiceNo": "FTR-2026-00402",
    "expectedCost": 47,
    "realCost": 63,
    "invoiceDate": "2026-06-14T21:39:02",
    "status": "disputed"
  },
  {
    "id": 103,
    "companyId": 1,
    "shipmentNo": 8200109,
    "invoiceNo": "FTR-2026-00403",
    "expectedCost": 75,
    "realCost": 87,
    "invoiceDate": "2026-06-14T04:40:04",
    "status": "disputed"
  },
  {
    "id": 104,
    "companyId": 1,
    "shipmentNo": 8200110,
    "invoiceNo": "FTR-2026-00404",
    "expectedCost": 72,
    "realCost": 72,
    "invoiceDate": "2026-06-15T19:59:51",
    "status": "matched"
  },
  {
    "id": 105,
    "companyId": 1,
    "shipmentNo": 8200111,
    "invoiceNo": "FTR-2026-00405",
    "expectedCost": 47,
    "realCost": 48,
    "invoiceDate": "2026-06-13T20:22:13",
    "status": "matched"
  },
  {
    "id": 106,
    "companyId": 6,
    "shipmentNo": 8200112,
    "invoiceNo": "FTR-2026-00406",
    "expectedCost": 76,
    "realCost": 78,
    "invoiceDate": "2026-06-15T17:07:29",
    "status": "matched"
  },
  {
    "id": 107,
    "companyId": 3,
    "shipmentNo": 8200113,
    "invoiceNo": "FTR-2026-00407",
    "expectedCost": 77,
    "realCost": 94,
    "invoiceDate": "2026-06-15T23:40:54",
    "status": "disputed"
  },
  {
    "id": 108,
    "companyId": 3,
    "shipmentNo": 8200114,
    "invoiceNo": "FTR-2026-00408",
    "expectedCost": 75,
    "realCost": 87,
    "invoiceDate": "2026-06-18T18:40:03",
    "status": "disputed"
  },
  {
    "id": 109,
    "companyId": 2,
    "shipmentNo": 8200115,
    "invoiceNo": "FTR-2026-00409",
    "expectedCost": 46,
    "realCost": 47,
    "invoiceDate": "2026-06-19T15:20:51",
    "status": "matched"
  },
  {
    "id": 110,
    "companyId": 3,
    "shipmentNo": 8200116,
    "invoiceNo": "FTR-2026-00410",
    "expectedCost": 79,
    "realCost": 101,
    "invoiceDate": "2026-06-19T02:32:41",
    "status": "disputed"
  },
  {
    "id": 111,
    "companyId": 4,
    "shipmentNo": 8200118,
    "invoiceNo": "FTR-2026-00411",
    "expectedCost": 44,
    "realCost": 45,
    "invoiceDate": "2026-06-18T18:09:40",
    "status": "matched"
  },
  {
    "id": 112,
    "companyId": 1,
    "shipmentNo": 8200119,
    "invoiceNo": "FTR-2026-00412",
    "expectedCost": 76,
    "realCost": 77,
    "invoiceDate": "2026-06-18T19:04:44",
    "status": "matched"
  },
  {
    "id": 113,
    "companyId": 2,
    "shipmentNo": 8200120,
    "invoiceNo": "FTR-2026-00413",
    "expectedCost": 73,
    "realCost": 73,
    "invoiceDate": "2026-06-19T07:26:49",
    "status": "matched"
  },
  {
    "id": 114,
    "companyId": 2,
    "shipmentNo": 8200121,
    "invoiceNo": "FTR-2026-00414",
    "expectedCost": 78,
    "realCost": 78,
    "invoiceDate": "2026-06-19T21:59:20",
    "status": "matched"
  },
  {
    "id": 115,
    "companyId": 6,
    "shipmentNo": 8200122,
    "invoiceNo": "FTR-2026-00415",
    "expectedCost": 45,
    "realCost": 46,
    "invoiceDate": "2026-06-20T17:23:55",
    "status": "matched"
  },
  {
    "id": 116,
    "companyId": 7,
    "shipmentNo": 8200123,
    "invoiceNo": "FTR-2026-00416",
    "expectedCost": 75,
    "realCost": 75,
    "invoiceDate": "2026-06-20T07:22:32",
    "status": "matched"
  },
  {
    "id": 117,
    "companyId": 2,
    "shipmentNo": 8200125,
    "invoiceNo": "FTR-2026-00417",
    "expectedCost": 49,
    "realCost": 49,
    "invoiceDate": "2026-06-21T13:06:52",
    "status": "matched"
  },
  {
    "id": 118,
    "companyId": 4,
    "shipmentNo": 8200126,
    "invoiceNo": "FTR-2026-00418",
    "expectedCost": 45,
    "realCost": 45,
    "invoiceDate": "2026-06-21T16:40:59",
    "status": "matched"
  },
  {
    "id": 119,
    "companyId": 1,
    "shipmentNo": 8200127,
    "invoiceNo": "FTR-2026-00419",
    "expectedCost": 72,
    "realCost": 72,
    "invoiceDate": "2026-06-22T21:06:10",
    "status": "matched"
  },
  {
    "id": 120,
    "companyId": 2,
    "shipmentNo": 8200128,
    "invoiceNo": "FTR-2026-00420",
    "expectedCost": 79,
    "realCost": 79,
    "invoiceDate": "2026-06-23T21:28:00",
    "status": "matched"
  },
  {
    "id": 121,
    "companyId": 4,
    "shipmentNo": 8200129,
    "invoiceNo": "FTR-2026-00421",
    "expectedCost": 47,
    "realCost": 48,
    "invoiceDate": "2026-06-24T16:20:29",
    "status": "matched"
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
    "monthlyLimit": 8000,
    "usedThisMonth": 5200
  },
  {
    "companyId": 2,
    "monthlyLimit": 5000,
    "usedThisMonth": 4600
  },
  {
    "companyId": 3,
    "monthlyLimit": 3500,
    "usedThisMonth": 2800
  },
  {
    "companyId": 4,
    "monthlyLimit": 1800,
    "usedThisMonth": 650
  },
  {
    "companyId": 6,
    "monthlyLimit": 2800,
    "usedThisMonth": 2660
  },
  {
    "companyId": 7,
    "monthlyLimit": 1500,
    "usedThisMonth": 380
  },
  {
    "companyId": 8,
    "monthlyLimit": 1200,
    "usedThisMonth": 290
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
  isDefaultOrder?: boolean
  isDefaultReturn?: boolean
  isDefaultTransfer?: boolean
  productTypes?: string[]
  customerSegments?: string[]
  packageTypes?: string[]
  channels?: string[]
  paymentTypes?: string[]
}

export interface ContractForm {
  companyId: number | ''
  name: string
  isDefaultOrder: boolean
  isDefaultReturn: boolean
  isDefaultTransfer: boolean
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
