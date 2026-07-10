import type { NodeFulfillment, NodeType, NodeWorkingHours, StockNode } from '../data/seed'

export const NODE_TYPES: { value: NodeType; labelKey: string }[] = [
  { value: 'store', labelKey: 'nodeWizard.type_store' },
  { value: 'warehouse', labelKey: 'nodeWizard.type_warehouse' },
]

export const NODE_GROUPS = ['A', 'B', 'C', 'D', 'E'] as const

export const WEEKDAYS = [
  { day: 0, labelKey: 'weekday.monday' },
  { day: 1, labelKey: 'weekday.tuesday' },
  { day: 2, labelKey: 'weekday.wednesday' },
  { day: 3, labelKey: 'weekday.thursday' },
  { day: 4, labelKey: 'weekday.friday' },
  { day: 5, labelKey: 'weekday.saturday' },
  { day: 6, labelKey: 'weekday.sunday' },
] as const

export const TIME_OPTIONS = Array.from({ length: 48 }, (_, i) => {
  const h = String(Math.floor(i / 2)).padStart(2, '0')
  const m = i % 2 === 0 ? '00' : '30'
  return `${h}:${m}`
})

export interface NodeForm {
  id: string
  name: string
  type: NodeType
  country: string
  provinceId: number | ''
  district: string
  address: string
  group: string
  dailyAssignmentLimit: string
  workingHours: NodeWorkingHours[]
  fulfillment: NodeFulfillment
}

function defaultWorkingHours(): NodeWorkingHours[] {
  return WEEKDAYS.map(({ day }) => ({
    day,
    enabled: day < 5,
    start: day < 5 ? '06:00' : '',
    end: day < 5 ? '20:00' : '',
    shippingDeadline: '',
  }))
}

export function emptyNodeForm(): NodeForm {
  return {
    id: '',
    name: '',
    type: 'store',
    country: 'Türkiye',
    provinceId: '',
    district: '',
    address: '',
    group: '',
    dailyAssignmentLimit: '0',
    workingHours: defaultWorkingHours(),
    fulfillment: { pickupFromStore: false, pickupPoint: false, shipFromStore: false },
  }
}

export function nodeFormFromNode(node: StockNode): NodeForm {
  return {
    id: node.code,
    name: node.name,
    type: node.type ?? 'store',
    country: node.country ?? 'Türkiye',
    provinceId: node.provinceId ?? '',
    district: node.district ?? '',
    address: node.address ?? '',
    group: node.group ?? '',
    dailyAssignmentLimit: node.dailyAssignmentLimit != null ? String(node.dailyAssignmentLimit) : '0',
    workingHours: node.workingHours ? node.workingHours.map((w) => ({ ...w })) : defaultWorkingHours(),
    fulfillment: node.fulfillment
      ? { ...node.fulfillment }
      : { pickupFromStore: false, pickupPoint: false, shipFromStore: false },
  }
}

export function validateNodeStep(step: number, f: NodeForm, t: (key: string) => string): Record<string, string> {
  const errs: Record<string, string> = {}
  if (step === 1) {
    if (!f.id.trim()) errs.id = t('validation.node_id_required')
    if (!f.name.trim()) errs.name = t('validation.node_name_required')
    if (!f.provinceId) errs.provinceId = t('validation.node_city_required')
    if (!f.district) errs.district = t('validation.node_district_required')
    if (!f.address.trim()) errs.address = t('validation.node_address_required')
  }
  if (step === 3) {
    if (!f.group) errs.group = t('validation.node_group_required')
  }
  return errs
}

export function nodePayloadFromForm(f: NodeForm): Omit<StockNode, 'id'> {
  return {
    name: f.name.trim(),
    code: f.id.trim().toUpperCase(),
    type: f.type,
    country: f.country,
    provinceId: f.provinceId === '' ? undefined : +f.provinceId,
    district: f.district,
    address: f.address.trim(),
    group: f.group,
    dailyAssignmentLimit: f.dailyAssignmentLimit === '' ? 0 : +f.dailyAssignmentLimit,
    workingHours: f.workingHours,
    fulfillment: f.fulfillment,
  }
}
