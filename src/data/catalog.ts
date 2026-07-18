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
  ShipmentCanceled: { code: 50, badge: 'badge-danger' },
  OnTheWayForPickUp: { code: 385, badge: 'badge-warning' },
  OnPickUpAddress: { code: 390, badge: 'badge-warning' },
  CreateShipmentError: { code: 400, badge: 'badge-danger' },
  DispatchLabelCreated: { code: 410, badge: 'badge-warning' },
  ReceivedByProvider: { code: 415, badge: 'badge-info' },
  OnTheWay: { code: 420, badge: 'badge-info' },
  ProviderReceivedThePackage: { code: 425, badge: 'badge-info' },
  DeliveredToCustomer: { code: 540, badge: 'badge-active' },
  DeliveredToStore: { code: 560, badge: 'badge-active' },
  ShipmentFailed: { code: 510, badge: 'badge-danger' },
  OnDeliveryAddress: { code: 515, badge: 'badge-info' },
  OnTheWayBackToSender: { code: 520, badge: 'badge-danger' },
  ReturnToSender: { code: 530, badge: 'badge-passive' },
} as const

export type ShipmentStatus = keyof typeof SHIPMENT_STATUS

export const STATUS_CHART_COLORS: Record<ShipmentStatus, string> = {
  ShipmentCanceled: '#f28d97',
  OnTheWayForPickUp: '#f0c869',
  OnPickUpAddress: '#f0a869',
  CreateShipmentError: '#d9748a',
  DispatchLabelCreated: '#e8b86d',
  ReceivedByProvider: '#8fb0f5',
  OnTheWay: '#85a0f2',
  ProviderReceivedThePackage: '#6f8fe0',
  DeliveredToCustomer: '#7ecca0',
  DeliveredToStore: '#5fb389',
  ShipmentFailed: '#bb4b5a',
  OnDeliveryAddress: '#a9c2f7',
  OnTheWayBackToSender: '#bb717a',
  ReturnToSender: '#aab3c2',
}

export const STATUS_GROUPS: { key: string; label: string; statuses: ShipmentStatus[] }[] = [
  { key: 'preparing', label: 'Hazırlanıyor', statuses: ['DispatchLabelCreated', 'OnTheWayForPickUp', 'OnPickUpAddress'] },
  { key: 'transit', label: 'Yolda', statuses: ['ReceivedByProvider', 'OnTheWay', 'ProviderReceivedThePackage', 'OnDeliveryAddress'] },
  { key: 'delivered', label: 'Teslim Edildi', statuses: ['DeliveredToCustomer', 'DeliveredToStore'] },
  { key: 'failed', label: 'İptal / Sorunlu', statuses: ['ShipmentCanceled', 'CreateShipmentError', 'ShipmentFailed'] },
  { key: 'returning', label: 'Geri Dönüyor', statuses: ['OnTheWayBackToSender', 'ReturnToSender'] },
]

export interface ShipmentRoutingDecision {
  mode: 'auto' | 'manual'
  /** Step 1: companies with an active order-shipping contract. */
  contractEligibleCompanyIds: number[]
  /** Step 2: active routing rule matching desi/province/amount, if any. */
  matchedRuleId: number | null
  matchedRuleName: string | null
  matchedRuleSummary: string | null
  /** Companies left after the matched rule narrowed the pool; null if no rule narrowed it. */
  ruleNarrowedCompanyIds: number[] | null
  /** Step 3: normalized weights (fractions summing to 1) used to compute `combined`, snapshotted at decision time. */
  weights: Record<CarrierMetricKey, number>
  /** Per-carrier, per-metric normalized scores (0-1) for every company in the final eligible pool, sorted by `combined` desc. */
  scores: { companyId: number; companyName: string; metrics: Record<CarrierMetricKey, number>; combined: number }[]
  /** Step 4: final pick. */
  chosenCompanyId: number
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
  desi?: number
  orderAmount?: number
  productType?: string
  routingDecision?: ShipmentRoutingDecision
  statusHistory: { status: ShipmentStatus; at: string }[]
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
    "status": "DeliveredToCustomer",
    "cargoType": "order",
    "referenceId": "REF-70013",
    "packageNo": "PKT-000001",
    "customerName": "Ahmet Güneş",
    "channel": "Hepsiburada",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-04-10T04:41:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-04-10T06:25:24.000Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-04-10T09:38:00.000Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-04-10T12:50:36.000Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-04-10T16:03:12.000Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-04-10T19:15:48.000Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-04-10T22:28:24.000Z"
      },
      {
        "status": "DeliveredToCustomer",
        "at": "2026-04-11T01:41:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 3,
          "companyName": "MNG Kargo",
          "metrics": {
            "cost": 0.5,
            "deliveryTime": 0.5199999999999999,
            "successRate": 0.679563492063492,
            "damagedRate": 0.7333333333333334,
            "avgPickupHours": 0,
            "costDiffPct": 0
          },
          "combined": 0.47222420634920637
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 3
          }
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
    "status": "DeliveredToCustomer",
    "cargoType": "order",
    "referenceId": "REF-70026",
    "packageNo": "PKT-000002",
    "customerName": "Aslı Aydın",
    "channel": "Trendyol",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-04-11T08:56:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-04-11T11:11:46.285Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-04-11T14:46:44.571Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-04-11T18:21:42.857Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-04-11T21:56:41.142Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-04-12T01:31:39.428Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-04-12T05:06:37.714Z"
      },
      {
        "status": "DeliveredToCustomer",
        "at": "2026-04-12T06:56:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 1
          }
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
    "status": "DeliveredToCustomer",
    "cargoType": "order",
    "referenceId": "REF-70039",
    "packageNo": "PKT-000003",
    "customerName": "Gizem Aksoy",
    "channel": "Trendyol",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-04-12T04:47:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-04-12T07:36:32.571Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-04-12T11:35:05.142Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-04-12T15:33:37.714Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-04-12T19:32:10.285Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-04-12T19:36:06.857Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-04-12T23:34:39.428Z"
      },
      {
        "status": "DeliveredToCustomer",
        "at": "2026-04-13T03:33:12.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 1
          }
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
    "status": "DeliveredToCustomer",
    "cargoType": "order",
    "referenceId": "REF-70052",
    "packageNo": "PKT-000004",
    "customerName": "Selin Kurt",
    "channel": "Hepsiburada",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-04-12T08:16:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-04-12T11:41:42.857Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-04-12T16:05:01.714Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-04-12T20:28:20.571Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-04-12T20:46:51.428Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-04-13T01:10:10.285Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-04-13T05:33:29.142Z"
      },
      {
        "status": "DeliveredToCustomer",
        "at": "2026-04-13T08:16:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 4,
          "companyName": "PTT Kargo",
          "metrics": {
            "cost": 0.5,
            "deliveryTime": 1,
            "successRate": 1,
            "damagedRate": 0.2592592592592593,
            "avgPickupHours": 0.6838709677419356,
            "costDiffPct": 0.9375970850179929
          },
          "combined": 0.7630727312019187
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 4
          }
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
    "status": "DeliveredToCustomer",
    "cargoType": "order",
    "referenceId": "REF-70065",
    "packageNo": "PKT-000005",
    "customerName": "Furkan Aksoy",
    "channel": "Trendyol",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-04-14T04:05:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-04-14T08:09:17.142Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-04-14T12:58:34.285Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-04-14T13:32:51.428Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-04-14T18:22:08.571Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-04-14T23:11:25.714Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-04-14T23:45:42.857Z"
      },
      {
        "status": "DeliveredToCustomer",
        "at": "2026-04-15T04:35:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 3,
          "companyName": "MNG Kargo",
          "metrics": {
            "cost": 0.5,
            "deliveryTime": 0.5199999999999999,
            "successRate": 0.679563492063492,
            "damagedRate": 0.7333333333333334,
            "avgPickupHours": 0,
            "costDiffPct": 0
          },
          "combined": 0.47222420634920637
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 3
          }
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
    "status": "DeliveredToCustomer",
    "cargoType": "order",
    "referenceId": "REF-70078",
    "packageNo": "PKT-000006",
    "customerName": "Onur Bulut",
    "channel": "Trendyol",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-04-14T06:48:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-04-14T11:33:15.428Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-04-14T12:24:30.857Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-04-14T17:40:58.285Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-04-14T22:57:25.714Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-04-14T23:48:41.142Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-04-15T05:05:08.571Z"
      },
      {
        "status": "DeliveredToCustomer",
        "at": "2026-04-15T08:48:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 2,
          "companyName": "Aras Kargo",
          "metrics": {
            "cost": 0.5853658536585367,
            "deliveryTime": 0.2800000000000001,
            "successRate": 0.679563492063492,
            "damagedRate": 0.4666666666666667,
            "avgPickupHours": 1,
            "costDiffPct": 1
          },
          "combined": 0.6188990030971738
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 2
          }
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
    "status": "DeliveredToCustomer",
    "cargoType": "order",
    "referenceId": "REF-70091",
    "packageNo": "PKT-000007",
    "customerName": "Doğan Yıldız",
    "channel": "Kendi Web Sitesi",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-04-15T04:27:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-04-15T09:55:37.714Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-04-15T11:05:03.428Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-04-15T16:49:53.142Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-04-15T17:59:18.857Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-04-15T23:44:08.571Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-04-16T05:28:58.285Z"
      },
      {
        "status": "DeliveredToCustomer",
        "at": "2026-04-16T06:38:24.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 1
          }
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
    "status": "DeliveredToCustomer",
    "cargoType": "order",
    "referenceId": "REF-70104",
    "packageNo": "PKT-000008",
    "customerName": "Gül Bulut",
    "channel": "Hepsiburada",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-04-15T08:11:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-04-15T14:25:24.000Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-04-15T15:54:12.000Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-04-15T22:08:36.000Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-04-15T23:37:24.000Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-04-16T05:51:48.000Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-04-16T07:20:36.000Z"
      },
      {
        "status": "DeliveredToCustomer",
        "at": "2026-04-16T12:11:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 1
          }
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
    "status": "ReturnToSender",
    "cargoType": "return",
    "referenceId": "REF-70117",
    "packageNo": "PKT-000009",
    "customerName": "Burak Kaya",
    "channel": "Trendyol",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-04-16T05:22:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-04-16T07:28:46.285Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-04-16T14:13:56.571Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-04-16T16:03:18.857Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-04-16T22:48:29.142Z"
      },
      {
        "status": "ShipmentFailed",
        "at": "2026-04-17T00:37:51.428Z"
      },
      {
        "status": "OnTheWayBackToSender",
        "at": "2026-04-17T07:23:01.714Z"
      },
      {
        "status": "ReturnToSender",
        "at": "2026-04-17T09:12:24.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 4,
          "companyName": "PTT Kargo",
          "metrics": {
            "cost": 0.5,
            "deliveryTime": 1,
            "successRate": 1,
            "damagedRate": 0.2592592592592593,
            "avgPickupHours": 0.6838709677419356,
            "costDiffPct": 0.9375970850179929
          },
          "combined": 0.7630727312019187
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 4
          }
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
    "status": "DeliveredToCustomer",
    "cargoType": "order",
    "referenceId": "REF-70130",
    "packageNo": "PKT-000010",
    "customerName": "Kerem Kaya",
    "channel": "Kendi Web Sitesi",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-04-16T08:01:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-04-16T10:48:08.571Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-04-16T18:05:17.142Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-04-16T20:16:25.714Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-04-17T03:33:34.285Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-04-17T05:44:42.857Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-04-17T07:55:51.428Z"
      },
      {
        "status": "DeliveredToCustomer",
        "at": "2026-04-17T14:01:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 3,
          "companyName": "MNG Kargo",
          "metrics": {
            "cost": 0.5,
            "deliveryTime": 0.5199999999999999,
            "successRate": 0.679563492063492,
            "damagedRate": 0.7333333333333334,
            "avgPickupHours": 0,
            "costDiffPct": 0
          },
          "combined": 0.47222420634920637
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 3
          }
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
    "status": "ReturnToSender",
    "cargoType": "order",
    "referenceId": "REF-70143",
    "packageNo": "PKT-000011",
    "customerName": "Mustafa Erdoğan",
    "channel": "Hepsiburada",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-04-16T08:41:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-04-16T12:10:54.857Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-04-16T20:01:13.714Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-04-16T22:35:20.571Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-04-17T01:09:27.428Z"
      },
      {
        "status": "ShipmentFailed",
        "at": "2026-04-17T08:59:46.285Z"
      },
      {
        "status": "OnTheWayBackToSender",
        "at": "2026-04-17T11:33:53.142Z"
      },
      {
        "status": "ReturnToSender",
        "at": "2026-04-17T14:08:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 1
          }
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
    "status": "DeliveredToCustomer",
    "cargoType": "order",
    "referenceId": "REF-70156",
    "packageNo": "PKT-000012",
    "customerName": "Zeynep Yılmaz",
    "channel": "Hepsiburada",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-04-18T09:51:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-04-18T14:06:05.142Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-04-18T17:04:22.285Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-04-19T01:29:03.428Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-04-19T04:27:20.571Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-04-19T07:25:37.714Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-04-19T15:50:18.857Z"
      },
      {
        "status": "DeliveredToCustomer",
        "at": "2026-04-19T17:51:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 7,
          "companyName": "Horoz Lojistik",
          "metrics": {
            "cost": 0.5,
            "deliveryTime": 0.09999999999999996,
            "successRate": 0.6471306471306472,
            "damagedRate": 1,
            "avgPickupHours": 0.6997518610421837,
            "costDiffPct": 0.9449840836312517
          },
          "combined": 0.5712562562500053
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 7
          }
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
    "status": "DeliveredToCustomer",
    "cargoType": "order",
    "referenceId": "REF-70169",
    "packageNo": "PKT-000013",
    "customerName": "Fatma Yıldız",
    "channel": "Trendyol",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-04-18T10:55:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-04-18T15:57:39.428Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-04-18T19:21:18.857Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-04-18T22:44:58.285Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-04-19T07:45:13.714Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-04-19T11:08:53.142Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-04-19T14:32:32.571Z"
      },
      {
        "status": "DeliveredToCustomer",
        "at": "2026-04-19T17:56:12.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 2,
          "companyName": "Aras Kargo",
          "metrics": {
            "cost": 0.5853658536585367,
            "deliveryTime": 0.2800000000000001,
            "successRate": 0.679563492063492,
            "damagedRate": 0.4666666666666667,
            "avgPickupHours": 1,
            "costDiffPct": 1
          },
          "combined": 0.6188990030971738
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 2
          }
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
    "status": "OnTheWayBackToSender",
    "cargoType": "order",
    "referenceId": "REF-70182",
    "packageNo": "PKT-000014",
    "customerName": "Serkan Demir",
    "channel": "N11",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-04-19T05:27:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-05-13T15:05:02.400Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-06-01T19:13:30.000Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-06-20T23:21:57.600Z"
      },
      {
        "status": "OnTheWayBackToSender",
        "at": "2026-07-10T03:30:25.200Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 2,
          "companyName": "Aras Kargo",
          "metrics": {
            "cost": 0.5853658536585367,
            "deliveryTime": 0.2800000000000001,
            "successRate": 0.679563492063492,
            "damagedRate": 0.4666666666666667,
            "avgPickupHours": 1,
            "costDiffPct": 1
          },
          "combined": 0.6188990030971738
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 2
          }
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
    "status": "DeliveredToCustomer",
    "cargoType": "order",
    "referenceId": "REF-70195",
    "packageNo": "PKT-000015",
    "customerName": "Barış Arslan",
    "channel": "Hepsiburada",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-04-21T09:16:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-04-21T16:01:00.000Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-04-21T20:19:00.000Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-04-22T00:37:00.000Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-04-22T04:55:00.000Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-04-22T09:13:00.000Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-04-22T13:31:00.000Z"
      },
      {
        "status": "DeliveredToCustomer",
        "at": "2026-04-22T17:49:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 2,
          "companyName": "Aras Kargo",
          "metrics": {
            "cost": 0.5853658536585367,
            "deliveryTime": 0.2800000000000001,
            "successRate": 0.679563492063492,
            "damagedRate": 0.4666666666666667,
            "avgPickupHours": 1,
            "costDiffPct": 1
          },
          "combined": 0.6188990030971738
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 2
          }
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
    "status": "DeliveredToCustomer",
    "cargoType": "order",
    "referenceId": "REF-70208",
    "packageNo": "PKT-000016",
    "customerName": "Onur Arslan",
    "channel": "Kendi Web Sitesi",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-04-22T08:05:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-04-22T15:44:46.285Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-04-22T20:31:44.571Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-04-23T01:18:42.857Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-04-23T06:05:41.142Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-04-23T10:52:39.428Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-04-23T15:39:37.714Z"
      },
      {
        "status": "DeliveredToCustomer",
        "at": "2026-04-23T20:05:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 2,
          "companyName": "Aras Kargo",
          "metrics": {
            "cost": 0.5853658536585367,
            "deliveryTime": 0.2800000000000001,
            "successRate": 0.679563492063492,
            "damagedRate": 0.4666666666666667,
            "avgPickupHours": 1,
            "costDiffPct": 1
          },
          "combined": 0.6188990030971738
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 2
          }
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
    "status": "DeliveredToCustomer",
    "cargoType": "order",
    "referenceId": "REF-70221",
    "packageNo": "PKT-000017",
    "customerName": "Deniz Öztürk",
    "channel": "Hepsiburada",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-04-22T10:28:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-04-22T12:47:32.571Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-04-22T18:04:41.142Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-04-22T23:21:49.714Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-04-23T04:38:58.285Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-04-23T09:56:06.857Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-04-23T15:13:15.428Z"
      },
      {
        "status": "DeliveredToCustomer",
        "at": "2026-04-23T20:30:24.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 3,
          "companyName": "MNG Kargo",
          "metrics": {
            "cost": 0.5,
            "deliveryTime": 0.5199999999999999,
            "successRate": 0.679563492063492,
            "damagedRate": 0.7333333333333334,
            "avgPickupHours": 0,
            "costDiffPct": 0
          },
          "combined": 0.47222420634920637
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 3
          }
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
    "status": "DeliveredToCustomer",
    "cargoType": "order",
    "referenceId": "REF-70234",
    "packageNo": "PKT-000018",
    "customerName": "Mehmet Doğan",
    "channel": "Trendyol",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-04-23T04:51:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-04-23T07:59:54.857Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-04-23T13:48:25.714Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-04-23T19:36:56.571Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-04-24T01:25:27.428Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-04-24T07:13:58.285Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-04-24T13:02:29.142Z"
      },
      {
        "status": "DeliveredToCustomer",
        "at": "2026-04-24T18:51:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 3,
          "companyName": "MNG Kargo",
          "metrics": {
            "cost": 0.5,
            "deliveryTime": 0.5199999999999999,
            "successRate": 0.679563492063492,
            "damagedRate": 0.7333333333333334,
            "avgPickupHours": 0,
            "costDiffPct": 0
          },
          "combined": 0.47222420634920637
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 3
          }
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
    "status": "DeliveredToCustomer",
    "cargoType": "order",
    "referenceId": "REF-70247",
    "packageNo": "PKT-000019",
    "customerName": "Elif Yavuz",
    "channel": "Trendyol",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-04-23T05:35:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-04-23T09:35:41.142Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-04-23T15:56:46.285Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-04-23T22:17:51.428Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-04-24T04:38:56.571Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-04-24T11:00:01.714Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-04-24T17:21:06.857Z"
      },
      {
        "status": "DeliveredToCustomer",
        "at": "2026-04-24T20:35:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 6,
          "companyName": "DHL eCommerce",
          "metrics": {
            "cost": 0.29268292682926833,
            "deliveryTime": 0.6666666666666665,
            "successRate": 0,
            "damagedRate": 0.2592592592592593,
            "avgPickupHours": 0.8538899430740037,
            "costDiffPct": 0.9922127873486873
          },
          "combined": 0.4170402640088454
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 6
          }
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
    "status": "DeliveredToCustomer",
    "cargoType": "order",
    "referenceId": "REF-70260",
    "packageNo": "PKT-000020",
    "customerName": "Aslı Bulut",
    "channel": "Kendi Web Sitesi",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-04-23T06:40:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-04-23T11:34:51.428Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-04-23T18:29:42.857Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-04-24T01:24:34.285Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-04-24T08:19:25.714Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-04-24T08:26:17.142Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-04-24T15:21:08.571Z"
      },
      {
        "status": "DeliveredToCustomer",
        "at": "2026-04-24T22:16:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 1
          }
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
    "status": "DeliveredToCustomer",
    "cargoType": "order",
    "referenceId": "REF-70273",
    "packageNo": "PKT-000021",
    "customerName": "İrem Özdemir",
    "channel": "Trendyol",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-04-23T11:40:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-04-23T17:31:25.714Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-04-24T01:01:15.428Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-04-24T08:31:05.142Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-04-24T09:02:42.857Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-04-24T16:32:32.571Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-04-25T00:02:22.285Z"
      },
      {
        "status": "DeliveredToCustomer",
        "at": "2026-04-25T04:40:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 1
          }
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
    "status": "DeliveredToCustomer",
    "cargoType": "order",
    "referenceId": "REF-70286",
    "packageNo": "PKT-000022",
    "customerName": "Gül Erdoğan",
    "channel": "Kendi Web Sitesi",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-04-24T07:19:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-04-24T14:09:24.000Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-04-24T22:15:24.000Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-04-24T23:13:00.000Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-04-25T07:19:00.000Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-04-25T15:25:00.000Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-04-25T16:22:36.000Z"
      },
      {
        "status": "DeliveredToCustomer",
        "at": "2026-04-26T00:28:36.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 4,
          "companyName": "PTT Kargo",
          "metrics": {
            "cost": 0.5,
            "deliveryTime": 1,
            "successRate": 1,
            "damagedRate": 0.2592592592592593,
            "avgPickupHours": 0.6838709677419356,
            "costDiffPct": 0.9375970850179929
          },
          "combined": 0.7630727312019187
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 4
          }
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
    "status": "DeliveredToCustomer",
    "cargoType": "order",
    "referenceId": "REF-70299",
    "packageNo": "PKT-000023",
    "customerName": "Gizem Şimşek",
    "channel": "Trendyol",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-04-25T03:06:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-04-25T10:57:46.285Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-04-25T12:22:32.571Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-04-25T21:05:54.857Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-04-26T05:49:17.142Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-04-26T07:14:03.428Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-04-26T15:57:25.714Z"
      },
      {
        "status": "DeliveredToCustomer",
        "at": "2026-04-26T22:06:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 6,
          "companyName": "DHL eCommerce",
          "metrics": {
            "cost": 0.29268292682926833,
            "deliveryTime": 0.6666666666666665,
            "successRate": 0,
            "damagedRate": 0.2592592592592593,
            "avgPickupHours": 0.8538899430740037,
            "costDiffPct": 0.9922127873486873
          },
          "combined": 0.4170402640088454
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 6
          }
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
    "status": "DeliveredToCustomer",
    "cargoType": "order",
    "referenceId": "REF-70312",
    "packageNo": "PKT-000024",
    "customerName": "Deniz Arslan",
    "channel": "Trendyol",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-04-26T02:12:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-04-26T11:07:32.571Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-04-26T13:00:41.142Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-04-26T22:22:37.714Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-04-27T00:15:46.285Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-04-27T09:37:42.857Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-04-27T18:59:39.428Z"
      },
      {
        "status": "DeliveredToCustomer",
        "at": "2026-04-27T20:52:48.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 2,
          "companyName": "Aras Kargo",
          "metrics": {
            "cost": 0.5853658536585367,
            "deliveryTime": 0.2800000000000001,
            "successRate": 0.679563492063492,
            "damagedRate": 0.4666666666666667,
            "avgPickupHours": 1,
            "costDiffPct": 1
          },
          "combined": 0.6188990030971738
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 2
          }
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
    "status": "DeliveredToCustomer",
    "cargoType": "order",
    "referenceId": "REF-70325",
    "packageNo": "PKT-000025",
    "customerName": "Kaan Güneş",
    "channel": "Trendyol",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-04-26T06:21:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-04-26T16:22:42.857Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-04-26T18:45:25.714Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-04-27T04:47:08.571Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-04-27T07:09:51.428Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-04-27T17:11:34.285Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-04-27T19:34:17.142Z"
      },
      {
        "status": "DeliveredToCustomer",
        "at": "2026-04-28T03:21:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 1
          }
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
    "status": "DeliveredToCustomer",
    "cargoType": "order",
    "referenceId": "REF-70338",
    "packageNo": "PKT-000026",
    "customerName": "Deniz Yılmaz",
    "channel": "N11",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-04-28T02:40:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-04-28T06:01:05.142Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-04-28T16:43:46.285Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-04-28T19:37:15.428Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-04-29T06:19:56.571Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-04-29T09:13:25.714Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-04-29T19:56:06.857Z"
      },
      {
        "status": "DeliveredToCustomer",
        "at": "2026-04-29T22:49:36.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 1
          }
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
    "status": "DeliveredToCustomer",
    "cargoType": "order",
    "referenceId": "REF-70351",
    "packageNo": "PKT-000027",
    "customerName": "Merve Koç",
    "channel": "Trendyol",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-04-28T04:24:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-04-28T08:45:51.428Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-04-28T20:10:42.857Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-04-28T23:36:10.285Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-04-29T11:01:01.714Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-04-29T14:26:29.142Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-04-29T17:51:56.571Z"
      },
      {
        "status": "DeliveredToCustomer",
        "at": "2026-04-30T03:24:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 1
          }
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
    "status": "DeliveredToCustomer",
    "cargoType": "order",
    "referenceId": "REF-70364",
    "packageNo": "PKT-000028",
    "customerName": "Doğan Özdemir",
    "channel": "Trendyol",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-04-28T05:09:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-04-28T10:34:01.714Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-04-28T22:42:15.428Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-04-29T02:40:53.142Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-04-29T06:39:30.857Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-04-29T18:47:44.571Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-04-29T22:46:22.285Z"
      },
      {
        "status": "DeliveredToCustomer",
        "at": "2026-04-30T02:45:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 2,
          "companyName": "Aras Kargo",
          "metrics": {
            "cost": 0.5853658536585367,
            "deliveryTime": 0.2800000000000001,
            "successRate": 0.679563492063492,
            "damagedRate": 0.4666666666666667,
            "avgPickupHours": 1,
            "costDiffPct": 1
          },
          "combined": 0.6188990030971738
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 2
          }
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
    "status": "DeliveredToCustomer",
    "cargoType": "order",
    "referenceId": "REF-70377",
    "packageNo": "PKT-000029",
    "customerName": "Ebru Yavuz",
    "channel": "N11",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-04-28T05:14:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-04-28T11:44:36.000Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-04-28T16:17:36.000Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-04-29T05:10:24.000Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-04-29T09:43:24.000Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-04-29T14:16:24.000Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-04-30T03:09:12.000Z"
      },
      {
        "status": "DeliveredToCustomer",
        "at": "2026-04-30T06:14:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 1
          }
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
    "status": "DeliveredToCustomer",
    "cargoType": "order",
    "referenceId": "REF-70390",
    "packageNo": "PKT-000030",
    "customerName": "Cem Erdoğan",
    "channel": "Trendyol",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-04-28T09:41:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-04-28T12:44:25.714Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-04-28T14:47:51.428Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-04-28T16:51:17.142Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-04-28T22:18:42.857Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-04-29T00:22:08.571Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-04-29T02:25:34.285Z"
      },
      {
        "status": "DeliveredToCustomer",
        "at": "2026-04-29T04:29:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 8,
          "companyName": "Hepsijet",
          "metrics": {
            "cost": 1,
            "deliveryTime": 0,
            "successRate": 0.19047619047619038,
            "damagedRate": 1,
            "avgPickupHours": 0.6838709677419356,
            "costDiffPct": 0.9556096935478475
          },
          "combined": 0.561567113748026
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 8
          }
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
    "status": "DeliveredToCustomer",
    "cargoType": "order",
    "referenceId": "REF-70403",
    "packageNo": "PKT-000031",
    "customerName": "Serkan Erdoğan",
    "channel": "Trendyol",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-04-29T07:21:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-04-29T10:58:48.000Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-04-29T13:21:00.000Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-04-29T15:43:12.000Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-04-29T18:05:24.000Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-04-30T00:01:48.000Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-04-30T02:24:00.000Z"
      },
      {
        "status": "DeliveredToCustomer",
        "at": "2026-04-30T04:21:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 6,
          "companyName": "DHL eCommerce",
          "metrics": {
            "cost": 0.29268292682926833,
            "deliveryTime": 0.6666666666666665,
            "successRate": 0,
            "damagedRate": 0.2592592592592593,
            "avgPickupHours": 0.8538899430740037,
            "costDiffPct": 0.9922127873486873
          },
          "combined": 0.4170402640088454
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 6
          }
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
    "status": "DeliveredToCustomer",
    "cargoType": "order",
    "referenceId": "REF-70416",
    "packageNo": "PKT-000032",
    "customerName": "Kerem Doğan",
    "channel": "Hepsiburada",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-04-29T09:35:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-04-29T13:49:34.285Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-04-29T16:31:44.571Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-04-29T19:13:54.857Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-04-29T21:56:05.142Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-04-30T00:38:15.428Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-04-30T03:20:25.714Z"
      },
      {
        "status": "DeliveredToCustomer",
        "at": "2026-04-30T06:02:36.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 3,
          "companyName": "MNG Kargo",
          "metrics": {
            "cost": 0.5,
            "deliveryTime": 0.5199999999999999,
            "successRate": 0.679563492063492,
            "damagedRate": 0.7333333333333334,
            "avgPickupHours": 0,
            "costDiffPct": 0
          },
          "combined": 0.47222420634920637
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 3
          }
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
    "status": "DeliveredToCustomer",
    "cargoType": "return",
    "referenceId": "REF-70429",
    "packageNo": "PKT-000033",
    "customerName": "Ayşe Polat",
    "channel": "Trendyol",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-04-29T10:51:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-04-29T15:44:44.571Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-04-29T18:48:05.142Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-04-29T21:51:25.714Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-04-30T00:54:46.285Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-04-30T03:58:06.857Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-04-30T07:01:27.428Z"
      },
      {
        "status": "DeliveredToCustomer",
        "at": "2026-04-30T09:51:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 2,
          "companyName": "Aras Kargo",
          "metrics": {
            "cost": 0.5853658536585367,
            "deliveryTime": 0.2800000000000001,
            "successRate": 0.679563492063492,
            "damagedRate": 0.4666666666666667,
            "avgPickupHours": 1,
            "costDiffPct": 1
          },
          "combined": 0.6188990030971738
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 2
          }
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
    "status": "ShipmentCanceled",
    "cargoType": "order",
    "referenceId": "REF-70442",
    "packageNo": "PKT-000034",
    "customerName": "Burak Aksoy",
    "channel": "Trendyol",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-05-02T04:19:00.000Z"
      },
      {
        "status": "ShipmentCanceled",
        "at": "2026-05-02T09:50:12.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 3,
          "companyName": "MNG Kargo",
          "metrics": {
            "cost": 0.5,
            "deliveryTime": 0.5199999999999999,
            "successRate": 0.679563492063492,
            "damagedRate": 0.7333333333333334,
            "avgPickupHours": 0,
            "costDiffPct": 0
          },
          "combined": 0.47222420634920637
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 3
          }
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
    "status": "ReturnToSender",
    "cargoType": "order",
    "referenceId": "REF-70455",
    "packageNo": "PKT-000035",
    "customerName": "Gül Doğan",
    "channel": "Hepsiburada",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-05-02T07:35:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-05-02T09:39:17.142Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-05-02T13:28:34.285Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-05-02T17:17:51.428Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-05-02T21:07:08.571Z"
      },
      {
        "status": "ShipmentFailed",
        "at": "2026-05-03T00:56:25.714Z"
      },
      {
        "status": "OnTheWayBackToSender",
        "at": "2026-05-03T04:45:42.857Z"
      },
      {
        "status": "ReturnToSender",
        "at": "2026-05-03T08:35:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 3,
          "companyName": "MNG Kargo",
          "metrics": {
            "cost": 0.5,
            "deliveryTime": 0.5199999999999999,
            "successRate": 0.679563492063492,
            "damagedRate": 0.7333333333333334,
            "avgPickupHours": 0,
            "costDiffPct": 0
          },
          "combined": 0.47222420634920637
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 3
          }
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
    "status": "DeliveredToCustomer",
    "cargoType": "order",
    "referenceId": "REF-70468",
    "packageNo": "PKT-000036",
    "customerName": "Hakan Özdemir",
    "channel": "Hepsiburada",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-05-02T09:59:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-05-02T12:39:27.428Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-05-02T16:53:30.857Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-05-02T21:07:34.285Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-05-03T01:21:37.714Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-05-03T05:35:41.142Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-05-03T09:49:44.571Z"
      },
      {
        "status": "DeliveredToCustomer",
        "at": "2026-05-03T11:59:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 2,
          "companyName": "Aras Kargo",
          "metrics": {
            "cost": 0.5853658536585367,
            "deliveryTime": 0.2800000000000001,
            "successRate": 0.679563492063492,
            "damagedRate": 0.4666666666666667,
            "avgPickupHours": 1,
            "costDiffPct": 1
          },
          "combined": 0.6188990030971738
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 2
          }
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
    "status": "DeliveredToCustomer",
    "cargoType": "order",
    "referenceId": "REF-70481",
    "packageNo": "PKT-000037",
    "customerName": "Selin Yavuz",
    "channel": "Trendyol",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-05-02T10:39:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-05-02T13:58:01.714Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-05-02T18:38:03.428Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-05-02T23:18:05.142Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-05-03T03:58:06.857Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-05-03T04:02:44.571Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-05-03T08:42:46.285Z"
      },
      {
        "status": "DeliveredToCustomer",
        "at": "2026-05-03T13:22:48.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 4,
      "matchedRuleName": "Ege Bölgesi Standart",
      "matchedRuleSummary": "0–30 desi · İzmir",
      "ruleNarrowedCompanyIds": [
        2
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 4,
          "companyName": "PTT Kargo",
          "metrics": {
            "cost": 0.5,
            "deliveryTime": 1,
            "successRate": 1,
            "damagedRate": 0.2592592592592593,
            "avgPickupHours": 0.6838709677419356,
            "costDiffPct": 0.9375970850179929
          },
          "combined": 0.7630727312019187
        },
        {
          "companyId": 2,
          "companyName": "Aras Kargo",
          "metrics": {
            "cost": 0.5853658536585367,
            "deliveryTime": 0.2800000000000001,
            "successRate": 0.679563492063492,
            "damagedRate": 0.4666666666666667,
            "avgPickupHours": 1,
            "costDiffPct": 1
          },
          "combined": 0.6188990030971738
        }
      ],
      "chosenCompanyId": 4
          }
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
    "status": "DeliveredToCustomer",
    "cargoType": "return",
    "referenceId": "REF-70494",
    "packageNo": "PKT-000038",
    "customerName": "Fatma Özdemir",
    "channel": "Hepsiburada",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-05-03T02:24:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-05-03T06:24:00.000Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-05-03T11:31:12.000Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-05-03T16:38:24.000Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-05-03T17:00:00.000Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-05-03T22:07:12.000Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-05-04T03:14:24.000Z"
      },
      {
        "status": "DeliveredToCustomer",
        "at": "2026-05-04T06:24:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 1
          }
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
    "status": "ReturnToSender",
    "cargoType": "order",
    "referenceId": "REF-70507",
    "packageNo": "PKT-000039",
    "customerName": "Hakan Aksoy",
    "channel": "Hepsiburada",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-05-03T03:29:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-05-03T08:12:22.285Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-05-03T13:47:56.571Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-05-03T14:27:42.857Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-05-03T20:03:17.142Z"
      },
      {
        "status": "ShipmentFailed",
        "at": "2026-05-04T01:38:51.428Z"
      },
      {
        "status": "OnTheWayBackToSender",
        "at": "2026-05-04T02:18:37.714Z"
      },
      {
        "status": "ReturnToSender",
        "at": "2026-05-04T07:54:12.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 2,
          "companyName": "Aras Kargo",
          "metrics": {
            "cost": 0.5853658536585367,
            "deliveryTime": 0.2800000000000001,
            "successRate": 0.679563492063492,
            "damagedRate": 0.4666666666666667,
            "avgPickupHours": 1,
            "costDiffPct": 1
          },
          "combined": 0.6188990030971738
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 2
          }
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
    "status": "DeliveredToCustomer",
    "cargoType": "return",
    "referenceId": "REF-70520",
    "packageNo": "PKT-000040",
    "customerName": "Mustafa Güneş",
    "channel": "Hepsiburada",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-05-03T04:05:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-05-03T09:34:08.571Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-05-03T10:33:17.142Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-05-03T16:38:25.714Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-05-03T22:43:34.285Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-05-03T23:42:42.857Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-05-04T05:47:51.428Z"
      },
      {
        "status": "DeliveredToCustomer",
        "at": "2026-05-04T10:05:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 1
          }
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
    "status": "DeliveredToCustomer",
    "cargoType": "order",
    "referenceId": "REF-70533",
    "packageNo": "PKT-000041",
    "customerName": "Yusuf Kaya",
    "channel": "Hepsiburada",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-05-04T10:25:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-05-04T16:42:18.857Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-05-04T18:02:01.714Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-05-05T00:37:56.571Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-05-05T01:57:39.428Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-05-05T08:33:34.285Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-05-05T15:09:29.142Z"
      },
      {
        "status": "DeliveredToCustomer",
        "at": "2026-05-05T16:29:12.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 3,
          "companyName": "MNG Kargo",
          "metrics": {
            "cost": 0.5,
            "deliveryTime": 0.5199999999999999,
            "successRate": 0.679563492063492,
            "damagedRate": 0.7333333333333334,
            "avgPickupHours": 0,
            "costDiffPct": 0
          },
          "combined": 0.47222420634920637
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 3
          }
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
    "status": "ReturnToSender",
    "cargoType": "order",
    "referenceId": "REF-70546",
    "packageNo": "PKT-000042",
    "customerName": "Ceren Polat",
    "channel": "N11",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-05-04T11:34:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-05-04T18:41:53.142Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-05-04T20:23:22.285Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-05-05T03:31:15.428Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-05-05T05:12:44.571Z"
      },
      {
        "status": "ShipmentFailed",
        "at": "2026-05-05T12:20:37.714Z"
      },
      {
        "status": "OnTheWayBackToSender",
        "at": "2026-05-05T14:02:06.857Z"
      },
      {
        "status": "ReturnToSender",
        "at": "2026-05-05T19:34:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 1
          }
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
    "status": "DeliveredToCustomer",
    "cargoType": "order",
    "referenceId": "REF-70559",
    "packageNo": "PKT-000043",
    "customerName": "Zeynep Öztürk",
    "channel": "N11",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-05-06T02:29:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-05-06T04:53:15.428Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-05-06T12:34:18.857Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-05-06T14:38:46.285Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-05-06T22:19:49.714Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-05-07T00:24:17.142Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-05-07T08:05:20.571Z"
      },
      {
        "status": "DeliveredToCustomer",
        "at": "2026-05-07T10:09:48.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 1
          }
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
    "status": "DeliveredToCustomer",
    "cargoType": "return",
    "referenceId": "REF-70572",
    "packageNo": "PKT-000044",
    "customerName": "Deniz Polat",
    "channel": "Hepsiburada",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-05-06T02:50:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-05-06T05:59:25.714Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-05-06T14:14:51.428Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-05-06T16:43:29.142Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-05-07T00:58:54.857Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-05-07T03:27:32.571Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-05-07T05:56:10.285Z"
      },
      {
        "status": "DeliveredToCustomer",
        "at": "2026-05-07T12:50:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 1
          }
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
    "status": "DeliveredToCustomer",
    "cargoType": "order",
    "referenceId": "REF-70585",
    "packageNo": "PKT-000045",
    "customerName": "İrem Aksoy",
    "channel": "Trendyol",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-05-06T06:54:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-05-06T10:51:00.000Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-05-06T19:42:00.000Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-05-06T22:36:00.000Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-05-07T01:30:00.000Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-05-07T10:21:00.000Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-05-07T13:15:00.000Z"
      },
      {
        "status": "DeliveredToCustomer",
        "at": "2026-05-07T16:09:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 4,
      "matchedRuleName": "Ege Bölgesi Standart",
      "matchedRuleSummary": "0–30 desi · İzmir",
      "ruleNarrowedCompanyIds": [
        2
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 2,
          "companyName": "Aras Kargo",
          "metrics": {
            "cost": 0.5853658536585367,
            "deliveryTime": 0.2800000000000001,
            "successRate": 0.679563492063492,
            "damagedRate": 0.4666666666666667,
            "avgPickupHours": 1,
            "costDiffPct": 1
          },
          "combined": 0.6188990030971738
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 1
          }
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
    "status": "DeliveredToCustomer",
    "cargoType": "order",
    "referenceId": "REF-70598",
    "packageNo": "PKT-000046",
    "customerName": "Mehmet Öztürk",
    "channel": "Kendi Web Sitesi",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-05-07T06:54:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-05-07T11:40:58.285Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-05-07T15:01:32.571Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-05-08T00:29:18.857Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-05-08T03:49:53.142Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-05-08T07:10:27.428Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-05-08T16:38:13.714Z"
      },
      {
        "status": "DeliveredToCustomer",
        "at": "2026-05-08T18:54:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 1
          }
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
    "status": "DeliveredToCustomer",
    "cargoType": "order",
    "referenceId": "REF-70611",
    "packageNo": "PKT-000047",
    "customerName": "Cem Doğan",
    "channel": "Hepsiburada",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-05-07T10:38:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-05-07T16:17:20.571Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-05-07T20:05:41.142Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-05-07T23:54:01.714Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-05-08T09:59:46.285Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-05-08T13:48:06.857Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-05-08T17:36:27.428Z"
      },
      {
        "status": "DeliveredToCustomer",
        "at": "2026-05-08T21:24:48.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 3,
          "companyName": "MNG Kargo",
          "metrics": {
            "cost": 0.5,
            "deliveryTime": 0.5199999999999999,
            "successRate": 0.679563492063492,
            "damagedRate": 0.7333333333333334,
            "avgPickupHours": 0,
            "costDiffPct": 0
          },
          "combined": 0.47222420634920637
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 3
          }
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
    "status": "ShipmentCanceled",
    "cargoType": "order",
    "referenceId": "REF-70624",
    "packageNo": "PKT-000048",
    "customerName": "Mustafa Aydın",
    "channel": "Trendyol",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-05-09T05:37:00.000Z"
      },
      {
        "status": "ShipmentCanceled",
        "at": "2026-05-09T10:37:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 2,
          "companyName": "Aras Kargo",
          "metrics": {
            "cost": 0.5853658536585367,
            "deliveryTime": 0.2800000000000001,
            "successRate": 0.679563492063492,
            "damagedRate": 0.4666666666666667,
            "avgPickupHours": 1,
            "costDiffPct": 1
          },
          "combined": 0.6188990030971738
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 2
          }
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
    "status": "DeliveredToCustomer",
    "cargoType": "order",
    "referenceId": "REF-70637",
    "packageNo": "PKT-000049",
    "customerName": "Kaan Bulut",
    "channel": "Trendyol",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-05-09T09:16:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-05-09T16:47:17.142Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-05-09T21:34:46.285Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-05-10T02:22:15.428Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-05-10T07:09:44.571Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-05-10T11:57:13.714Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-05-10T16:44:42.857Z"
      },
      {
        "status": "DeliveredToCustomer",
        "at": "2026-05-10T21:32:12.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 1
          }
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
    "status": "DeliveredToCustomer",
    "cargoType": "order",
    "referenceId": "REF-70650",
    "packageNo": "PKT-000050",
    "customerName": "İrem Erdoğan",
    "channel": "Hepsiburada",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-05-10T07:01:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-05-10T15:31:51.428Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-05-10T20:50:42.857Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-05-11T02:09:34.285Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-05-11T07:28:25.714Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-05-11T12:47:17.142Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-05-11T18:06:08.571Z"
      },
      {
        "status": "DeliveredToCustomer",
        "at": "2026-05-11T23:01:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 3,
          "companyName": "MNG Kargo",
          "metrics": {
            "cost": 0.5,
            "deliveryTime": 0.5199999999999999,
            "successRate": 0.679563492063492,
            "damagedRate": 0.7333333333333334,
            "avgPickupHours": 0,
            "costDiffPct": 0
          },
          "combined": 0.47222420634920637
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 3
          }
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
    "status": "ShipmentCanceled",
    "cargoType": "order",
    "referenceId": "REF-70663",
    "packageNo": "PKT-000051",
    "customerName": "Onur Yılmaz",
    "channel": "Kendi Web Sitesi",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-05-10T10:34:00.000Z"
      },
      {
        "status": "ShipmentCanceled",
        "at": "2026-05-10T13:19:36.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 8,
          "companyName": "Hepsijet",
          "metrics": {
            "cost": 1,
            "deliveryTime": 0,
            "successRate": 0.19047619047619038,
            "damagedRate": 1,
            "avgPickupHours": 0.6838709677419356,
            "costDiffPct": 0.9556096935478475
          },
          "combined": 0.561567113748026
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 8
          }
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
    "status": "DeliveredToCustomer",
    "cargoType": "order",
    "referenceId": "REF-70676",
    "packageNo": "PKT-000052",
    "customerName": "Kaan Koç",
    "channel": "Hepsiburada",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-05-11T03:55:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-05-11T07:23:48.000Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-05-11T13:49:00.000Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-05-11T20:14:12.000Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-05-12T02:39:24.000Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-05-12T09:04:36.000Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-05-12T15:29:48.000Z"
      },
      {
        "status": "DeliveredToCustomer",
        "at": "2026-05-12T21:55:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 1
          }
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
    "status": "DeliveredToCustomer",
    "cargoType": "order",
    "referenceId": "REF-70689",
    "packageNo": "PKT-000053",
    "customerName": "Aslı Aksoy",
    "channel": "Kendi Web Sitesi",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-05-12T03:12:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-05-12T07:37:22.285Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-05-12T14:37:32.571Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-05-12T21:37:42.857Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-05-13T04:37:53.142Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-05-13T11:38:03.428Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-05-13T18:38:13.714Z"
      },
      {
        "status": "DeliveredToCustomer",
        "at": "2026-05-13T22:12:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 3,
          "companyName": "MNG Kargo",
          "metrics": {
            "cost": 0.5,
            "deliveryTime": 0.5199999999999999,
            "successRate": 0.679563492063492,
            "damagedRate": 0.7333333333333334,
            "avgPickupHours": 0,
            "costDiffPct": 0
          },
          "combined": 0.47222420634920637
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 3
          }
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
    "status": "DeliveredToCustomer",
    "cargoType": "order",
    "referenceId": "REF-70702",
    "packageNo": "PKT-000054",
    "customerName": "Furkan Koç",
    "channel": "Trendyol",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-05-12T07:44:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-05-12T13:08:20.571Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-05-12T20:44:41.142Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-05-13T04:21:01.714Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-05-13T11:57:22.285Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-05-13T12:04:54.857Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-05-13T19:41:15.428Z"
      },
      {
        "status": "DeliveredToCustomer",
        "at": "2026-05-14T03:17:36.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 1
          }
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
    "status": "DeliveredToCustomer",
    "cargoType": "order",
    "referenceId": "REF-70715",
    "packageNo": "PKT-000055",
    "customerName": "Ebru Yılmaz",
    "channel": "Kendi Web Sitesi",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-05-12T08:14:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-05-12T14:39:42.857Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-05-12T22:53:25.714Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-05-13T07:07:08.571Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-05-13T07:41:51.428Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-05-13T15:55:34.285Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-05-14T00:09:17.142Z"
      },
      {
        "status": "DeliveredToCustomer",
        "at": "2026-05-14T05:14:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 1
          }
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
    "status": "DeliveredToCustomer",
    "cargoType": "return",
    "referenceId": "REF-70728",
    "packageNo": "PKT-000056",
    "customerName": "Gül Aksoy",
    "channel": "Hepsiburada",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-05-12T09:23:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-05-12T16:52:29.142Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-05-13T01:44:46.285Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-05-13T02:47:51.428Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-05-13T11:40:08.571Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-05-13T20:32:25.714Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-05-13T21:35:30.857Z"
      },
      {
        "status": "DeliveredToCustomer",
        "at": "2026-05-14T06:27:48.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 3,
          "companyName": "MNG Kargo",
          "metrics": {
            "cost": 0.5,
            "deliveryTime": 0.5199999999999999,
            "successRate": 0.679563492063492,
            "damagedRate": 0.7333333333333334,
            "avgPickupHours": 0,
            "costDiffPct": 0
          },
          "combined": 0.47222420634920637
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 3
          }
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
    "status": "DeliveredToCustomer",
    "cargoType": "order",
    "referenceId": "REF-70741",
    "packageNo": "PKT-000057",
    "customerName": "Fatma Özdemir",
    "channel": "Trendyol",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-05-13T04:58:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-05-13T13:33:39.428Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-05-13T15:06:18.857Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-05-14T00:38:22.285Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-05-14T10:10:25.714Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-05-14T11:43:05.142Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-05-14T21:15:08.571Z"
      },
      {
        "status": "DeliveredToCustomer",
        "at": "2026-05-15T03:58:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 6,
          "companyName": "DHL eCommerce",
          "metrics": {
            "cost": 0.29268292682926833,
            "deliveryTime": 0.6666666666666665,
            "successRate": 0,
            "damagedRate": 0.2592592592592593,
            "avgPickupHours": 0.8538899430740037,
            "costDiffPct": 0.9922127873486873
          },
          "combined": 0.4170402640088454
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 6
          }
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
    "status": "DeliveredToCustomer",
    "cargoType": "order",
    "referenceId": "REF-70754",
    "packageNo": "PKT-000058",
    "customerName": "Tuğçe Kurt",
    "channel": "Trendyol",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-05-14T04:00:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-05-14T13:44:13.714Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-05-14T15:47:39.428Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-05-15T02:00:41.142Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-05-15T04:04:06.857Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-05-15T14:17:08.571Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-05-16T00:30:10.285Z"
      },
      {
        "status": "DeliveredToCustomer",
        "at": "2026-05-16T02:33:36.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 2,
          "companyName": "Aras Kargo",
          "metrics": {
            "cost": 0.5853658536585367,
            "deliveryTime": 0.2800000000000001,
            "successRate": 0.679563492063492,
            "damagedRate": 0.4666666666666667,
            "avgPickupHours": 1,
            "costDiffPct": 1
          },
          "combined": 0.6188990030971738
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 2
          }
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
    "status": "ReturnToSender",
    "cargoType": "return",
    "referenceId": "REF-70767",
    "packageNo": "PKT-000059",
    "customerName": "Merve Çelik",
    "channel": "Hepsiburada",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-05-14T09:41:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-05-14T20:36:12.000Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-05-14T23:11:36.000Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-05-15T10:06:48.000Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-05-15T12:42:12.000Z"
      },
      {
        "status": "ShipmentFailed",
        "at": "2026-05-15T23:37:24.000Z"
      },
      {
        "status": "OnTheWayBackToSender",
        "at": "2026-05-16T02:12:48.000Z"
      },
      {
        "status": "ReturnToSender",
        "at": "2026-05-16T10:41:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 3,
          "companyName": "MNG Kargo",
          "metrics": {
            "cost": 0.5,
            "deliveryTime": 0.5199999999999999,
            "successRate": 0.679563492063492,
            "damagedRate": 0.7333333333333334,
            "avgPickupHours": 0,
            "costDiffPct": 0
          },
          "combined": 0.47222420634920637
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 3
          }
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
    "status": "DeliveredToCustomer",
    "cargoType": "order",
    "referenceId": "REF-70780",
    "packageNo": "PKT-000060",
    "customerName": "Yusuf Koç",
    "channel": "Hepsiburada",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-05-15T06:41:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-05-15T08:08:25.714Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-05-15T12:47:51.428Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-05-15T14:03:17.142Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-05-15T18:42:42.857Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-05-15T19:58:08.571Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-05-16T00:37:34.285Z"
      },
      {
        "status": "DeliveredToCustomer",
        "at": "2026-05-16T01:53:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 6,
          "companyName": "DHL eCommerce",
          "metrics": {
            "cost": 0.29268292682926833,
            "deliveryTime": 0.6666666666666665,
            "successRate": 0,
            "damagedRate": 0.2592592592592593,
            "avgPickupHours": 0.8538899430740037,
            "costDiffPct": 0.9922127873486873
          },
          "combined": 0.4170402640088454
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 6
          }
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
    "status": "DeliveredToCustomer",
    "cargoType": "order",
    "referenceId": "REF-70793",
    "packageNo": "PKT-000061",
    "customerName": "Aslı Demir",
    "channel": "N11",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-05-15T09:50:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-05-15T11:47:00.000Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-05-15T16:53:00.000Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-05-15T18:24:48.000Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-05-15T23:30:48.000Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-05-16T01:02:36.000Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-05-16T02:34:24.000Z"
      },
      {
        "status": "DeliveredToCustomer",
        "at": "2026-05-16T06:50:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 2,
          "companyName": "Aras Kargo",
          "metrics": {
            "cost": 0.5853658536585367,
            "deliveryTime": 0.2800000000000001,
            "successRate": 0.679563492063492,
            "damagedRate": 0.4666666666666667,
            "avgPickupHours": 1,
            "costDiffPct": 1
          },
          "combined": 0.6188990030971738
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 2
          }
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
    "status": "DeliveredToCustomer",
    "cargoType": "return",
    "referenceId": "REF-70806",
    "packageNo": "PKT-000062",
    "customerName": "Pınar Yılmaz",
    "channel": "Trendyol",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-05-19T04:44:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-05-19T07:12:58.285Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-05-19T12:46:44.571Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-05-19T14:36:06.857Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-05-19T16:25:29.142Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-05-19T21:59:15.428Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-05-19T23:48:37.714Z"
      },
      {
        "status": "DeliveredToCustomer",
        "at": "2026-05-20T01:38:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 3,
          "companyName": "MNG Kargo",
          "metrics": {
            "cost": 0.5,
            "deliveryTime": 0.5199999999999999,
            "successRate": 0.679563492063492,
            "damagedRate": 0.7333333333333334,
            "avgPickupHours": 0,
            "costDiffPct": 0
          },
          "combined": 0.47222420634920637
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 3
          }
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
    "status": "DeliveredToCustomer",
    "cargoType": "order",
    "referenceId": "REF-70819",
    "packageNo": "PKT-000063",
    "customerName": "Barış Güneş",
    "channel": "Trendyol",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-05-20T02:04:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-05-20T05:07:20.571Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-05-20T07:15:29.142Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-05-20T13:18:13.714Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-05-20T15:26:22.285Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-05-20T17:34:30.857Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-05-20T23:37:15.428Z"
      },
      {
        "status": "DeliveredToCustomer",
        "at": "2026-05-21T01:04:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 3,
          "companyName": "MNG Kargo",
          "metrics": {
            "cost": 0.5,
            "deliveryTime": 0.5199999999999999,
            "successRate": 0.679563492063492,
            "damagedRate": 0.7333333333333334,
            "avgPickupHours": 0,
            "costDiffPct": 0
          },
          "combined": 0.47222420634920637
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 3
          }
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
    "status": "DeliveredToCustomer",
    "cargoType": "order",
    "referenceId": "REF-70832",
    "packageNo": "PKT-000064",
    "customerName": "Ebru Demir",
    "channel": "Trendyol",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-05-20T02:31:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-05-20T06:11:06.857Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-05-20T08:39:13.714Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-05-20T11:07:20.571Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-05-20T17:40:15.428Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-05-20T20:08:22.285Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-05-20T22:36:29.142Z"
      },
      {
        "status": "DeliveredToCustomer",
        "at": "2026-05-21T01:04:36.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 3,
          "companyName": "MNG Kargo",
          "metrics": {
            "cost": 0.5,
            "deliveryTime": 0.5199999999999999,
            "successRate": 0.679563492063492,
            "damagedRate": 0.7333333333333334,
            "avgPickupHours": 0,
            "costDiffPct": 0
          },
          "combined": 0.47222420634920637
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 3
          }
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
    "status": "ShipmentCanceled",
    "cargoType": "return",
    "referenceId": "REF-70845",
    "packageNo": "PKT-000065",
    "customerName": "Gül Yavuz",
    "channel": "Hepsiburada",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-05-20T06:46:00.000Z"
      },
      {
        "status": "ShipmentCanceled",
        "at": "2026-05-20T08:46:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 1
          }
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
    "status": "DeliveredToCustomer",
    "cargoType": "order",
    "referenceId": "REF-70858",
    "packageNo": "PKT-000066",
    "customerName": "Mehmet Koç",
    "channel": "Trendyol",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-05-20T11:33:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-05-20T16:33:51.428Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-05-20T19:45:30.857Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-05-20T22:57:10.285Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-05-21T02:08:49.714Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-05-21T05:20:29.142Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-05-21T08:32:08.571Z"
      },
      {
        "status": "DeliveredToCustomer",
        "at": "2026-05-21T11:43:48.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 6,
          "companyName": "DHL eCommerce",
          "metrics": {
            "cost": 0.29268292682926833,
            "deliveryTime": 0.6666666666666665,
            "successRate": 0,
            "damagedRate": 0.2592592592592593,
            "avgPickupHours": 0.8538899430740037,
            "costDiffPct": 0.9922127873486873
          },
          "combined": 0.4170402640088454
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 6
          }
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
    "status": "DeliveredToCustomer",
    "cargoType": "order",
    "referenceId": "REF-70871",
    "packageNo": "PKT-000067",
    "customerName": "Serkan Bulut",
    "channel": "Hepsiburada",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-05-21T05:07:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-05-21T10:51:49.714Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-05-21T14:27:03.428Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-05-21T18:02:17.142Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-05-21T21:37:30.857Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-05-22T01:12:44.571Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-05-22T04:47:58.285Z"
      },
      {
        "status": "DeliveredToCustomer",
        "at": "2026-05-22T08:07:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 7,
          "companyName": "Horoz Lojistik",
          "metrics": {
            "cost": 0.5,
            "deliveryTime": 0.09999999999999996,
            "successRate": 0.6471306471306472,
            "damagedRate": 1,
            "avgPickupHours": 0.6997518610421837,
            "costDiffPct": 0.9449840836312517
          },
          "combined": 0.5712562562500053
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 7
          }
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
    "status": "DeliveredToCustomer",
    "cargoType": "order",
    "referenceId": "REF-70884",
    "packageNo": "PKT-000068",
    "customerName": "Kaan Bulut",
    "channel": "Hepsiburada",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-05-21T06:33:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-05-21T08:18:36.000Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-05-21T12:18:36.000Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-05-21T16:18:36.000Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-05-21T20:18:36.000Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-05-22T00:18:36.000Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-05-22T04:18:36.000Z"
      },
      {
        "status": "DeliveredToCustomer",
        "at": "2026-05-22T08:18:36.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 1
          }
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
    "status": "DeliveredToCustomer",
    "cargoType": "order",
    "referenceId": "REF-70897",
    "packageNo": "PKT-000069",
    "customerName": "İrem Polat",
    "channel": "Hepsiburada",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-05-21T09:53:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-05-21T12:17:10.285Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-05-21T16:43:08.571Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-05-21T21:09:06.857Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-05-22T01:35:05.142Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-05-22T06:01:03.428Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-05-22T10:27:01.714Z"
      },
      {
        "status": "DeliveredToCustomer",
        "at": "2026-05-22T14:53:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 7,
          "companyName": "Horoz Lojistik",
          "metrics": {
            "cost": 0.5,
            "deliveryTime": 0.09999999999999996,
            "successRate": 0.6471306471306472,
            "damagedRate": 1,
            "avgPickupHours": 0.6997518610421837,
            "costDiffPct": 0.9449840836312517
          },
          "combined": 0.5712562562500053
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 7
          }
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
    "status": "DeliveredToCustomer",
    "cargoType": "order",
    "referenceId": "REF-70910",
    "packageNo": "PKT-000070",
    "customerName": "Gizem Bulut",
    "channel": "Hepsiburada",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-05-22T02:23:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-05-22T05:28:08.571Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-05-22T10:21:17.142Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-05-22T15:14:25.714Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-05-22T20:07:34.285Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-05-23T01:00:42.857Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-05-23T05:53:51.428Z"
      },
      {
        "status": "DeliveredToCustomer",
        "at": "2026-05-23T08:23:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 2,
          "companyName": "Aras Kargo",
          "metrics": {
            "cost": 0.5853658536585367,
            "deliveryTime": 0.2800000000000001,
            "successRate": 0.679563492063492,
            "damagedRate": 0.4666666666666667,
            "avgPickupHours": 1,
            "costDiffPct": 1
          },
          "combined": 0.6188990030971738
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 2
          }
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
    "status": "DeliveredToCustomer",
    "cargoType": "order",
    "referenceId": "REF-70923",
    "packageNo": "PKT-000071",
    "customerName": "Doğan Kurt",
    "channel": "Trendyol",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-05-22T04:01:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-05-22T07:49:30.857Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-05-22T13:11:01.714Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-05-22T18:32:32.571Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-05-22T23:54:03.428Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-05-22T23:59:22.285Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-05-23T05:20:53.142Z"
      },
      {
        "status": "DeliveredToCustomer",
        "at": "2026-05-23T10:42:24.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 1
          }
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
    "status": "DeliveredToCustomer",
    "cargoType": "return",
    "referenceId": "REF-70936",
    "packageNo": "PKT-000072",
    "customerName": "Gizem Bulut",
    "channel": "Trendyol",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-05-23T03:20:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-05-23T07:54:17.142Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-05-23T13:45:22.285Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-05-23T19:36:27.428Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-05-23T20:01:08.571Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-05-24T01:52:13.714Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-05-24T07:43:18.857Z"
      },
      {
        "status": "DeliveredToCustomer",
        "at": "2026-05-24T11:20:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 8,
          "companyName": "Hepsijet",
          "metrics": {
            "cost": 1,
            "deliveryTime": 0,
            "successRate": 0.19047619047619038,
            "damagedRate": 1,
            "avgPickupHours": 0.6838709677419356,
            "costDiffPct": 0.9556096935478475
          },
          "combined": 0.561567113748026
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 8
          }
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
    "status": "ReturnToSender",
    "cargoType": "order",
    "referenceId": "REF-70949",
    "packageNo": "PKT-000073",
    "customerName": "Fatma Çelik",
    "channel": "Trendyol",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-05-23T04:54:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-05-23T10:16:27.428Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-05-23T16:38:18.857Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-05-23T17:23:34.285Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-05-23T23:45:25.714Z"
      },
      {
        "status": "ShipmentFailed",
        "at": "2026-05-24T06:07:17.142Z"
      },
      {
        "status": "OnTheWayBackToSender",
        "at": "2026-05-24T06:52:32.571Z"
      },
      {
        "status": "ReturnToSender",
        "at": "2026-05-24T13:14:24.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 1
          }
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
    "status": "DeliveredToCustomer",
    "cargoType": "order",
    "referenceId": "REF-70962",
    "packageNo": "PKT-000074",
    "customerName": "Aslı Aksoy",
    "channel": "Trendyol",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-05-23T07:48:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-05-23T14:01:01.714Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-05-23T15:08:03.428Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-05-23T22:01:53.142Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-05-24T04:55:42.857Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-05-24T06:02:44.571Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-05-24T12:56:34.285Z"
      },
      {
        "status": "DeliveredToCustomer",
        "at": "2026-05-24T17:48:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 3,
          "companyName": "MNG Kargo",
          "metrics": {
            "cost": 0.5,
            "deliveryTime": 0.5199999999999999,
            "successRate": 0.679563492063492,
            "damagedRate": 0.7333333333333334,
            "avgPickupHours": 0,
            "costDiffPct": 0
          },
          "combined": 0.47222420634920637
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 3
          }
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
    "status": "DeliveredToCustomer",
    "cargoType": "order",
    "referenceId": "REF-70975",
    "packageNo": "PKT-000075",
    "customerName": "Fatma Aydın",
    "channel": "Kendi Web Sitesi",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-05-23T09:06:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-05-23T16:12:00.000Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-05-23T17:42:00.000Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-05-24T01:09:00.000Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-05-24T02:39:00.000Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-05-24T10:06:00.000Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-05-24T17:33:00.000Z"
      },
      {
        "status": "DeliveredToCustomer",
        "at": "2026-05-24T19:03:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 1
          }
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
    "status": "DeliveredToCustomer",
    "cargoType": "order",
    "referenceId": "REF-70988",
    "packageNo": "PKT-000076",
    "customerName": "Gül Öztürk",
    "channel": "N11",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-05-23T11:05:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-05-23T19:06:22.285Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-05-23T21:00:32.571Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-05-24T05:01:54.857Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-05-24T06:56:05.142Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-05-24T14:57:27.428Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-05-24T16:51:37.714Z"
      },
      {
        "status": "DeliveredToCustomer",
        "at": "2026-05-24T23:05:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 7,
          "companyName": "Horoz Lojistik",
          "metrics": {
            "cost": 0.5,
            "deliveryTime": 0.09999999999999996,
            "successRate": 0.6471306471306472,
            "damagedRate": 1,
            "avgPickupHours": 0.6997518610421837,
            "costDiffPct": 0.9449840836312517
          },
          "combined": 0.5712562562500053
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 7
          }
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
    "status": "DeliveredToCustomer",
    "cargoType": "order",
    "referenceId": "REF-71001",
    "packageNo": "PKT-000077",
    "customerName": "Onur Arslan",
    "channel": "Trendyol",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-05-24T04:55:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-05-24T07:36:44.571Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-05-24T16:13:41.142Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-05-24T18:33:13.714Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-05-25T03:10:10.285Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-05-25T05:29:42.857Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-05-25T14:06:39.428Z"
      },
      {
        "status": "DeliveredToCustomer",
        "at": "2026-05-25T16:26:12.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 1
          }
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
    "status": "DeliveredToCustomer",
    "cargoType": "order",
    "referenceId": "REF-71014",
    "packageNo": "PKT-000078",
    "customerName": "İrem Şahin",
    "channel": "Hepsiburada",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-05-24T11:55:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-05-24T15:26:42.857Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-05-25T00:40:25.714Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-05-25T03:26:32.571Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-05-25T12:40:15.428Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-05-25T15:26:22.285Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-05-25T18:12:29.142Z"
      },
      {
        "status": "DeliveredToCustomer",
        "at": "2026-05-26T01:55:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 2,
          "companyName": "Aras Kargo",
          "metrics": {
            "cost": 0.5853658536585367,
            "deliveryTime": 0.2800000000000001,
            "successRate": 0.679563492063492,
            "damagedRate": 0.4666666666666667,
            "avgPickupHours": 1,
            "costDiffPct": 1
          },
          "combined": 0.6188990030971738
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 2
          }
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
    "status": "DeliveredToCustomer",
    "cargoType": "order",
    "referenceId": "REF-71027",
    "packageNo": "PKT-000079",
    "customerName": "Kerem Bulut",
    "channel": "Trendyol",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-05-25T02:21:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-05-25T06:45:05.142Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-05-25T16:36:46.285Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-05-25T19:50:39.428Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-05-25T23:04:32.571Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-05-26T08:56:13.714Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-05-26T12:10:06.857Z"
      },
      {
        "status": "DeliveredToCustomer",
        "at": "2026-05-26T15:24:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 4,
      "matchedRuleName": "Ege Bölgesi Standart",
      "matchedRuleSummary": "0–30 desi · İzmir",
      "ruleNarrowedCompanyIds": [
        2
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 2,
          "companyName": "Aras Kargo",
          "metrics": {
            "cost": 0.5853658536585367,
            "deliveryTime": 0.2800000000000001,
            "successRate": 0.679563492063492,
            "damagedRate": 0.4666666666666667,
            "avgPickupHours": 1,
            "costDiffPct": 1
          },
          "combined": 0.6188990030971738
        }
      ],
      "chosenCompanyId": 2
          }
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
    "status": "DeliveredToCustomer",
    "cargoType": "order",
    "referenceId": "REF-71040",
    "packageNo": "PKT-000080",
    "customerName": "Aslı Aksoy",
    "channel": "Hepsiburada",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-05-25T03:17:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-05-25T08:35:51.428Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-05-25T12:18:42.857Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-05-25T22:49:34.285Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-05-26T02:32:25.714Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-05-26T06:15:17.142Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-05-26T16:46:08.571Z"
      },
      {
        "status": "DeliveredToCustomer",
        "at": "2026-05-26T19:17:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 1
          }
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
    "status": "DeliveredToCustomer",
    "cargoType": "order",
    "referenceId": "REF-71053",
    "packageNo": "PKT-000081",
    "customerName": "Gül Erdoğan",
    "channel": "Kendi Web Sitesi",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-05-26T07:17:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-05-26T13:33:01.714Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-05-26T17:46:03.428Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-05-26T21:59:05.142Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-05-27T09:10:18.857Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-05-27T13:23:20.571Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-05-27T17:36:22.285Z"
      },
      {
        "status": "DeliveredToCustomer",
        "at": "2026-05-27T21:49:24.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 7,
          "companyName": "Horoz Lojistik",
          "metrics": {
            "cost": 0.5,
            "deliveryTime": 0.09999999999999996,
            "successRate": 0.6471306471306472,
            "damagedRate": 1,
            "avgPickupHours": 0.6997518610421837,
            "costDiffPct": 0.9449840836312517
          },
          "combined": 0.5712562562500053
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 7
          }
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
    "status": "DeliveredToCustomer",
    "cargoType": "return",
    "referenceId": "REF-71066",
    "packageNo": "PKT-000082",
    "customerName": "Mehmet Koç",
    "channel": "Trendyol",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-05-26T10:44:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-05-26T17:59:36.000Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-05-26T22:44:00.000Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-05-27T03:28:24.000Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-05-27T08:12:48.000Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-05-27T20:05:36.000Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-05-28T00:50:00.000Z"
      },
      {
        "status": "DeliveredToCustomer",
        "at": "2026-05-28T04:44:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 1
          }
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
    "status": "ReturnToSender",
    "cargoType": "order",
    "referenceId": "REF-71079",
    "packageNo": "PKT-000083",
    "customerName": "Ebru Aksoy",
    "channel": "Trendyol",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-05-27T08:17:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-05-27T16:34:34.285Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-05-27T21:51:32.571Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-05-28T03:08:30.857Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-05-28T08:25:29.142Z"
      },
      {
        "status": "ShipmentFailed",
        "at": "2026-05-28T13:42:27.428Z"
      },
      {
        "status": "OnTheWayBackToSender",
        "at": "2026-05-28T18:59:25.714Z"
      },
      {
        "status": "ReturnToSender",
        "at": "2026-05-29T00:16:24.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 8,
          "companyName": "Hepsijet",
          "metrics": {
            "cost": 1,
            "deliveryTime": 0,
            "successRate": 0.19047619047619038,
            "damagedRate": 1,
            "avgPickupHours": 0.6838709677419356,
            "costDiffPct": 0.9556096935478475
          },
          "combined": 0.561567113748026
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 8
          }
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
    "status": "ShipmentCanceled",
    "cargoType": "order",
    "referenceId": "REF-71092",
    "packageNo": "PKT-000084",
    "customerName": "Doğan Aksoy",
    "channel": "N11",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-05-27T09:56:00.000Z"
      },
      {
        "status": "ShipmentCanceled",
        "at": "2026-05-27T15:56:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 1
          }
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
    "status": "DeliveredToCustomer",
    "cargoType": "return",
    "referenceId": "REF-71105",
    "packageNo": "PKT-000085",
    "customerName": "Selin Doğan",
    "channel": "Trendyol",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-05-28T08:45:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-05-28T11:34:42.857Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-05-28T18:00:25.714Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-05-29T00:26:08.571Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-05-29T06:51:51.428Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-05-29T13:17:34.285Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-05-29T19:43:17.142Z"
      },
      {
        "status": "DeliveredToCustomer",
        "at": "2026-05-30T02:09:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 7,
          "companyName": "Horoz Lojistik",
          "metrics": {
            "cost": 0.5,
            "deliveryTime": 0.09999999999999996,
            "successRate": 0.6471306471306472,
            "damagedRate": 1,
            "avgPickupHours": 0.6997518610421837,
            "costDiffPct": 0.9449840836312517
          },
          "combined": 0.5712562562500053
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 7
          }
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
    "status": "DeliveredToCustomer",
    "cargoType": "order",
    "referenceId": "REF-71118",
    "packageNo": "PKT-000086",
    "customerName": "Onur Arslan",
    "channel": "Hepsiburada",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-05-28T10:10:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-05-28T13:58:41.142Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-05-28T21:00:34.285Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-05-29T04:02:27.428Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-05-29T11:04:20.571Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-05-29T18:06:13.714Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-05-30T01:08:06.857Z"
      },
      {
        "status": "DeliveredToCustomer",
        "at": "2026-05-30T08:10:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 2,
          "companyName": "Aras Kargo",
          "metrics": {
            "cost": 0.5853658536585367,
            "deliveryTime": 0.2800000000000001,
            "successRate": 0.679563492063492,
            "damagedRate": 0.4666666666666667,
            "avgPickupHours": 1,
            "costDiffPct": 1
          },
          "combined": 0.6188990030971738
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 2
          }
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
    "status": "DeliveredToCustomer",
    "cargoType": "order",
    "referenceId": "REF-71131",
    "packageNo": "PKT-000087",
    "customerName": "Emre Yıldız",
    "channel": "Trendyol",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-05-29T04:58:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-05-29T09:48:03.428Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-05-29T17:27:18.857Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-05-30T01:06:34.285Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-05-30T08:45:49.714Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-05-30T16:25:05.142Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-05-31T00:04:20.571Z"
      },
      {
        "status": "DeliveredToCustomer",
        "at": "2026-05-31T03:58:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 2,
          "companyName": "Aras Kargo",
          "metrics": {
            "cost": 0.5853658536585367,
            "deliveryTime": 0.2800000000000001,
            "successRate": 0.679563492063492,
            "damagedRate": 0.4666666666666667,
            "avgPickupHours": 1,
            "costDiffPct": 1
          },
          "combined": 0.6188990030971738
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 2
          }
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
    "status": "DeliveredToCustomer",
    "cargoType": "order",
    "referenceId": "REF-71144",
    "packageNo": "PKT-000088",
    "customerName": "Mehmet Kaya",
    "channel": "Hepsiburada",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-05-29T08:11:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-05-29T14:04:49.714Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-05-29T22:22:39.428Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-05-30T06:40:29.142Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-05-30T14:58:18.857Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-05-30T15:06:32.571Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-05-30T23:24:22.285Z"
      },
      {
        "status": "DeliveredToCustomer",
        "at": "2026-05-31T07:42:12.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 1
          }
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
    "status": "DeliveredToCustomer",
    "cargoType": "order",
    "referenceId": "REF-71157",
    "packageNo": "PKT-000089",
    "customerName": "Elif Şahin",
    "channel": "Trendyol",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-05-29T08:52:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-05-29T15:52:00.000Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-05-30T00:49:36.000Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-05-30T09:47:12.000Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-05-30T10:25:00.000Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-05-30T19:22:36.000Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-05-31T04:20:12.000Z"
      },
      {
        "status": "DeliveredToCustomer",
        "at": "2026-05-31T09:52:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 1
          }
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
    "status": "DeliveredToCustomer",
    "cargoType": "order",
    "referenceId": "REF-71170",
    "packageNo": "PKT-000090",
    "customerName": "Kerem Özdemir",
    "channel": "Kendi Web Sitesi",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-05-30T08:14:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-05-30T11:29:25.714Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-05-30T15:20:51.428Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-05-30T15:48:17.142Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-05-30T19:39:42.857Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-05-30T23:31:08.571Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-05-30T23:58:34.285Z"
      },
      {
        "status": "DeliveredToCustomer",
        "at": "2026-05-31T03:50:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 2,
          "companyName": "Aras Kargo",
          "metrics": {
            "cost": 0.5853658536585367,
            "deliveryTime": 0.2800000000000001,
            "successRate": 0.679563492063492,
            "damagedRate": 0.4666666666666667,
            "avgPickupHours": 1,
            "costDiffPct": 1
          },
          "combined": 0.6188990030971738
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 2
          }
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
    "status": "ReturnToSender",
    "cargoType": "order",
    "referenceId": "REF-71183",
    "packageNo": "PKT-000091",
    "customerName": "Gül Özdemir",
    "channel": "Trendyol",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-05-31T11:16:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-05-31T15:06:24.000Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-05-31T15:47:48.000Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-05-31T20:03:24.000Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-06-01T00:19:00.000Z"
      },
      {
        "status": "ShipmentFailed",
        "at": "2026-06-01T01:00:24.000Z"
      },
      {
        "status": "OnTheWayBackToSender",
        "at": "2026-06-01T05:16:00.000Z"
      },
      {
        "status": "ReturnToSender",
        "at": "2026-06-01T08:16:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 4,
          "companyName": "PTT Kargo",
          "metrics": {
            "cost": 0.5,
            "deliveryTime": 1,
            "successRate": 1,
            "damagedRate": 0.2592592592592593,
            "avgPickupHours": 0.6838709677419356,
            "costDiffPct": 0.9375970850179929
          },
          "combined": 0.7630727312019187
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 4
          }
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
    "status": "DeliveredToCustomer",
    "cargoType": "order",
    "referenceId": "REF-71196",
    "packageNo": "PKT-000092",
    "customerName": "İrem Erdoğan",
    "channel": "N11",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-06-01T06:28:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-06-01T10:55:46.285Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-06-01T11:52:20.571Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-06-01T16:33:18.857Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-06-01T17:29:53.142Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-06-01T22:10:51.428Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-06-02T02:51:49.714Z"
      },
      {
        "status": "DeliveredToCustomer",
        "at": "2026-06-02T03:48:24.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 1
          }
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
    "status": "DeliveredToCustomer",
    "cargoType": "order",
    "referenceId": "REF-71209",
    "packageNo": "PKT-000093",
    "customerName": "Ceren Yıldız",
    "channel": "N11",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-06-02T10:04:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-06-02T15:11:32.571Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-06-02T16:24:29.142Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-06-02T21:32:01.714Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-06-02T22:44:58.285Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-06-03T03:52:30.857Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-06-03T05:05:27.428Z"
      },
      {
        "status": "DeliveredToCustomer",
        "at": "2026-06-03T09:04:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 2,
          "companyName": "Aras Kargo",
          "metrics": {
            "cost": 0.5853658536585367,
            "deliveryTime": 0.2800000000000001,
            "successRate": 0.679563492063492,
            "damagedRate": 0.4666666666666667,
            "avgPickupHours": 1,
            "costDiffPct": 1
          },
          "combined": 0.6188990030971738
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 2
          }
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
    "status": "DeliveredToCustomer",
    "cargoType": "order",
    "referenceId": "REF-71222",
    "packageNo": "PKT-000094",
    "customerName": "Ayşe Doğan",
    "channel": "Trendyol",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-06-03T03:33:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-06-03T05:17:54.857Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-06-03T10:53:13.714Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-06-03T12:23:44.571Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-06-03T17:59:03.428Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-06-03T19:29:34.285Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-06-04T01:04:53.142Z"
      },
      {
        "status": "DeliveredToCustomer",
        "at": "2026-06-04T02:35:24.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 6,
          "companyName": "DHL eCommerce",
          "metrics": {
            "cost": 0.29268292682926833,
            "deliveryTime": 0.6666666666666665,
            "successRate": 0,
            "damagedRate": 0.2592592592592593,
            "avgPickupHours": 0.8538899430740037,
            "costDiffPct": 0.9922127873486873
          },
          "combined": 0.4170402640088454
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 6
          }
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
    "status": "DeliveredToCustomer",
    "cargoType": "order",
    "referenceId": "REF-71235",
    "packageNo": "PKT-000095",
    "customerName": "Merve Çelik",
    "channel": "Trendyol",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-06-03T05:40:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-06-03T07:59:17.142Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-06-03T14:03:34.285Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-06-03T15:52:51.428Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-06-03T21:57:08.571Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-06-03T23:46:25.714Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-06-04T01:35:42.857Z"
      },
      {
        "status": "DeliveredToCustomer",
        "at": "2026-06-04T06:40:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 3,
          "companyName": "MNG Kargo",
          "metrics": {
            "cost": 0.5,
            "deliveryTime": 0.5199999999999999,
            "successRate": 0.679563492063492,
            "damagedRate": 0.7333333333333334,
            "avgPickupHours": 0,
            "costDiffPct": 0
          },
          "combined": 0.47222420634920637
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 3
          }
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
    "status": "DeliveredToCustomer",
    "cargoType": "order",
    "referenceId": "REF-71248",
    "packageNo": "PKT-000096",
    "customerName": "Serkan Kurt",
    "channel": "Trendyol",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-06-03T07:42:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-06-03T10:38:03.428Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-06-03T17:12:30.857Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-06-03T19:21:46.285Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-06-03T21:31:01.714Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-06-04T04:05:29.142Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-06-04T06:14:44.571Z"
      },
      {
        "status": "DeliveredToCustomer",
        "at": "2026-06-04T08:24:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 7,
          "companyName": "Horoz Lojistik",
          "metrics": {
            "cost": 0.5,
            "deliveryTime": 0.09999999999999996,
            "successRate": 0.6471306471306472,
            "damagedRate": 1,
            "avgPickupHours": 0.6997518610421837,
            "costDiffPct": 0.9449840836312517
          },
          "combined": 0.5712562562500053
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 7
          }
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
    "status": "DeliveredToCustomer",
    "cargoType": "return",
    "referenceId": "REF-71261",
    "packageNo": "PKT-000097",
    "customerName": "Serkan Doğan",
    "channel": "Hepsiburada",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-06-03T09:00:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-06-03T12:35:13.714Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-06-03T15:05:39.428Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-06-03T22:11:29.142Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-06-04T00:41:54.857Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-06-04T03:12:20.571Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-06-04T10:18:10.285Z"
      },
      {
        "status": "DeliveredToCustomer",
        "at": "2026-06-04T12:00:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 4,
      "matchedRuleName": "Ege Bölgesi Standart",
      "matchedRuleSummary": "0–30 desi · İzmir",
      "ruleNarrowedCompanyIds": [
        2
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 2,
          "companyName": "Aras Kargo",
          "metrics": {
            "cost": 0.5853658536585367,
            "deliveryTime": 0.2800000000000001,
            "successRate": 0.679563492063492,
            "damagedRate": 0.4666666666666667,
            "avgPickupHours": 1,
            "costDiffPct": 1
          },
          "combined": 0.6188990030971738
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 1
          }
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
    "status": "DeliveredToCustomer",
    "cargoType": "order",
    "referenceId": "REF-71274",
    "packageNo": "PKT-000098",
    "customerName": "Zeynep Demir",
    "channel": "N11",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-06-05T10:13:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-06-05T14:29:48.000Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-06-05T17:22:36.000Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-06-05T20:15:24.000Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-06-06T03:53:48.000Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-06-06T06:46:36.000Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-06-06T09:39:24.000Z"
      },
      {
        "status": "DeliveredToCustomer",
        "at": "2026-06-06T12:32:12.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 4,
      "matchedRuleName": "Ege Bölgesi Standart",
      "matchedRuleSummary": "0–30 desi · İzmir",
      "ruleNarrowedCompanyIds": [
        2
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 2,
          "companyName": "Aras Kargo",
          "metrics": {
            "cost": 0.5853658536585367,
            "deliveryTime": 0.2800000000000001,
            "successRate": 0.679563492063492,
            "damagedRate": 0.4666666666666667,
            "avgPickupHours": 1,
            "costDiffPct": 1
          },
          "combined": 0.6188990030971738
        }
      ],
      "chosenCompanyId": 2
          }
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
    "status": "DeliveredToCustomer",
    "cargoType": "order",
    "referenceId": "REF-71287",
    "packageNo": "PKT-000099",
    "customerName": "Tuğçe Özdemir",
    "channel": "Trendyol",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-06-05T11:38:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-06-05T16:38:46.285Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-06-05T19:55:08.571Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-06-05T23:11:30.857Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-06-06T02:27:53.142Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-06-06T10:40:03.428Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-06-06T13:56:25.714Z"
      },
      {
        "status": "DeliveredToCustomer",
        "at": "2026-06-06T16:38:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 3,
          "companyName": "MNG Kargo",
          "metrics": {
            "cost": 0.5,
            "deliveryTime": 0.5199999999999999,
            "successRate": 0.679563492063492,
            "damagedRate": 0.7333333333333334,
            "avgPickupHours": 0,
            "costDiffPct": 0
          },
          "combined": 0.47222420634920637
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 3
          }
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
    "status": "DeliveredToCustomer",
    "cargoType": "order",
    "referenceId": "REF-71300",
    "packageNo": "PKT-000100",
    "customerName": "Serkan Koç",
    "channel": "Trendyol",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-06-06T05:00:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-06-06T10:47:08.571Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-06-06T14:28:17.142Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-06-06T18:09:25.714Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-06-06T21:50:34.285Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-06-07T01:31:42.857Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-06-07T05:12:51.428Z"
      },
      {
        "status": "DeliveredToCustomer",
        "at": "2026-06-07T08:54:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 3,
          "companyName": "MNG Kargo",
          "metrics": {
            "cost": 0.5,
            "deliveryTime": 0.5199999999999999,
            "successRate": 0.679563492063492,
            "damagedRate": 0.7333333333333334,
            "avgPickupHours": 0,
            "costDiffPct": 0
          },
          "combined": 0.47222420634920637
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 3
          }
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
    "status": "DeliveredToCustomer",
    "cargoType": "order",
    "referenceId": "REF-71313",
    "packageNo": "PKT-000101",
    "customerName": "Kerem Aydın",
    "channel": "N11",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-06-06T09:22:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-06-06T15:57:54.857Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-06-06T20:05:01.714Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-06-07T00:12:08.571Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-06-07T04:19:15.428Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-06-07T08:26:22.285Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-06-07T12:33:29.142Z"
      },
      {
        "status": "DeliveredToCustomer",
        "at": "2026-06-07T16:22:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 3,
          "companyName": "MNG Kargo",
          "metrics": {
            "cost": 0.5,
            "deliveryTime": 0.5199999999999999,
            "successRate": 0.679563492063492,
            "damagedRate": 0.7333333333333334,
            "avgPickupHours": 0,
            "costDiffPct": 0
          },
          "combined": 0.47222420634920637
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 3
          }
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
    "status": "DeliveredToCustomer",
    "cargoType": "order",
    "referenceId": "REF-71326",
    "packageNo": "PKT-000102",
    "customerName": "Barış Bulut",
    "channel": "Trendyol",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-06-08T02:30:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-06-08T04:30:41.142Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-06-08T09:04:58.285Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-06-08T13:39:15.428Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-06-08T18:13:32.571Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-06-08T22:47:49.714Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-06-09T03:22:06.857Z"
      },
      {
        "status": "DeliveredToCustomer",
        "at": "2026-06-09T07:56:24.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 4,
          "companyName": "PTT Kargo",
          "metrics": {
            "cost": 0.5,
            "deliveryTime": 1,
            "successRate": 1,
            "damagedRate": 0.2592592592592593,
            "avgPickupHours": 0.6838709677419356,
            "costDiffPct": 0.9375970850179929
          },
          "combined": 0.7630727312019187
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 4
          }
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
    "status": "DeliveredToCustomer",
    "cargoType": "order",
    "referenceId": "REF-71339",
    "packageNo": "PKT-000103",
    "customerName": "Onur Kurt",
    "channel": "Trendyol",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-06-11T02:43:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-06-11T05:27:03.428Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-06-11T10:29:42.857Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-06-11T15:32:22.285Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-06-11T20:35:01.714Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-06-12T01:37:41.142Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-06-12T06:40:20.571Z"
      },
      {
        "status": "DeliveredToCustomer",
        "at": "2026-06-12T11:43:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 1
          }
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
    "status": "DeliveredToCustomer",
    "cargoType": "order",
    "referenceId": "REF-71352",
    "packageNo": "PKT-000104",
    "customerName": "Yusuf Yıldız",
    "channel": "N11",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-06-11T03:01:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-06-11T06:30:49.714Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-06-11T12:03:03.428Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-06-11T17:35:17.142Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-06-11T23:07:30.857Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-06-12T04:39:44.571Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-06-12T10:11:58.285Z"
      },
      {
        "status": "DeliveredToCustomer",
        "at": "2026-06-12T13:01:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 2,
          "companyName": "Aras Kargo",
          "metrics": {
            "cost": 0.5853658536585367,
            "deliveryTime": 0.2800000000000001,
            "successRate": 0.679563492063492,
            "damagedRate": 0.4666666666666667,
            "avgPickupHours": 1,
            "costDiffPct": 1
          },
          "combined": 0.6188990030971738
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 2
          }
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
    "status": "DeliveredToCustomer",
    "cargoType": "order",
    "referenceId": "REF-71365",
    "packageNo": "PKT-000105",
    "customerName": "Barış Polat",
    "channel": "Trendyol",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-06-11T04:10:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-06-11T08:28:00.000Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-06-11T14:31:00.000Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-06-11T20:34:00.000Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-06-12T02:37:00.000Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-06-12T02:43:00.000Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-06-12T08:46:00.000Z"
      },
      {
        "status": "DeliveredToCustomer",
        "at": "2026-06-12T14:49:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 7,
          "companyName": "Horoz Lojistik",
          "metrics": {
            "cost": 0.5,
            "deliveryTime": 0.09999999999999996,
            "successRate": 0.6471306471306472,
            "damagedRate": 1,
            "avgPickupHours": 0.6997518610421837,
            "costDiffPct": 0.9449840836312517
          },
          "combined": 0.5712562562500053
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 7
          }
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
    "status": "DeliveredToCustomer",
    "cargoType": "order",
    "referenceId": "REF-71378",
    "packageNo": "PKT-000106",
    "customerName": "Deniz Erdoğan",
    "channel": "Kendi Web Sitesi",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-06-11T05:25:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-06-11T10:33:34.285Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-06-11T17:08:32.571Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-06-11T23:43:30.857Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-06-12T00:11:17.142Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-06-12T06:46:15.428Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-06-12T13:21:13.714Z"
      },
      {
        "status": "DeliveredToCustomer",
        "at": "2026-06-12T17:25:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 1
          }
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
    "status": "DeliveredToCustomer",
    "cargoType": "order",
    "referenceId": "REF-71391",
    "packageNo": "PKT-000107",
    "customerName": "Gül Demir",
    "channel": "Hepsiburada",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-06-11T07:06:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-06-11T13:07:32.571Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-06-11T20:15:41.142Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-06-11T21:06:25.714Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-06-12T04:14:34.285Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-06-12T11:22:42.857Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-06-12T12:13:27.428Z"
      },
      {
        "status": "DeliveredToCustomer",
        "at": "2026-06-12T19:21:36.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 7,
          "companyName": "Horoz Lojistik",
          "metrics": {
            "cost": 0.5,
            "deliveryTime": 0.09999999999999996,
            "successRate": 0.6471306471306472,
            "damagedRate": 1,
            "avgPickupHours": 0.6997518610421837,
            "costDiffPct": 0.9449840836312517
          },
          "combined": 0.5712562562500053
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 7
          }
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
    "status": "DeliveredToCustomer",
    "cargoType": "order",
    "referenceId": "REF-71404",
    "packageNo": "PKT-000108",
    "customerName": "Barış Özdemir",
    "channel": "Trendyol",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-06-11T09:29:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-06-11T16:25:54.857Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-06-11T17:40:49.714Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-06-12T01:23:20.571Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-06-12T09:05:51.428Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-06-12T10:20:46.285Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-06-12T18:03:17.142Z"
      },
      {
        "status": "DeliveredToCustomer",
        "at": "2026-06-12T23:29:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 3,
          "companyName": "MNG Kargo",
          "metrics": {
            "cost": 0.5,
            "deliveryTime": 0.5199999999999999,
            "successRate": 0.679563492063492,
            "damagedRate": 0.7333333333333334,
            "avgPickupHours": 0,
            "costDiffPct": 0
          },
          "combined": 0.47222420634920637
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 3
          }
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
    "status": "DeliveredToCustomer",
    "cargoType": "order",
    "referenceId": "REF-71417",
    "packageNo": "PKT-000109",
    "customerName": "Hakan Şimşek",
    "channel": "N11",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-06-12T02:20:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-06-12T10:14:41.142Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-06-12T11:54:58.285Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-06-12T20:13:03.428Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-06-12T21:53:20.571Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-06-13T06:11:25.714Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-06-13T14:29:30.857Z"
      },
      {
        "status": "DeliveredToCustomer",
        "at": "2026-06-13T16:09:48.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 1
          }
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
    "status": "DeliveredToCustomer",
    "cargoType": "order",
    "referenceId": "REF-71430",
    "packageNo": "PKT-000110",
    "customerName": "Burak Aydın",
    "channel": "Hepsiburada",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-06-12T04:59:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-06-12T13:53:51.428Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-06-12T16:00:42.857Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-06-13T00:55:34.285Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-06-13T03:02:25.714Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-06-13T11:57:17.142Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-06-13T14:04:08.571Z"
      },
      {
        "status": "DeliveredToCustomer",
        "at": "2026-06-13T20:59:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 1
          }
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
    "status": "DeliveredToCustomer",
    "cargoType": "order",
    "referenceId": "REF-71443",
    "packageNo": "PKT-000111",
    "customerName": "Serkan Arslan",
    "channel": "Trendyol",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-06-12T05:49:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-06-12T08:48:13.714Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-06-12T18:21:03.428Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-06-12T20:55:41.142Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-06-13T06:28:30.857Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-06-13T09:03:08.571Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-06-13T18:35:58.285Z"
      },
      {
        "status": "DeliveredToCustomer",
        "at": "2026-06-13T21:10:36.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 1
          }
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
    "status": "DeliveredToCustomer",
    "cargoType": "order",
    "referenceId": "REF-71456",
    "packageNo": "PKT-000112",
    "customerName": "Barış Polat",
    "channel": "Trendyol",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-06-12T05:54:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-06-12T09:48:00.000Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-06-12T20:00:00.000Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-06-12T23:03:36.000Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-06-13T09:15:36.000Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-06-13T12:19:12.000Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-06-13T15:22:48.000Z"
      },
      {
        "status": "DeliveredToCustomer",
        "at": "2026-06-13T23:54:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 6,
          "companyName": "DHL eCommerce",
          "metrics": {
            "cost": 0.29268292682926833,
            "deliveryTime": 0.6666666666666665,
            "successRate": 0,
            "damagedRate": 0.2592592592592593,
            "avgPickupHours": 0.8538899430740037,
            "costDiffPct": 0.9922127873486873
          },
          "combined": 0.4170402640088454
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 6
          }
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
    "status": "DeliveredToCustomer",
    "cargoType": "order",
    "referenceId": "REF-71469",
    "packageNo": "PKT-000113",
    "customerName": "Yusuf Şahin",
    "channel": "Trendyol",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-06-13T09:26:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-06-13T14:17:10.285Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-06-14T01:09:32.571Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-06-14T04:43:18.857Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-06-14T08:17:05.142Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-06-14T19:09:27.428Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-06-14T22:43:13.714Z"
      },
      {
        "status": "DeliveredToCustomer",
        "at": "2026-06-15T02:17:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 3,
          "companyName": "MNG Kargo",
          "metrics": {
            "cost": 0.5,
            "deliveryTime": 0.5199999999999999,
            "successRate": 0.679563492063492,
            "damagedRate": 0.7333333333333334,
            "avgPickupHours": 0,
            "costDiffPct": 0
          },
          "combined": 0.47222420634920637
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 3
          }
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
    "status": "DeliveredToCustomer",
    "cargoType": "order",
    "referenceId": "REF-71482",
    "packageNo": "PKT-000114",
    "customerName": "Pınar Çelik",
    "channel": "Trendyol",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-06-14T06:31:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-06-14T12:21:44.571Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-06-14T16:26:53.142Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-06-15T04:00:49.714Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-06-15T08:05:58.285Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-06-15T12:11:06.857Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-06-15T23:45:03.428Z"
      },
      {
        "status": "DeliveredToCustomer",
        "at": "2026-06-16T02:31:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 3,
          "companyName": "MNG Kargo",
          "metrics": {
            "cost": 0.5,
            "deliveryTime": 0.5199999999999999,
            "successRate": 0.679563492063492,
            "damagedRate": 0.7333333333333334,
            "avgPickupHours": 0,
            "costDiffPct": 0
          },
          "combined": 0.47222420634920637
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 3
          }
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
    "status": "DeliveredToCustomer",
    "cargoType": "order",
    "referenceId": "REF-71495",
    "packageNo": "PKT-000115",
    "customerName": "Kerem Koç",
    "channel": "Hepsiburada",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-06-15T08:39:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-06-15T15:31:42.857Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-06-15T20:09:25.714Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-06-16T00:47:08.571Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-06-16T13:03:51.428Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-06-16T17:41:34.285Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-06-16T22:19:17.142Z"
      },
      {
        "status": "DeliveredToCustomer",
        "at": "2026-06-17T02:57:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 1,
      "matchedRuleName": "İstanbul İçi Ekonomik",
      "matchedRuleSummary": "0–10 desi · İstanbul",
      "ruleNarrowedCompanyIds": [
        8,
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 2,
          "companyName": "Aras Kargo",
          "metrics": {
            "cost": 0.5853658536585367,
            "deliveryTime": 0.2800000000000001,
            "successRate": 0.679563492063492,
            "damagedRate": 0.4666666666666667,
            "avgPickupHours": 1,
            "costDiffPct": 1
          },
          "combined": 0.6188990030971738
        },
        {
          "companyId": 8,
          "companyName": "Hepsijet",
          "metrics": {
            "cost": 1,
            "deliveryTime": 0,
            "successRate": 0.19047619047619038,
            "damagedRate": 1,
            "avgPickupHours": 0.6838709677419356,
            "costDiffPct": 0.9556096935478475
          },
          "combined": 0.561567113748026
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 2
          }
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
    "status": "DeliveredToCustomer",
    "cargoType": "order",
    "referenceId": "REF-71508",
    "packageNo": "PKT-000116",
    "customerName": "Deniz Kurt",
    "channel": "Hepsiburada",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-06-16T04:36:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-06-16T12:33:05.142Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-06-16T17:44:34.285Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-06-16T22:56:03.428Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-06-17T04:07:32.571Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-06-17T17:08:13.714Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-06-17T22:19:42.857Z"
      },
      {
        "status": "DeliveredToCustomer",
        "at": "2026-06-18T02:36:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 3,
          "companyName": "MNG Kargo",
          "metrics": {
            "cost": 0.5,
            "deliveryTime": 0.5199999999999999,
            "successRate": 0.679563492063492,
            "damagedRate": 0.7333333333333334,
            "avgPickupHours": 0,
            "costDiffPct": 0
          },
          "combined": 0.47222420634920637
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 3
          }
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
    "status": "OnTheWayBackToSender",
    "cargoType": "order",
    "referenceId": "REF-71521",
    "packageNo": "PKT-000117",
    "customerName": "Tuğçe Kaya",
    "channel": "Trendyol",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-06-16T06:32:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-06-25T00:04:24.000Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-07-01T16:43:14.400Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-07-08T09:22:04.800Z"
      },
      {
        "status": "OnTheWayBackToSender",
        "at": "2026-07-15T02:00:55.200Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 1
          }
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
    "status": "DeliveredToCustomer",
    "cargoType": "order",
    "referenceId": "REF-71534",
    "packageNo": "PKT-000118",
    "customerName": "Kerem Bulut",
    "channel": "Trendyol",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-06-16T07:41:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-06-16T17:54:01.714Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-06-17T00:16:39.428Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-06-17T06:39:17.142Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-06-17T13:01:54.857Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-06-17T19:24:32.571Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-06-18T01:47:10.285Z"
      },
      {
        "status": "DeliveredToCustomer",
        "at": "2026-06-18T07:41:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 4,
          "companyName": "PTT Kargo",
          "metrics": {
            "cost": 0.5,
            "deliveryTime": 1,
            "successRate": 1,
            "damagedRate": 0.2592592592592593,
            "avgPickupHours": 0.6838709677419356,
            "costDiffPct": 0.9375970850179929
          },
          "combined": 0.7630727312019187
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 4
          }
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
    "status": "DeliveredToCustomer",
    "cargoType": "order",
    "referenceId": "REF-71547",
    "packageNo": "PKT-000119",
    "customerName": "Doğan Bulut",
    "channel": "Kendi Web Sitesi",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-06-16T09:41:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-06-16T12:45:48.000Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-06-16T19:45:48.000Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-06-17T02:45:48.000Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-06-17T09:45:48.000Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-06-17T16:45:48.000Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-06-17T23:45:48.000Z"
      },
      {
        "status": "DeliveredToCustomer",
        "at": "2026-06-18T06:45:48.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 1
          }
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
    "status": "ReturnToSender",
    "cargoType": "return",
    "referenceId": "REF-71560",
    "packageNo": "PKT-000120",
    "customerName": "Barış Yıldız",
    "channel": "Kendi Web Sitesi",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-06-17T03:31:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-06-17T05:10:25.714Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-06-17T08:13:51.428Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-06-17T11:17:17.142Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-06-17T14:20:42.857Z"
      },
      {
        "status": "ShipmentFailed",
        "at": "2026-06-17T17:24:08.571Z"
      },
      {
        "status": "OnTheWayBackToSender",
        "at": "2026-06-17T20:27:34.285Z"
      },
      {
        "status": "ReturnToSender",
        "at": "2026-06-17T23:31:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 4,
      "matchedRuleName": "Ege Bölgesi Standart",
      "matchedRuleSummary": "0–30 desi · İzmir",
      "ruleNarrowedCompanyIds": [
        2
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 2,
          "companyName": "Aras Kargo",
          "metrics": {
            "cost": 0.5853658536585367,
            "deliveryTime": 0.2800000000000001,
            "successRate": 0.679563492063492,
            "damagedRate": 0.4666666666666667,
            "avgPickupHours": 1,
            "costDiffPct": 1
          },
          "combined": 0.6188990030971738
        }
      ],
      "chosenCompanyId": 2
          }
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
    "status": "DeliveredToCustomer",
    "cargoType": "order",
    "referenceId": "REF-71573",
    "packageNo": "PKT-000121",
    "customerName": "Hakan Yavuz",
    "channel": "Kendi Web Sitesi",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-06-17T07:39:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-06-17T09:48:36.000Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-06-17T13:13:48.000Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-06-17T16:39:00.000Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-06-17T20:04:12.000Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-06-17T23:29:24.000Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-06-18T02:54:36.000Z"
      },
      {
        "status": "DeliveredToCustomer",
        "at": "2026-06-18T04:39:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 2,
          "companyName": "Aras Kargo",
          "metrics": {
            "cost": 0.5853658536585367,
            "deliveryTime": 0.2800000000000001,
            "successRate": 0.679563492063492,
            "damagedRate": 0.4666666666666667,
            "avgPickupHours": 1,
            "costDiffPct": 1
          },
          "combined": 0.6188990030971738
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 2
          }
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
    "status": "DeliveredToCustomer",
    "cargoType": "order",
    "referenceId": "REF-71586",
    "packageNo": "PKT-000122",
    "customerName": "Serkan Demir",
    "channel": "N11",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-06-17T09:20:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-06-17T12:02:10.285Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-06-17T15:50:20.571Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-06-17T19:38:30.857Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-06-17T23:26:41.142Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-06-17T23:30:27.428Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-06-18T03:18:37.714Z"
      },
      {
        "status": "DeliveredToCustomer",
        "at": "2026-06-18T07:06:48.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 6,
          "companyName": "DHL eCommerce",
          "metrics": {
            "cost": 0.29268292682926833,
            "deliveryTime": 0.6666666666666665,
            "successRate": 0,
            "damagedRate": 0.2592592592592593,
            "avgPickupHours": 0.8538899430740037,
            "costDiffPct": 0.9922127873486873
          },
          "combined": 0.4170402640088454
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 6
          }
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
    "status": "DeliveredToCustomer",
    "cargoType": "order",
    "referenceId": "REF-71599",
    "packageNo": "PKT-000123",
    "customerName": "Ceren Öztürk",
    "channel": "Trendyol",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-06-17T11:16:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-06-17T14:33:08.571Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-06-17T18:45:29.142Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-06-17T22:57:49.714Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-06-17T23:15:34.285Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-06-18T03:27:54.857Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-06-18T07:40:15.428Z"
      },
      {
        "status": "DeliveredToCustomer",
        "at": "2026-06-18T10:16:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 4,
      "matchedRuleName": "Ege Bölgesi Standart",
      "matchedRuleSummary": "0–30 desi · İzmir",
      "ruleNarrowedCompanyIds": [
        2
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 2,
          "companyName": "Aras Kargo",
          "metrics": {
            "cost": 0.5853658536585367,
            "deliveryTime": 0.2800000000000001,
            "successRate": 0.679563492063492,
            "damagedRate": 0.4666666666666667,
            "avgPickupHours": 1,
            "costDiffPct": 1
          },
          "combined": 0.6188990030971738
        },
        {
          "companyId": 7,
          "companyName": "Horoz Lojistik",
          "metrics": {
            "cost": 0.5,
            "deliveryTime": 0.09999999999999996,
            "successRate": 0.6471306471306472,
            "damagedRate": 1,
            "avgPickupHours": 0.6997518610421837,
            "costDiffPct": 0.9449840836312517
          },
          "combined": 0.5712562562500053
        }
      ],
      "chosenCompanyId": 7
          }
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
    "status": "ShipmentCanceled",
    "cargoType": "order",
    "referenceId": "REF-71612",
    "packageNo": "PKT-000124",
    "customerName": "Ayşe Kaya",
    "channel": "Hepsiburada",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-06-18T03:45:00.000Z"
      },
      {
        "status": "ShipmentCanceled",
        "at": "2026-06-18T09:45:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 1
          }
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
    "status": "DeliveredToCustomer",
    "cargoType": "order",
    "referenceId": "REF-71625",
    "packageNo": "PKT-000125",
    "customerName": "Burak Bulut",
    "channel": "Hepsiburada",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-06-18T11:02:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-06-18T15:36:17.142Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-06-18T16:25:34.285Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-06-18T21:29:51.428Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-06-19T02:34:08.571Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-06-19T03:23:25.714Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-06-19T08:27:42.857Z"
      },
      {
        "status": "DeliveredToCustomer",
        "at": "2026-06-19T12:02:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 2,
          "companyName": "Aras Kargo",
          "metrics": {
            "cost": 0.5853658536585367,
            "deliveryTime": 0.2800000000000001,
            "successRate": 0.679563492063492,
            "damagedRate": 0.4666666666666667,
            "avgPickupHours": 1,
            "costDiffPct": 1
          },
          "combined": 0.6188990030971738
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 2
          }
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
    "status": "DeliveredToCustomer",
    "cargoType": "order",
    "referenceId": "REF-71638",
    "packageNo": "PKT-000126",
    "customerName": "Emre Koç",
    "channel": "Trendyol",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-06-19T03:03:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-06-19T08:19:27.428Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-06-19T09:26:18.857Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-06-19T14:58:22.285Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-06-19T16:05:13.714Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-06-19T21:37:17.142Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-06-20T03:09:20.571Z"
      },
      {
        "status": "DeliveredToCustomer",
        "at": "2026-06-20T04:16:12.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 4,
          "companyName": "PTT Kargo",
          "metrics": {
            "cost": 0.5,
            "deliveryTime": 1,
            "successRate": 1,
            "damagedRate": 0.2592592592592593,
            "avgPickupHours": 0.6838709677419356,
            "costDiffPct": 0.9375970850179929
          },
          "combined": 0.7630727312019187
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 4
          }
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
    "status": "DeliveredToCustomer",
    "cargoType": "order",
    "referenceId": "REF-71651",
    "packageNo": "PKT-000127",
    "customerName": "Ceren Erdoğan",
    "channel": "Trendyol",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-06-20T03:40:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-06-20T09:41:01.714Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-06-20T11:06:39.428Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-06-20T17:07:41.142Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-06-20T18:33:18.857Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-06-21T00:34:20.571Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-06-21T01:59:58.285Z"
      },
      {
        "status": "DeliveredToCustomer",
        "at": "2026-06-21T06:40:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 1
          }
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
    "status": "DeliveredToCustomer",
    "cargoType": "order",
    "referenceId": "REF-71664",
    "packageNo": "PKT-000128",
    "customerName": "Ceren Öztürk",
    "channel": "Trendyol",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-06-20T09:06:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-06-20T11:08:24.000Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-06-20T17:39:36.000Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-06-20T19:25:12.000Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-06-21T01:56:24.000Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-06-21T03:42:00.000Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-06-21T10:13:12.000Z"
      },
      {
        "status": "DeliveredToCustomer",
        "at": "2026-06-21T11:58:48.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 2,
          "companyName": "Aras Kargo",
          "metrics": {
            "cost": 0.5853658536585367,
            "deliveryTime": 0.2800000000000001,
            "successRate": 0.679563492063492,
            "damagedRate": 0.4666666666666667,
            "avgPickupHours": 1,
            "costDiffPct": 1
          },
          "combined": 0.6188990030971738
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 2
          }
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
    "status": "DeliveredToCustomer",
    "cargoType": "order",
    "referenceId": "REF-71677",
    "packageNo": "PKT-000129",
    "customerName": "Ceren Şimşek",
    "channel": "Trendyol",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-06-21T07:55:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-06-21T10:36:34.285Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-06-21T17:39:08.571Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-06-21T19:45:54.857Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-06-22T02:48:29.142Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-06-22T04:55:15.428Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-06-22T07:02:01.714Z"
      },
      {
        "status": "DeliveredToCustomer",
        "at": "2026-06-22T12:55:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 4,
      "matchedRuleName": "Ege Bölgesi Standart",
      "matchedRuleSummary": "0–30 desi · İzmir",
      "ruleNarrowedCompanyIds": [
        2
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 4,
          "companyName": "PTT Kargo",
          "metrics": {
            "cost": 0.5,
            "deliveryTime": 1,
            "successRate": 1,
            "damagedRate": 0.2592592592592593,
            "avgPickupHours": 0.6838709677419356,
            "costDiffPct": 0.9375970850179929
          },
          "combined": 0.7630727312019187
        },
        {
          "companyId": 2,
          "companyName": "Aras Kargo",
          "metrics": {
            "cost": 0.5853658536585367,
            "deliveryTime": 0.2800000000000001,
            "successRate": 0.679563492063492,
            "damagedRate": 0.4666666666666667,
            "avgPickupHours": 1,
            "costDiffPct": 1
          },
          "combined": 0.6188990030971738
        }
      ],
      "chosenCompanyId": 4
          }
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
    "status": "OnTheWayBackToSender",
    "cargoType": "order",
    "referenceId": "REF-71690",
    "packageNo": "PKT-000130",
    "customerName": "Gizem Çelik",
    "channel": "Trendyol",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-06-21T09:04:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-06-26T15:46:19.200Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-07-05T07:06:28.800Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-07-09T20:32:07.200Z"
      },
      {
        "status": "OnTheWayBackToSender",
        "at": "2026-07-14T09:57:45.600Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 8,
          "companyName": "Hepsijet",
          "metrics": {
            "cost": 1,
            "deliveryTime": 0,
            "successRate": 0.19047619047619038,
            "damagedRate": 1,
            "avgPickupHours": 0.6838709677419356,
            "costDiffPct": 0.9556096935478475
          },
          "combined": 0.561567113748026
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 8
          }
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
    "status": "DispatchLabelCreated",
    "cargoType": "order",
    "referenceId": "REF-71703",
    "packageNo": "PKT-000131",
    "customerName": "Burak Güneş",
    "channel": "Kendi Web Sitesi",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-06-21T10:05:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 7,
          "companyName": "Horoz Lojistik",
          "metrics": {
            "cost": 0.5,
            "deliveryTime": 0.09999999999999996,
            "successRate": 0.6471306471306472,
            "damagedRate": 1,
            "avgPickupHours": 0.6997518610421837,
            "costDiffPct": 0.9449840836312517
          },
          "combined": 0.5712562562500053
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 7
          }
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
    "status": "DispatchLabelCreated",
    "cargoType": "order",
    "referenceId": "REF-71716",
    "packageNo": "PKT-000132",
    "customerName": "Serkan Koç",
    "channel": "Trendyol",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-06-22T09:16:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 3,
          "companyName": "MNG Kargo",
          "metrics": {
            "cost": 0.5,
            "deliveryTime": 0.5199999999999999,
            "successRate": 0.679563492063492,
            "damagedRate": 0.7333333333333334,
            "avgPickupHours": 0,
            "costDiffPct": 0
          },
          "combined": 0.47222420634920637
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 3
          }
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
    "status": "OnTheWay",
    "cargoType": "order",
    "referenceId": "REF-71729",
    "packageNo": "PKT-000133",
    "customerName": "Emre Öztürk",
    "channel": "N11",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-06-22T11:34:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-06-28T21:24:28.800Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-07-03T22:17:00.000Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-07-08T23:09:31.200Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-07-14T00:02:02.400Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 1
          }
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
    "status": "DispatchLabelCreated",
    "cargoType": "order",
    "referenceId": "REF-71742",
    "packageNo": "PKT-000134",
    "customerName": "Deniz Koç",
    "channel": "N11",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-06-23T03:08:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 3,
          "companyName": "MNG Kargo",
          "metrics": {
            "cost": 0.5,
            "deliveryTime": 0.5199999999999999,
            "successRate": 0.679563492063492,
            "damagedRate": 0.7333333333333334,
            "avgPickupHours": 0,
            "costDiffPct": 0
          },
          "combined": 0.47222420634920637
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 3
          }
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
    "status": "OnTheWay",
    "cargoType": "order",
    "referenceId": "REF-71755",
    "packageNo": "PKT-000135",
    "customerName": "Kerem Özdemir",
    "channel": "N11",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-06-23T05:44:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-06-30T07:44:19.200Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-07-05T15:14:33.600Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-07-10T22:44:48.000Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-07-15T09:00:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 1
          }
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
    "status": "DispatchLabelCreated",
    "cargoType": "order",
    "referenceId": "REF-71768",
    "packageNo": "PKT-000136",
    "customerName": "Gül Demir",
    "channel": "Hepsiburada",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-06-23T10:37:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 6,
          "companyName": "DHL eCommerce",
          "metrics": {
            "cost": 0.29268292682926833,
            "deliveryTime": 0.6666666666666665,
            "successRate": 0,
            "damagedRate": 0.2592592592592593,
            "avgPickupHours": 0.8538899430740037,
            "costDiffPct": 0.9922127873486873
          },
          "combined": 0.4170402640088454
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 6
          }
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
    "status": "DispatchLabelCreated",
    "cargoType": "order",
    "referenceId": "REF-71781",
    "packageNo": "PKT-000137",
    "customerName": "Yusuf Polat",
    "channel": "Hepsiburada",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-06-24T04:40:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 6,
          "companyName": "DHL eCommerce",
          "metrics": {
            "cost": 0.29268292682926833,
            "deliveryTime": 0.6666666666666665,
            "successRate": 0,
            "damagedRate": 0.2592592592592593,
            "avgPickupHours": 0.8538899430740037,
            "costDiffPct": 0.9922127873486873
          },
          "combined": 0.4170402640088454
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 6
          }
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
    "status": "DispatchLabelCreated",
    "cargoType": "order",
    "referenceId": "REF-71794",
    "packageNo": "PKT-000138",
    "customerName": "Elif Demir",
    "channel": "Hepsiburada",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-06-24T06:58:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 6,
          "companyName": "DHL eCommerce",
          "metrics": {
            "cost": 0.29268292682926833,
            "deliveryTime": 0.6666666666666665,
            "successRate": 0,
            "damagedRate": 0.2592592592592593,
            "avgPickupHours": 0.8538899430740037,
            "costDiffPct": 0.9922127873486873
          },
          "combined": 0.4170402640088454
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 6
          }
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
    "status": "OnTheWay",
    "cargoType": "order",
    "referenceId": "REF-71807",
    "packageNo": "PKT-000139",
    "customerName": "Serkan Çelik",
    "channel": "Trendyol",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-06-25T06:14:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-06-29T21:16:10.800Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-07-05T12:26:39.600Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-07-11T03:37:08.400Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-07-15T09:00:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 3,
          "companyName": "MNG Kargo",
          "metrics": {
            "cost": 0.5,
            "deliveryTime": 0.5199999999999999,
            "successRate": 0.679563492063492,
            "damagedRate": 0.7333333333333334,
            "avgPickupHours": 0,
            "costDiffPct": 0
          },
          "combined": 0.47222420634920637
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 3
          }
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
    "status": "DispatchLabelCreated",
    "cargoType": "order",
    "referenceId": "REF-71820",
    "packageNo": "PKT-000140",
    "customerName": "Emre Yıldız",
    "channel": "Hepsiburada",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-06-27T03:05:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 6,
          "companyName": "DHL eCommerce",
          "metrics": {
            "cost": 0.29268292682926833,
            "deliveryTime": 0.6666666666666665,
            "successRate": 0,
            "damagedRate": 0.2592592592592593,
            "avgPickupHours": 0.8538899430740037,
            "costDiffPct": 0.9922127873486873
          },
          "combined": 0.4170402640088454
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 6
          }
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
    "status": "OnTheWay",
    "cargoType": "order",
    "referenceId": "REF-71833",
    "packageNo": "PKT-000141",
    "customerName": "Mustafa Koç",
    "channel": "Kendi Web Sitesi",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-06-28T04:03:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-07-02T19:32:47.400Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-07-07T23:25:53.400Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-07-10T05:06:54.000Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-07-15T09:00:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 1
          }
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
    "status": "DispatchLabelCreated",
    "cargoType": "order",
    "referenceId": "REF-71846",
    "packageNo": "PKT-000142",
    "customerName": "Furkan Demir",
    "channel": "Hepsiburada",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-06-28T04:29:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 4,
      "matchedRuleName": "Ege Bölgesi Standart",
      "matchedRuleSummary": "0–30 desi · İzmir",
      "ruleNarrowedCompanyIds": [
        2
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 2,
          "companyName": "Aras Kargo",
          "metrics": {
            "cost": 0.5853658536585367,
            "deliveryTime": 0.2800000000000001,
            "successRate": 0.679563492063492,
            "damagedRate": 0.4666666666666667,
            "avgPickupHours": 1,
            "costDiffPct": 1
          },
          "combined": 0.6188990030971738
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 1
          }
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
    "status": "OnTheWay",
    "cargoType": "order",
    "referenceId": "REF-71859",
    "packageNo": "PKT-000143",
    "customerName": "Kaan Aksoy",
    "channel": "Trendyol",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-06-28T08:37:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-07-03T15:12:55.800Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-07-06T04:28:22.800Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-07-11T15:09:20.400Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-07-14T04:24:47.400Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 1
          }
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
    "status": "OnTheWay",
    "cargoType": "order",
    "referenceId": "REF-71872",
    "packageNo": "PKT-000144",
    "customerName": "Ceren Yılmaz",
    "channel": "Kendi Web Sitesi",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-06-29T05:08:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-07-04T13:07:45.600Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-07-07T03:11:16.800Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-07-12T11:11:02.400Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-07-15T01:14:33.600Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 1
          }
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
    "status": "OnTheWay",
    "cargoType": "order",
    "referenceId": "REF-71885",
    "packageNo": "PKT-000145",
    "customerName": "Aslı Çelik",
    "channel": "Trendyol",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-06-29T07:45:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-07-02T05:05:42.000Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-07-07T16:04:48.000Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-07-10T09:34:21.000Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-07-15T09:00:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 1
          }
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
    "status": "OnTheWay",
    "cargoType": "order",
    "referenceId": "REF-71898",
    "packageNo": "PKT-000146",
    "customerName": "Yusuf Yavuz",
    "channel": "Hepsiburada",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-06-30T03:26:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-07-03T04:32:48.000Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-07-08T12:29:42.000Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-07-11T06:17:49.200Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-07-15T09:00:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 2,
          "companyName": "Aras Kargo",
          "metrics": {
            "cost": 0.5853658536585367,
            "deliveryTime": 0.2800000000000001,
            "successRate": 0.679563492063492,
            "damagedRate": 0.4666666666666667,
            "avgPickupHours": 1,
            "costDiffPct": 1
          },
          "combined": 0.6188990030971738
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 2
          }
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
    "status": "DispatchLabelCreated",
    "cargoType": "order",
    "referenceId": "REF-71911",
    "packageNo": "PKT-000147",
    "customerName": "Pınar Şimşek",
    "channel": "Kendi Web Sitesi",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-06-30T08:10:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 6,
          "companyName": "DHL eCommerce",
          "metrics": {
            "cost": 0.29268292682926833,
            "deliveryTime": 0.6666666666666665,
            "successRate": 0,
            "damagedRate": 0.2592592592592593,
            "avgPickupHours": 0.8538899430740037,
            "costDiffPct": 0.9922127873486873
          },
          "combined": 0.4170402640088454
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 6
          }
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
    "status": "OnTheWay",
    "cargoType": "order",
    "referenceId": "REF-71924",
    "packageNo": "PKT-000148",
    "customerName": "Merve Kurt",
    "channel": "Trendyol",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-07-01T03:08:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-07-04T13:10:52.800Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-07-07T09:33:16.800Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-07-12T16:02:43.200Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-07-15T09:00:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 4,
      "matchedRuleName": "Ege Bölgesi Standart",
      "matchedRuleSummary": "0–30 desi · İzmir",
      "ruleNarrowedCompanyIds": [
        2
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 2,
          "companyName": "Aras Kargo",
          "metrics": {
            "cost": 0.5853658536585367,
            "deliveryTime": 0.2800000000000001,
            "successRate": 0.679563492063492,
            "damagedRate": 0.4666666666666667,
            "avgPickupHours": 1,
            "costDiffPct": 1
          },
          "combined": 0.6188990030971738
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 1
          }
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
    "status": "OnTheWay",
    "cargoType": "order",
    "referenceId": "REF-71937",
    "packageNo": "PKT-000149",
    "customerName": "Gül Polat",
    "channel": "Trendyol",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-07-01T04:47:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-07-04T21:14:22.800Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-07-07T20:41:06.600Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-07-10T20:07:50.400Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-07-15T09:00:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 1
          }
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
    "status": "DispatchLabelCreated",
    "cargoType": "order",
    "referenceId": "REF-71950",
    "packageNo": "PKT-000150",
    "customerName": "Cem Koç",
    "channel": "N11",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-07-01T08:34:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 1
          }
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
    "status": "OnTheWay",
    "cargoType": "order",
    "referenceId": "REF-71963",
    "packageNo": "PKT-000151",
    "customerName": "Ahmet Arslan",
    "channel": "Kendi Web Sitesi",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-07-01T11:02:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-07-05T15:13:24.000Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-07-08T20:02:08.400Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-07-12T00:50:52.800Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-07-15T05:39:37.200Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 1
          }
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
    "status": "DispatchLabelCreated",
    "cargoType": "order",
    "referenceId": "REF-71976",
    "packageNo": "PKT-000152",
    "customerName": "Pınar Aksoy",
    "channel": "Hepsiburada",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-07-02T02:08:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 1
          }
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
    "status": "OnTheWay",
    "cargoType": "order",
    "referenceId": "REF-71989",
    "packageNo": "PKT-000153",
    "customerName": "Serkan Demir",
    "channel": "Trendyol",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-07-02T06:25:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-07-04T11:53:45.000Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-07-07T18:32:30.000Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-07-11T01:11:15.000Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-07-14T07:50:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 7,
          "companyName": "Horoz Lojistik",
          "metrics": {
            "cost": 0.5,
            "deliveryTime": 0.09999999999999996,
            "successRate": 0.6471306471306472,
            "damagedRate": 1,
            "avgPickupHours": 0.6997518610421837,
            "costDiffPct": 0.9449840836312517
          },
          "combined": 0.5712562562500053
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 7
          }
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
    "status": "OnTheWay",
    "cargoType": "order",
    "referenceId": "REF-72002",
    "packageNo": "PKT-000154",
    "customerName": "Onur Şimşek",
    "channel": "Kendi Web Sitesi",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-07-02T11:18:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-07-04T22:08:34.800Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-07-08T06:39:54.000Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-07-11T15:11:13.200Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-07-14T23:42:32.400Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 1
          }
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
    "status": "OnTheWay",
    "cargoType": "order",
    "referenceId": "REF-72015",
    "packageNo": "PKT-000155",
    "customerName": "Yusuf Çelik",
    "channel": "Hepsiburada",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-07-03T02:47:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-07-05T16:34:07.800Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-07-09T00:00:26.400Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-07-12T07:26:45.000Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-07-15T09:00:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 3,
          "companyName": "MNG Kargo",
          "metrics": {
            "cost": 0.5,
            "deliveryTime": 0.5199999999999999,
            "successRate": 0.679563492063492,
            "damagedRate": 0.7333333333333334,
            "avgPickupHours": 0,
            "costDiffPct": 0
          },
          "combined": 0.47222420634920637
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 3
          }
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
    "status": "OnTheWay",
    "cargoType": "order",
    "referenceId": "REF-72028",
    "packageNo": "PKT-000156",
    "customerName": "Elif Şahin",
    "channel": "Trendyol",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-07-03T03:27:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-07-05T22:57:59.400Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-07-09T09:09:37.800Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-07-12T19:21:16.200Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-07-15T09:00:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 7,
          "companyName": "Horoz Lojistik",
          "metrics": {
            "cost": 0.5,
            "deliveryTime": 0.09999999999999996,
            "successRate": 0.6471306471306472,
            "damagedRate": 1,
            "avgPickupHours": 0.6997518610421837,
            "costDiffPct": 0.9449840836312517
          },
          "combined": 0.5712562562500053
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 7
          }
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
    "status": "OnTheWay",
    "cargoType": "order",
    "referenceId": "REF-72041",
    "packageNo": "PKT-000157",
    "customerName": "Burak Aydın",
    "channel": "Hepsiburada",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-07-03T07:21:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-07-06T07:45:45.000Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-07-09T19:45:39.600Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-07-13T07:45:34.200Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-07-14T18:31:03.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 1
          }
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
    "status": "DispatchLabelCreated",
    "cargoType": "order",
    "referenceId": "REF-72054",
    "packageNo": "PKT-000158",
    "customerName": "Gül Koç",
    "channel": "Hepsiburada",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-07-03T10:13:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 2,
          "companyName": "Aras Kargo",
          "metrics": {
            "cost": 0.5853658536585367,
            "deliveryTime": 0.2800000000000001,
            "successRate": 0.679563492063492,
            "damagedRate": 0.4666666666666667,
            "avgPickupHours": 1,
            "costDiffPct": 1
          },
          "combined": 0.6188990030971738
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 2
          }
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
    "status": "OnTheWay",
    "cargoType": "order",
    "referenceId": "REF-72067",
    "packageNo": "PKT-000159",
    "customerName": "Emre Erdoğan",
    "channel": "Trendyol",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-07-04T08:35:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-07-07T13:15:51.000Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-07-09T02:16:57.000Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-07-12T12:15:06.000Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-07-15T09:00:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 6,
          "companyName": "DHL eCommerce",
          "metrics": {
            "cost": 0.29268292682926833,
            "deliveryTime": 0.6666666666666665,
            "successRate": 0,
            "damagedRate": 0.2592592592592593,
            "avgPickupHours": 0.8538899430740037,
            "costDiffPct": 0.9922127873486873
          },
          "combined": 0.4170402640088454
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 6
          }
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
    "status": "OnTheWay",
    "cargoType": "order",
    "referenceId": "REF-72080",
    "packageNo": "PKT-000160",
    "customerName": "Cem Bulut",
    "channel": "Hepsiburada",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-07-04T10:33:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-07-07T19:54:34.200Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-07-09T11:16:37.200Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-07-12T23:15:39.600Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-07-14T14:37:42.600Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 4,
          "companyName": "PTT Kargo",
          "metrics": {
            "cost": 0.5,
            "deliveryTime": 1,
            "successRate": 1,
            "damagedRate": 0.2592592592592593,
            "avgPickupHours": 0.6838709677419356,
            "costDiffPct": 0.9375970850179929
          },
          "combined": 0.7630727312019187
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 4
          }
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
    "status": "OnTheWay",
    "cargoType": "order",
    "referenceId": "REF-72093",
    "packageNo": "PKT-000161",
    "customerName": "Furkan Doğan",
    "channel": "Trendyol",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-07-04T10:46:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-07-08T01:18:13.200Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-07-09T19:15:39.600Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-07-13T09:47:52.800Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-07-15T03:45:19.200Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 2,
          "companyName": "Aras Kargo",
          "metrics": {
            "cost": 0.5853658536585367,
            "deliveryTime": 0.2800000000000001,
            "successRate": 0.679563492063492,
            "damagedRate": 0.4666666666666667,
            "avgPickupHours": 1,
            "costDiffPct": 1
          },
          "combined": 0.6188990030971738
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 2
          }
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
    "status": "OnTheWay",
    "cargoType": "order",
    "referenceId": "REF-72106",
    "packageNo": "PKT-000162",
    "customerName": "Doğan Doğan",
    "channel": "Trendyol",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-07-05T02:15:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-07-06T22:39:54.000Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-07-10T10:33:36.000Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-07-12T04:30:27.000Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-07-15T09:00:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 1
          }
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
    "status": "OnTheWay",
    "cargoType": "order",
    "referenceId": "REF-72119",
    "packageNo": "PKT-000163",
    "customerName": "Barış Doğan",
    "channel": "Trendyol",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-07-05T05:04:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-07-07T05:51:12.000Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-07-10T19:13:48.000Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-07-12T15:08:16.800Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-07-15T09:00:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 1
          }
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
    "status": "DispatchLabelCreated",
    "cargoType": "order",
    "referenceId": "REF-72132",
    "packageNo": "PKT-000164",
    "customerName": "Gül Çelik",
    "channel": "Trendyol",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-07-05T07:04:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 3,
          "companyName": "MNG Kargo",
          "metrics": {
            "cost": 0.5,
            "deliveryTime": 0.5199999999999999,
            "successRate": 0.679563492063492,
            "damagedRate": 0.7333333333333334,
            "avgPickupHours": 0,
            "costDiffPct": 0
          },
          "combined": 0.47222420634920637
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 3
          }
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
    "status": "OnTheWay",
    "cargoType": "order",
    "referenceId": "REF-72145",
    "packageNo": "PKT-000165",
    "customerName": "Barış Arslan",
    "channel": "Kendi Web Sitesi",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-07-06T02:16:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-07-08T07:43:21.600Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-07-10T04:16:09.600Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-07-13T14:40:50.400Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-07-15T09:00:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 1,
      "matchedRuleName": "İstanbul İçi Ekonomik",
      "matchedRuleSummary": "0–10 desi · İstanbul",
      "ruleNarrowedCompanyIds": [
        8,
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 8,
          "companyName": "Hepsijet",
          "metrics": {
            "cost": 1,
            "deliveryTime": 0,
            "successRate": 0.19047619047619038,
            "damagedRate": 1,
            "avgPickupHours": 0.6838709677419356,
            "costDiffPct": 0.9556096935478475
          },
          "combined": 0.561567113748026
        },
        {
          "companyId": 3,
          "companyName": "MNG Kargo",
          "metrics": {
            "cost": 0.5,
            "deliveryTime": 0.5199999999999999,
            "successRate": 0.679563492063492,
            "damagedRate": 0.7333333333333334,
            "avgPickupHours": 0,
            "costDiffPct": 0
          },
          "combined": 0.47222420634920637
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 3
          }
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
    "status": "OnTheWay",
    "cargoType": "order",
    "referenceId": "REF-72158",
    "packageNo": "PKT-000166",
    "customerName": "Selin Şahin",
    "channel": "Trendyol",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-07-06T11:35:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-07-08T19:04:18.000Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-07-10T15:53:21.000Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-07-12T12:42:24.000Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-07-15T09:00:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 1
          }
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
    "status": "DispatchLabelCreated",
    "cargoType": "order",
    "referenceId": "REF-72171",
    "packageNo": "PKT-000167",
    "customerName": "Fatma Güneş",
    "channel": "Trendyol",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-07-07T05:56:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 2,
          "companyName": "Aras Kargo",
          "metrics": {
            "cost": 0.5853658536585367,
            "deliveryTime": 0.2800000000000001,
            "successRate": 0.679563492063492,
            "damagedRate": 0.4666666666666667,
            "avgPickupHours": 1,
            "costDiffPct": 1
          },
          "combined": 0.6188990030971738
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 2
          }
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
    "status": "OnTheWay",
    "cargoType": "order",
    "referenceId": "REF-72184",
    "packageNo": "PKT-000168",
    "customerName": "Hakan Yılmaz",
    "channel": "Trendyol",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-07-07T09:43:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-07-09T19:06:06.000Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-07-11T15:05:48.600Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-07-13T11:05:31.200Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-07-15T07:05:13.800Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 6,
          "companyName": "DHL eCommerce",
          "metrics": {
            "cost": 0.29268292682926833,
            "deliveryTime": 0.6666666666666665,
            "successRate": 0,
            "damagedRate": 0.2592592592592593,
            "avgPickupHours": 0.8538899430740037,
            "costDiffPct": 0.9922127873486873
          },
          "combined": 0.4170402640088454
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 6
          }
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
    "status": "OnTheWay",
    "cargoType": "order",
    "referenceId": "REF-72197",
    "packageNo": "PKT-000169",
    "customerName": "Hakan Aksoy",
    "channel": "N11",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-07-07T09:54:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-07-09T23:03:07.200Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-07-11T20:54:57.600Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-07-13T18:46:48.000Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-07-15T09:00:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 6,
          "companyName": "DHL eCommerce",
          "metrics": {
            "cost": 0.29268292682926833,
            "deliveryTime": 0.6666666666666665,
            "successRate": 0,
            "damagedRate": 0.2592592592592593,
            "avgPickupHours": 0.8538899430740037,
            "costDiffPct": 0.9922127873486873
          },
          "combined": 0.4170402640088454
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 6
          }
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
    "status": "OnTheWay",
    "cargoType": "order",
    "referenceId": "REF-72210",
    "packageNo": "PKT-000170",
    "customerName": "Ebru Şahin",
    "channel": "N11",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-07-08T08:21:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-07-09T13:01:13.800Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-07-11T07:10:58.800Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-07-13T01:20:43.800Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-07-14T19:30:28.800Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 4,
      "matchedRuleName": "Ege Bölgesi Standart",
      "matchedRuleSummary": "0–30 desi · İzmir",
      "ruleNarrowedCompanyIds": [
        2
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 2,
          "companyName": "Aras Kargo",
          "metrics": {
            "cost": 0.5853658536585367,
            "deliveryTime": 0.2800000000000001,
            "successRate": 0.679563492063492,
            "damagedRate": 0.4666666666666667,
            "avgPickupHours": 1,
            "costDiffPct": 1
          },
          "combined": 0.6188990030971738
        }
      ],
      "chosenCompanyId": 2
          }
  }
]

export const RETURN_REASONS: Record<string, string> = {
  begenmedim: 'Beğenmedim / Vazgeçtim',
  yanlis_urun: 'Yanlış Ürün Gönderildi',
  kusurlu: 'Kusurlu / Hasarlı Ürün',
  degisim: 'Değişim Talebi',
  diger: 'Diğer',
}

export type ReturnStatus =
  | 'ReturnCodeCreated'
  | 'ReturnOnTheWay'
  | 'OnReturnAddress'
  | 'ReturnReceivedByProvider'
  | 'ReceivedByReturnCenter'
  | 'ReturnShipmentError'
  | 'ReturnCodeExpired'

export const RETURN_STATUS: Record<ReturnStatus, { code: number; badge: string }> = {
  ReturnCodeCreated: { code: 575, badge: 'badge-info' },
  ReturnOnTheWay: { code: 580, badge: 'badge-warning' },
  OnReturnAddress: { code: 582, badge: 'badge-warning' },
  ReturnReceivedByProvider: { code: 585, badge: 'badge-passive' },
  ReceivedByReturnCenter: { code: 590, badge: 'badge-active' },
  ReturnShipmentError: { code: 600, badge: 'badge-danger' },
  ReturnCodeExpired: { code: 570, badge: 'badge-danger' },
}

export const RETURN_STATUS_CHART_COLORS: Record<ReturnStatus, string> = {
  ReturnCodeCreated: '#85a0f2',
  ReturnOnTheWay: '#f0a869',
  OnReturnAddress: '#e8b86d',
  ReturnReceivedByProvider: '#aab3c2',
  ReceivedByReturnCenter: '#7ecca0',
  ReturnShipmentError: '#f28d97',
  ReturnCodeExpired: '#bb717a',
}

export const RETURN_STATUS_GROUPS: { key: string; label: string; statuses: ReturnStatus[] }[] = [
  { key: 'started', label: 'İade Başladı', statuses: ['ReturnCodeCreated'] },
  { key: 'transit', label: 'Yolda', statuses: ['ReturnOnTheWay', 'OnReturnAddress', 'ReturnReceivedByProvider'] },
  { key: 'completed', label: 'Tamamlandı', statuses: ['ReceivedByReturnCenter'] },
  { key: 'failed', label: 'Sorunlu', statuses: ['ReturnShipmentError', 'ReturnCodeExpired'] },
]

export interface ReturnItem {
  id: number
  returnNo: number
  orderNo: number
  companyId: number
  trackingNo: string
  shipFrom: string
  shipTo: { district: string; province: string; addressLine?: string; phone?: string; email?: string }
  requestDate: string
  status: ReturnStatus
  referenceId: string
  packageNo: string
  customerName: string
  channel: string
  reason: string
  pickup: boolean
  note: string
  desi?: number
  orderAmount?: number
  productType?: string
  pickupDate?: string
  pickupTimeSlot?: string
  routingDecision?: ShipmentRoutingDecision
  statusHistory: { status: ReturnStatus; at: string }[]
}

export const SEED_RETURNS: ReturnItem[] = [
  {
    "id": 1,
    "returnNo": 9300001,
    "orderNo": 61200002,
    "companyId": 1,
    "trackingNo": "YK-2026-R0000137",
    "shipFrom": "Ankara İade Merkezi",
    "shipTo": {
      "district": "Nilüfer",
      "province": "Bursa"
    },
    "requestDate": "2026-04-14T01:06:29",
    "status": "ReceivedByReturnCenter",
    "referenceId": "REF-R00271",
    "packageNo": "PKT-R000001",
    "customerName": "Aslı Aydın",
    "channel": "Trendyol",
    "reason": "kusurlu",
    "pickup": true,
    "note": "",
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        4,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 1
          },
    "statusHistory": [
      {
        "status": "ReturnCodeCreated",
        "at": "2026-04-13T22:06:29.000Z"
      },
      {
        "status": "ReturnOnTheWay",
        "at": "2026-04-14T11:47:17.000Z"
      },
      {
        "status": "OnReturnAddress",
        "at": "2026-04-15T06:30:29.000Z"
      },
      {
        "status": "ReturnReceivedByProvider",
        "at": "2026-04-16T01:13:41.000Z"
      },
      {
        "status": "ReceivedByReturnCenter",
        "at": "2026-04-16T19:56:53.000Z"
      }
    ]
  },
  {
    "id": 2,
    "returnNo": 9300002,
    "orderNo": 61200004,
    "companyId": 4,
    "trackingNo": "PTT-2026-R0000274",
    "shipFrom": "İzmir İade Merkezi",
    "shipTo": {
      "district": "Keçiören",
      "province": "Ankara"
    },
    "requestDate": "2026-04-21T21:09:36",
    "status": "ReceivedByReturnCenter",
    "referenceId": "REF-R00542",
    "packageNo": "PKT-R000002",
    "customerName": "Selin Kurt",
    "channel": "Hepsiburada",
    "reason": "degisim",
    "pickup": true,
    "note": "",
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        4,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 4,
          "companyName": "PTT Kargo",
          "metrics": {
            "cost": 0.5,
            "deliveryTime": 1,
            "successRate": 1,
            "damagedRate": 0.2592592592592593,
            "avgPickupHours": 0.6838709677419356,
            "costDiffPct": 0.9375970850179929
          },
          "combined": 0.7630727312019187
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 4
          },
    "statusHistory": [
      {
        "status": "ReturnCodeCreated",
        "at": "2026-04-21T18:09:36.000Z"
      },
      {
        "status": "ReturnOnTheWay",
        "at": "2026-04-22T14:19:12.000Z"
      },
      {
        "status": "OnReturnAddress",
        "at": "2026-04-23T16:14:24.000Z"
      },
      {
        "status": "ReturnReceivedByProvider",
        "at": "2026-04-24T18:09:36.000Z"
      },
      {
        "status": "ReceivedByReturnCenter",
        "at": "2026-04-25T18:09:36.000Z"
      }
    ]
  },
  {
    "id": 3,
    "returnNo": 9300003,
    "orderNo": 61200013,
    "companyId": 2,
    "trackingNo": "ARAS-2026-R0000411",
    "shipFrom": "Bursa İade Merkezi",
    "shipTo": {
      "district": "Selçuklu",
      "province": "Konya"
    },
    "requestDate": "2026-04-23T09:25:03",
    "status": "ReceivedByReturnCenter",
    "referenceId": "REF-R00813",
    "packageNo": "PKT-R000003",
    "customerName": "Fatma Yıldız",
    "channel": "Trendyol",
    "reason": "kusurlu",
    "pickup": true,
    "note": "",
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        4,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 2,
          "companyName": "Aras Kargo",
          "metrics": {
            "cost": 0.5853658536585367,
            "deliveryTime": 0.2800000000000001,
            "successRate": 0.679563492063492,
            "damagedRate": 0.4666666666666667,
            "avgPickupHours": 1,
            "costDiffPct": 1
          },
          "combined": 0.6188990030971738
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 2
          },
    "statusHistory": [
      {
        "status": "ReturnCodeCreated",
        "at": "2026-04-23T06:25:03.000Z"
      },
      {
        "status": "ReturnOnTheWay",
        "at": "2026-04-24T10:01:03.000Z"
      },
      {
        "status": "OnReturnAddress",
        "at": "2026-04-25T19:37:03.000Z"
      },
      {
        "status": "ReturnReceivedByProvider",
        "at": "2026-04-27T05:13:03.000Z"
      },
      {
        "status": "ReceivedByReturnCenter",
        "at": "2026-04-28T06:25:03.000Z"
      }
    ]
  },
  {
    "id": 4,
    "returnNo": 9300004,
    "orderNo": 61200020,
    "companyId": 1,
    "trackingNo": "YK-2026-R0000548",
    "shipFrom": "İstanbul İade Merkezi",
    "shipTo": {
      "district": "Muratpaşa",
      "province": "Antalya"
    },
    "requestDate": "2026-04-27T14:11:44",
    "status": "ReceivedByReturnCenter",
    "referenceId": "REF-R01084",
    "packageNo": "PKT-R000004",
    "customerName": "Aslı Bulut",
    "channel": "Kendi Web Sitesi",
    "reason": "diger",
    "pickup": true,
    "note": "",
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        4,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 1
          },
    "statusHistory": [
      {
        "status": "ReturnCodeCreated",
        "at": "2026-04-27T11:11:44.000Z"
      },
      {
        "status": "ReturnOnTheWay",
        "at": "2026-04-28T23:11:44.000Z"
      },
      {
        "status": "OnReturnAddress",
        "at": "2026-04-30T16:57:20.000Z"
      },
      {
        "status": "ReturnReceivedByProvider",
        "at": "2026-05-02T10:42:56.000Z"
      },
      {
        "status": "ReceivedByReturnCenter",
        "at": "2026-05-03T03:59:44.000Z"
      }
    ]
  },
  {
    "id": 5,
    "returnNo": 9300005,
    "orderNo": 61200028,
    "companyId": 2,
    "trackingNo": "ARAS-2026-R0000685",
    "shipFrom": "Ankara İade Merkezi",
    "shipTo": {
      "district": "Melikgazi",
      "province": "Kayseri"
    },
    "requestDate": "2026-05-01T13:59:10",
    "status": "ReceivedByReturnCenter",
    "referenceId": "REF-R01355",
    "packageNo": "PKT-R000005",
    "customerName": "Doğan Özdemir",
    "channel": "Trendyol",
    "reason": "begenmedim",
    "pickup": true,
    "note": "",
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        4,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 2,
          "companyName": "Aras Kargo",
          "metrics": {
            "cost": 0.5853658536585367,
            "deliveryTime": 0.2800000000000001,
            "successRate": 0.679563492063492,
            "damagedRate": 0.4666666666666667,
            "avgPickupHours": 1,
            "costDiffPct": 1
          },
          "combined": 0.6188990030971738
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 2
          },
    "statusHistory": [
      {
        "status": "ReturnCodeCreated",
        "at": "2026-05-01T10:59:10.000Z"
      },
      {
        "status": "ReturnOnTheWay",
        "at": "2026-05-03T08:20:46.000Z"
      },
      {
        "status": "OnReturnAddress",
        "at": "2026-05-05T10:44:46.000Z"
      },
      {
        "status": "ReturnReceivedByProvider",
        "at": "2026-05-06T08:35:10.000Z"
      },
      {
        "status": "ReceivedByReturnCenter",
        "at": "2026-05-08T10:59:10.000Z"
      }
    ]
  },
  {
    "id": 6,
    "returnNo": 9300006,
    "orderNo": 61200016,
    "companyId": 2,
    "trackingNo": "ARAS-2026-R0000822",
    "shipFrom": "İzmir İade Merkezi",
    "shipTo": {
      "district": "Ortahisar",
      "province": "Trabzon"
    },
    "requestDate": "2026-05-02T13:52:50",
    "status": "ReceivedByReturnCenter",
    "referenceId": "REF-R01626",
    "packageNo": "PKT-R000006",
    "customerName": "Onur Arslan",
    "channel": "Kendi Web Sitesi",
    "reason": "begenmedim",
    "pickup": true,
    "note": "",
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        4,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 2,
          "companyName": "Aras Kargo",
          "metrics": {
            "cost": 0.5853658536585367,
            "deliveryTime": 0.2800000000000001,
            "successRate": 0.679563492063492,
            "damagedRate": 0.4666666666666667,
            "avgPickupHours": 1,
            "costDiffPct": 1
          },
          "combined": 0.6188990030971738
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 2
          },
    "statusHistory": [
      {
        "status": "ReturnCodeCreated",
        "at": "2026-05-02T10:52:50.000Z"
      },
      {
        "status": "ReturnOnTheWay",
        "at": "2026-05-03T00:48:02.000Z"
      },
      {
        "status": "OnReturnAddress",
        "at": "2026-05-03T07:31:14.000Z"
      },
      {
        "status": "ReturnReceivedByProvider",
        "at": "2026-05-03T22:24:02.000Z"
      },
      {
        "status": "ReceivedByReturnCenter",
        "at": "2026-05-04T10:52:50.000Z"
      }
    ]
  },
  {
    "id": 7,
    "returnNo": 9300007,
    "orderNo": 61200030,
    "companyId": 8,
    "trackingNo": "HPS-2026-R0000959",
    "shipFrom": "Bursa İade Merkezi",
    "shipTo": {
      "district": "Karatay",
      "province": "Konya"
    },
    "requestDate": "2026-05-02T19:17:17",
    "status": "ReceivedByReturnCenter",
    "referenceId": "REF-R01897",
    "packageNo": "PKT-R000007",
    "customerName": "Cem Erdoğan",
    "channel": "Trendyol",
    "reason": "degisim",
    "pickup": true,
    "note": "",
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        4,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 8,
          "companyName": "Hepsijet",
          "metrics": {
            "cost": 1,
            "deliveryTime": 0,
            "successRate": 0.19047619047619038,
            "damagedRate": 1,
            "avgPickupHours": 0.6838709677419356,
            "costDiffPct": 0.9556096935478475
          },
          "combined": 0.561567113748026
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 8
          },
    "statusHistory": [
      {
        "status": "ReturnCodeCreated",
        "at": "2026-05-02T16:17:17.000Z"
      },
      {
        "status": "ReturnOnTheWay",
        "at": "2026-05-03T14:36:29.000Z"
      },
      {
        "status": "OnReturnAddress",
        "at": "2026-05-04T01:24:29.000Z"
      },
      {
        "status": "ReturnReceivedByProvider",
        "at": "2026-05-05T00:26:53.000Z"
      },
      {
        "status": "ReceivedByReturnCenter",
        "at": "2026-05-05T11:14:53.000Z"
      }
    ]
  },
  {
    "id": 8,
    "returnNo": 9300008,
    "orderNo": 61200033,
    "companyId": 2,
    "trackingNo": "ARAS-2026-R0001096",
    "shipFrom": "İstanbul İade Merkezi",
    "shipTo": {
      "district": "Ortahisar",
      "province": "Trabzon"
    },
    "requestDate": "2026-05-07T05:26:59",
    "status": "ReceivedByReturnCenter",
    "referenceId": "REF-R02168",
    "packageNo": "PKT-R000008",
    "customerName": "Ayşe Polat",
    "channel": "Trendyol",
    "reason": "yanlis_urun",
    "pickup": true,
    "note": "",
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        4,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 2,
          "companyName": "Aras Kargo",
          "metrics": {
            "cost": 0.5853658536585367,
            "deliveryTime": 0.2800000000000001,
            "successRate": 0.679563492063492,
            "damagedRate": 0.4666666666666667,
            "avgPickupHours": 1,
            "costDiffPct": 1
          },
          "combined": 0.6188990030971738
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 2
          },
    "statusHistory": [
      {
        "status": "ReturnCodeCreated",
        "at": "2026-05-07T02:26:59.000Z"
      },
      {
        "status": "ReturnOnTheWay",
        "at": "2026-05-08T10:07:47.000Z"
      },
      {
        "status": "OnReturnAddress",
        "at": "2026-05-09T01:29:23.000Z"
      },
      {
        "status": "ReturnReceivedByProvider",
        "at": "2026-05-10T09:10:11.000Z"
      },
      {
        "status": "ReceivedByReturnCenter",
        "at": "2026-05-11T00:31:47.000Z"
      }
    ]
  },
  {
    "id": 9,
    "returnNo": 9300009,
    "orderNo": 61200036,
    "companyId": 2,
    "trackingNo": "ARAS-2026-R0001233",
    "shipFrom": "Ankara İade Merkezi",
    "shipTo": {
      "district": "Yenimahalle",
      "province": "Ankara"
    },
    "requestDate": "2026-05-08T06:03:41",
    "status": "ReceivedByReturnCenter",
    "referenceId": "REF-R02439",
    "packageNo": "PKT-R000009",
    "customerName": "Hakan Özdemir",
    "channel": "Hepsiburada",
    "reason": "begenmedim",
    "pickup": true,
    "note": "",
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        4,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 2,
          "companyName": "Aras Kargo",
          "metrics": {
            "cost": 0.5853658536585367,
            "deliveryTime": 0.2800000000000001,
            "successRate": 0.679563492063492,
            "damagedRate": 0.4666666666666667,
            "avgPickupHours": 1,
            "costDiffPct": 1
          },
          "combined": 0.6188990030971738
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 2
          },
    "statusHistory": [
      {
        "status": "ReturnCodeCreated",
        "at": "2026-05-08T03:03:41.000Z"
      },
      {
        "status": "ReturnOnTheWay",
        "at": "2026-05-09T00:39:41.000Z"
      },
      {
        "status": "OnReturnAddress",
        "at": "2026-05-10T17:27:41.000Z"
      },
      {
        "status": "ReturnReceivedByProvider",
        "at": "2026-05-11T13:51:41.000Z"
      },
      {
        "status": "ReceivedByReturnCenter",
        "at": "2026-05-13T03:03:41.000Z"
      }
    ]
  },
  {
    "id": 10,
    "returnNo": 9300010,
    "orderNo": 61200032,
    "companyId": 3,
    "trackingNo": "MNG-2026-R0001370",
    "shipFrom": "İzmir İade Merkezi",
    "shipTo": {
      "district": "Mamak",
      "province": "Ankara"
    },
    "requestDate": "2026-05-08T14:25:53",
    "status": "ReceivedByReturnCenter",
    "referenceId": "REF-R02710",
    "packageNo": "PKT-R000010",
    "customerName": "Kerem Doğan",
    "channel": "Hepsiburada",
    "reason": "begenmedim",
    "pickup": true,
    "note": "",
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        4,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 3,
          "companyName": "MNG Kargo",
          "metrics": {
            "cost": 0.5,
            "deliveryTime": 0.5199999999999999,
            "successRate": 0.679563492063492,
            "damagedRate": 0.7333333333333334,
            "avgPickupHours": 0,
            "costDiffPct": 0
          },
          "combined": 0.47222420634920637
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 3
          },
    "statusHistory": [
      {
        "status": "ReturnCodeCreated",
        "at": "2026-05-08T11:25:53.000Z"
      },
      {
        "status": "ReturnOnTheWay",
        "at": "2026-05-09T16:13:53.000Z"
      },
      {
        "status": "OnReturnAddress",
        "at": "2026-05-11T18:37:53.000Z"
      },
      {
        "status": "ReturnReceivedByProvider",
        "at": "2026-05-12T20:33:05.000Z"
      },
      {
        "status": "ReceivedByReturnCenter",
        "at": "2026-05-14T11:25:53.000Z"
      }
    ]
  },
  {
    "id": 11,
    "returnNo": 9300011,
    "orderNo": 61200035,
    "companyId": 3,
    "trackingNo": "MNG-2026-R0001507",
    "shipFrom": "Bursa İade Merkezi",
    "shipTo": {
      "district": "Osmangazi",
      "province": "Bursa"
    },
    "requestDate": "2026-05-10T09:09:17",
    "status": "ReceivedByReturnCenter",
    "referenceId": "REF-R02981",
    "packageNo": "PKT-R000011",
    "customerName": "Gül Doğan",
    "channel": "Hepsiburada",
    "reason": "begenmedim",
    "pickup": false,
    "note": "",
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        4,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 3,
          "companyName": "MNG Kargo",
          "metrics": {
            "cost": 0.5,
            "deliveryTime": 0.5199999999999999,
            "successRate": 0.679563492063492,
            "damagedRate": 0.7333333333333334,
            "avgPickupHours": 0,
            "costDiffPct": 0
          },
          "combined": 0.47222420634920637
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 3
          },
    "statusHistory": [
      {
        "status": "ReturnCodeCreated",
        "at": "2026-05-10T06:09:17.000Z"
      },
      {
        "status": "ReturnOnTheWay",
        "at": "2026-05-11T19:06:53.000Z"
      },
      {
        "status": "OnReturnAddress",
        "at": "2026-05-14T07:35:41.000Z"
      },
      {
        "status": "ReturnReceivedByProvider",
        "at": "2026-05-15T15:30:53.000Z"
      },
      {
        "status": "ReceivedByReturnCenter",
        "at": "2026-05-16T23:26:05.000Z"
      }
    ]
  },
  {
    "id": 12,
    "returnNo": 9300012,
    "orderNo": 61200018,
    "companyId": 3,
    "trackingNo": "MNG-2026-R0001644",
    "shipFrom": "İstanbul İade Merkezi",
    "shipTo": {
      "district": "Şehitkamil",
      "province": "Gaziantep"
    },
    "requestDate": "2026-05-10T19:23:50",
    "status": "ReceivedByReturnCenter",
    "referenceId": "REF-R03252",
    "packageNo": "PKT-R000012",
    "customerName": "Mehmet Doğan",
    "channel": "Trendyol",
    "reason": "kusurlu",
    "pickup": true,
    "note": "",
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        4,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 3,
          "companyName": "MNG Kargo",
          "metrics": {
            "cost": 0.5,
            "deliveryTime": 0.5199999999999999,
            "successRate": 0.679563492063492,
            "damagedRate": 0.7333333333333334,
            "avgPickupHours": 0,
            "costDiffPct": 0
          },
          "combined": 0.47222420634920637
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 3
          },
    "statusHistory": [
      {
        "status": "ReturnCodeCreated",
        "at": "2026-05-10T16:23:50.000Z"
      },
      {
        "status": "ReturnOnTheWay",
        "at": "2026-05-11T03:55:02.000Z"
      },
      {
        "status": "OnReturnAddress",
        "at": "2026-05-11T13:31:02.000Z"
      },
      {
        "status": "ReturnReceivedByProvider",
        "at": "2026-05-12T07:16:38.000Z"
      },
      {
        "status": "ReceivedByReturnCenter",
        "at": "2026-05-12T16:23:50.000Z"
      }
    ]
  },
  {
    "id": 13,
    "returnNo": 9300013,
    "orderNo": 61200046,
    "companyId": 1,
    "trackingNo": "YK-2026-R0001781",
    "shipFrom": "Ankara İade Merkezi",
    "shipTo": {
      "district": "Çukurova",
      "province": "Adana"
    },
    "requestDate": "2026-05-11T16:06:33",
    "status": "ReceivedByReturnCenter",
    "referenceId": "REF-R03523",
    "packageNo": "PKT-R000013",
    "customerName": "Mehmet Öztürk",
    "channel": "Kendi Web Sitesi",
    "reason": "degisim",
    "pickup": false,
    "note": "",
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        4,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 1
          },
    "statusHistory": [
      {
        "status": "ReturnCodeCreated",
        "at": "2026-05-11T13:06:33.000Z"
      },
      {
        "status": "ReturnOnTheWay",
        "at": "2026-05-12T07:49:45.000Z"
      },
      {
        "status": "OnReturnAddress",
        "at": "2026-05-12T22:56:57.000Z"
      },
      {
        "status": "ReturnReceivedByProvider",
        "at": "2026-05-13T14:04:09.000Z"
      },
      {
        "status": "ReceivedByReturnCenter",
        "at": "2026-05-14T13:06:33.000Z"
      }
    ]
  },
  {
    "id": 14,
    "returnNo": 9300014,
    "orderNo": 61200045,
    "companyId": 1,
    "trackingNo": "YK-2026-R0001918",
    "shipFrom": "İzmir İade Merkezi",
    "shipTo": {
      "district": "Bornova",
      "province": "İzmir"
    },
    "requestDate": "2026-05-11T19:19:17",
    "status": "ReceivedByReturnCenter",
    "referenceId": "REF-R03794",
    "packageNo": "PKT-R000014",
    "customerName": "İrem Aksoy",
    "channel": "Trendyol",
    "reason": "begenmedim",
    "pickup": true,
    "note": "",
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        4,
        6,
        7,
        8
      ],
      "matchedRuleId": 4,
      "matchedRuleName": "Ege Bölgesi Standart",
      "matchedRuleSummary": "0–30 desi · İzmir",
      "ruleNarrowedCompanyIds": null,
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 4,
          "companyName": "PTT Kargo",
          "metrics": {
            "cost": 0.5,
            "deliveryTime": 1,
            "successRate": 1,
            "damagedRate": 0.2592592592592593,
            "avgPickupHours": 0.6838709677419356,
            "costDiffPct": 0.9375970850179929
          },
          "combined": 0.7630727312019187
        },
        {
          "companyId": 7,
          "companyName": "Horoz Lojistik",
          "metrics": {
            "cost": 0.5,
            "deliveryTime": 0.09999999999999996,
            "successRate": 0.6471306471306472,
            "damagedRate": 1,
            "avgPickupHours": 0.6997518610421837,
            "costDiffPct": 0.9449840836312517
          },
          "combined": 0.5712562562500053
        },
        {
          "companyId": 8,
          "companyName": "Hepsijet",
          "metrics": {
            "cost": 1,
            "deliveryTime": 0,
            "successRate": 0.19047619047619038,
            "damagedRate": 1,
            "avgPickupHours": 0.6838709677419356,
            "costDiffPct": 0.9556096935478475
          },
          "combined": 0.561567113748026
        },
        {
          "companyId": 6,
          "companyName": "DHL eCommerce",
          "metrics": {
            "cost": 0.29268292682926833,
            "deliveryTime": 0.6666666666666665,
            "successRate": 0,
            "damagedRate": 0.2592592592592593,
            "avgPickupHours": 0.8538899430740037,
            "costDiffPct": 0.9922127873486873
          },
          "combined": 0.4170402640088454
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 1
          },
    "statusHistory": [
      {
        "status": "ReturnCodeCreated",
        "at": "2026-05-11T16:19:17.000Z"
      },
      {
        "status": "ReturnOnTheWay",
        "at": "2026-05-12T19:12:05.000Z"
      },
      {
        "status": "OnReturnAddress",
        "at": "2026-05-13T16:19:17.000Z"
      },
      {
        "status": "ReturnReceivedByProvider",
        "at": "2026-05-14T13:26:29.000Z"
      },
      {
        "status": "ReceivedByReturnCenter",
        "at": "2026-05-15T10:33:41.000Z"
      }
    ]
  },
  {
    "id": 15,
    "returnNo": 9300015,
    "orderNo": 61200042,
    "companyId": 1,
    "trackingNo": "YK-2026-R0002055",
    "shipFrom": "Bursa İade Merkezi",
    "shipTo": {
      "district": "Keçiören",
      "province": "Ankara"
    },
    "requestDate": "2026-05-12T04:05:30",
    "status": "ReturnShipmentError",
    "referenceId": "REF-R04065",
    "packageNo": "PKT-R000015",
    "customerName": "Ceren Polat",
    "channel": "N11",
    "reason": "diger",
    "pickup": false,
    "note": "",
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        4,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 1
          },
    "statusHistory": [
      {
        "status": "ReturnCodeCreated",
        "at": "2026-05-12T01:05:30.000Z"
      },
      {
        "status": "ReturnShipmentError",
        "at": "2026-05-17T01:05:30.000Z"
      }
    ]
  },
  {
    "id": 16,
    "returnNo": 9300016,
    "orderNo": 61200039,
    "companyId": 2,
    "trackingNo": "ARAS-2026-R0002192",
    "shipFrom": "İstanbul İade Merkezi",
    "shipTo": {
      "district": "Melikgazi",
      "province": "Kayseri"
    },
    "requestDate": "2026-05-13T05:14:02",
    "status": "ReturnShipmentError",
    "referenceId": "REF-R04336",
    "packageNo": "PKT-R000016",
    "customerName": "Hakan Aksoy",
    "channel": "Hepsiburada",
    "reason": "yanlis_urun",
    "pickup": true,
    "note": "",
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        4,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 2,
          "companyName": "Aras Kargo",
          "metrics": {
            "cost": 0.5853658536585367,
            "deliveryTime": 0.2800000000000001,
            "successRate": 0.679563492063492,
            "damagedRate": 0.4666666666666667,
            "avgPickupHours": 1,
            "costDiffPct": 1
          },
          "combined": 0.6188990030971738
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 2
          },
    "statusHistory": [
      {
        "status": "ReturnCodeCreated",
        "at": "2026-05-13T02:14:02.000Z"
      },
      {
        "status": "ReturnShipmentError",
        "at": "2026-05-19T02:14:02.000Z"
      }
    ]
  },
  {
    "id": 17,
    "returnNo": 9300017,
    "orderNo": 61200057,
    "companyId": 6,
    "trackingNo": "DHL-2026-R0002329",
    "shipFrom": "Ankara İade Merkezi",
    "shipTo": {
      "district": "Kocasinan",
      "province": "Kayseri"
    },
    "requestDate": "2026-05-16T02:54:24",
    "status": "ReturnShipmentError",
    "referenceId": "REF-R04607",
    "packageNo": "PKT-R000017",
    "customerName": "Fatma Özdemir",
    "channel": "Trendyol",
    "reason": "kusurlu",
    "pickup": true,
    "note": "",
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        4,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 6,
          "companyName": "DHL eCommerce",
          "metrics": {
            "cost": 0.29268292682926833,
            "deliveryTime": 0.6666666666666665,
            "successRate": 0,
            "damagedRate": 0.2592592592592593,
            "avgPickupHours": 0.8538899430740037,
            "costDiffPct": 0.9922127873486873
          },
          "combined": 0.4170402640088454
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 6
          },
    "statusHistory": [
      {
        "status": "ReturnCodeCreated",
        "at": "2026-05-15T23:54:24.000Z"
      },
      {
        "status": "ReturnShipmentError",
        "at": "2026-05-22T10:28:00.000Z"
      }
    ]
  },
  {
    "id": 18,
    "returnNo": 9300018,
    "orderNo": 61200041,
    "companyId": 3,
    "trackingNo": "MNG-2026-R0002466",
    "shipFrom": "İzmir İade Merkezi",
    "shipTo": {
      "district": "Selçuklu",
      "province": "Konya"
    },
    "requestDate": "2026-05-16T18:56:58",
    "status": "ReturnCodeExpired",
    "referenceId": "REF-R04878",
    "packageNo": "PKT-R000018",
    "customerName": "Yusuf Kaya",
    "channel": "Hepsiburada",
    "reason": "diger",
    "pickup": true,
    "note": "",
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        4,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 3,
          "companyName": "MNG Kargo",
          "metrics": {
            "cost": 0.5,
            "deliveryTime": 0.5199999999999999,
            "successRate": 0.679563492063492,
            "damagedRate": 0.7333333333333334,
            "avgPickupHours": 0,
            "costDiffPct": 0
          },
          "combined": 0.47222420634920637
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 3
          },
    "statusHistory": [
      {
        "status": "ReturnCodeCreated",
        "at": "2026-05-16T15:56:58.000Z"
      },
      {
        "status": "ReturnCodeExpired",
        "at": "2026-05-18T13:04:10.000Z"
      }
    ]
  },
  {
    "id": 19,
    "returnNo": 9300019,
    "orderNo": 61200053,
    "companyId": 3,
    "trackingNo": "MNG-2026-R0002603",
    "shipFrom": "Bursa İade Merkezi",
    "shipTo": {
      "district": "Ortahisar",
      "province": "Trabzon"
    },
    "requestDate": "2026-05-17T05:22:19",
    "status": "ReturnReceivedByProvider",
    "referenceId": "REF-R05149",
    "packageNo": "PKT-R000019",
    "customerName": "Aslı Aksoy",
    "channel": "Kendi Web Sitesi",
    "reason": "diger",
    "pickup": false,
    "note": "",
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        4,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 3,
          "companyName": "MNG Kargo",
          "metrics": {
            "cost": 0.5,
            "deliveryTime": 0.5199999999999999,
            "successRate": 0.679563492063492,
            "damagedRate": 0.7333333333333334,
            "avgPickupHours": 0,
            "costDiffPct": 0
          },
          "combined": 0.47222420634920637
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 3
          },
    "statusHistory": [
      {
        "status": "ReturnCodeCreated",
        "at": "2026-05-17T02:22:19.000Z"
      },
      {
        "status": "ReturnOnTheWay",
        "at": "2026-06-03T11:40:34.226Z"
      },
      {
        "status": "OnReturnAddress",
        "at": "2026-06-24T10:20:17.113Z"
      },
      {
        "status": "ReturnReceivedByProvider",
        "at": "2026-07-15T09:00:00.000Z"
      }
    ]
  },
  {
    "id": 20,
    "returnNo": 9300020,
    "orderNo": 61200052,
    "companyId": 1,
    "trackingNo": "YK-2026-R0002740",
    "shipFrom": "İstanbul İade Merkezi",
    "shipTo": {
      "district": "Pendik",
      "province": "İstanbul"
    },
    "requestDate": "2026-05-25T15:13:40",
    "status": "ReturnReceivedByProvider",
    "referenceId": "REF-R05420",
    "packageNo": "PKT-R000020",
    "customerName": "Kaan Koç",
    "channel": "Hepsiburada",
    "reason": "kusurlu",
    "pickup": true,
    "note": "",
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        4,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 1
          },
    "statusHistory": [
      {
        "status": "ReturnCodeCreated",
        "at": "2026-05-25T12:13:40.000Z"
      },
      {
        "status": "ReturnOnTheWay",
        "at": "2026-06-10T10:44:11.066Z"
      },
      {
        "status": "OnReturnAddress",
        "at": "2026-06-28T22:17:01.133Z"
      },
      {
        "status": "ReturnReceivedByProvider",
        "at": "2026-07-15T09:00:00.000Z"
      }
    ]
  },
  {
    "id": 21,
    "returnNo": 9300021,
    "orderNo": 61200077,
    "companyId": 1,
    "trackingNo": "YK-2026-R0002877",
    "shipFrom": "Ankara İade Merkezi",
    "shipTo": {
      "district": "Yenimahalle",
      "province": "Ankara"
    },
    "requestDate": "2026-05-27T04:27:22",
    "status": "ReturnReceivedByProvider",
    "referenceId": "REF-R05691",
    "packageNo": "PKT-R000021",
    "customerName": "Onur Arslan",
    "channel": "Trendyol",
    "reason": "diger",
    "pickup": true,
    "note": "",
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        4,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 1
          },
    "statusHistory": [
      {
        "status": "ReturnCodeCreated",
        "at": "2026-05-27T01:27:22.000Z"
      },
      {
        "status": "ReturnOnTheWay",
        "at": "2026-06-12T11:58:14.666Z"
      },
      {
        "status": "OnReturnAddress",
        "at": "2026-06-30T21:49:37.653Z"
      },
      {
        "status": "ReturnReceivedByProvider",
        "at": "2026-07-15T09:00:00.000Z"
      }
    ]
  },
  {
    "id": 22,
    "returnNo": 9300022,
    "orderNo": 61200066,
    "companyId": 6,
    "trackingNo": "DHL-2026-R0003014",
    "shipFrom": "İzmir İade Merkezi",
    "shipTo": {
      "district": "Çukurova",
      "province": "Adana"
    },
    "requestDate": "2026-05-30T14:22:48",
    "status": "ReturnReceivedByProvider",
    "referenceId": "REF-R05962",
    "packageNo": "PKT-R000022",
    "customerName": "Mehmet Koç",
    "channel": "Trendyol",
    "reason": "yanlis_urun",
    "pickup": true,
    "note": "",
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        4,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 6,
          "companyName": "DHL eCommerce",
          "metrics": {
            "cost": 0.29268292682926833,
            "deliveryTime": 0.6666666666666665,
            "successRate": 0,
            "damagedRate": 0.2592592592592593,
            "avgPickupHours": 0.8538899430740037,
            "costDiffPct": 0.9922127873486873
          },
          "combined": 0.4170402640088454
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 6
          },
    "statusHistory": [
      {
        "status": "ReturnCodeCreated",
        "at": "2026-05-30T11:22:48.000Z"
      },
      {
        "status": "ReturnOnTheWay",
        "at": "2026-06-15T16:37:08.640Z"
      },
      {
        "status": "OnReturnAddress",
        "at": "2026-07-03T06:54:24.240Z"
      },
      {
        "status": "ReturnReceivedByProvider",
        "at": "2026-07-13T01:55:08.400Z"
      }
    ]
  },
  {
    "id": 23,
    "returnNo": 9300023,
    "orderNo": 61200068,
    "companyId": 1,
    "trackingNo": "YK-2026-R0003151",
    "shipFrom": "Bursa İade Merkezi",
    "shipTo": {
      "district": "Kocasinan",
      "province": "Kayseri"
    },
    "requestDate": "2026-06-04T00:37:07",
    "status": "ReturnReceivedByProvider",
    "referenceId": "REF-R06233",
    "packageNo": "PKT-R000023",
    "customerName": "Kaan Bulut",
    "channel": "Hepsiburada",
    "reason": "kusurlu",
    "pickup": true,
    "note": "",
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        4,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 1
          },
    "statusHistory": [
      {
        "status": "ReturnCodeCreated",
        "at": "2026-06-03T21:37:07.000Z"
      },
      {
        "status": "ReturnOnTheWay",
        "at": "2026-06-19T09:13:39.586Z"
      },
      {
        "status": "OnReturnAddress",
        "at": "2026-06-28T15:31:46.223Z"
      },
      {
        "status": "ReturnReceivedByProvider",
        "at": "2026-07-14T23:02:46.270Z"
      }
    ]
  },
  {
    "id": 24,
    "returnNo": 9300024,
    "orderNo": 61200096,
    "companyId": 7,
    "trackingNo": "HRZ-2026-R0003288",
    "shipFrom": "İstanbul İade Merkezi",
    "shipTo": {
      "district": "Seyhan",
      "province": "Adana"
    },
    "requestDate": "2026-06-05T15:49:09",
    "status": "ReturnReceivedByProvider",
    "referenceId": "REF-R06504",
    "packageNo": "PKT-R000024",
    "customerName": "Serkan Kurt",
    "channel": "Trendyol",
    "reason": "begenmedim",
    "pickup": true,
    "note": "",
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        4,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 7,
          "companyName": "Horoz Lojistik",
          "metrics": {
            "cost": 0.5,
            "deliveryTime": 0.09999999999999996,
            "successRate": 0.6471306471306472,
            "damagedRate": 1,
            "avgPickupHours": 0.6997518610421837,
            "costDiffPct": 0.9449840836312517
          },
          "combined": 0.5712562562500053
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 7
          },
    "statusHistory": [
      {
        "status": "ReturnCodeCreated",
        "at": "2026-06-05T12:49:09.000Z"
      },
      {
        "status": "ReturnOnTheWay",
        "at": "2026-06-21T04:55:01.060Z"
      },
      {
        "status": "OnReturnAddress",
        "at": "2026-06-30T12:01:32.960Z"
      },
      {
        "status": "ReturnReceivedByProvider",
        "at": "2026-07-15T09:00:00.000Z"
      }
    ]
  },
  {
    "id": 25,
    "returnNo": 9300025,
    "orderNo": 61200075,
    "companyId": 1,
    "trackingNo": "YK-2026-R0003425",
    "shipFrom": "Ankara İade Merkezi",
    "shipTo": {
      "district": "Meram",
      "province": "Konya"
    },
    "requestDate": "2026-06-06T06:09:15",
    "status": "ReturnReceivedByProvider",
    "referenceId": "REF-R06775",
    "packageNo": "PKT-R000025",
    "customerName": "Fatma Aydın",
    "channel": "Kendi Web Sitesi",
    "reason": "degisim",
    "pickup": true,
    "note": "",
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        4,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 1
          },
    "statusHistory": [
      {
        "status": "ReturnCodeCreated",
        "at": "2026-06-06T03:09:15.000Z"
      },
      {
        "status": "ReturnOnTheWay",
        "at": "2026-06-22T08:27:01.600Z"
      },
      {
        "status": "OnReturnAddress",
        "at": "2026-07-01T21:37:58.550Z"
      },
      {
        "status": "ReturnReceivedByProvider",
        "at": "2026-07-15T09:00:00.000Z"
      }
    ]
  },
  {
    "id": 26,
    "returnNo": 9300026,
    "orderNo": 61200070,
    "companyId": 2,
    "trackingNo": "ARAS-2026-R0003562",
    "shipFrom": "İzmir İade Merkezi",
    "shipTo": {
      "district": "Kocasinan",
      "province": "Kayseri"
    },
    "requestDate": "2026-06-09T15:20:19",
    "status": "ReturnReceivedByProvider",
    "referenceId": "REF-R07046",
    "packageNo": "PKT-R000026",
    "customerName": "Gizem Bulut",
    "channel": "Hepsiburada",
    "reason": "yanlis_urun",
    "pickup": true,
    "note": "",
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        4,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 2,
          "companyName": "Aras Kargo",
          "metrics": {
            "cost": 0.5853658536585367,
            "deliveryTime": 0.2800000000000001,
            "successRate": 0.679563492063492,
            "damagedRate": 0.4666666666666667,
            "avgPickupHours": 1,
            "costDiffPct": 1
          },
          "combined": 0.6188990030971738
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 2
          },
    "statusHistory": [
      {
        "status": "ReturnCodeCreated",
        "at": "2026-06-09T12:20:19.000Z"
      },
      {
        "status": "ReturnOnTheWay",
        "at": "2026-06-18T22:58:45.996Z"
      },
      {
        "status": "OnReturnAddress",
        "at": "2026-07-04T03:19:33.953Z"
      },
      {
        "status": "ReturnReceivedByProvider",
        "at": "2026-07-13T05:21:37.140Z"
      }
    ]
  },
  {
    "id": 27,
    "returnNo": 9300027,
    "orderNo": 61200102,
    "companyId": 4,
    "trackingNo": "PTT-2026-R0003699",
    "shipFrom": "Bursa İade Merkezi",
    "shipTo": {
      "district": "Ortahisar",
      "province": "Trabzon"
    },
    "requestDate": "2026-06-11T05:01:37",
    "status": "ReturnOnTheWay",
    "referenceId": "REF-R07317",
    "packageNo": "PKT-R000027",
    "customerName": "Barış Bulut",
    "channel": "Trendyol",
    "reason": "diger",
    "pickup": true,
    "note": "",
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        4,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 4,
          "companyName": "PTT Kargo",
          "metrics": {
            "cost": 0.5,
            "deliveryTime": 1,
            "successRate": 1,
            "damagedRate": 0.2592592592592593,
            "avgPickupHours": 0.6838709677419356,
            "costDiffPct": 0.9375970850179929
          },
          "combined": 0.7630727312019187
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 4
          },
    "statusHistory": [
      {
        "status": "ReturnCodeCreated",
        "at": "2026-06-11T02:01:37.000Z"
      },
      {
        "status": "ReturnOnTheWay",
        "at": "2026-07-13T15:51:04.850Z"
      }
    ]
  },
  {
    "id": 28,
    "returnNo": 9300028,
    "orderNo": 61200074,
    "companyId": 3,
    "trackingNo": "MNG-2026-R0003836",
    "shipFrom": "İstanbul İade Merkezi",
    "shipTo": {
      "district": "Yıldırım",
      "province": "Bursa"
    },
    "requestDate": "2026-06-11T22:59:12",
    "status": "ReturnOnTheWay",
    "referenceId": "REF-R07588",
    "packageNo": "PKT-R000028",
    "customerName": "Aslı Aksoy",
    "channel": "Trendyol",
    "reason": "begenmedim",
    "pickup": true,
    "note": "",
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        4,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 3,
          "companyName": "MNG Kargo",
          "metrics": {
            "cost": 0.5,
            "deliveryTime": 0.5199999999999999,
            "successRate": 0.679563492063492,
            "damagedRate": 0.7333333333333334,
            "avgPickupHours": 0,
            "costDiffPct": 0
          },
          "combined": 0.47222420634920637
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 3
          },
    "statusHistory": [
      {
        "status": "ReturnCodeCreated",
        "at": "2026-06-11T19:59:12.000Z"
      },
      {
        "status": "ReturnOnTheWay",
        "at": "2026-07-14T08:50:58.560Z"
      }
    ]
  },
  {
    "id": 29,
    "returnNo": 9300029,
    "orderNo": 61200094,
    "companyId": 6,
    "trackingNo": "DHL-2026-R0003973",
    "shipFrom": "Ankara İade Merkezi",
    "shipTo": {
      "district": "Yüreğir",
      "province": "Adana"
    },
    "requestDate": "2026-06-14T00:24:11",
    "status": "ReturnOnTheWay",
    "referenceId": "REF-R07859",
    "packageNo": "PKT-R000029",
    "customerName": "Ayşe Doğan",
    "channel": "Trendyol",
    "reason": "begenmedim",
    "pickup": true,
    "note": "",
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        4,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 6,
          "companyName": "DHL eCommerce",
          "metrics": {
            "cost": 0.29268292682926833,
            "deliveryTime": 0.6666666666666665,
            "successRate": 0,
            "damagedRate": 0.2592592592592593,
            "avgPickupHours": 0.8538899430740037,
            "costDiffPct": 0.9922127873486873
          },
          "combined": 0.4170402640088454
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 6
          },
    "statusHistory": [
      {
        "status": "ReturnCodeCreated",
        "at": "2026-06-13T21:24:11.000Z"
      },
      {
        "status": "ReturnOnTheWay",
        "at": "2026-07-15T01:26:38.510Z"
      }
    ]
  },
  {
    "id": 30,
    "returnNo": 9300030,
    "orderNo": 61200083,
    "companyId": 8,
    "trackingNo": "HPS-2026-R0004110",
    "shipFrom": "İzmir İade Merkezi",
    "shipTo": {
      "district": "Keçiören",
      "province": "Ankara"
    },
    "requestDate": "2026-06-14T08:25:56",
    "status": "ReturnOnTheWay",
    "referenceId": "REF-R08130",
    "packageNo": "PKT-R000030",
    "customerName": "Ebru Aksoy",
    "channel": "Trendyol",
    "reason": "degisim",
    "pickup": true,
    "note": "",
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        4,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 8,
          "companyName": "Hepsijet",
          "metrics": {
            "cost": 1,
            "deliveryTime": 0,
            "successRate": 0.19047619047619038,
            "damagedRate": 1,
            "avgPickupHours": 0.6838709677419356,
            "costDiffPct": 0.9556096935478475
          },
          "combined": 0.561567113748026
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 8
          },
    "statusHistory": [
      {
        "status": "ReturnCodeCreated",
        "at": "2026-06-14T05:25:56.000Z"
      },
      {
        "status": "ReturnOnTheWay",
        "at": "2026-07-15T09:00:00.000Z"
      }
    ]
  },
  {
    "id": 31,
    "returnNo": 9300031,
    "orderNo": 61200111,
    "companyId": 1,
    "trackingNo": "YK-2026-R0004247",
    "shipFrom": "Bursa İade Merkezi",
    "shipTo": {
      "district": "Selçuklu",
      "province": "Konya"
    },
    "requestDate": "2026-06-15T03:41:53",
    "status": "ReturnOnTheWay",
    "referenceId": "REF-R08401",
    "packageNo": "PKT-R000031",
    "customerName": "Serkan Arslan",
    "channel": "Trendyol",
    "reason": "diger",
    "pickup": true,
    "note": "",
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        4,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 1
          },
    "statusHistory": [
      {
        "status": "ReturnCodeCreated",
        "at": "2026-06-15T00:41:53.000Z"
      },
      {
        "status": "ReturnOnTheWay",
        "at": "2026-07-15T09:00:00.000Z"
      }
    ]
  },
  {
    "id": 32,
    "returnNo": 9300032,
    "orderNo": 61200098,
    "companyId": 2,
    "trackingNo": "ARAS-2026-R0004384",
    "shipFrom": "İstanbul İade Merkezi",
    "shipTo": {
      "district": "Çiğli",
      "province": "İzmir"
    },
    "requestDate": "2026-06-16T21:15:22",
    "status": "ReturnOnTheWay",
    "referenceId": "REF-R08672",
    "packageNo": "PKT-R000032",
    "customerName": "Zeynep Demir",
    "channel": "N11",
    "reason": "kusurlu",
    "pickup": true,
    "note": "",
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        4,
        6,
        7,
        8,
        2
      ],
      "matchedRuleId": 4,
      "matchedRuleName": "Ege Bölgesi Standart",
      "matchedRuleSummary": "0–30 desi · İzmir",
      "ruleNarrowedCompanyIds": null,
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 4,
          "companyName": "PTT Kargo",
          "metrics": {
            "cost": 0.5,
            "deliveryTime": 1,
            "successRate": 1,
            "damagedRate": 0.2592592592592593,
            "avgPickupHours": 0.6838709677419356,
            "costDiffPct": 0.9375970850179929
          },
          "combined": 0.7630727312019187
        },
        {
          "companyId": 2,
          "companyName": "Aras Kargo",
          "metrics": {
            "cost": 0.5853658536585367,
            "deliveryTime": 0.2800000000000001,
            "successRate": 0.679563492063492,
            "damagedRate": 0.4666666666666667,
            "avgPickupHours": 1,
            "costDiffPct": 1
          },
          "combined": 0.6188990030971738
        },
        {
          "companyId": 7,
          "companyName": "Horoz Lojistik",
          "metrics": {
            "cost": 0.5,
            "deliveryTime": 0.09999999999999996,
            "successRate": 0.6471306471306472,
            "damagedRate": 1,
            "avgPickupHours": 0.6997518610421837,
            "costDiffPct": 0.9449840836312517
          },
          "combined": 0.5712562562500053
        },
        {
          "companyId": 8,
          "companyName": "Hepsijet",
          "metrics": {
            "cost": 1,
            "deliveryTime": 0,
            "successRate": 0.19047619047619038,
            "damagedRate": 1,
            "avgPickupHours": 0.6838709677419356,
            "costDiffPct": 0.9556096935478475
          },
          "combined": 0.561567113748026
        },
        {
          "companyId": 6,
          "companyName": "DHL eCommerce",
          "metrics": {
            "cost": 0.29268292682926833,
            "deliveryTime": 0.6666666666666665,
            "successRate": 0,
            "damagedRate": 0.2592592592592593,
            "avgPickupHours": 0.8538899430740037,
            "costDiffPct": 0.9922127873486873
          },
          "combined": 0.4170402640088454
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 2
          },
    "statusHistory": [
      {
        "status": "ReturnCodeCreated",
        "at": "2026-06-16T18:15:22.000Z"
      },
      {
        "status": "ReturnOnTheWay",
        "at": "2026-07-15T09:00:00.000Z"
      }
    ]
  },
  {
    "id": 33,
    "returnNo": 9300033,
    "orderNo": 61200090,
    "companyId": 2,
    "trackingNo": "ARAS-2026-R0004521",
    "shipFrom": "Ankara İade Merkezi",
    "shipTo": {
      "district": "Şahinbey",
      "province": "Gaziantep"
    },
    "requestDate": "2026-06-18T13:21:21",
    "status": "ReturnCodeCreated",
    "referenceId": "REF-R08943",
    "packageNo": "PKT-R000033",
    "customerName": "Kerem Özdemir",
    "channel": "Kendi Web Sitesi",
    "reason": "degisim",
    "pickup": true,
    "note": "",
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        4,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 2,
          "companyName": "Aras Kargo",
          "metrics": {
            "cost": 0.5853658536585367,
            "deliveryTime": 0.2800000000000001,
            "successRate": 0.679563492063492,
            "damagedRate": 0.4666666666666667,
            "avgPickupHours": 1,
            "costDiffPct": 1
          },
          "combined": 0.6188990030971738
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 2
          },
    "statusHistory": [
      {
        "status": "ReturnCodeCreated",
        "at": "2026-06-18T10:21:21.000Z"
      }
    ]
  },
  {
    "id": 34,
    "returnNo": 9300034,
    "orderNo": 61200107,
    "companyId": 7,
    "trackingNo": "HRZ-2026-R0004658",
    "shipFrom": "İzmir İade Merkezi",
    "shipTo": {
      "district": "Seyhan",
      "province": "Adana"
    },
    "requestDate": "2026-06-21T23:44:44",
    "status": "ReturnCodeCreated",
    "referenceId": "REF-R09214",
    "packageNo": "PKT-R000034",
    "customerName": "Gül Demir",
    "channel": "Hepsiburada",
    "reason": "yanlis_urun",
    "pickup": true,
    "note": "",
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        4,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 7,
          "companyName": "Horoz Lojistik",
          "metrics": {
            "cost": 0.5,
            "deliveryTime": 0.09999999999999996,
            "successRate": 0.6471306471306472,
            "damagedRate": 1,
            "avgPickupHours": 0.6997518610421837,
            "costDiffPct": 0.9449840836312517
          },
          "combined": 0.5712562562500053
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 7
          },
    "statusHistory": [
      {
        "status": "ReturnCodeCreated",
        "at": "2026-06-21T20:44:44.000Z"
      }
    ]
  },
  {
    "id": 35,
    "returnNo": 9300035,
    "orderNo": 61200116,
    "companyId": 3,
    "trackingNo": "MNG-2026-R0004795",
    "shipFrom": "Bursa İade Merkezi",
    "shipTo": {
      "district": "Akçaabat",
      "province": "Trabzon"
    },
    "requestDate": "2026-06-23T02:33:36",
    "status": "ReturnCodeCreated",
    "referenceId": "REF-R09485",
    "packageNo": "PKT-R000035",
    "customerName": "Deniz Kurt",
    "channel": "Hepsiburada",
    "reason": "diger",
    "pickup": true,
    "note": "",
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        4,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 3,
          "companyName": "MNG Kargo",
          "metrics": {
            "cost": 0.5,
            "deliveryTime": 0.5199999999999999,
            "successRate": 0.679563492063492,
            "damagedRate": 0.7333333333333334,
            "avgPickupHours": 0,
            "costDiffPct": 0
          },
          "combined": 0.47222420634920637
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 3
          },
    "statusHistory": [
      {
        "status": "ReturnCodeCreated",
        "at": "2026-06-22T23:33:36.000Z"
      }
    ]
  },
  {
    "id": 36,
    "returnNo": 9300036,
    "orderNo": 61200108,
    "companyId": 3,
    "trackingNo": "MNG-2026-R0004932",
    "shipFrom": "İstanbul İade Merkezi",
    "shipTo": {
      "district": "Seyhan",
      "province": "Adana"
    },
    "requestDate": "2026-06-24T08:46:59",
    "status": "ReturnCodeCreated",
    "referenceId": "REF-R09756",
    "packageNo": "PKT-R000036",
    "customerName": "Barış Özdemir",
    "channel": "Trendyol",
    "reason": "kusurlu",
    "pickup": true,
    "note": "",
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        4,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 3,
          "companyName": "MNG Kargo",
          "metrics": {
            "cost": 0.5,
            "deliveryTime": 0.5199999999999999,
            "successRate": 0.679563492063492,
            "damagedRate": 0.7333333333333334,
            "avgPickupHours": 0,
            "costDiffPct": 0
          },
          "combined": 0.47222420634920637
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 3
          },
    "statusHistory": [
      {
        "status": "ReturnCodeCreated",
        "at": "2026-06-24T05:46:59.000Z"
      }
    ]
  },
  {
    "id": 37,
    "returnNo": 9300037,
    "orderNo": 61200127,
    "companyId": 1,
    "trackingNo": "YK-2026-R0005069",
    "shipFrom": "Ankara İade Merkezi",
    "shipTo": {
      "district": "Kocasinan",
      "province": "Kayseri"
    },
    "requestDate": "2026-06-25T07:58:48",
    "status": "ReturnCodeCreated",
    "referenceId": "REF-R10027",
    "packageNo": "PKT-R000037",
    "customerName": "Ceren Erdoğan",
    "channel": "Trendyol",
    "reason": "kusurlu",
    "pickup": true,
    "note": "",
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        4,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 1
          },
    "statusHistory": [
      {
        "status": "ReturnCodeCreated",
        "at": "2026-06-25T04:58:48.000Z"
      }
    ]
  },
  {
    "id": 38,
    "returnNo": 9300038,
    "orderNo": 61200101,
    "companyId": 3,
    "trackingNo": "MNG-2026-R0005206",
    "shipFrom": "İzmir İade Merkezi",
    "shipTo": {
      "district": "Mamak",
      "province": "Ankara"
    },
    "requestDate": "2026-06-26T09:09:09",
    "status": "ReturnCodeCreated",
    "referenceId": "REF-R10298",
    "packageNo": "PKT-R000038",
    "customerName": "Kerem Aydın",
    "channel": "N11",
    "reason": "degisim",
    "pickup": true,
    "note": "",
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        4,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 3,
          "companyName": "MNG Kargo",
          "metrics": {
            "cost": 0.5,
            "deliveryTime": 0.5199999999999999,
            "successRate": 0.679563492063492,
            "damagedRate": 0.7333333333333334,
            "avgPickupHours": 0,
            "costDiffPct": 0
          },
          "combined": 0.47222420634920637
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 3
          },
    "statusHistory": [
      {
        "status": "ReturnCodeCreated",
        "at": "2026-06-26T06:09:09.000Z"
      }
    ]
  },
  {
    "id": 39,
    "returnNo": 9300039,
    "orderNo": 61200113,
    "companyId": 3,
    "trackingNo": "MNG-2026-R0005343",
    "shipFrom": "Bursa İade Merkezi",
    "shipTo": {
      "district": "Seyhan",
      "province": "Adana"
    },
    "requestDate": "2026-06-30T10:07:29",
    "status": "ReturnCodeCreated",
    "referenceId": "REF-R10569",
    "packageNo": "PKT-R000039",
    "customerName": "Yusuf Şahin",
    "channel": "Trendyol",
    "reason": "diger",
    "pickup": true,
    "note": "",
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        4,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 3,
          "companyName": "MNG Kargo",
          "metrics": {
            "cost": 0.5,
            "deliveryTime": 0.5199999999999999,
            "successRate": 0.679563492063492,
            "damagedRate": 0.7333333333333334,
            "avgPickupHours": 0,
            "costDiffPct": 0
          },
          "combined": 0.47222420634920637
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 3
          },
    "statusHistory": [
      {
        "status": "ReturnCodeCreated",
        "at": "2026-06-30T07:07:29.000Z"
      }
    ]
  },
  {
    "id": 40,
    "returnNo": 9300040,
    "orderNo": 61200114,
    "companyId": 3,
    "trackingNo": "MNG-2026-R0005480",
    "shipFrom": "İstanbul İade Merkezi",
    "shipTo": {
      "district": "Şişli",
      "province": "İstanbul"
    },
    "requestDate": "2026-06-30T19:24:30",
    "status": "ReturnCodeCreated",
    "referenceId": "REF-R10840",
    "packageNo": "PKT-R000040",
    "customerName": "Pınar Çelik",
    "channel": "Trendyol",
    "reason": "degisim",
    "pickup": true,
    "note": "",
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        4,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 3,
          "companyName": "MNG Kargo",
          "metrics": {
            "cost": 0.5,
            "deliveryTime": 0.5199999999999999,
            "successRate": 0.679563492063492,
            "damagedRate": 0.7333333333333334,
            "avgPickupHours": 0,
            "costDiffPct": 0
          },
          "combined": 0.47222420634920637
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 3
          },
    "statusHistory": [
      {
        "status": "ReturnCodeCreated",
        "at": "2026-06-30T16:24:30.000Z"
      }
    ]
  },
  {
    "id": 41,
    "returnNo": 9300041,
    "orderNo": 61200128,
    "companyId": 2,
    "trackingNo": "ARAS-2026-R0005617",
    "shipFrom": "Ankara İade Merkezi",
    "shipTo": {
      "district": "Akçaabat",
      "province": "Trabzon"
    },
    "requestDate": "2026-07-05T16:51:47",
    "status": "ReturnCodeCreated",
    "referenceId": "REF-R11111",
    "packageNo": "PKT-R000041",
    "customerName": "Ceren Öztürk",
    "channel": "Trendyol",
    "reason": "diger",
    "pickup": true,
    "note": "",
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        4,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 2,
          "companyName": "Aras Kargo",
          "metrics": {
            "cost": 0.5853658536585367,
            "deliveryTime": 0.2800000000000001,
            "successRate": 0.679563492063492,
            "damagedRate": 0.4666666666666667,
            "avgPickupHours": 1,
            "costDiffPct": 1
          },
          "combined": 0.6188990030971738
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 2
          },
    "statusHistory": [
      {
        "status": "ReturnCodeCreated",
        "at": "2026-07-05T13:51:47.000Z"
      }
    ]
  },
  {
    "id": 42,
    "returnNo": 9300042,
    "orderNo": 61200129,
    "companyId": 4,
    "trackingNo": "PTT-2026-R0005754",
    "shipFrom": "İzmir İade Merkezi",
    "shipTo": {
      "district": "Çiğli",
      "province": "İzmir"
    },
    "requestDate": "2026-07-08T15:00:00",
    "status": "ReturnCodeCreated",
    "referenceId": "REF-R11382",
    "packageNo": "PKT-R000042",
    "customerName": "Ceren Şimşek",
    "channel": "Trendyol",
    "reason": "yanlis_urun",
    "pickup": true,
    "note": "",
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        4,
        6,
        7,
        8
      ],
      "matchedRuleId": 4,
      "matchedRuleName": "Ege Bölgesi Standart",
      "matchedRuleSummary": "0–30 desi · İzmir",
      "ruleNarrowedCompanyIds": null,
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 4,
          "companyName": "PTT Kargo",
          "metrics": {
            "cost": 0.5,
            "deliveryTime": 1,
            "successRate": 1,
            "damagedRate": 0.2592592592592593,
            "avgPickupHours": 0.6838709677419356,
            "costDiffPct": 0.9375970850179929
          },
          "combined": 0.7630727312019187
        },
        {
          "companyId": 7,
          "companyName": "Horoz Lojistik",
          "metrics": {
            "cost": 0.5,
            "deliveryTime": 0.09999999999999996,
            "successRate": 0.6471306471306472,
            "damagedRate": 1,
            "avgPickupHours": 0.6997518610421837,
            "costDiffPct": 0.9449840836312517
          },
          "combined": 0.5712562562500053
        },
        {
          "companyId": 8,
          "companyName": "Hepsijet",
          "metrics": {
            "cost": 1,
            "deliveryTime": 0,
            "successRate": 0.19047619047619038,
            "damagedRate": 1,
            "avgPickupHours": 0.6838709677419356,
            "costDiffPct": 0.9556096935478475
          },
          "combined": 0.561567113748026
        },
        {
          "companyId": 6,
          "companyName": "DHL eCommerce",
          "metrics": {
            "cost": 0.29268292682926833,
            "deliveryTime": 0.6666666666666665,
            "successRate": 0,
            "damagedRate": 0.2592592592592593,
            "avgPickupHours": 0.8538899430740037,
            "costDiffPct": 0.9922127873486873
          },
          "combined": 0.4170402640088454
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 4
          },
    "statusHistory": [
      {
        "status": "ReturnCodeCreated",
        "at": "2026-07-08T12:00:00.000Z"
      }
    ]
  }
]

export interface TransferItem {
  id: number
  transferNo: number
  dispatchNo: number
  fromNodeId: number
  toNodeId: number
  companyId: number
  trackingNo: string
  referenceId: string
  packageNo: string
  status: ShipmentStatus
  desi?: number
  note: string
  createdAt: string
  productType?: string
  routingDecision?: ShipmentRoutingDecision
  statusHistory: { status: ShipmentStatus; at: string }[]
}

export const SEED_TRANSFERS: TransferItem[] = [
  {
    "id": 1,
    "transferNo": 7100001,
    "dispatchNo": 5100001,
    "fromNodeId": 4,
    "toNodeId": 2,
    "companyId": 1,
    "trackingNo": "YK-TR-200041",
    "referenceId": "REF-T10271",
    "packageNo": "PKT-T000001",
    "status": "DeliveredToStore",
    "desi": 21,
    "note": "",
    "createdAt": "2026-04-10T09:40:00",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-04-10T06:40:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-04-10T08:24:24.000Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-04-10T11:37:00.000Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-04-10T14:49:36.000Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-04-10T18:02:12.000Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-04-10T21:14:48.000Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-04-11T00:27:24.000Z"
      },
      {
        "status": "DeliveredToStore",
        "at": "2026-04-11T03:40:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 1
          }
  },
  {
    "id": 2,
    "transferNo": 7100002,
    "dispatchNo": 5100002,
    "fromNodeId": 9,
    "toNodeId": 13,
    "companyId": 2,
    "trackingNo": "ARAS-TR-200082",
    "referenceId": "REF-T10542",
    "packageNo": "PKT-T000002",
    "status": "DeliveredToStore",
    "desi": 40,
    "note": "",
    "createdAt": "2026-04-13T05:48:00",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-04-13T02:48:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-04-13T05:03:46.285Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-04-13T08:38:44.571Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-04-13T12:13:42.857Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-04-13T15:48:41.142Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-04-13T19:23:39.428Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-04-13T22:58:37.714Z"
      },
      {
        "status": "DeliveredToStore",
        "at": "2026-04-14T00:48:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 2,
      "matchedRuleName": "Yüksek Desi - Ağır Kargo",
      "matchedRuleSummary": "30–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        7
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 2,
          "companyName": "Aras Kargo",
          "metrics": {
            "cost": 0.5853658536585367,
            "deliveryTime": 0.2800000000000001,
            "successRate": 0.679563492063492,
            "damagedRate": 0.4666666666666667,
            "avgPickupHours": 1,
            "costDiffPct": 1
          },
          "combined": 0.6188990030971738
        },
        {
          "companyId": 7,
          "companyName": "Horoz Lojistik",
          "metrics": {
            "cost": 0.5,
            "deliveryTime": 0.09999999999999996,
            "successRate": 0.6471306471306472,
            "damagedRate": 1,
            "avgPickupHours": 0.6997518610421837,
            "costDiffPct": 0.9449840836312517
          },
          "combined": 0.5712562562500053
        }
      ],
      "chosenCompanyId": 2
          }
  },
  {
    "id": 3,
    "transferNo": 7100003,
    "dispatchNo": 5100003,
    "fromNodeId": 15,
    "toNodeId": 3,
    "companyId": 1,
    "trackingNo": "YK-TR-200123",
    "referenceId": "REF-T10813",
    "packageNo": "PKT-T000003",
    "status": "DeliveredToStore",
    "desi": 29,
    "note": "",
    "createdAt": "2026-04-13T06:07:00",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-04-13T03:07:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-04-13T05:56:32.571Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-04-13T09:55:05.142Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-04-13T13:53:37.714Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-04-13T17:52:10.285Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-04-13T17:56:06.857Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-04-13T21:54:39.428Z"
      },
      {
        "status": "DeliveredToStore",
        "at": "2026-04-14T01:53:12.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 1
          }
  },
  {
    "id": 4,
    "transferNo": 7100004,
    "dispatchNo": 5100004,
    "fromNodeId": 14,
    "toNodeId": 9,
    "companyId": 3,
    "trackingNo": "MNG-TR-200164",
    "referenceId": "REF-T11084",
    "packageNo": "PKT-T000004",
    "status": "DeliveredToStore",
    "desi": 20,
    "note": "",
    "createdAt": "2026-04-14T10:11:00",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-04-14T07:11:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-04-14T10:36:42.857Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-04-14T15:00:01.714Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-04-14T19:23:20.571Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-04-14T19:41:51.428Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-04-15T00:05:10.285Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-04-15T04:28:29.142Z"
      },
      {
        "status": "DeliveredToStore",
        "at": "2026-04-15T07:11:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 3,
          "companyName": "MNG Kargo",
          "metrics": {
            "cost": 0.5,
            "deliveryTime": 0.5199999999999999,
            "successRate": 0.679563492063492,
            "damagedRate": 0.7333333333333334,
            "avgPickupHours": 0,
            "costDiffPct": 0
          },
          "combined": 0.47222420634920637
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 3
          }
  },
  {
    "id": 5,
    "transferNo": 7100005,
    "dispatchNo": 5100005,
    "fromNodeId": 6,
    "toNodeId": 9,
    "companyId": 1,
    "trackingNo": "YK-TR-200205",
    "referenceId": "REF-T11355",
    "packageNo": "PKT-T000005",
    "status": "DeliveredToStore",
    "desi": 36,
    "note": "",
    "createdAt": "2026-04-14T10:32:00",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-04-14T07:32:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-04-14T11:36:17.142Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-04-14T16:25:34.285Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-04-14T16:59:51.428Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-04-14T21:49:08.571Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-04-15T02:38:25.714Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-04-15T03:12:42.857Z"
      },
      {
        "status": "DeliveredToStore",
        "at": "2026-04-15T08:02:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 2,
      "matchedRuleName": "Yüksek Desi - Ağır Kargo",
      "matchedRuleSummary": "30–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        7
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 7,
          "companyName": "Horoz Lojistik",
          "metrics": {
            "cost": 0.5,
            "deliveryTime": 0.09999999999999996,
            "successRate": 0.6471306471306472,
            "damagedRate": 1,
            "avgPickupHours": 0.6997518610421837,
            "costDiffPct": 0.9449840836312517
          },
          "combined": 0.5712562562500053
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 1
          }
  },
  {
    "id": 6,
    "transferNo": 7100006,
    "dispatchNo": 5100006,
    "fromNodeId": 13,
    "toNodeId": 1,
    "companyId": 3,
    "trackingNo": "MNG-TR-200246",
    "referenceId": "REF-T11626",
    "packageNo": "PKT-T000006",
    "status": "DeliveredToStore",
    "desi": 30,
    "note": "",
    "createdAt": "2026-04-17T06:11:00",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-04-17T03:11:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-04-17T07:56:15.428Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-04-17T08:47:30.857Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-04-17T14:03:58.285Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-04-17T19:20:25.714Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-04-17T20:11:41.142Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-04-18T01:28:08.571Z"
      },
      {
        "status": "DeliveredToStore",
        "at": "2026-04-18T05:11:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 2,
      "matchedRuleName": "Yüksek Desi - Ağır Kargo",
      "matchedRuleSummary": "30–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        7
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 7,
          "companyName": "Horoz Lojistik",
          "metrics": {
            "cost": 0.5,
            "deliveryTime": 0.09999999999999996,
            "successRate": 0.6471306471306472,
            "damagedRate": 1,
            "avgPickupHours": 0.6997518610421837,
            "costDiffPct": 0.9449840836312517
          },
          "combined": 0.5712562562500053
        },
        {
          "companyId": 3,
          "companyName": "MNG Kargo",
          "metrics": {
            "cost": 0.5,
            "deliveryTime": 0.5199999999999999,
            "successRate": 0.679563492063492,
            "damagedRate": 0.7333333333333334,
            "avgPickupHours": 0,
            "costDiffPct": 0
          },
          "combined": 0.47222420634920637
        }
      ],
      "chosenCompanyId": 3
          }
  },
  {
    "id": 7,
    "transferNo": 7100007,
    "dispatchNo": 5100007,
    "fromNodeId": 13,
    "toNodeId": 11,
    "companyId": 2,
    "trackingNo": "ARAS-TR-200287",
    "referenceId": "REF-T11897",
    "packageNo": "PKT-T000007",
    "status": "DeliveredToStore",
    "desi": 33,
    "note": "",
    "createdAt": "2026-04-17T13:55:00",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-04-17T10:55:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-04-17T16:23:37.714Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-04-17T17:33:03.428Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-04-17T23:17:53.142Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-04-18T00:27:18.857Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-04-18T06:12:08.571Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-04-18T11:56:58.285Z"
      },
      {
        "status": "DeliveredToStore",
        "at": "2026-04-18T13:06:24.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 2,
      "matchedRuleName": "Yüksek Desi - Ağır Kargo",
      "matchedRuleSummary": "30–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        7
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 2,
          "companyName": "Aras Kargo",
          "metrics": {
            "cost": 0.5853658536585367,
            "deliveryTime": 0.2800000000000001,
            "successRate": 0.679563492063492,
            "damagedRate": 0.4666666666666667,
            "avgPickupHours": 1,
            "costDiffPct": 1
          },
          "combined": 0.6188990030971738
        },
        {
          "companyId": 7,
          "companyName": "Horoz Lojistik",
          "metrics": {
            "cost": 0.5,
            "deliveryTime": 0.09999999999999996,
            "successRate": 0.6471306471306472,
            "damagedRate": 1,
            "avgPickupHours": 0.6997518610421837,
            "costDiffPct": 0.9449840836312517
          },
          "combined": 0.5712562562500053
        }
      ],
      "chosenCompanyId": 2
          }
  },
  {
    "id": 8,
    "transferNo": 7100008,
    "dispatchNo": 5100008,
    "fromNodeId": 3,
    "toNodeId": 2,
    "companyId": 2,
    "trackingNo": "ARAS-TR-200328",
    "referenceId": "REF-T12168",
    "packageNo": "PKT-T000008",
    "status": "DeliveredToStore",
    "desi": 30,
    "note": "",
    "createdAt": "2026-04-18T12:13:00",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-04-18T09:13:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-04-18T15:27:24.000Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-04-18T16:56:12.000Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-04-18T23:10:36.000Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-04-19T00:39:24.000Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-04-19T06:53:48.000Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-04-19T08:22:36.000Z"
      },
      {
        "status": "DeliveredToStore",
        "at": "2026-04-19T13:13:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 2,
      "matchedRuleName": "Yüksek Desi - Ağır Kargo",
      "matchedRuleSummary": "30–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        7
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 2,
          "companyName": "Aras Kargo",
          "metrics": {
            "cost": 0.5853658536585367,
            "deliveryTime": 0.2800000000000001,
            "successRate": 0.679563492063492,
            "damagedRate": 0.4666666666666667,
            "avgPickupHours": 1,
            "costDiffPct": 1
          },
          "combined": 0.6188990030971738
        },
        {
          "companyId": 7,
          "companyName": "Horoz Lojistik",
          "metrics": {
            "cost": 0.5,
            "deliveryTime": 0.09999999999999996,
            "successRate": 0.6471306471306472,
            "damagedRate": 1,
            "avgPickupHours": 0.6997518610421837,
            "costDiffPct": 0.9449840836312517
          },
          "combined": 0.5712562562500053
        }
      ],
      "chosenCompanyId": 2
          }
  },
  {
    "id": 9,
    "transferNo": 7100009,
    "dispatchNo": 5100009,
    "fromNodeId": 4,
    "toNodeId": 1,
    "companyId": 2,
    "trackingNo": "ARAS-TR-200369",
    "referenceId": "REF-T12439",
    "packageNo": "PKT-T000009",
    "status": "DeliveredToStore",
    "desi": 32,
    "note": "",
    "createdAt": "2026-04-19T10:28:00",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-04-19T07:28:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-04-19T09:34:46.285Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-04-19T16:19:56.571Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-04-19T18:09:18.857Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-04-20T00:54:29.142Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-04-20T02:43:51.428Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-04-20T09:29:01.714Z"
      },
      {
        "status": "DeliveredToStore",
        "at": "2026-04-20T11:18:24.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 2,
      "matchedRuleName": "Yüksek Desi - Ağır Kargo",
      "matchedRuleSummary": "30–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        7
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 2,
          "companyName": "Aras Kargo",
          "metrics": {
            "cost": 0.5853658536585367,
            "deliveryTime": 0.2800000000000001,
            "successRate": 0.679563492063492,
            "damagedRate": 0.4666666666666667,
            "avgPickupHours": 1,
            "costDiffPct": 1
          },
          "combined": 0.6188990030971738
        },
        {
          "companyId": 7,
          "companyName": "Horoz Lojistik",
          "metrics": {
            "cost": 0.5,
            "deliveryTime": 0.09999999999999996,
            "successRate": 0.6471306471306472,
            "damagedRate": 1,
            "avgPickupHours": 0.6997518610421837,
            "costDiffPct": 0.9449840836312517
          },
          "combined": 0.5712562562500053
        }
      ],
      "chosenCompanyId": 2
          }
  },
  {
    "id": 10,
    "transferNo": 7100010,
    "dispatchNo": 5100010,
    "fromNodeId": 11,
    "toNodeId": 15,
    "companyId": 1,
    "trackingNo": "YK-TR-200410",
    "referenceId": "REF-T12710",
    "packageNo": "PKT-T000010",
    "status": "DeliveredToStore",
    "desi": 10,
    "note": "",
    "createdAt": "2026-04-19T11:34:00",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-04-19T08:34:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-04-19T11:21:08.571Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-04-19T18:38:17.142Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-04-19T20:49:25.714Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-04-20T04:06:34.285Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-04-20T06:17:42.857Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-04-20T08:28:51.428Z"
      },
      {
        "status": "DeliveredToStore",
        "at": "2026-04-20T14:34:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 1
          }
  },
  {
    "id": 11,
    "transferNo": 7100011,
    "dispatchNo": 5100011,
    "fromNodeId": 10,
    "toNodeId": 8,
    "companyId": 1,
    "trackingNo": "YK-TR-200451",
    "referenceId": "REF-T12981",
    "packageNo": "PKT-T000011",
    "status": "DeliveredToStore",
    "desi": 27,
    "note": "",
    "createdAt": "2026-04-20T05:11:00",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-04-20T02:11:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-04-20T05:40:54.857Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-04-20T13:31:13.714Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-04-20T16:05:20.571Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-04-20T18:39:27.428Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-04-21T02:29:46.285Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-04-21T05:03:53.142Z"
      },
      {
        "status": "DeliveredToStore",
        "at": "2026-04-21T07:38:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 1
          }
  },
  {
    "id": 12,
    "transferNo": 7100012,
    "dispatchNo": 5100012,
    "fromNodeId": 6,
    "toNodeId": 3,
    "companyId": 2,
    "trackingNo": "ARAS-TR-200492",
    "referenceId": "REF-T13252",
    "packageNo": "PKT-T000012",
    "status": "DeliveredToStore",
    "desi": 34,
    "note": "",
    "createdAt": "2026-04-20T06:28:00",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-04-20T03:28:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-04-20T07:43:05.142Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-04-20T10:41:22.285Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-04-20T19:06:03.428Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-04-20T22:04:20.571Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-04-21T01:02:37.714Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-04-21T09:27:18.857Z"
      },
      {
        "status": "DeliveredToStore",
        "at": "2026-04-21T11:28:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 2,
      "matchedRuleName": "Yüksek Desi - Ağır Kargo",
      "matchedRuleSummary": "30–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        7
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 2,
          "companyName": "Aras Kargo",
          "metrics": {
            "cost": 0.5853658536585367,
            "deliveryTime": 0.2800000000000001,
            "successRate": 0.679563492063492,
            "damagedRate": 0.4666666666666667,
            "avgPickupHours": 1,
            "costDiffPct": 1
          },
          "combined": 0.6188990030971738
        },
        {
          "companyId": 7,
          "companyName": "Horoz Lojistik",
          "metrics": {
            "cost": 0.5,
            "deliveryTime": 0.09999999999999996,
            "successRate": 0.6471306471306472,
            "damagedRate": 1,
            "avgPickupHours": 0.6997518610421837,
            "costDiffPct": 0.9449840836312517
          },
          "combined": 0.5712562562500053
        }
      ],
      "chosenCompanyId": 2
          }
  },
  {
    "id": 13,
    "transferNo": 7100013,
    "dispatchNo": 5100013,
    "fromNodeId": 6,
    "toNodeId": 11,
    "companyId": 2,
    "trackingNo": "ARAS-TR-200533",
    "referenceId": "REF-T13523",
    "packageNo": "PKT-T000013",
    "status": "DeliveredToStore",
    "desi": 17,
    "note": "",
    "createdAt": "2026-04-20T07:47:00",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-04-20T04:47:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-04-20T09:49:39.428Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-04-20T13:13:18.857Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-04-20T16:36:58.285Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-04-21T01:37:13.714Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-04-21T05:00:53.142Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-04-21T08:24:32.571Z"
      },
      {
        "status": "DeliveredToStore",
        "at": "2026-04-21T11:48:12.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 2,
          "companyName": "Aras Kargo",
          "metrics": {
            "cost": 0.5853658536585367,
            "deliveryTime": 0.2800000000000001,
            "successRate": 0.679563492063492,
            "damagedRate": 0.4666666666666667,
            "avgPickupHours": 1,
            "costDiffPct": 1
          },
          "combined": 0.6188990030971738
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 2
          }
  },
  {
    "id": 14,
    "transferNo": 7100014,
    "dispatchNo": 5100014,
    "fromNodeId": 9,
    "toNodeId": 11,
    "companyId": 1,
    "trackingNo": "YK-TR-200574",
    "referenceId": "REF-T13794",
    "packageNo": "PKT-T000014",
    "status": "DeliveredToStore",
    "desi": 32,
    "note": "",
    "createdAt": "2026-04-20T12:49:00",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-04-20T09:49:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-04-20T15:41:37.714Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-04-20T19:31:51.428Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-04-20T23:22:05.142Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-04-21T03:12:18.857Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-04-21T12:49:20.571Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-04-21T16:39:34.285Z"
      },
      {
        "status": "DeliveredToStore",
        "at": "2026-04-21T19:49:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 2,
      "matchedRuleName": "Yüksek Desi - Ağır Kargo",
      "matchedRuleSummary": "30–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        7
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 7,
          "companyName": "Horoz Lojistik",
          "metrics": {
            "cost": 0.5,
            "deliveryTime": 0.09999999999999996,
            "successRate": 0.6471306471306472,
            "damagedRate": 1,
            "avgPickupHours": 0.6997518610421837,
            "costDiffPct": 0.9449840836312517
          },
          "combined": 0.5712562562500053
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 1
          }
  },
  {
    "id": 15,
    "transferNo": 7100015,
    "dispatchNo": 5100015,
    "fromNodeId": 7,
    "toNodeId": 3,
    "companyId": 1,
    "trackingNo": "YK-TR-200615",
    "referenceId": "REF-T14065",
    "packageNo": "PKT-T000015",
    "status": "DeliveredToStore",
    "desi": 16,
    "note": "",
    "createdAt": "2026-04-21T05:41:00",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-04-21T02:41:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-04-21T09:26:00.000Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-04-21T13:44:00.000Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-04-21T18:02:00.000Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-04-21T22:20:00.000Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-04-22T02:38:00.000Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-04-22T06:56:00.000Z"
      },
      {
        "status": "DeliveredToStore",
        "at": "2026-04-22T11:14:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 1
          }
  },
  {
    "id": 16,
    "transferNo": 7100016,
    "dispatchNo": 5100016,
    "fromNodeId": 7,
    "toNodeId": 3,
    "companyId": 2,
    "trackingNo": "ARAS-TR-200656",
    "referenceId": "REF-T14336",
    "packageNo": "PKT-T000016",
    "status": "OnTheWayBackToSender",
    "desi": 10,
    "note": "",
    "createdAt": "2026-04-22T13:55:00",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-04-22T10:55:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-05-19T07:25:24.000Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-06-08T10:48:12.000Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-06-28T14:11:00.000Z"
      },
      {
        "status": "OnTheWayBackToSender",
        "at": "2026-07-15T09:00:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 2,
          "companyName": "Aras Kargo",
          "metrics": {
            "cost": 0.5853658536585367,
            "deliveryTime": 0.2800000000000001,
            "successRate": 0.679563492063492,
            "damagedRate": 0.4666666666666667,
            "avgPickupHours": 1,
            "costDiffPct": 1
          },
          "combined": 0.6188990030971738
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 2
          }
  },
  {
    "id": 17,
    "transferNo": 7100017,
    "dispatchNo": 5100017,
    "fromNodeId": 12,
    "toNodeId": 2,
    "companyId": 1,
    "trackingNo": "YK-TR-200697",
    "referenceId": "REF-T14607",
    "packageNo": "PKT-T000017",
    "status": "DeliveredToStore",
    "desi": 25,
    "note": "",
    "createdAt": "2026-04-25T09:51:00",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-04-25T06:51:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-04-25T09:10:32.571Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-04-25T14:27:41.142Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-04-25T19:44:49.714Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-04-26T01:01:58.285Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-04-26T06:19:06.857Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-04-26T11:36:15.428Z"
      },
      {
        "status": "DeliveredToStore",
        "at": "2026-04-26T16:53:24.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 1
          }
  },
  {
    "id": 18,
    "transferNo": 7100018,
    "dispatchNo": 5100018,
    "fromNodeId": 3,
    "toNodeId": 8,
    "companyId": 7,
    "trackingNo": "HRZ-TR-200738",
    "referenceId": "REF-T14878",
    "packageNo": "PKT-T000018",
    "status": "DeliveredToStore",
    "desi": 18,
    "note": "",
    "createdAt": "2026-04-29T09:00:00",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-04-29T06:00:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-04-29T09:08:54.857Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-04-29T14:57:25.714Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-04-29T20:45:56.571Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-04-30T02:34:27.428Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-04-30T08:22:58.285Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-04-30T14:11:29.142Z"
      },
      {
        "status": "DeliveredToStore",
        "at": "2026-04-30T20:00:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 7,
          "companyName": "Horoz Lojistik",
          "metrics": {
            "cost": 0.5,
            "deliveryTime": 0.09999999999999996,
            "successRate": 0.6471306471306472,
            "damagedRate": 1,
            "avgPickupHours": 0.6997518610421837,
            "costDiffPct": 0.9449840836312517
          },
          "combined": 0.5712562562500053
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 7
          }
  },
  {
    "id": 19,
    "transferNo": 7100019,
    "dispatchNo": 5100019,
    "fromNodeId": 15,
    "toNodeId": 10,
    "companyId": 3,
    "trackingNo": "MNG-TR-200779",
    "referenceId": "REF-T15149",
    "packageNo": "PKT-T000019",
    "status": "DeliveredToStore",
    "desi": 8,
    "note": "",
    "createdAt": "2026-05-03T07:50:00",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-05-03T04:50:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-05-03T08:50:41.142Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-05-03T15:11:46.285Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-05-03T21:32:51.428Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-05-04T03:53:56.571Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-05-04T10:15:01.714Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-05-04T16:36:06.857Z"
      },
      {
        "status": "DeliveredToStore",
        "at": "2026-05-04T19:50:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 3,
          "companyName": "MNG Kargo",
          "metrics": {
            "cost": 0.5,
            "deliveryTime": 0.5199999999999999,
            "successRate": 0.679563492063492,
            "damagedRate": 0.7333333333333334,
            "avgPickupHours": 0,
            "costDiffPct": 0
          },
          "combined": 0.47222420634920637
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 3
          }
  },
  {
    "id": 20,
    "transferNo": 7100020,
    "dispatchNo": 5100020,
    "fromNodeId": 2,
    "toNodeId": 1,
    "companyId": 2,
    "trackingNo": "ARAS-TR-200820",
    "referenceId": "REF-T15420",
    "packageNo": "PKT-T000020",
    "status": "ShipmentCanceled",
    "desi": 21,
    "note": "",
    "createdAt": "2026-05-03T08:18:00",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-05-03T05:18:00.000Z"
      },
      {
        "status": "ShipmentCanceled",
        "at": "2026-05-03T07:15:36.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 2,
          "companyName": "Aras Kargo",
          "metrics": {
            "cost": 0.5853658536585367,
            "deliveryTime": 0.2800000000000001,
            "successRate": 0.679563492063492,
            "damagedRate": 0.4666666666666667,
            "avgPickupHours": 1,
            "costDiffPct": 1
          },
          "combined": 0.6188990030971738
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 2
          }
  },
  {
    "id": 21,
    "transferNo": 7100021,
    "dispatchNo": 5100021,
    "fromNodeId": 8,
    "toNodeId": 7,
    "companyId": 2,
    "trackingNo": "ARAS-TR-200861",
    "referenceId": "REF-T15691",
    "packageNo": "PKT-T000021",
    "status": "DeliveredToStore",
    "desi": 37,
    "note": "",
    "createdAt": "2026-05-05T09:11:00",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-05-05T06:11:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-05-05T12:02:25.714Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-05-05T19:32:15.428Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-05-06T03:02:05.142Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-05-06T03:33:42.857Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-05-06T11:03:32.571Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-05-06T18:33:22.285Z"
      },
      {
        "status": "DeliveredToStore",
        "at": "2026-05-06T23:11:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 2,
      "matchedRuleName": "Yüksek Desi - Ağır Kargo",
      "matchedRuleSummary": "30–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        7
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 2,
          "companyName": "Aras Kargo",
          "metrics": {
            "cost": 0.5853658536585367,
            "deliveryTime": 0.2800000000000001,
            "successRate": 0.679563492063492,
            "damagedRate": 0.4666666666666667,
            "avgPickupHours": 1,
            "costDiffPct": 1
          },
          "combined": 0.6188990030971738
        },
        {
          "companyId": 7,
          "companyName": "Horoz Lojistik",
          "metrics": {
            "cost": 0.5,
            "deliveryTime": 0.09999999999999996,
            "successRate": 0.6471306471306472,
            "damagedRate": 1,
            "avgPickupHours": 0.6997518610421837,
            "costDiffPct": 0.9449840836312517
          },
          "combined": 0.5712562562500053
        }
      ],
      "chosenCompanyId": 2
          }
  },
  {
    "id": 22,
    "transferNo": 7100022,
    "dispatchNo": 5100022,
    "fromNodeId": 7,
    "toNodeId": 13,
    "companyId": 3,
    "trackingNo": "MNG-TR-200902",
    "referenceId": "REF-T15962",
    "packageNo": "PKT-T000022",
    "status": "DeliveredToStore",
    "desi": 14,
    "note": "",
    "createdAt": "2026-05-07T12:38:00",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-05-07T09:38:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-05-07T16:28:24.000Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-05-08T00:34:24.000Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-05-08T01:32:00.000Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-05-08T09:38:00.000Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-05-08T17:44:00.000Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-05-08T18:41:36.000Z"
      },
      {
        "status": "DeliveredToStore",
        "at": "2026-05-09T02:47:36.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 3,
          "companyName": "MNG Kargo",
          "metrics": {
            "cost": 0.5,
            "deliveryTime": 0.5199999999999999,
            "successRate": 0.679563492063492,
            "damagedRate": 0.7333333333333334,
            "avgPickupHours": 0,
            "costDiffPct": 0
          },
          "combined": 0.47222420634920637
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 3
          }
  },
  {
    "id": 23,
    "transferNo": 7100023,
    "dispatchNo": 5100023,
    "fromNodeId": 14,
    "toNodeId": 2,
    "companyId": 7,
    "trackingNo": "HRZ-TR-200943",
    "referenceId": "REF-T16233",
    "packageNo": "PKT-T000023",
    "status": "DeliveredToStore",
    "desi": 19,
    "note": "",
    "createdAt": "2026-05-08T14:08:00",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-05-08T11:08:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-05-08T18:59:46.285Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-05-08T20:24:32.571Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-05-09T05:07:54.857Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-05-09T13:51:17.142Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-05-09T15:16:03.428Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-05-09T23:59:25.714Z"
      },
      {
        "status": "DeliveredToStore",
        "at": "2026-05-10T06:08:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 7,
          "companyName": "Horoz Lojistik",
          "metrics": {
            "cost": 0.5,
            "deliveryTime": 0.09999999999999996,
            "successRate": 0.6471306471306472,
            "damagedRate": 1,
            "avgPickupHours": 0.6997518610421837,
            "costDiffPct": 0.9449840836312517
          },
          "combined": 0.5712562562500053
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 7
          }
  },
  {
    "id": 24,
    "transferNo": 7100024,
    "dispatchNo": 5100024,
    "fromNodeId": 4,
    "toNodeId": 14,
    "companyId": 2,
    "trackingNo": "ARAS-TR-200984",
    "referenceId": "REF-T16504",
    "packageNo": "PKT-T000024",
    "status": "DeliveredToStore",
    "desi": 18,
    "note": "",
    "createdAt": "2026-05-09T14:33:00",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-05-09T11:33:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-05-09T20:28:32.571Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-05-09T22:21:41.142Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-05-10T07:43:37.714Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-05-10T09:36:46.285Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-05-10T18:58:42.857Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-05-11T04:20:39.428Z"
      },
      {
        "status": "DeliveredToStore",
        "at": "2026-05-11T06:13:48.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 2,
          "companyName": "Aras Kargo",
          "metrics": {
            "cost": 0.5853658536585367,
            "deliveryTime": 0.2800000000000001,
            "successRate": 0.679563492063492,
            "damagedRate": 0.4666666666666667,
            "avgPickupHours": 1,
            "costDiffPct": 1
          },
          "combined": 0.6188990030971738
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 2
          }
  },
  {
    "id": 25,
    "transferNo": 7100025,
    "dispatchNo": 5100025,
    "fromNodeId": 12,
    "toNodeId": 8,
    "companyId": 3,
    "trackingNo": "MNG-TR-201025",
    "referenceId": "REF-T16775",
    "packageNo": "PKT-T000025",
    "status": "DeliveredToStore",
    "desi": 17,
    "note": "",
    "createdAt": "2026-05-10T06:23:00",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-05-10T03:23:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-05-10T13:24:42.857Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-05-10T15:47:25.714Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-05-11T01:49:08.571Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-05-11T04:11:51.428Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-05-11T14:13:34.285Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-05-11T16:36:17.142Z"
      },
      {
        "status": "DeliveredToStore",
        "at": "2026-05-12T00:23:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 3,
          "companyName": "MNG Kargo",
          "metrics": {
            "cost": 0.5,
            "deliveryTime": 0.5199999999999999,
            "successRate": 0.679563492063492,
            "damagedRate": 0.7333333333333334,
            "avgPickupHours": 0,
            "costDiffPct": 0
          },
          "combined": 0.47222420634920637
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 3
          }
  },
  {
    "id": 26,
    "transferNo": 7100026,
    "dispatchNo": 5100026,
    "fromNodeId": 13,
    "toNodeId": 4,
    "companyId": 7,
    "trackingNo": "HRZ-TR-201066",
    "referenceId": "REF-T17046",
    "packageNo": "PKT-T000026",
    "status": "DeliveredToStore",
    "desi": 17,
    "note": "",
    "createdAt": "2026-05-10T06:29:00",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-05-10T03:29:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-05-10T06:50:05.142Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-05-10T17:32:46.285Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-05-10T20:26:15.428Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-05-11T07:08:56.571Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-05-11T10:02:25.714Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-05-11T20:45:06.857Z"
      },
      {
        "status": "DeliveredToStore",
        "at": "2026-05-11T23:38:36.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 4,
      "matchedRuleName": "Ege Bölgesi Standart",
      "matchedRuleSummary": "0–30 desi · İzmir",
      "ruleNarrowedCompanyIds": [
        2
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 2,
          "companyName": "Aras Kargo",
          "metrics": {
            "cost": 0.5853658536585367,
            "deliveryTime": 0.2800000000000001,
            "successRate": 0.679563492063492,
            "damagedRate": 0.4666666666666667,
            "avgPickupHours": 1,
            "costDiffPct": 1
          },
          "combined": 0.6188990030971738
        },
        {
          "companyId": 7,
          "companyName": "Horoz Lojistik",
          "metrics": {
            "cost": 0.5,
            "deliveryTime": 0.09999999999999996,
            "successRate": 0.6471306471306472,
            "damagedRate": 1,
            "avgPickupHours": 0.6997518610421837,
            "costDiffPct": 0.9449840836312517
          },
          "combined": 0.5712562562500053
        }
      ],
      "chosenCompanyId": 7
          }
  },
  {
    "id": 27,
    "transferNo": 7100027,
    "dispatchNo": 5100027,
    "fromNodeId": 13,
    "toNodeId": 6,
    "companyId": 6,
    "trackingNo": "DHL-TR-201107",
    "referenceId": "REF-T17317",
    "packageNo": "PKT-T000027",
    "status": "DeliveredToStore",
    "desi": 27,
    "note": "",
    "createdAt": "2026-05-10T12:04:00",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-05-10T09:04:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-05-10T13:25:51.428Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-05-11T00:50:42.857Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-05-11T04:16:10.285Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-05-11T15:41:01.714Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-05-11T19:06:29.142Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-05-11T22:31:56.571Z"
      },
      {
        "status": "DeliveredToStore",
        "at": "2026-05-12T08:04:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 6,
          "companyName": "DHL eCommerce",
          "metrics": {
            "cost": 0.29268292682926833,
            "deliveryTime": 0.6666666666666665,
            "successRate": 0,
            "damagedRate": 0.2592592592592593,
            "avgPickupHours": 0.8538899430740037,
            "costDiffPct": 0.9922127873486873
          },
          "combined": 0.4170402640088454
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 6
          }
  },
  {
    "id": 28,
    "transferNo": 7100028,
    "dispatchNo": 5100028,
    "fromNodeId": 1,
    "toNodeId": 14,
    "companyId": 2,
    "trackingNo": "ARAS-TR-201148",
    "referenceId": "REF-T17588",
    "packageNo": "PKT-T000028",
    "status": "DeliveredToStore",
    "desi": 32,
    "note": "",
    "createdAt": "2026-05-11T08:37:00",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-05-11T05:37:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-05-11T11:02:01.714Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-05-11T23:10:15.428Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-05-12T03:08:53.142Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-05-12T07:07:30.857Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-05-12T19:15:44.571Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-05-12T23:14:22.285Z"
      },
      {
        "status": "DeliveredToStore",
        "at": "2026-05-13T03:13:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 2,
      "matchedRuleName": "Yüksek Desi - Ağır Kargo",
      "matchedRuleSummary": "30–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        7
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 2,
          "companyName": "Aras Kargo",
          "metrics": {
            "cost": 0.5853658536585367,
            "deliveryTime": 0.2800000000000001,
            "successRate": 0.679563492063492,
            "damagedRate": 0.4666666666666667,
            "avgPickupHours": 1,
            "costDiffPct": 1
          },
          "combined": 0.6188990030971738
        },
        {
          "companyId": 7,
          "companyName": "Horoz Lojistik",
          "metrics": {
            "cost": 0.5,
            "deliveryTime": 0.09999999999999996,
            "successRate": 0.6471306471306472,
            "damagedRate": 1,
            "avgPickupHours": 0.6997518610421837,
            "costDiffPct": 0.9449840836312517
          },
          "combined": 0.5712562562500053
        }
      ],
      "chosenCompanyId": 2
          }
  },
  {
    "id": 29,
    "transferNo": 7100029,
    "dispatchNo": 5100029,
    "fromNodeId": 2,
    "toNodeId": 5,
    "companyId": 6,
    "trackingNo": "DHL-TR-201189",
    "referenceId": "REF-T17859",
    "packageNo": "PKT-T000029",
    "status": "DeliveredToStore",
    "desi": 14,
    "note": "",
    "createdAt": "2026-05-13T11:33:00",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-05-13T08:33:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-05-13T15:03:36.000Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-05-13T19:36:36.000Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-05-14T08:29:24.000Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-05-14T13:02:24.000Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-05-14T17:35:24.000Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-05-15T06:28:12.000Z"
      },
      {
        "status": "DeliveredToStore",
        "at": "2026-05-15T09:33:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 6,
          "companyName": "DHL eCommerce",
          "metrics": {
            "cost": 0.29268292682926833,
            "deliveryTime": 0.6666666666666665,
            "successRate": 0,
            "damagedRate": 0.2592592592592593,
            "avgPickupHours": 0.8538899430740037,
            "costDiffPct": 0.9922127873486873
          },
          "combined": 0.4170402640088454
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 6
          }
  },
  {
    "id": 30,
    "transferNo": 7100030,
    "dispatchNo": 5100030,
    "fromNodeId": 5,
    "toNodeId": 9,
    "companyId": 1,
    "trackingNo": "YK-TR-201230",
    "referenceId": "REF-T18130",
    "packageNo": "PKT-T000030",
    "status": "DeliveredToStore",
    "desi": 27,
    "note": "",
    "createdAt": "2026-05-14T05:17:00",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-05-14T02:17:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-05-14T05:20:25.714Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-05-14T07:23:51.428Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-05-14T09:27:17.142Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-05-14T14:54:42.857Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-05-14T16:58:08.571Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-05-14T19:01:34.285Z"
      },
      {
        "status": "DeliveredToStore",
        "at": "2026-05-14T21:05:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 1
          }
  },
  {
    "id": 31,
    "transferNo": 7100031,
    "dispatchNo": 5100031,
    "fromNodeId": 8,
    "toNodeId": 10,
    "companyId": 1,
    "trackingNo": "YK-TR-201271",
    "referenceId": "REF-T18401",
    "packageNo": "PKT-T000031",
    "status": "ShipmentCanceled",
    "desi": 34,
    "note": "",
    "createdAt": "2026-05-15T07:44:00",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-05-15T04:44:00.000Z"
      },
      {
        "status": "ShipmentCanceled",
        "at": "2026-05-15T07:44:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 2,
      "matchedRuleName": "Yüksek Desi - Ağır Kargo",
      "matchedRuleSummary": "30–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        7
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 7,
          "companyName": "Horoz Lojistik",
          "metrics": {
            "cost": 0.5,
            "deliveryTime": 0.09999999999999996,
            "successRate": 0.6471306471306472,
            "damagedRate": 1,
            "avgPickupHours": 0.6997518610421837,
            "costDiffPct": 0.9449840836312517
          },
          "combined": 0.5712562562500053
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 1
          }
  },
  {
    "id": 32,
    "transferNo": 7100032,
    "dispatchNo": 5100032,
    "fromNodeId": 6,
    "toNodeId": 14,
    "companyId": 7,
    "trackingNo": "HRZ-TR-201312",
    "referenceId": "REF-T18672",
    "packageNo": "PKT-T000032",
    "status": "DeliveredToStore",
    "desi": 25,
    "note": "",
    "createdAt": "2026-05-16T09:31:00",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-05-16T06:31:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-05-16T10:45:34.285Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-05-16T13:27:44.571Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-05-16T16:09:54.857Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-05-16T18:52:05.142Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-05-16T21:34:15.428Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-05-17T00:16:25.714Z"
      },
      {
        "status": "DeliveredToStore",
        "at": "2026-05-17T02:58:36.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 7,
          "companyName": "Horoz Lojistik",
          "metrics": {
            "cost": 0.5,
            "deliveryTime": 0.09999999999999996,
            "successRate": 0.6471306471306472,
            "damagedRate": 1,
            "avgPickupHours": 0.6997518610421837,
            "costDiffPct": 0.9449840836312517
          },
          "combined": 0.5712562562500053
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 7
          }
  },
  {
    "id": 33,
    "transferNo": 7100033,
    "dispatchNo": 5100033,
    "fromNodeId": 9,
    "toNodeId": 11,
    "companyId": 1,
    "trackingNo": "YK-TR-201353",
    "referenceId": "REF-T18943",
    "packageNo": "PKT-T000033",
    "status": "DeliveredToStore",
    "desi": 18,
    "note": "",
    "createdAt": "2026-05-16T13:46:00",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-05-16T10:46:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-05-16T15:39:44.571Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-05-16T18:43:05.142Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-05-16T21:46:25.714Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-05-17T00:49:46.285Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-05-17T03:53:06.857Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-05-17T06:56:27.428Z"
      },
      {
        "status": "DeliveredToStore",
        "at": "2026-05-17T09:46:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 1
          }
  },
  {
    "id": 34,
    "transferNo": 7100034,
    "dispatchNo": 5100034,
    "fromNodeId": 14,
    "toNodeId": 11,
    "companyId": 1,
    "trackingNo": "YK-TR-201394",
    "referenceId": "REF-T19214",
    "packageNo": "PKT-T000034",
    "status": "OnTheWayBackToSender",
    "desi": 7,
    "note": "",
    "createdAt": "2026-05-17T13:11:00",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-05-17T10:11:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-05-27T10:42:07.800Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-06-11T04:24:22.800Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-06-25T22:06:37.800Z"
      },
      {
        "status": "OnTheWayBackToSender",
        "at": "2026-07-10T15:48:52.800Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 1
          }
  },
  {
    "id": 35,
    "transferNo": 7100035,
    "dispatchNo": 5100035,
    "fromNodeId": 1,
    "toNodeId": 15,
    "companyId": 1,
    "trackingNo": "YK-TR-201435",
    "referenceId": "REF-T19485",
    "packageNo": "PKT-T000035",
    "status": "DeliveredToStore",
    "desi": 16,
    "note": "",
    "createdAt": "2026-05-23T14:30:00",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-05-23T11:30:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-05-23T13:34:17.142Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-05-23T17:23:34.285Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-05-23T21:12:51.428Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-05-24T01:02:08.571Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-05-24T04:51:25.714Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-05-24T08:40:42.857Z"
      },
      {
        "status": "DeliveredToStore",
        "at": "2026-05-24T12:30:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 1
          }
  },
  {
    "id": 36,
    "transferNo": 7100036,
    "dispatchNo": 5100036,
    "fromNodeId": 10,
    "toNodeId": 2,
    "companyId": 6,
    "trackingNo": "DHL-TR-201476",
    "referenceId": "REF-T19756",
    "packageNo": "PKT-T000036",
    "status": "DeliveredToStore",
    "desi": 17,
    "note": "",
    "createdAt": "2026-05-23T14:56:00",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-05-23T11:56:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-05-23T14:36:27.428Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-05-23T18:50:30.857Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-05-23T23:04:34.285Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-05-24T03:18:37.714Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-05-24T07:32:41.142Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-05-24T11:46:44.571Z"
      },
      {
        "status": "DeliveredToStore",
        "at": "2026-05-24T13:56:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 6,
          "companyName": "DHL eCommerce",
          "metrics": {
            "cost": 0.29268292682926833,
            "deliveryTime": 0.6666666666666665,
            "successRate": 0,
            "damagedRate": 0.2592592592592593,
            "avgPickupHours": 0.8538899430740037,
            "costDiffPct": 0.9922127873486873
          },
          "combined": 0.4170402640088454
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 6
          }
  },
  {
    "id": 37,
    "transferNo": 7100037,
    "dispatchNo": 5100037,
    "fromNodeId": 15,
    "toNodeId": 12,
    "companyId": 1,
    "trackingNo": "YK-TR-201517",
    "referenceId": "REF-T20027",
    "packageNo": "PKT-T000037",
    "status": "DeliveredToStore",
    "desi": 11,
    "note": "",
    "createdAt": "2026-05-24T08:07:00",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-05-24T05:07:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-05-24T08:26:01.714Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-05-24T13:06:03.428Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-05-24T17:46:05.142Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-05-24T22:26:06.857Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-05-24T22:30:44.571Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-05-25T03:10:46.285Z"
      },
      {
        "status": "DeliveredToStore",
        "at": "2026-05-25T07:50:48.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 1
          }
  },
  {
    "id": 38,
    "transferNo": 7100038,
    "dispatchNo": 5100038,
    "fromNodeId": 6,
    "toNodeId": 2,
    "companyId": 6,
    "trackingNo": "DHL-TR-201558",
    "referenceId": "REF-T20298",
    "packageNo": "PKT-T000038",
    "status": "ShipmentCanceled",
    "desi": 32,
    "note": "",
    "createdAt": "2026-05-24T13:42:00",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-05-24T10:42:00.000Z"
      },
      {
        "status": "ShipmentCanceled",
        "at": "2026-05-24T15:42:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 2,
      "matchedRuleName": "Yüksek Desi - Ağır Kargo",
      "matchedRuleSummary": "30–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        7
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 7,
          "companyName": "Horoz Lojistik",
          "metrics": {
            "cost": 0.5,
            "deliveryTime": 0.09999999999999996,
            "successRate": 0.6471306471306472,
            "damagedRate": 1,
            "avgPickupHours": 0.6997518610421837,
            "costDiffPct": 0.9449840836312517
          },
          "combined": 0.5712562562500053
        },
        {
          "companyId": 6,
          "companyName": "DHL eCommerce",
          "metrics": {
            "cost": 0.29268292682926833,
            "deliveryTime": 0.6666666666666665,
            "successRate": 0,
            "damagedRate": 0.2592592592592593,
            "avgPickupHours": 0.8538899430740037,
            "costDiffPct": 0.9922127873486873
          },
          "combined": 0.4170402640088454
        }
      ],
      "chosenCompanyId": 6
          }
  },
  {
    "id": 39,
    "transferNo": 7100039,
    "dispatchNo": 5100039,
    "fromNodeId": 6,
    "toNodeId": 8,
    "companyId": 6,
    "trackingNo": "DHL-TR-201599",
    "referenceId": "REF-T20569",
    "packageNo": "PKT-T000039",
    "status": "ShipmentCanceled",
    "desi": 24,
    "note": "",
    "createdAt": "2026-05-25T09:21:00",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-05-25T06:21:00.000Z"
      },
      {
        "status": "ShipmentCanceled",
        "at": "2026-05-25T12:21:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 6,
          "companyName": "DHL eCommerce",
          "metrics": {
            "cost": 0.29268292682926833,
            "deliveryTime": 0.6666666666666665,
            "successRate": 0,
            "damagedRate": 0.2592592592592593,
            "avgPickupHours": 0.8538899430740037,
            "costDiffPct": 0.9922127873486873
          },
          "combined": 0.4170402640088454
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 6
          }
  },
  {
    "id": 40,
    "transferNo": 7100040,
    "dispatchNo": 5100040,
    "fromNodeId": 6,
    "toNodeId": 5,
    "companyId": 1,
    "trackingNo": "YK-TR-201640",
    "referenceId": "REF-T20840",
    "packageNo": "PKT-T000040",
    "status": "DeliveredToStore",
    "desi": 28,
    "note": "",
    "createdAt": "2026-05-25T13:30:00",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-05-25T10:30:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-05-25T15:59:08.571Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-05-25T16:58:17.142Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-05-25T23:03:25.714Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-05-26T05:08:34.285Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-05-26T06:07:42.857Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-05-26T12:12:51.428Z"
      },
      {
        "status": "DeliveredToStore",
        "at": "2026-05-26T16:30:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 1
          }
  },
  {
    "id": 41,
    "transferNo": 7100041,
    "dispatchNo": 5100041,
    "fromNodeId": 10,
    "toNodeId": 14,
    "companyId": 2,
    "trackingNo": "ARAS-TR-201681",
    "referenceId": "REF-T21111",
    "packageNo": "PKT-T000041",
    "status": "DeliveredToStore",
    "desi": 34,
    "note": "",
    "createdAt": "2026-05-26T10:21:00",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-05-26T07:21:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-05-26T13:38:18.857Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-05-26T14:58:01.714Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-05-26T21:33:56.571Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-05-26T22:53:39.428Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-05-27T05:29:34.285Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-05-27T12:05:29.142Z"
      },
      {
        "status": "DeliveredToStore",
        "at": "2026-05-27T13:25:12.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 2,
      "matchedRuleName": "Yüksek Desi - Ağır Kargo",
      "matchedRuleSummary": "30–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        7
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 2,
          "companyName": "Aras Kargo",
          "metrics": {
            "cost": 0.5853658536585367,
            "deliveryTime": 0.2800000000000001,
            "successRate": 0.679563492063492,
            "damagedRate": 0.4666666666666667,
            "avgPickupHours": 1,
            "costDiffPct": 1
          },
          "combined": 0.6188990030971738
        },
        {
          "companyId": 7,
          "companyName": "Horoz Lojistik",
          "metrics": {
            "cost": 0.5,
            "deliveryTime": 0.09999999999999996,
            "successRate": 0.6471306471306472,
            "damagedRate": 1,
            "avgPickupHours": 0.6997518610421837,
            "costDiffPct": 0.9449840836312517
          },
          "combined": 0.5712562562500053
        }
      ],
      "chosenCompanyId": 2
          }
  },
  {
    "id": 42,
    "transferNo": 7100042,
    "dispatchNo": 5100042,
    "fromNodeId": 12,
    "toNodeId": 15,
    "companyId": 3,
    "trackingNo": "MNG-TR-201722",
    "referenceId": "REF-T21382",
    "packageNo": "PKT-T000042",
    "status": "DeliveredToStore",
    "desi": 28,
    "note": "",
    "createdAt": "2026-05-26T12:50:00",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-05-26T09:50:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-05-26T16:57:53.142Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-05-26T18:39:22.285Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-05-27T01:47:15.428Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-05-27T03:28:44.571Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-05-27T10:36:37.714Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-05-27T12:18:06.857Z"
      },
      {
        "status": "DeliveredToStore",
        "at": "2026-05-27T17:50:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 3,
          "companyName": "MNG Kargo",
          "metrics": {
            "cost": 0.5,
            "deliveryTime": 0.5199999999999999,
            "successRate": 0.679563492063492,
            "damagedRate": 0.7333333333333334,
            "avgPickupHours": 0,
            "costDiffPct": 0
          },
          "combined": 0.47222420634920637
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 3
          }
  },
  {
    "id": 43,
    "transferNo": 7100043,
    "dispatchNo": 5100043,
    "fromNodeId": 14,
    "toNodeId": 11,
    "companyId": 3,
    "trackingNo": "MNG-TR-201763",
    "referenceId": "REF-T21653",
    "packageNo": "PKT-T000043",
    "status": "DeliveredToStore",
    "desi": 17,
    "note": "",
    "createdAt": "2026-05-27T14:59:00",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-05-27T11:59:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-05-27T14:23:15.428Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-05-27T22:04:18.857Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-05-28T00:08:46.285Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-05-28T07:49:49.714Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-05-28T09:54:17.142Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-05-28T17:35:20.571Z"
      },
      {
        "status": "DeliveredToStore",
        "at": "2026-05-28T19:39:48.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 3,
          "companyName": "MNG Kargo",
          "metrics": {
            "cost": 0.5,
            "deliveryTime": 0.5199999999999999,
            "successRate": 0.679563492063492,
            "damagedRate": 0.7333333333333334,
            "avgPickupHours": 0,
            "costDiffPct": 0
          },
          "combined": 0.47222420634920637
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 3
          }
  },
  {
    "id": 44,
    "transferNo": 7100044,
    "dispatchNo": 5100044,
    "fromNodeId": 4,
    "toNodeId": 11,
    "companyId": 2,
    "trackingNo": "ARAS-TR-201804",
    "referenceId": "REF-T21924",
    "packageNo": "PKT-T000044",
    "status": "DeliveredToStore",
    "desi": 35,
    "note": "",
    "createdAt": "2026-05-28T14:35:00",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-05-28T11:35:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-05-28T14:44:25.714Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-05-28T22:59:51.428Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-05-29T01:28:29.142Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-05-29T09:43:54.857Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-05-29T12:12:32.571Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-05-29T14:41:10.285Z"
      },
      {
        "status": "DeliveredToStore",
        "at": "2026-05-29T21:35:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 2,
      "matchedRuleName": "Yüksek Desi - Ağır Kargo",
      "matchedRuleSummary": "30–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        7
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 2,
          "companyName": "Aras Kargo",
          "metrics": {
            "cost": 0.5853658536585367,
            "deliveryTime": 0.2800000000000001,
            "successRate": 0.679563492063492,
            "damagedRate": 0.4666666666666667,
            "avgPickupHours": 1,
            "costDiffPct": 1
          },
          "combined": 0.6188990030971738
        },
        {
          "companyId": 7,
          "companyName": "Horoz Lojistik",
          "metrics": {
            "cost": 0.5,
            "deliveryTime": 0.09999999999999996,
            "successRate": 0.6471306471306472,
            "damagedRate": 1,
            "avgPickupHours": 0.6997518610421837,
            "costDiffPct": 0.9449840836312517
          },
          "combined": 0.5712562562500053
        }
      ],
      "chosenCompanyId": 2
          }
  },
  {
    "id": 45,
    "transferNo": 7100045,
    "dispatchNo": 5100045,
    "fromNodeId": 3,
    "toNodeId": 13,
    "companyId": 1,
    "trackingNo": "YK-TR-201845",
    "referenceId": "REF-T22195",
    "packageNo": "PKT-T000045",
    "status": "DeliveredToStore",
    "desi": 21,
    "note": "",
    "createdAt": "2026-05-29T09:24:00",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-05-29T06:24:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-05-29T10:21:00.000Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-05-29T19:12:00.000Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-05-29T22:06:00.000Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-05-30T01:00:00.000Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-05-30T09:51:00.000Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-05-30T12:45:00.000Z"
      },
      {
        "status": "DeliveredToStore",
        "at": "2026-05-30T15:39:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 1
          }
  },
  {
    "id": 46,
    "transferNo": 7100046,
    "dispatchNo": 5100046,
    "fromNodeId": 12,
    "toNodeId": 3,
    "companyId": 3,
    "trackingNo": "MNG-TR-201886",
    "referenceId": "REF-T22466",
    "packageNo": "PKT-T000046",
    "status": "DeliveredToStore",
    "desi": 38,
    "note": "",
    "createdAt": "2026-05-29T14:28:00",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-05-29T11:28:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-05-29T16:14:58.285Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-05-29T19:35:32.571Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-05-30T05:03:18.857Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-05-30T08:23:53.142Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-05-30T11:44:27.428Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-05-30T21:12:13.714Z"
      },
      {
        "status": "DeliveredToStore",
        "at": "2026-05-30T23:28:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 2,
      "matchedRuleName": "Yüksek Desi - Ağır Kargo",
      "matchedRuleSummary": "30–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        7
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 7,
          "companyName": "Horoz Lojistik",
          "metrics": {
            "cost": 0.5,
            "deliveryTime": 0.09999999999999996,
            "successRate": 0.6471306471306472,
            "damagedRate": 1,
            "avgPickupHours": 0.6997518610421837,
            "costDiffPct": 0.9449840836312517
          },
          "combined": 0.5712562562500053
        },
        {
          "companyId": 3,
          "companyName": "MNG Kargo",
          "metrics": {
            "cost": 0.5,
            "deliveryTime": 0.5199999999999999,
            "successRate": 0.679563492063492,
            "damagedRate": 0.7333333333333334,
            "avgPickupHours": 0,
            "costDiffPct": 0
          },
          "combined": 0.47222420634920637
        }
      ],
      "chosenCompanyId": 3
          }
  },
  {
    "id": 47,
    "transferNo": 7100047,
    "dispatchNo": 5100047,
    "fromNodeId": 1,
    "toNodeId": 10,
    "companyId": 3,
    "trackingNo": "MNG-TR-201927",
    "referenceId": "REF-T22737",
    "packageNo": "PKT-T000047",
    "status": "DeliveredToStore",
    "desi": 30,
    "note": "",
    "createdAt": "2026-05-30T06:29:00",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-05-30T03:29:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-05-30T09:08:20.571Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-05-30T12:56:41.142Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-05-30T16:45:01.714Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-05-31T02:50:46.285Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-05-31T06:39:06.857Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-05-31T10:27:27.428Z"
      },
      {
        "status": "DeliveredToStore",
        "at": "2026-05-31T14:15:48.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 2,
      "matchedRuleName": "Yüksek Desi - Ağır Kargo",
      "matchedRuleSummary": "30–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        7
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 7,
          "companyName": "Horoz Lojistik",
          "metrics": {
            "cost": 0.5,
            "deliveryTime": 0.09999999999999996,
            "successRate": 0.6471306471306472,
            "damagedRate": 1,
            "avgPickupHours": 0.6997518610421837,
            "costDiffPct": 0.9449840836312517
          },
          "combined": 0.5712562562500053
        },
        {
          "companyId": 3,
          "companyName": "MNG Kargo",
          "metrics": {
            "cost": 0.5,
            "deliveryTime": 0.5199999999999999,
            "successRate": 0.679563492063492,
            "damagedRate": 0.7333333333333334,
            "avgPickupHours": 0,
            "costDiffPct": 0
          },
          "combined": 0.47222420634920637
        }
      ],
      "chosenCompanyId": 3
          }
  },
  {
    "id": 48,
    "transferNo": 7100048,
    "dispatchNo": 5100048,
    "fromNodeId": 13,
    "toNodeId": 10,
    "companyId": 2,
    "trackingNo": "ARAS-TR-201968",
    "referenceId": "REF-T23008",
    "packageNo": "PKT-T000048",
    "status": "DeliveredToStore",
    "desi": 6,
    "note": "",
    "createdAt": "2026-05-30T10:42:00",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-05-30T07:42:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-05-30T14:16:06.857Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-05-30T18:33:25.714Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-05-30T22:50:44.571Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-05-31T03:08:03.428Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-05-31T13:52:58.285Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-05-31T18:10:17.142Z"
      },
      {
        "status": "DeliveredToStore",
        "at": "2026-05-31T21:42:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 1,
      "matchedRuleName": "İstanbul İçi Ekonomik",
      "matchedRuleSummary": "0–10 desi · İstanbul",
      "ruleNarrowedCompanyIds": [
        8,
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 2,
          "companyName": "Aras Kargo",
          "metrics": {
            "cost": 0.5853658536585367,
            "deliveryTime": 0.2800000000000001,
            "successRate": 0.679563492063492,
            "damagedRate": 0.4666666666666667,
            "avgPickupHours": 1,
            "costDiffPct": 1
          },
          "combined": 0.6188990030971738
        },
        {
          "companyId": 8,
          "companyName": "Hepsijet",
          "metrics": {
            "cost": 1,
            "deliveryTime": 0,
            "successRate": 0.19047619047619038,
            "damagedRate": 1,
            "avgPickupHours": 0.6838709677419356,
            "costDiffPct": 0.9556096935478475
          },
          "combined": 0.561567113748026
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 2
          }
  },
  {
    "id": 49,
    "transferNo": 7100049,
    "dispatchNo": 5100049,
    "fromNodeId": 3,
    "toNodeId": 4,
    "companyId": 1,
    "trackingNo": "YK-TR-202009",
    "referenceId": "REF-T23279",
    "packageNo": "PKT-T000049",
    "status": "DeliveredToStore",
    "desi": 11,
    "note": "",
    "createdAt": "2026-05-31T08:17:00",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-05-31T05:17:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-05-31T12:48:17.142Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-05-31T17:35:46.285Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-05-31T22:23:15.428Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-06-01T03:10:44.571Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-06-01T07:58:13.714Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-06-01T12:45:42.857Z"
      },
      {
        "status": "DeliveredToStore",
        "at": "2026-06-01T17:33:12.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 1
          }
  },
  {
    "id": 50,
    "transferNo": 7100050,
    "dispatchNo": 5100050,
    "fromNodeId": 10,
    "toNodeId": 13,
    "companyId": 7,
    "trackingNo": "HRZ-TR-202050",
    "referenceId": "REF-T23550",
    "packageNo": "PKT-T000050",
    "status": "DeliveredToStore",
    "desi": 8,
    "note": "",
    "createdAt": "2026-06-01T06:16:00",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-06-01T03:16:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-06-01T11:46:51.428Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-06-01T17:05:42.857Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-06-01T22:24:34.285Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-06-02T03:43:25.714Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-06-02T09:02:17.142Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-06-02T14:21:08.571Z"
      },
      {
        "status": "DeliveredToStore",
        "at": "2026-06-02T19:16:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 4,
      "matchedRuleName": "Ege Bölgesi Standart",
      "matchedRuleSummary": "0–30 desi · İzmir",
      "ruleNarrowedCompanyIds": [
        2
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 2,
          "companyName": "Aras Kargo",
          "metrics": {
            "cost": 0.5853658536585367,
            "deliveryTime": 0.2800000000000001,
            "successRate": 0.679563492063492,
            "damagedRate": 0.4666666666666667,
            "avgPickupHours": 1,
            "costDiffPct": 1
          },
          "combined": 0.6188990030971738
        },
        {
          "companyId": 7,
          "companyName": "Horoz Lojistik",
          "metrics": {
            "cost": 0.5,
            "deliveryTime": 0.09999999999999996,
            "successRate": 0.6471306471306472,
            "damagedRate": 1,
            "avgPickupHours": 0.6997518610421837,
            "costDiffPct": 0.9449840836312517
          },
          "combined": 0.5712562562500053
        }
      ],
      "chosenCompanyId": 7
          }
  },
  {
    "id": 51,
    "transferNo": 7100051,
    "dispatchNo": 5100051,
    "fromNodeId": 2,
    "toNodeId": 12,
    "companyId": 1,
    "trackingNo": "YK-TR-202091",
    "referenceId": "REF-T23821",
    "packageNo": "PKT-T000051",
    "status": "DeliveredToStore",
    "desi": 7,
    "note": "",
    "createdAt": "2026-06-01T08:27:00",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-06-01T05:27:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-06-01T08:01:37.714Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-06-01T13:53:03.428Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-06-01T19:44:29.142Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-06-02T01:35:54.857Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-06-02T07:27:20.571Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-06-02T13:18:46.285Z"
      },
      {
        "status": "DeliveredToStore",
        "at": "2026-06-02T19:10:12.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 1
          }
  },
  {
    "id": 52,
    "transferNo": 7100052,
    "dispatchNo": 5100052,
    "fromNodeId": 7,
    "toNodeId": 2,
    "companyId": 1,
    "trackingNo": "YK-TR-202132",
    "referenceId": "REF-T24092",
    "packageNo": "PKT-T000052",
    "status": "DeliveredToStore",
    "desi": 14,
    "note": "",
    "createdAt": "2026-06-03T11:50:00",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-06-03T08:50:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-06-03T12:18:48.000Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-06-03T18:44:00.000Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-06-04T01:09:12.000Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-06-04T07:34:24.000Z"
      },
      {
        "status": "ProviderReceivedThePackage",
        "at": "2026-06-04T13:59:36.000Z"
      },
      {
        "status": "OnDeliveryAddress",
        "at": "2026-06-04T20:24:48.000Z"
      },
      {
        "status": "DeliveredToStore",
        "at": "2026-06-05T02:50:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 1
          }
  },
  {
    "id": 53,
    "transferNo": 7100053,
    "dispatchNo": 5100053,
    "fromNodeId": 11,
    "toNodeId": 10,
    "companyId": 1,
    "trackingNo": "YK-TR-202173",
    "referenceId": "REF-T24363",
    "packageNo": "PKT-T000053",
    "status": "DispatchLabelCreated",
    "desi": 28,
    "note": "",
    "createdAt": "2026-06-03T11:51:00",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-06-03T08:51:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 1
          }
  },
  {
    "id": 54,
    "transferNo": 7100054,
    "dispatchNo": 5100054,
    "fromNodeId": 1,
    "toNodeId": 13,
    "companyId": 3,
    "trackingNo": "MNG-TR-202214",
    "referenceId": "REF-T24634",
    "packageNo": "PKT-T000054",
    "status": "OnTheWay",
    "desi": 23,
    "note": "",
    "createdAt": "2026-06-05T05:13:00",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-06-05T02:13:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-06-14T08:34:36.600Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-06-25T15:16:34.200Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-07-06T21:58:31.800Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-07-15T09:00:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 3,
          "companyName": "MNG Kargo",
          "metrics": {
            "cost": 0.5,
            "deliveryTime": 0.5199999999999999,
            "successRate": 0.679563492063492,
            "damagedRate": 0.7333333333333334,
            "avgPickupHours": 0,
            "costDiffPct": 0
          },
          "combined": 0.47222420634920637
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 3
          }
  },
  {
    "id": 55,
    "transferNo": 7100055,
    "dispatchNo": 5100055,
    "fromNodeId": 14,
    "toNodeId": 3,
    "companyId": 6,
    "trackingNo": "DHL-TR-202255",
    "referenceId": "REF-T24905",
    "packageNo": "PKT-T000055",
    "status": "DispatchLabelCreated",
    "desi": 35,
    "note": "",
    "createdAt": "2026-06-05T11:03:00",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-06-05T08:03:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 2,
      "matchedRuleName": "Yüksek Desi - Ağır Kargo",
      "matchedRuleSummary": "30–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        7
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 7,
          "companyName": "Horoz Lojistik",
          "metrics": {
            "cost": 0.5,
            "deliveryTime": 0.09999999999999996,
            "successRate": 0.6471306471306472,
            "damagedRate": 1,
            "avgPickupHours": 0.6997518610421837,
            "costDiffPct": 0.9449840836312517
          },
          "combined": 0.5712562562500053
        },
        {
          "companyId": 6,
          "companyName": "DHL eCommerce",
          "metrics": {
            "cost": 0.29268292682926833,
            "deliveryTime": 0.6666666666666665,
            "successRate": 0,
            "damagedRate": 0.2592592592592593,
            "avgPickupHours": 0.8538899430740037,
            "costDiffPct": 0.9922127873486873
          },
          "combined": 0.4170402640088454
        }
      ],
      "chosenCompanyId": 6
          }
  },
  {
    "id": 56,
    "transferNo": 7100056,
    "dispatchNo": 5100056,
    "fromNodeId": 14,
    "toNodeId": 12,
    "companyId": 1,
    "trackingNo": "YK-TR-202296",
    "referenceId": "REF-T25176",
    "packageNo": "PKT-T000056",
    "status": "OnTheWay",
    "desi": 8,
    "note": "",
    "createdAt": "2026-06-06T08:05:00",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-06-06T05:05:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-06-16T18:51:39.000Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-06-28T12:50:09.000Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-07-03T15:01:30.000Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-07-15T09:00:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 1
          }
  },
  {
    "id": 57,
    "transferNo": 7100057,
    "dispatchNo": 5100057,
    "fromNodeId": 7,
    "toNodeId": 8,
    "companyId": 1,
    "trackingNo": "YK-TR-202337",
    "referenceId": "REF-T25447",
    "packageNo": "PKT-T000057",
    "status": "OnTheWay",
    "desi": 31,
    "note": "",
    "createdAt": "2026-06-06T13:07:00",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-06-06T10:07:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-06-17T17:13:58.200Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-06-23T04:06:59.400Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-07-05T05:55:49.200Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-07-15T09:00:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 2,
      "matchedRuleName": "Yüksek Desi - Ağır Kargo",
      "matchedRuleSummary": "30–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        7
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 7,
          "companyName": "Horoz Lojistik",
          "metrics": {
            "cost": 0.5,
            "deliveryTime": 0.09999999999999996,
            "successRate": 0.6471306471306472,
            "damagedRate": 1,
            "avgPickupHours": 0.6997518610421837,
            "costDiffPct": 0.9449840836312517
          },
          "combined": 0.5712562562500053
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 1
          }
  },
  {
    "id": 58,
    "transferNo": 7100058,
    "dispatchNo": 5100058,
    "fromNodeId": 11,
    "toNodeId": 9,
    "companyId": 2,
    "trackingNo": "ARAS-TR-202378",
    "referenceId": "REF-T25718",
    "packageNo": "PKT-T000058",
    "status": "DispatchLabelCreated",
    "desi": 24,
    "note": "",
    "createdAt": "2026-06-07T09:42:00",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-06-07T06:42:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 2,
          "companyName": "Aras Kargo",
          "metrics": {
            "cost": 0.5853658536585367,
            "deliveryTime": 0.2800000000000001,
            "successRate": 0.679563492063492,
            "damagedRate": 0.4666666666666667,
            "avgPickupHours": 1,
            "costDiffPct": 1
          },
          "combined": 0.6188990030971738
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 2
          }
  },
  {
    "id": 59,
    "transferNo": 7100059,
    "dispatchNo": 5100059,
    "fromNodeId": 6,
    "toNodeId": 1,
    "companyId": 1,
    "trackingNo": "YK-TR-202419",
    "referenceId": "REF-T25989",
    "packageNo": "PKT-T000059",
    "status": "DispatchLabelCreated",
    "desi": 27,
    "note": "",
    "createdAt": "2026-06-08T13:51:00",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-06-08T10:51:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 1
          }
  },
  {
    "id": 60,
    "transferNo": 7100060,
    "dispatchNo": 5100060,
    "fromNodeId": 8,
    "toNodeId": 13,
    "companyId": 1,
    "trackingNo": "YK-TR-202460",
    "referenceId": "REF-T26260",
    "packageNo": "PKT-T000060",
    "status": "DispatchLabelCreated",
    "desi": 36,
    "note": "",
    "createdAt": "2026-06-10T14:04:00",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-06-10T11:04:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 2,
      "matchedRuleName": "Yüksek Desi - Ağır Kargo",
      "matchedRuleSummary": "30–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        7
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 7,
          "companyName": "Horoz Lojistik",
          "metrics": {
            "cost": 0.5,
            "deliveryTime": 0.09999999999999996,
            "successRate": 0.6471306471306472,
            "damagedRate": 1,
            "avgPickupHours": 0.6997518610421837,
            "costDiffPct": 0.9449840836312517
          },
          "combined": 0.5712562562500053
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 1
          }
  },
  {
    "id": 61,
    "transferNo": 7100061,
    "dispatchNo": 5100061,
    "fromNodeId": 3,
    "toNodeId": 13,
    "companyId": 1,
    "trackingNo": "YK-TR-202501",
    "referenceId": "REF-T26531",
    "packageNo": "PKT-T000061",
    "status": "OnTheWay",
    "desi": 25,
    "note": "",
    "createdAt": "2026-06-12T06:57:00",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-06-12T03:57:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-06-18T19:21:36.000Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-06-30T10:19:39.000Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-07-06T09:47:47.400Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-07-15T09:00:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 1
          }
  },
  {
    "id": 62,
    "transferNo": 7100062,
    "dispatchNo": 5100062,
    "fromNodeId": 9,
    "toNodeId": 7,
    "companyId": 2,
    "trackingNo": "ARAS-TR-202542",
    "referenceId": "REF-T26802",
    "packageNo": "PKT-T000062",
    "status": "OnTheWay",
    "desi": 36,
    "note": "",
    "createdAt": "2026-06-12T07:41:00",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-06-12T04:41:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-06-19T11:52:22.800Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-07-01T10:32:49.200Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-07-07T17:50:49.800Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-07-14T01:08:50.400Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 2,
      "matchedRuleName": "Yüksek Desi - Ağır Kargo",
      "matchedRuleSummary": "30–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        7
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 2,
          "companyName": "Aras Kargo",
          "metrics": {
            "cost": 0.5853658536585367,
            "deliveryTime": 0.2800000000000001,
            "successRate": 0.679563492063492,
            "damagedRate": 0.4666666666666667,
            "avgPickupHours": 1,
            "costDiffPct": 1
          },
          "combined": 0.6188990030971738
        },
        {
          "companyId": 7,
          "companyName": "Horoz Lojistik",
          "metrics": {
            "cost": 0.5,
            "deliveryTime": 0.09999999999999996,
            "successRate": 0.6471306471306472,
            "damagedRate": 1,
            "avgPickupHours": 0.6997518610421837,
            "costDiffPct": 0.9449840836312517
          },
          "combined": 0.5712562562500053
        }
      ],
      "chosenCompanyId": 2
          }
  },
  {
    "id": 63,
    "transferNo": 7100063,
    "dispatchNo": 5100063,
    "fromNodeId": 6,
    "toNodeId": 1,
    "companyId": 3,
    "trackingNo": "MNG-TR-202583",
    "referenceId": "REF-T27073",
    "packageNo": "PKT-T000063",
    "status": "DispatchLabelCreated",
    "desi": 12,
    "note": "",
    "createdAt": "2026-06-12T09:19:00",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-06-12T06:19:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 3,
          "companyName": "MNG Kargo",
          "metrics": {
            "cost": 0.5,
            "deliveryTime": 0.5199999999999999,
            "successRate": 0.679563492063492,
            "damagedRate": 0.7333333333333334,
            "avgPickupHours": 0,
            "costDiffPct": 0
          },
          "combined": 0.47222420634920637
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 3
          }
  },
  {
    "id": 64,
    "transferNo": 7100064,
    "dispatchNo": 5100064,
    "fromNodeId": 4,
    "toNodeId": 5,
    "companyId": 1,
    "trackingNo": "YK-TR-202624",
    "referenceId": "REF-T27344",
    "packageNo": "PKT-T000064",
    "status": "OnTheWay",
    "desi": 7,
    "note": "",
    "createdAt": "2026-06-15T06:42:00",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-06-15T03:42:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-06-23T00:16:40.800Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-06-29T08:35:27.600Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-07-05T16:54:14.400Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-07-15T09:00:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 1
          }
  },
  {
    "id": 65,
    "transferNo": 7100065,
    "dispatchNo": 5100065,
    "fromNodeId": 6,
    "toNodeId": 5,
    "companyId": 2,
    "trackingNo": "ARAS-TR-202665",
    "referenceId": "REF-T27615",
    "packageNo": "PKT-T000065",
    "status": "OnTheWay",
    "desi": 11,
    "note": "",
    "createdAt": "2026-06-15T13:39:00",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-06-15T10:39:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-06-23T19:47:16.800Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-06-30T09:49:30.000Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-07-06T23:51:43.200Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-07-13T13:53:56.400Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 2,
          "companyName": "Aras Kargo",
          "metrics": {
            "cost": 0.5853658536585367,
            "deliveryTime": 0.2800000000000001,
            "successRate": 0.679563492063492,
            "damagedRate": 0.4666666666666667,
            "avgPickupHours": 1,
            "costDiffPct": 1
          },
          "combined": 0.6188990030971738
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 2
          }
  },
  {
    "id": 66,
    "transferNo": 7100066,
    "dispatchNo": 5100066,
    "fromNodeId": 1,
    "toNodeId": 5,
    "companyId": 3,
    "trackingNo": "MNG-TR-202706",
    "referenceId": "REF-T27886",
    "packageNo": "PKT-T000066",
    "status": "OnTheWay",
    "desi": 17,
    "note": "",
    "createdAt": "2026-06-16T09:43:00",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-06-16T06:43:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-06-25T00:12:06.000Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-07-01T16:48:24.600Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-07-08T09:24:43.200Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-07-15T02:01:01.800Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 3,
          "companyName": "MNG Kargo",
          "metrics": {
            "cost": 0.5,
            "deliveryTime": 0.5199999999999999,
            "successRate": 0.679563492063492,
            "damagedRate": 0.7333333333333334,
            "avgPickupHours": 0,
            "costDiffPct": 0
          },
          "combined": 0.47222420634920637
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 3
          }
  },
  {
    "id": 67,
    "transferNo": 7100067,
    "dispatchNo": 5100067,
    "fromNodeId": 9,
    "toNodeId": 2,
    "companyId": 2,
    "trackingNo": "ARAS-TR-202747",
    "referenceId": "REF-T28157",
    "packageNo": "PKT-T000067",
    "status": "OnTheWay",
    "desi": 38,
    "note": "",
    "createdAt": "2026-06-17T10:22:00",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-06-17T07:22:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-06-26T06:55:45.600Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-07-03T00:36:04.800Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-07-09T18:16:24.000Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-07-15T09:00:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 2,
      "matchedRuleName": "Yüksek Desi - Ağır Kargo",
      "matchedRuleSummary": "30–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        7
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 2,
          "companyName": "Aras Kargo",
          "metrics": {
            "cost": 0.5853658536585367,
            "deliveryTime": 0.2800000000000001,
            "successRate": 0.679563492063492,
            "damagedRate": 0.4666666666666667,
            "avgPickupHours": 1,
            "costDiffPct": 1
          },
          "combined": 0.6188990030971738
        },
        {
          "companyId": 7,
          "companyName": "Horoz Lojistik",
          "metrics": {
            "cost": 0.5,
            "deliveryTime": 0.09999999999999996,
            "successRate": 0.6471306471306472,
            "damagedRate": 1,
            "avgPickupHours": 0.6997518610421837,
            "costDiffPct": 0.9449840836312517
          },
          "combined": 0.5712562562500053
        }
      ],
      "chosenCompanyId": 2
          }
  },
  {
    "id": 68,
    "transferNo": 7100068,
    "dispatchNo": 5100068,
    "fromNodeId": 14,
    "toNodeId": 4,
    "companyId": 3,
    "trackingNo": "MNG-TR-202788",
    "referenceId": "REF-T28428",
    "packageNo": "PKT-T000068",
    "status": "OnTheWay",
    "desi": 6,
    "note": "",
    "createdAt": "2026-06-18T07:18:00",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-06-18T04:18:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-06-22T19:15:32.400Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-06-29T14:26:02.400Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-07-06T09:36:32.400Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-07-13T04:47:02.400Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 3,
          "companyName": "MNG Kargo",
          "metrics": {
            "cost": 0.5,
            "deliveryTime": 0.5199999999999999,
            "successRate": 0.679563492063492,
            "damagedRate": 0.7333333333333334,
            "avgPickupHours": 0,
            "costDiffPct": 0
          },
          "combined": 0.47222420634920637
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 3
          }
  },
  {
    "id": 69,
    "transferNo": 7100069,
    "dispatchNo": 5100069,
    "fromNodeId": 2,
    "toNodeId": 13,
    "companyId": 1,
    "trackingNo": "YK-TR-202829",
    "referenceId": "REF-T28699",
    "packageNo": "PKT-T000069",
    "status": "OnTheWay",
    "desi": 34,
    "note": "",
    "createdAt": "2026-06-19T05:12:00",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-06-19T02:12:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-06-24T02:03:07.200Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-06-30T22:03:36.000Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-07-07T18:04:04.800Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-07-14T14:04:33.600Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 2,
      "matchedRuleName": "Yüksek Desi - Ağır Kargo",
      "matchedRuleSummary": "30–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        7
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 7,
          "companyName": "Horoz Lojistik",
          "metrics": {
            "cost": 0.5,
            "deliveryTime": 0.09999999999999996,
            "successRate": 0.6471306471306472,
            "damagedRate": 1,
            "avgPickupHours": 0.6997518610421837,
            "costDiffPct": 0.9449840836312517
          },
          "combined": 0.5712562562500053
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 1
          }
  },
  {
    "id": 70,
    "transferNo": 7100070,
    "dispatchNo": 5100070,
    "fromNodeId": 6,
    "toNodeId": 8,
    "companyId": 1,
    "trackingNo": "YK-TR-202870",
    "referenceId": "REF-T28970",
    "packageNo": "PKT-T000070",
    "status": "OnTheWay",
    "desi": 33,
    "note": "",
    "createdAt": "2026-06-22T05:48:00",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-06-22T02:48:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-06-27T00:01:19.200Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-07-03T06:44:09.600Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-07-09T13:27:00.000Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-07-15T09:00:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 2,
      "matchedRuleName": "Yüksek Desi - Ağır Kargo",
      "matchedRuleSummary": "30–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        7
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 7,
          "companyName": "Horoz Lojistik",
          "metrics": {
            "cost": 0.5,
            "deliveryTime": 0.09999999999999996,
            "successRate": 0.6471306471306472,
            "damagedRate": 1,
            "avgPickupHours": 0.6997518610421837,
            "costDiffPct": 0.9449840836312517
          },
          "combined": 0.5712562562500053
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 1
          }
  },
  {
    "id": 71,
    "transferNo": 7100071,
    "dispatchNo": 5100071,
    "fromNodeId": 7,
    "toNodeId": 6,
    "companyId": 1,
    "trackingNo": "YK-TR-202911",
    "referenceId": "REF-T29241",
    "packageNo": "PKT-T000071",
    "status": "OnTheWay",
    "desi": 35,
    "note": "",
    "createdAt": "2026-06-22T06:28:00",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-06-22T03:28:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-06-27T11:41:57.600Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-07-03T23:48:31.200Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-07-10T11:55:04.800Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-07-15T09:00:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 2,
      "matchedRuleName": "Yüksek Desi - Ağır Kargo",
      "matchedRuleSummary": "30–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        7
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 7,
          "companyName": "Horoz Lojistik",
          "metrics": {
            "cost": 0.5,
            "deliveryTime": 0.09999999999999996,
            "successRate": 0.6471306471306472,
            "damagedRate": 1,
            "avgPickupHours": 0.6997518610421837,
            "costDiffPct": 0.9449840836312517
          },
          "combined": 0.5712562562500053
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 1
          }
  },
  {
    "id": 72,
    "transferNo": 7100072,
    "dispatchNo": 5100072,
    "fromNodeId": 7,
    "toNodeId": 8,
    "companyId": 2,
    "trackingNo": "ARAS-TR-202952",
    "referenceId": "REF-T29512",
    "packageNo": "PKT-T000072",
    "status": "DispatchLabelCreated",
    "desi": 20,
    "note": "",
    "createdAt": "2026-06-22T10:49:00",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-06-22T07:49:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 2,
          "companyName": "Aras Kargo",
          "metrics": {
            "cost": 0.5853658536585367,
            "deliveryTime": 0.2800000000000001,
            "successRate": 0.679563492063492,
            "damagedRate": 0.4666666666666667,
            "avgPickupHours": 1,
            "costDiffPct": 1
          },
          "combined": 0.6188990030971738
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 2
          }
  },
  {
    "id": 73,
    "transferNo": 7100073,
    "dispatchNo": 5100073,
    "fromNodeId": 2,
    "toNodeId": 4,
    "companyId": 1,
    "trackingNo": "YK-TR-202993",
    "referenceId": "REF-T29783",
    "packageNo": "PKT-T000073",
    "status": "DispatchLabelCreated",
    "desi": 32,
    "note": "",
    "createdAt": "2026-06-25T06:04:00",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-06-25T03:04:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 2,
      "matchedRuleName": "Yüksek Desi - Ağır Kargo",
      "matchedRuleSummary": "30–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        7
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 7,
          "companyName": "Horoz Lojistik",
          "metrics": {
            "cost": 0.5,
            "deliveryTime": 0.09999999999999996,
            "successRate": 0.6471306471306472,
            "damagedRate": 1,
            "avgPickupHours": 0.6997518610421837,
            "costDiffPct": 0.9449840836312517
          },
          "combined": 0.5712562562500053
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 1
          }
  },
  {
    "id": 74,
    "transferNo": 7100074,
    "dispatchNo": 5100074,
    "fromNodeId": 6,
    "toNodeId": 8,
    "companyId": 6,
    "trackingNo": "DHL-TR-203034",
    "referenceId": "REF-T30054",
    "packageNo": "PKT-T000074",
    "status": "DispatchLabelCreated",
    "desi": 16,
    "note": "",
    "createdAt": "2026-06-25T10:13:00",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-06-25T07:13:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 4,
      "matchedRuleName": "Ege Bölgesi Standart",
      "matchedRuleSummary": "0–30 desi · İzmir",
      "ruleNarrowedCompanyIds": [
        2
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 2,
          "companyName": "Aras Kargo",
          "metrics": {
            "cost": 0.5853658536585367,
            "deliveryTime": 0.2800000000000001,
            "successRate": 0.679563492063492,
            "damagedRate": 0.4666666666666667,
            "avgPickupHours": 1,
            "costDiffPct": 1
          },
          "combined": 0.6188990030971738
        },
        {
          "companyId": 6,
          "companyName": "DHL eCommerce",
          "metrics": {
            "cost": 0.29268292682926833,
            "deliveryTime": 0.6666666666666665,
            "successRate": 0,
            "damagedRate": 0.2592592592592593,
            "avgPickupHours": 0.8538899430740037,
            "costDiffPct": 0.9922127873486873
          },
          "combined": 0.4170402640088454
        }
      ],
      "chosenCompanyId": 6
          }
  },
  {
    "id": 75,
    "transferNo": 7100075,
    "dispatchNo": 5100075,
    "fromNodeId": 1,
    "toNodeId": 14,
    "companyId": 1,
    "trackingNo": "YK-TR-203075",
    "referenceId": "REF-T30325",
    "packageNo": "PKT-T000075",
    "status": "OnTheWay",
    "desi": 14,
    "note": "",
    "createdAt": "2026-06-27T11:23:00",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-06-27T08:23:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-07-02T22:29:40.200Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-07-05T15:23:13.200Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-07-11T09:49:27.600Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-07-14T02:43:00.600Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 1
          }
  },
  {
    "id": 76,
    "transferNo": 7100076,
    "dispatchNo": 5100076,
    "fromNodeId": 10,
    "toNodeId": 13,
    "companyId": 1,
    "trackingNo": "YK-TR-203116",
    "referenceId": "REF-T30596",
    "packageNo": "PKT-T000076",
    "status": "DispatchLabelCreated",
    "desi": 24,
    "note": "",
    "createdAt": "2026-06-29T06:35:00",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-06-29T03:35:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 1
          }
  },
  {
    "id": 77,
    "transferNo": 7100077,
    "dispatchNo": 5100077,
    "fromNodeId": 14,
    "toNodeId": 7,
    "companyId": 2,
    "trackingNo": "ARAS-TR-203157",
    "referenceId": "REF-T30867",
    "packageNo": "PKT-T000077",
    "status": "OnTheWay",
    "desi": 18,
    "note": "",
    "createdAt": "2026-06-29T08:46:00",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-06-29T05:46:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-07-02T03:28:07.200Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-07-07T15:07:40.800Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-07-10T08:57:27.600Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-07-15T09:00:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 2,
          "companyName": "Aras Kargo",
          "metrics": {
            "cost": 0.5853658536585367,
            "deliveryTime": 0.2800000000000001,
            "successRate": 0.679563492063492,
            "damagedRate": 0.4666666666666667,
            "avgPickupHours": 1,
            "costDiffPct": 1
          },
          "combined": 0.6188990030971738
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 2
          }
  },
  {
    "id": 78,
    "transferNo": 7100078,
    "dispatchNo": 5100078,
    "fromNodeId": 7,
    "toNodeId": 2,
    "companyId": 2,
    "trackingNo": "ARAS-TR-203198",
    "referenceId": "REF-T31138",
    "packageNo": "PKT-T000078",
    "status": "OnTheWay",
    "desi": 9,
    "note": "",
    "createdAt": "2026-07-03T14:25:00",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-07-03T11:25:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-07-05T20:32:00.000Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-07-10T00:29:15.000Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-07-12T03:53:33.000Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-07-15T09:00:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 2,
          "companyName": "Aras Kargo",
          "metrics": {
            "cost": 0.5853658536585367,
            "deliveryTime": 0.2800000000000001,
            "successRate": 0.679563492063492,
            "damagedRate": 0.4666666666666667,
            "avgPickupHours": 1,
            "costDiffPct": 1
          },
          "combined": 0.6188990030971738
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 2
          }
  },
  {
    "id": 79,
    "transferNo": 7100079,
    "dispatchNo": 5100079,
    "fromNodeId": 3,
    "toNodeId": 5,
    "companyId": 2,
    "trackingNo": "ARAS-TR-203239",
    "referenceId": "REF-T31409",
    "packageNo": "PKT-T000079",
    "status": "OnTheWay",
    "desi": 34,
    "note": "",
    "createdAt": "2026-07-05T05:38:00",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-07-05T02:38:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-07-07T08:50:02.400Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-07-11T01:31:33.600Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-07-13T00:20:08.400Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-07-14T23:08:43.200Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 2,
      "matchedRuleName": "Yüksek Desi - Ağır Kargo",
      "matchedRuleSummary": "30–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        7
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 2,
          "companyName": "Aras Kargo",
          "metrics": {
            "cost": 0.5853658536585367,
            "deliveryTime": 0.2800000000000001,
            "successRate": 0.679563492063492,
            "damagedRate": 0.4666666666666667,
            "avgPickupHours": 1,
            "costDiffPct": 1
          },
          "combined": 0.6188990030971738
        },
        {
          "companyId": 7,
          "companyName": "Horoz Lojistik",
          "metrics": {
            "cost": 0.5,
            "deliveryTime": 0.09999999999999996,
            "successRate": 0.6471306471306472,
            "damagedRate": 1,
            "avgPickupHours": 0.6997518610421837,
            "costDiffPct": 0.9449840836312517
          },
          "combined": 0.5712562562500053
        }
      ],
      "chosenCompanyId": 2
          }
  },
  {
    "id": 80,
    "transferNo": 7100080,
    "dispatchNo": 5100080,
    "fromNodeId": 7,
    "toNodeId": 3,
    "companyId": 6,
    "trackingNo": "DHL-TR-203280",
    "referenceId": "REF-T31680",
    "packageNo": "PKT-T000080",
    "status": "OnTheWay",
    "desi": 23,
    "note": "",
    "createdAt": "2026-07-07T12:34:00",
    "statusHistory": [
      {
        "status": "DispatchLabelCreated",
        "at": "2026-07-07T09:34:00.000Z"
      },
      {
        "status": "OnTheWayForPickUp",
        "at": "2026-07-09T07:30:38.400Z"
      },
      {
        "status": "OnPickUpAddress",
        "at": "2026-07-10T21:47:50.400Z"
      },
      {
        "status": "ReceivedByProvider",
        "at": "2026-07-13T20:37:39.600Z"
      },
      {
        "status": "OnTheWay",
        "at": "2026-07-15T09:00:00.000Z"
      }
    ],
    "routingDecision": {
      "mode": "auto",
      "contractEligibleCompanyIds": [
        1,
        2,
        6,
        7,
        8
      ],
      "matchedRuleId": 5,
      "matchedRuleName": "Genel Varsayılan",
      "matchedRuleSummary": "0–999 desi · Tüm bölgeler",
      "ruleNarrowedCompanyIds": [
        1
      ],
      "weights": {
        "cost": 0.25,
        "deliveryTime": 0.2,
        "successRate": 0.25,
        "damagedRate": 0.1,
        "avgPickupHours": 0.1,
        "costDiffPct": 0.1
      },
      "scores": [
        {
          "companyId": 6,
          "companyName": "DHL eCommerce",
          "metrics": {
            "cost": 0.29268292682926833,
            "deliveryTime": 0.6666666666666665,
            "successRate": 0,
            "damagedRate": 0.2592592592592593,
            "avgPickupHours": 0.8538899430740037,
            "costDiffPct": 0.9922127873486873
          },
          "combined": 0.4170402640088454
        },
        {
          "companyId": 1,
          "companyName": "Yurtiçi Kargo",
          "metrics": {
            "cost": 0,
            "deliveryTime": 0.25000000000000006,
            "successRate": 0.3408795212073899,
            "damagedRate": 0,
            "avgPickupHours": 0.572184029613961,
            "costDiffPct": 0.9763550805736562
          },
          "combined": 0.29007379132060923
        }
      ],
      "chosenCompanyId": 6
          }
  }
]

export type RoutingCargoType = 'shipment' | 'transfer' | 'return'

export type CarrierMetricKey = 'cost' | 'deliveryTime' | 'successRate' | 'damagedRate' | 'avgPickupHours' | 'costDiffPct'

export const CARRIER_METRIC_KEYS: CarrierMetricKey[] = [
  'cost',
  'deliveryTime',
  'successRate',
  'damagedRate',
  'avgPickupHours',
  'costDiffPct',
]

export const CARRIER_METRIC_LABELS: Record<CarrierMetricKey, string> = {
  cost: 'Maliyet',
  deliveryTime: 'Zamanında Teslimat (OTD)',
  successRate: 'Başarı Oranı',
  damagedRate: 'Hasar Oranı',
  avgPickupHours: 'Ort. Teslim Alma Süresi',
  costDiffPct: 'Maliyet Sapması',
}

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
  shipmentNo?: number
  returnNo?: number
  transferNo?: number
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
  },
  {
    "id": 122,
    "companyId": 1,
    "returnNo": 9300001,
    "invoiceNo": "FTR-2026-00422",
    "expectedCost": 58,
    "realCost": 60,
    "invoiceDate": "2026-04-16T22:06:29.000Z",
    "status": "matched"
  },
  {
    "id": 123,
    "companyId": 4,
    "returnNo": 9300002,
    "invoiceNo": "FTR-2026-00423",
    "expectedCost": 66,
    "realCost": 78,
    "invoiceDate": "2026-04-25T18:09:36.000Z",
    "status": "pending"
  },
  {
    "id": 124,
    "companyId": 2,
    "returnNo": 9300003,
    "invoiceNo": "FTR-2026-00424",
    "expectedCost": 74,
    "realCost": 75,
    "invoiceDate": "2026-04-28T06:25:03.000Z",
    "status": "disputed"
  },
  {
    "id": 125,
    "companyId": 1,
    "returnNo": 9300004,
    "invoiceNo": "FTR-2026-00425",
    "expectedCost": 82,
    "realCost": 93,
    "invoiceDate": "2026-05-03T11:11:44.000Z",
    "status": "matched"
  },
  {
    "id": 126,
    "companyId": 2,
    "returnNo": 9300005,
    "invoiceNo": "FTR-2026-00426",
    "expectedCost": 90,
    "realCost": 90,
    "invoiceDate": "2026-05-03T10:59:10.000Z",
    "status": "matched"
  },
  {
    "id": 127,
    "companyId": 2,
    "returnNo": 9300006,
    "invoiceNo": "FTR-2026-00427",
    "expectedCost": 98,
    "realCost": 108,
    "invoiceDate": "2026-05-05T10:52:50.000Z",
    "status": "pending"
  },
  {
    "id": 128,
    "companyId": 8,
    "returnNo": 9300007,
    "invoiceNo": "FTR-2026-00428",
    "expectedCost": 50,
    "realCost": 49,
    "invoiceDate": "2026-05-06T16:17:17.000Z",
    "status": "disputed"
  },
  {
    "id": 129,
    "companyId": 2,
    "returnNo": 9300008,
    "invoiceNo": "FTR-2026-00429",
    "expectedCost": 58,
    "realCost": 67,
    "invoiceDate": "2026-05-12T02:26:59.000Z",
    "status": "matched"
  },
  {
    "id": 130,
    "companyId": 2,
    "returnNo": 9300009,
    "invoiceNo": "FTR-2026-00430",
    "expectedCost": 66,
    "realCost": 64,
    "invoiceDate": "2026-05-14T03:03:41.000Z",
    "status": "matched"
  },
  {
    "id": 131,
    "companyId": 3,
    "returnNo": 9300010,
    "invoiceNo": "FTR-2026-00431",
    "expectedCost": 74,
    "realCost": 82,
    "invoiceDate": "2026-05-10T11:25:53.000Z",
    "status": "pending"
  },
  {
    "id": 132,
    "companyId": 3,
    "returnNo": 9300011,
    "invoiceNo": "FTR-2026-00432",
    "expectedCost": 82,
    "realCost": 79,
    "invoiceDate": "2026-05-13T06:09:17.000Z",
    "status": "disputed"
  },
  {
    "id": 133,
    "companyId": 3,
    "returnNo": 9300012,
    "invoiceNo": "FTR-2026-00433",
    "expectedCost": 90,
    "realCost": 97,
    "invoiceDate": "2026-05-14T16:23:50.000Z",
    "status": "matched"
  },
  {
    "id": 134,
    "companyId": 1,
    "returnNo": 9300013,
    "invoiceNo": "FTR-2026-00434",
    "expectedCost": 98,
    "realCost": 94,
    "invoiceDate": "2026-05-16T13:06:33.000Z",
    "status": "matched"
  },
  {
    "id": 135,
    "companyId": 1,
    "returnNo": 9300014,
    "invoiceNo": "FTR-2026-00435",
    "expectedCost": 50,
    "realCost": 56,
    "invoiceDate": "2026-05-17T16:19:17.000Z",
    "status": "pending"
  },
  {
    "id": 136,
    "companyId": 1,
    "returnNo": 9300015,
    "invoiceNo": "FTR-2026-00436",
    "expectedCost": 58,
    "realCost": 53,
    "invoiceDate": "2026-05-14T01:05:30.000Z",
    "status": "disputed"
  },
  {
    "id": 137,
    "companyId": 2,
    "returnNo": 9300016,
    "invoiceNo": "FTR-2026-00437",
    "expectedCost": 66,
    "realCost": 71,
    "invoiceDate": "2026-05-16T02:14:02.000Z",
    "status": "matched"
  },
  {
    "id": 138,
    "companyId": 6,
    "returnNo": 9300017,
    "invoiceNo": "FTR-2026-00438",
    "expectedCost": 74,
    "realCost": 68,
    "invoiceDate": "2026-05-19T23:54:24.000Z",
    "status": "matched"
  },
  {
    "id": 139,
    "companyId": 3,
    "returnNo": 9300018,
    "invoiceNo": "FTR-2026-00439",
    "expectedCost": 82,
    "realCost": 86,
    "invoiceDate": "2026-05-21T15:56:58.000Z",
    "status": "pending"
  },
  {
    "id": 140,
    "companyId": 3,
    "returnNo": 9300019,
    "invoiceNo": "FTR-2026-00440",
    "expectedCost": 90,
    "realCost": 83,
    "invoiceDate": "2026-05-23T02:22:19.000Z",
    "status": "disputed"
  },
  {
    "id": 141,
    "companyId": 1,
    "returnNo": 9300020,
    "invoiceNo": "FTR-2026-00441",
    "expectedCost": 98,
    "realCost": 101,
    "invoiceDate": "2026-05-27T12:13:40.000Z",
    "status": "matched"
  },
  {
    "id": 142,
    "companyId": 1,
    "returnNo": 9300021,
    "invoiceNo": "FTR-2026-00442",
    "expectedCost": 50,
    "realCost": 42,
    "invoiceDate": "2026-05-30T01:27:22.000Z",
    "status": "matched"
  },
  {
    "id": 143,
    "companyId": 6,
    "returnNo": 9300022,
    "invoiceNo": "FTR-2026-00443",
    "expectedCost": 58,
    "realCost": 60,
    "invoiceDate": "2026-06-03T11:22:48.000Z",
    "status": "pending"
  },
  {
    "id": 144,
    "companyId": 1,
    "returnNo": 9300023,
    "invoiceNo": "FTR-2026-00444",
    "expectedCost": 66,
    "realCost": 78,
    "invoiceDate": "2026-06-08T21:37:07.000Z",
    "status": "disputed"
  },
  {
    "id": 145,
    "companyId": 7,
    "returnNo": 9300024,
    "invoiceNo": "FTR-2026-00445",
    "expectedCost": 74,
    "realCost": 75,
    "invoiceDate": "2026-06-11T12:49:09.000Z",
    "status": "matched"
  },
  {
    "id": 146,
    "companyId": 1,
    "returnNo": 9300025,
    "invoiceNo": "FTR-2026-00446",
    "expectedCost": 82,
    "realCost": 93,
    "invoiceDate": "2026-06-08T03:09:15.000Z",
    "status": "matched"
  },
  {
    "id": 147,
    "companyId": 2,
    "returnNo": 9300026,
    "invoiceNo": "FTR-2026-00447",
    "expectedCost": 90,
    "realCost": 90,
    "invoiceDate": "2026-06-12T12:20:19.000Z",
    "status": "pending"
  },
  {
    "id": 148,
    "companyId": 4,
    "returnNo": 9300027,
    "invoiceNo": "FTR-2026-00448",
    "expectedCost": 98,
    "realCost": 108,
    "invoiceDate": "2026-06-15T02:01:37.000Z",
    "status": "disputed"
  },
  {
    "id": 149,
    "companyId": 3,
    "returnNo": 9300028,
    "invoiceNo": "FTR-2026-00449",
    "expectedCost": 50,
    "realCost": 49,
    "invoiceDate": "2026-06-16T19:59:12.000Z",
    "status": "matched"
  },
  {
    "id": 150,
    "companyId": 6,
    "returnNo": 9300029,
    "invoiceNo": "FTR-2026-00450",
    "expectedCost": 58,
    "realCost": 67,
    "invoiceDate": "2026-06-19T21:24:11.000Z",
    "status": "matched"
  },
  {
    "id": 151,
    "companyId": 8,
    "returnNo": 9300030,
    "invoiceNo": "FTR-2026-00451",
    "expectedCost": 66,
    "realCost": 64,
    "invoiceDate": "2026-06-16T05:25:56.000Z",
    "status": "pending"
  },
  {
    "id": 152,
    "companyId": 1,
    "returnNo": 9300031,
    "invoiceNo": "FTR-2026-00452",
    "expectedCost": 74,
    "realCost": 82,
    "invoiceDate": "2026-06-18T00:41:53.000Z",
    "status": "disputed"
  },
  {
    "id": 153,
    "companyId": 2,
    "returnNo": 9300032,
    "invoiceNo": "FTR-2026-00453",
    "expectedCost": 82,
    "realCost": 79,
    "invoiceDate": "2026-06-20T18:15:22.000Z",
    "status": "matched"
  },
  {
    "id": 154,
    "companyId": 2,
    "returnNo": 9300033,
    "invoiceNo": "FTR-2026-00454",
    "expectedCost": 90,
    "realCost": 97,
    "invoiceDate": "2026-06-23T10:21:21.000Z",
    "status": "matched"
  },
  {
    "id": 155,
    "companyId": 7,
    "returnNo": 9300034,
    "invoiceNo": "FTR-2026-00455",
    "expectedCost": 98,
    "realCost": 94,
    "invoiceDate": "2026-06-27T20:44:44.000Z",
    "status": "pending"
  },
  {
    "id": 156,
    "companyId": 3,
    "returnNo": 9300035,
    "invoiceNo": "FTR-2026-00456",
    "expectedCost": 50,
    "realCost": 56,
    "invoiceDate": "2026-06-24T23:33:36.000Z",
    "status": "disputed"
  },
  {
    "id": 157,
    "companyId": 3,
    "returnNo": 9300036,
    "invoiceNo": "FTR-2026-00457",
    "expectedCost": 58,
    "realCost": 53,
    "invoiceDate": "2026-06-27T05:46:59.000Z",
    "status": "matched"
  },
  {
    "id": 158,
    "companyId": 1,
    "returnNo": 9300037,
    "invoiceNo": "FTR-2026-00458",
    "expectedCost": 66,
    "realCost": 71,
    "invoiceDate": "2026-06-29T04:58:48.000Z",
    "status": "matched"
  },
  {
    "id": 159,
    "companyId": 3,
    "returnNo": 9300038,
    "invoiceNo": "FTR-2026-00459",
    "expectedCost": 74,
    "realCost": 68,
    "invoiceDate": "2026-07-01T06:09:09.000Z",
    "status": "pending"
  },
  {
    "id": 160,
    "companyId": 3,
    "returnNo": 9300039,
    "invoiceNo": "FTR-2026-00460",
    "expectedCost": 82,
    "realCost": 86,
    "invoiceDate": "2026-07-06T07:07:29.000Z",
    "status": "disputed"
  },
  {
    "id": 161,
    "companyId": 3,
    "returnNo": 9300040,
    "invoiceNo": "FTR-2026-00461",
    "expectedCost": 90,
    "realCost": 83,
    "invoiceDate": "2026-07-02T16:24:30.000Z",
    "status": "matched"
  },
  {
    "id": 162,
    "companyId": 2,
    "returnNo": 9300041,
    "invoiceNo": "FTR-2026-00462",
    "expectedCost": 98,
    "realCost": 101,
    "invoiceDate": "2026-07-08T13:51:47.000Z",
    "status": "matched"
  },
  {
    "id": 163,
    "companyId": 4,
    "returnNo": 9300042,
    "invoiceNo": "FTR-2026-00463",
    "expectedCost": 50,
    "realCost": 42,
    "invoiceDate": "2026-07-12T12:00:00.000Z",
    "status": "pending"
  },
  {
    "id": 164,
    "companyId": 1,
    "transferNo": 7100001,
    "invoiceNo": "FTR-2026-00464",
    "expectedCost": 46,
    "realCost": 53,
    "invoiceDate": "2026-04-17T06:40:00.000Z",
    "status": "matched"
  },
  {
    "id": 165,
    "companyId": 2,
    "transferNo": 7100002,
    "invoiceNo": "FTR-2026-00465",
    "expectedCost": 57,
    "realCost": 60,
    "invoiceDate": "2026-04-21T02:48:00.000Z",
    "status": "matched"
  },
  {
    "id": 166,
    "companyId": 1,
    "transferNo": 7100003,
    "invoiceNo": "FTR-2026-00466",
    "expectedCost": 68,
    "realCost": 67,
    "invoiceDate": "2026-04-22T03:07:00.000Z",
    "status": "pending"
  },
  {
    "id": 167,
    "companyId": 3,
    "transferNo": 7100004,
    "invoiceNo": "FTR-2026-00467",
    "expectedCost": 79,
    "realCost": 74,
    "invoiceDate": "2026-04-24T07:11:00.000Z",
    "status": "disputed"
  },
  {
    "id": 168,
    "companyId": 1,
    "transferNo": 7100005,
    "invoiceNo": "FTR-2026-00468",
    "expectedCost": 90,
    "realCost": 81,
    "invoiceDate": "2026-04-20T07:32:00.000Z",
    "status": "matched"
  },
  {
    "id": 169,
    "companyId": 3,
    "transferNo": 7100006,
    "invoiceNo": "FTR-2026-00469",
    "expectedCost": 101,
    "realCost": 109,
    "invoiceDate": "2026-04-24T03:11:00.000Z",
    "status": "matched"
  },
  {
    "id": 170,
    "companyId": 2,
    "transferNo": 7100007,
    "invoiceNo": "FTR-2026-00470",
    "expectedCost": 42,
    "realCost": 46,
    "invoiceDate": "2026-04-25T10:55:00.000Z",
    "status": "matched"
  },
  {
    "id": 171,
    "companyId": 2,
    "transferNo": 7100008,
    "invoiceNo": "FTR-2026-00471",
    "expectedCost": 53,
    "realCost": 53,
    "invoiceDate": "2026-04-27T09:13:00.000Z",
    "status": "pending"
  },
  {
    "id": 172,
    "companyId": 2,
    "transferNo": 7100009,
    "invoiceNo": "FTR-2026-00472",
    "expectedCost": 64,
    "realCost": 60,
    "invoiceDate": "2026-04-29T07:28:00.000Z",
    "status": "disputed"
  },
  {
    "id": 173,
    "companyId": 1,
    "transferNo": 7100010,
    "invoiceNo": "FTR-2026-00473",
    "expectedCost": 75,
    "realCost": 67,
    "invoiceDate": "2026-04-25T08:34:00.000Z",
    "status": "matched"
  },
  {
    "id": 174,
    "companyId": 1,
    "transferNo": 7100011,
    "invoiceNo": "FTR-2026-00474",
    "expectedCost": 86,
    "realCost": 95,
    "invoiceDate": "2026-04-27T02:11:00.000Z",
    "status": "matched"
  },
  {
    "id": 175,
    "companyId": 2,
    "transferNo": 7100012,
    "invoiceNo": "FTR-2026-00475",
    "expectedCost": 97,
    "realCost": 102,
    "invoiceDate": "2026-04-28T03:28:00.000Z",
    "status": "matched"
  },
  {
    "id": 176,
    "companyId": 2,
    "transferNo": 7100013,
    "invoiceNo": "FTR-2026-00476",
    "expectedCost": 38,
    "realCost": 39,
    "invoiceDate": "2026-04-29T04:47:00.000Z",
    "status": "pending"
  },
  {
    "id": 177,
    "companyId": 1,
    "transferNo": 7100014,
    "invoiceNo": "FTR-2026-00477",
    "expectedCost": 49,
    "realCost": 46,
    "invoiceDate": "2026-04-30T09:49:00.000Z",
    "status": "disputed"
  },
  {
    "id": 178,
    "companyId": 1,
    "transferNo": 7100015,
    "invoiceNo": "FTR-2026-00478",
    "expectedCost": 60,
    "realCost": 53,
    "invoiceDate": "2026-04-27T02:41:00.000Z",
    "status": "matched"
  },
  {
    "id": 179,
    "companyId": 2,
    "transferNo": 7100016,
    "invoiceNo": "FTR-2026-00479",
    "expectedCost": 71,
    "realCost": 81,
    "invoiceDate": "2026-04-29T10:55:00.000Z",
    "status": "matched"
  },
  {
    "id": 180,
    "companyId": 1,
    "transferNo": 7100017,
    "invoiceNo": "FTR-2026-00480",
    "expectedCost": 82,
    "realCost": 88,
    "invoiceDate": "2026-05-03T06:51:00.000Z",
    "status": "matched"
  },
  {
    "id": 181,
    "companyId": 7,
    "transferNo": 7100018,
    "invoiceNo": "FTR-2026-00481",
    "expectedCost": 93,
    "realCost": 95,
    "invoiceDate": "2026-05-08T06:00:00.000Z",
    "status": "pending"
  },
  {
    "id": 182,
    "companyId": 3,
    "transferNo": 7100019,
    "invoiceNo": "FTR-2026-00482",
    "expectedCost": 104,
    "realCost": 102,
    "invoiceDate": "2026-05-13T04:50:00.000Z",
    "status": "disputed"
  },
  {
    "id": 183,
    "companyId": 2,
    "transferNo": 7100020,
    "invoiceNo": "FTR-2026-00483",
    "expectedCost": 45,
    "realCost": 39,
    "invoiceDate": "2026-05-09T05:18:00.000Z",
    "status": "matched"
  },
  {
    "id": 184,
    "companyId": 2,
    "transferNo": 7100021,
    "invoiceNo": "FTR-2026-00484",
    "expectedCost": 56,
    "realCost": 46,
    "invoiceDate": "2026-05-12T06:11:00.000Z",
    "status": "matched"
  },
  {
    "id": 185,
    "companyId": 3,
    "transferNo": 7100022,
    "invoiceNo": "FTR-2026-00485",
    "expectedCost": 67,
    "realCost": 74,
    "invoiceDate": "2026-05-15T09:38:00.000Z",
    "status": "matched"
  },
  {
    "id": 186,
    "companyId": 7,
    "transferNo": 7100023,
    "invoiceNo": "FTR-2026-00486",
    "expectedCost": 78,
    "realCost": 81,
    "invoiceDate": "2026-05-17T11:08:00.000Z",
    "status": "pending"
  },
  {
    "id": 187,
    "companyId": 2,
    "transferNo": 7100024,
    "invoiceNo": "FTR-2026-00487",
    "expectedCost": 89,
    "realCost": 88,
    "invoiceDate": "2026-05-19T11:33:00.000Z",
    "status": "disputed"
  },
  {
    "id": 188,
    "companyId": 3,
    "transferNo": 7100025,
    "invoiceNo": "FTR-2026-00488",
    "expectedCost": 100,
    "realCost": 95,
    "invoiceDate": "2026-05-16T03:23:00.000Z",
    "status": "matched"
  },
  {
    "id": 189,
    "companyId": 7,
    "transferNo": 7100026,
    "invoiceNo": "FTR-2026-00489",
    "expectedCost": 41,
    "realCost": 32,
    "invoiceDate": "2026-05-17T03:29:00.000Z",
    "status": "matched"
  },
  {
    "id": 190,
    "companyId": 6,
    "transferNo": 7100027,
    "invoiceNo": "FTR-2026-00490",
    "expectedCost": 52,
    "realCost": 60,
    "invoiceDate": "2026-05-18T09:04:00.000Z",
    "status": "matched"
  },
  {
    "id": 191,
    "companyId": 2,
    "transferNo": 7100028,
    "invoiceNo": "FTR-2026-00491",
    "expectedCost": 63,
    "realCost": 67,
    "invoiceDate": "2026-05-20T05:37:00.000Z",
    "status": "pending"
  },
  {
    "id": 192,
    "companyId": 6,
    "transferNo": 7100029,
    "invoiceNo": "FTR-2026-00492",
    "expectedCost": 74,
    "realCost": 74,
    "invoiceDate": "2026-05-23T08:33:00.000Z",
    "status": "disputed"
  },
  {
    "id": 193,
    "companyId": 1,
    "transferNo": 7100030,
    "invoiceNo": "FTR-2026-00493",
    "expectedCost": 85,
    "realCost": 81,
    "invoiceDate": "2026-05-20T02:17:00.000Z",
    "status": "matched"
  },
  {
    "id": 194,
    "companyId": 1,
    "transferNo": 7100031,
    "invoiceNo": "FTR-2026-00494",
    "expectedCost": 96,
    "realCost": 88,
    "invoiceDate": "2026-05-22T04:44:00.000Z",
    "status": "matched"
  },
  {
    "id": 195,
    "companyId": 7,
    "transferNo": 7100032,
    "invoiceNo": "FTR-2026-00495",
    "expectedCost": 37,
    "realCost": 46,
    "invoiceDate": "2026-05-24T06:31:00.000Z",
    "status": "matched"
  },
  {
    "id": 196,
    "companyId": 1,
    "transferNo": 7100033,
    "invoiceNo": "FTR-2026-00496",
    "expectedCost": 48,
    "realCost": 53,
    "invoiceDate": "2026-05-25T10:46:00.000Z",
    "status": "pending"
  },
  {
    "id": 197,
    "companyId": 1,
    "transferNo": 7100034,
    "invoiceNo": "FTR-2026-00497",
    "expectedCost": 59,
    "realCost": 60,
    "invoiceDate": "2026-05-27T10:11:00.000Z",
    "status": "disputed"
  },
  {
    "id": 198,
    "companyId": 1,
    "transferNo": 7100035,
    "invoiceNo": "FTR-2026-00498",
    "expectedCost": 70,
    "realCost": 67,
    "invoiceDate": "2026-05-29T11:30:00.000Z",
    "status": "matched"
  },
  {
    "id": 199,
    "companyId": 6,
    "transferNo": 7100036,
    "invoiceNo": "FTR-2026-00499",
    "expectedCost": 81,
    "realCost": 74,
    "invoiceDate": "2026-05-30T11:56:00.000Z",
    "status": "matched"
  },
  {
    "id": 200,
    "companyId": 1,
    "transferNo": 7100037,
    "invoiceNo": "FTR-2026-00500",
    "expectedCost": 92,
    "realCost": 102,
    "invoiceDate": "2026-06-01T05:07:00.000Z",
    "status": "matched"
  },
  {
    "id": 201,
    "companyId": 6,
    "transferNo": 7100038,
    "invoiceNo": "FTR-2026-00501",
    "expectedCost": 103,
    "realCost": 109,
    "invoiceDate": "2026-06-02T10:42:00.000Z",
    "status": "pending"
  },
  {
    "id": 202,
    "companyId": 6,
    "transferNo": 7100039,
    "invoiceNo": "FTR-2026-00502",
    "expectedCost": 44,
    "realCost": 46,
    "invoiceDate": "2026-06-04T06:21:00.000Z",
    "status": "disputed"
  },
  {
    "id": 203,
    "companyId": 1,
    "transferNo": 7100040,
    "invoiceNo": "FTR-2026-00503",
    "expectedCost": 55,
    "realCost": 53,
    "invoiceDate": "2026-05-31T10:30:00.000Z",
    "status": "matched"
  },
  {
    "id": 204,
    "companyId": 2,
    "transferNo": 7100041,
    "invoiceNo": "FTR-2026-00504",
    "expectedCost": 66,
    "realCost": 60,
    "invoiceDate": "2026-06-02T07:21:00.000Z",
    "status": "matched"
  },
  {
    "id": 205,
    "companyId": 3,
    "transferNo": 7100042,
    "invoiceNo": "FTR-2026-00505",
    "expectedCost": 77,
    "realCost": 67,
    "invoiceDate": "2026-06-03T09:50:00.000Z",
    "status": "matched"
  },
  {
    "id": 206,
    "companyId": 3,
    "transferNo": 7100043,
    "invoiceNo": "FTR-2026-00506",
    "expectedCost": 88,
    "realCost": 95,
    "invoiceDate": "2026-06-05T11:59:00.000Z",
    "status": "pending"
  },
  {
    "id": 207,
    "companyId": 2,
    "transferNo": 7100044,
    "invoiceNo": "FTR-2026-00507",
    "expectedCost": 99,
    "realCost": 102,
    "invoiceDate": "2026-06-07T11:35:00.000Z",
    "status": "disputed"
  },
  {
    "id": 208,
    "companyId": 1,
    "transferNo": 7100045,
    "invoiceNo": "FTR-2026-00508",
    "expectedCost": 40,
    "realCost": 39,
    "invoiceDate": "2026-06-04T06:24:00.000Z",
    "status": "matched"
  },
  {
    "id": 209,
    "companyId": 3,
    "transferNo": 7100046,
    "invoiceNo": "FTR-2026-00509",
    "expectedCost": 51,
    "realCost": 46,
    "invoiceDate": "2026-06-05T11:28:00.000Z",
    "status": "matched"
  },
  {
    "id": 210,
    "companyId": 3,
    "transferNo": 7100047,
    "invoiceNo": "FTR-2026-00510",
    "expectedCost": 62,
    "realCost": 53,
    "invoiceDate": "2026-06-07T03:29:00.000Z",
    "status": "matched"
  },
  {
    "id": 211,
    "companyId": 2,
    "transferNo": 7100048,
    "invoiceNo": "FTR-2026-00511",
    "expectedCost": 73,
    "realCost": 81,
    "invoiceDate": "2026-06-08T07:42:00.000Z",
    "status": "pending"
  },
  {
    "id": 212,
    "companyId": 1,
    "transferNo": 7100049,
    "invoiceNo": "FTR-2026-00512",
    "expectedCost": 84,
    "realCost": 88,
    "invoiceDate": "2026-06-10T05:17:00.000Z",
    "status": "disputed"
  },
  {
    "id": 213,
    "companyId": 7,
    "transferNo": 7100050,
    "invoiceNo": "FTR-2026-00513",
    "expectedCost": 95,
    "realCost": 95,
    "invoiceDate": "2026-06-07T03:16:00.000Z",
    "status": "matched"
  },
  {
    "id": 214,
    "companyId": 1,
    "transferNo": 7100051,
    "invoiceNo": "FTR-2026-00514",
    "expectedCost": 36,
    "realCost": 32,
    "invoiceDate": "2026-06-08T05:27:00.000Z",
    "status": "matched"
  },
  {
    "id": 215,
    "companyId": 1,
    "transferNo": 7100052,
    "invoiceNo": "FTR-2026-00515",
    "expectedCost": 47,
    "realCost": 39,
    "invoiceDate": "2026-06-11T08:50:00.000Z",
    "status": "matched"
  },
  {
    "id": 216,
    "companyId": 1,
    "transferNo": 7100053,
    "invoiceNo": "FTR-2026-00516",
    "expectedCost": 58,
    "realCost": 67,
    "invoiceDate": "2026-06-12T08:51:00.000Z",
    "status": "pending"
  },
  {
    "id": 217,
    "companyId": 3,
    "transferNo": 7100054,
    "invoiceNo": "FTR-2026-00517",
    "expectedCost": 69,
    "realCost": 74,
    "invoiceDate": "2026-06-15T02:13:00.000Z",
    "status": "disputed"
  },
  {
    "id": 218,
    "companyId": 6,
    "transferNo": 7100055,
    "invoiceNo": "FTR-2026-00518",
    "expectedCost": 80,
    "realCost": 81,
    "invoiceDate": "2026-06-11T08:03:00.000Z",
    "status": "matched"
  },
  {
    "id": 219,
    "companyId": 1,
    "transferNo": 7100056,
    "invoiceNo": "FTR-2026-00519",
    "expectedCost": 91,
    "realCost": 88,
    "invoiceDate": "2026-06-13T05:05:00.000Z",
    "status": "matched"
  },
  {
    "id": 220,
    "companyId": 1,
    "transferNo": 7100057,
    "invoiceNo": "FTR-2026-00520",
    "expectedCost": 102,
    "realCost": 95,
    "invoiceDate": "2026-06-14T10:07:00.000Z",
    "status": "matched"
  },
  {
    "id": 221,
    "companyId": 2,
    "transferNo": 7100058,
    "invoiceNo": "FTR-2026-00521",
    "expectedCost": 43,
    "realCost": 53,
    "invoiceDate": "2026-06-16T06:42:00.000Z",
    "status": "pending"
  },
  {
    "id": 222,
    "companyId": 1,
    "transferNo": 7100059,
    "invoiceNo": "FTR-2026-00522",
    "expectedCost": 54,
    "realCost": 60,
    "invoiceDate": "2026-06-18T10:51:00.000Z",
    "status": "disputed"
  },
  {
    "id": 223,
    "companyId": 1,
    "transferNo": 7100060,
    "invoiceNo": "FTR-2026-00523",
    "expectedCost": 65,
    "realCost": 67,
    "invoiceDate": "2026-06-16T11:04:00.000Z",
    "status": "matched"
  },
  {
    "id": 224,
    "companyId": 1,
    "transferNo": 7100061,
    "invoiceNo": "FTR-2026-00524",
    "expectedCost": 76,
    "realCost": 74,
    "invoiceDate": "2026-06-19T03:57:00.000Z",
    "status": "matched"
  },
  {
    "id": 225,
    "companyId": 2,
    "transferNo": 7100062,
    "invoiceNo": "FTR-2026-00525",
    "expectedCost": 87,
    "realCost": 81,
    "invoiceDate": "2026-06-20T04:41:00.000Z",
    "status": "matched"
  },
  {
    "id": 226,
    "companyId": 3,
    "transferNo": 7100063,
    "invoiceNo": "FTR-2026-00526",
    "expectedCost": 98,
    "realCost": 88,
    "invoiceDate": "2026-06-21T06:19:00.000Z",
    "status": "pending"
  },
  {
    "id": 227,
    "companyId": 1,
    "transferNo": 7100064,
    "invoiceNo": "FTR-2026-00527",
    "expectedCost": 39,
    "realCost": 46,
    "invoiceDate": "2026-06-25T03:42:00.000Z",
    "status": "disputed"
  },
  {
    "id": 228,
    "companyId": 2,
    "transferNo": 7100065,
    "invoiceNo": "FTR-2026-00528",
    "expectedCost": 50,
    "realCost": 53,
    "invoiceDate": "2026-06-21T10:39:00.000Z",
    "status": "matched"
  },
  {
    "id": 229,
    "companyId": 3,
    "transferNo": 7100066,
    "invoiceNo": "FTR-2026-00529",
    "expectedCost": 61,
    "realCost": 60,
    "invoiceDate": "2026-06-23T06:43:00.000Z",
    "status": "matched"
  },
  {
    "id": 230,
    "companyId": 2,
    "transferNo": 7100067,
    "invoiceNo": "FTR-2026-00530",
    "expectedCost": 72,
    "realCost": 67,
    "invoiceDate": "2026-06-25T07:22:00.000Z",
    "status": "matched"
  },
  {
    "id": 231,
    "companyId": 3,
    "transferNo": 7100068,
    "invoiceNo": "FTR-2026-00531",
    "expectedCost": 83,
    "realCost": 74,
    "invoiceDate": "2026-06-27T04:18:00.000Z",
    "status": "pending"
  },
  {
    "id": 232,
    "companyId": 1,
    "transferNo": 7100069,
    "invoiceNo": "FTR-2026-00532",
    "expectedCost": 94,
    "realCost": 102,
    "invoiceDate": "2026-06-29T02:12:00.000Z",
    "status": "disputed"
  },
  {
    "id": 233,
    "companyId": 1,
    "transferNo": 7100070,
    "invoiceNo": "FTR-2026-00533",
    "expectedCost": 35,
    "realCost": 39,
    "invoiceDate": "2026-06-28T02:48:00.000Z",
    "status": "matched"
  },
  {
    "id": 234,
    "companyId": 1,
    "transferNo": 7100071,
    "invoiceNo": "FTR-2026-00534",
    "expectedCost": 46,
    "realCost": 46,
    "invoiceDate": "2026-06-29T03:28:00.000Z",
    "status": "matched"
  },
  {
    "id": 235,
    "companyId": 2,
    "transferNo": 7100072,
    "invoiceNo": "FTR-2026-00535",
    "expectedCost": 57,
    "realCost": 53,
    "invoiceDate": "2026-06-30T07:49:00.000Z",
    "status": "matched"
  },
  {
    "id": 236,
    "companyId": 1,
    "transferNo": 7100073,
    "invoiceNo": "FTR-2026-00536",
    "expectedCost": 68,
    "realCost": 60,
    "invoiceDate": "2026-07-04T03:04:00.000Z",
    "status": "pending"
  },
  {
    "id": 237,
    "companyId": 6,
    "transferNo": 7100074,
    "invoiceNo": "FTR-2026-00537",
    "expectedCost": 79,
    "realCost": 88,
    "invoiceDate": "2026-07-05T07:13:00.000Z",
    "status": "disputed"
  },
  {
    "id": 238,
    "companyId": 1,
    "transferNo": 7100075,
    "invoiceNo": "FTR-2026-00538",
    "expectedCost": 90,
    "realCost": 95,
    "invoiceDate": "2026-07-03T08:23:00.000Z",
    "status": "matched"
  },
  {
    "id": 239,
    "companyId": 1,
    "transferNo": 7100076,
    "invoiceNo": "FTR-2026-00539",
    "expectedCost": 101,
    "realCost": 102,
    "invoiceDate": "2026-07-06T03:35:00.000Z",
    "status": "matched"
  },
  {
    "id": 240,
    "companyId": 2,
    "transferNo": 7100077,
    "invoiceNo": "FTR-2026-00540",
    "expectedCost": 42,
    "realCost": 39,
    "invoiceDate": "2026-07-07T05:46:00.000Z",
    "status": "matched"
  },
  {
    "id": 241,
    "companyId": 2,
    "transferNo": 7100078,
    "invoiceNo": "FTR-2026-00541",
    "expectedCost": 53,
    "realCost": 46,
    "invoiceDate": "2026-07-12T11:25:00.000Z",
    "status": "pending"
  },
  {
    "id": 242,
    "companyId": 2,
    "transferNo": 7100079,
    "invoiceNo": "FTR-2026-00542",
    "expectedCost": 64,
    "realCost": 74,
    "invoiceDate": "2026-07-15T02:38:00.000Z",
    "status": "disputed"
  },
  {
    "id": 243,
    "companyId": 6,
    "transferNo": 7100080,
    "invoiceNo": "FTR-2026-00543",
    "expectedCost": 75,
    "realCost": 81,
    "invoiceDate": "2026-07-13T09:34:00.000Z",
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
  if (s.status !== 'DeliveredToCustomer' && s.status !== 'DeliveredToStore' && s.status !== 'ReturnToSender') return null
  const d = new Date(s.shipTime)
  d.setHours(d.getHours() + 20 + (s.id % 30))
  return d.toISOString()
}

export function plannedReturnDate(r: ReturnItem) {
  const d = new Date(r.requestDate)
  d.setDate(d.getDate() + Math.ceil(1 + (r.id % 4) * 0.5))
  return d.toISOString()
}

export function actualReturnDate(r: ReturnItem) {
  if (r.status !== 'ReceivedByReturnCenter') return null
  const d = new Date(r.requestDate)
  d.setHours(d.getHours() + 20 + (r.id % 30))
  return d.toISOString()
}

export function plannedTransferDate(tr: TransferItem) {
  const d = new Date(tr.createdAt)
  d.setDate(d.getDate() + Math.ceil(1 + (tr.id % 4) * 0.5))
  return d.toISOString()
}

export function actualTransferDate(tr: TransferItem) {
  if (tr.status !== 'DeliveredToStore') return null
  const d = new Date(tr.createdAt)
  d.setHours(d.getHours() + 20 + (tr.id % 30))
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
  productTypes?: string[]
}

export interface ContractForm {
  companyId: number | ''
  name: string
  minDesi: string | number
  maxDesi: string | number
  minOrderAmount: string | number
  maxOrderAmount: string | number
  orderShipping: boolean
  returnShipping: boolean
  transferShipping: boolean
  productTypes: string[]
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

export const SEED_CONTRACTS: Contract[] = [
  {
    id: 1,
    companyId: 1,
    name: 'Yurtiçi - Ana Depo',
    status: 'active',
    createdAt: '2026-01-10',
    orderShipping: true,
    returnShipping: true,
    transferShipping: true,
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
    transferShipping: true,
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
    transferShipping: true,
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
    transferShipping: false,
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
    transferShipping: true,
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
    transferShipping: true,
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
    transferShipping: true,
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
