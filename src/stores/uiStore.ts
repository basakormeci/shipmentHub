import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Lang } from '../data/seed'
import type { ShipmentColumnKey, ShipmentSearchField } from '../lib/shipments'
import type { ContractForm, ReturnStatus, RoutingCargoType, ShipmentStatus } from '../data/catalog'
import { emptyContractForm, type ContractFilterStatus } from '../lib/contracts'
import { emptyNodeForm, type NodeForm } from '../lib/nodes'
import type { ReturnColumnKey, ReturnSearchField } from '../lib/returns'
import type { TransferColumnKey, TransferSearchField } from '../lib/transfers'
import type { ReportColumnKey } from '../lib/reports'
import type { UnifiedColumnKey } from '../lib/allShipmentsReport'

interface UiState {
  lang: Lang
  langMenuOpen: boolean
  nodeListSearch: string
  nodeListExpanded: Record<number, boolean>
  dashboardDateFrom: string
  dashboardDateTo: string
  reportsDateFrom: string
  reportsDateTo: string
  reportsCompanySelection: Partial<Record<string, boolean>>
  reportsProvinceSelection: Partial<Record<string, boolean>>
  reportsKindSelection: Partial<Record<string, boolean>>
  reportsChannelSelection: Partial<Record<string, boolean>>
  reportsVisibleColumns: Partial<Record<ReportColumnKey, boolean>>
  allShipmentsReportDateFrom: string
  allShipmentsReportDateTo: string
  allShipmentsReportCompanySelection: Partial<Record<string, boolean>>
  allShipmentsReportKindSelection: Partial<Record<string, boolean>>
  allShipmentsReportProvinceSelection: Partial<Record<string, boolean>>
  allShipmentsReportVisibleColumns: Partial<Record<UnifiedColumnKey, boolean>>
  allShipmentsReportPage: number
  routingSimulator: {
    desi: string
    provinceId: string
    amount: string
    cargoType: RoutingCargoType | ''
    resultId: number | null | false
  }
  routingWeights: {
    deliveryTime: number
    successRate: number
    damagedRate: number
    avgPickupHours: number
    costDiffPct: number
  }
  shipmentsSearch: string
  shipmentsSearchField: ShipmentSearchField
  shipmentsFilterStatus: ShipmentStatus | 'all'
  shipmentsFilterSupplierId: string
  shipmentsDateFrom: string
  shipmentsDateTo: string
  shipmentsPage: number
  shipmentsVisibleColumns: Partial<Record<ShipmentColumnKey, boolean>>
  returnsSearch: string
  returnsSearchField: ReturnSearchField
  returnsFilterStatus: ReturnStatus | 'all'
  returnsFilterCompanyId: string
  returnsFilterReason: string
  returnsDateFrom: string
  returnsDateTo: string
  returnsPage: number
  returnsVisibleColumns: Partial<Record<ReturnColumnKey, boolean>>
  transfersSearch: string
  transfersSearchField: TransferSearchField
  transfersFilterStatus: ShipmentStatus | 'all'
  transfersFilterCompanyId: string
  transfersDateFrom: string
  transfersDateTo: string
  transfersPage: number
  transfersVisibleColumns: Partial<Record<TransferColumnKey, boolean>>
  contractsFilterStatus: ContractFilterStatus
  contractWizard: { step: number; editingId: number | null; f: ContractForm }
  nodeWizard: { step: number; editingId: number | null; f: NodeForm }
  setLang: (lang: Lang) => void
  toggleLangMenu: () => void
  closeLangMenu: () => void
  setNodeListSearch: (value: string) => void
  toggleNodeExpanded: (id: number) => void
  setDashboardDateFrom: (v: string) => void
  setDashboardDateTo: (v: string) => void
  setReportsFilter: (key: 'reportsDateFrom' | 'reportsDateTo', v: string) => void
  setReportsCompanySelection: (sel: Partial<Record<string, boolean>>) => void
  setReportsProvinceSelection: (sel: Partial<Record<string, boolean>>) => void
  setReportsKindSelection: (sel: Partial<Record<string, boolean>>) => void
  setReportsChannelSelection: (sel: Partial<Record<string, boolean>>) => void
  setReportsVisibleColumns: (cols: Partial<Record<ReportColumnKey, boolean>>) => void
  setAllShipmentsReportFilter: (key: 'allShipmentsReportDateFrom' | 'allShipmentsReportDateTo', v: string) => void
  setAllShipmentsReportCompanySelection: (sel: Partial<Record<string, boolean>>) => void
  setAllShipmentsReportKindSelection: (sel: Partial<Record<string, boolean>>) => void
  setAllShipmentsReportProvinceSelection: (sel: Partial<Record<string, boolean>>) => void
  setAllShipmentsReportVisibleColumns: (cols: Partial<Record<UnifiedColumnKey, boolean>>) => void
  setAllShipmentsReportPage: (page: number) => void
  setRoutingSimulator: (patch: Partial<UiState['routingSimulator']>) => void
  setRoutingWeights: (patch: Partial<UiState['routingWeights']>) => void
  setShipmentsFilter: (
    patch: Partial<
      Pick<
        UiState,
        | 'shipmentsSearch'
        | 'shipmentsSearchField'
        | 'shipmentsFilterStatus'
        | 'shipmentsFilterSupplierId'
        | 'shipmentsDateFrom'
        | 'shipmentsDateTo'
        | 'shipmentsPage'
        | 'shipmentsVisibleColumns'
      >
    >,
  ) => void
  resetShipmentsFilters: () => void
  setReturnsFilter: (
    patch: Partial<
      Pick<
        UiState,
        | 'returnsSearch'
        | 'returnsSearchField'
        | 'returnsFilterStatus'
        | 'returnsFilterCompanyId'
        | 'returnsFilterReason'
        | 'returnsDateFrom'
        | 'returnsDateTo'
        | 'returnsPage'
        | 'returnsVisibleColumns'
      >
    >,
  ) => void
  resetReturnsFilters: () => void
  setTransfersFilter: (
    patch: Partial<
      Pick<
        UiState,
        | 'transfersSearch'
        | 'transfersSearchField'
        | 'transfersFilterStatus'
        | 'transfersFilterCompanyId'
        | 'transfersDateFrom'
        | 'transfersDateTo'
        | 'transfersPage'
        | 'transfersVisibleColumns'
      >
    >,
  ) => void
  resetTransfersFilters: () => void
  setContractsFilterStatus: (status: ContractFilterStatus) => void
  setContractWizard: (patch: Partial<{ step: number; editingId: number | null; f: ContractForm }>) => void
  resetContractWizard: () => void
  setNodeWizard: (patch: Partial<{ step: number; editingId: number | null; f: NodeForm }>) => void
  resetNodeWizard: () => void
}

export const useUiStore = create<UiState>()(
  persist(
    (set, get) => ({
      lang: 'tr',
      langMenuOpen: false,
      nodeListSearch: '',
      nodeListExpanded: {},
      dashboardDateFrom: '',
      dashboardDateTo: '',
      reportsDateFrom: '2026-04-10',
      reportsDateTo: '2026-07-08',
      reportsCompanySelection: {},
      reportsProvinceSelection: {},
      reportsKindSelection: {},
      reportsChannelSelection: {},
      reportsVisibleColumns: {},
      allShipmentsReportDateFrom: '',
      allShipmentsReportDateTo: '',
      allShipmentsReportCompanySelection: {},
      allShipmentsReportKindSelection: {},
      allShipmentsReportProvinceSelection: {},
      allShipmentsReportVisibleColumns: {},
      allShipmentsReportPage: 1,
      routingSimulator: { desi: '', provinceId: '', amount: '', cargoType: '', resultId: null },
      routingWeights: { deliveryTime: 3, successRate: 4, damagedRate: 2, avgPickupHours: 2, costDiffPct: 2 },
      shipmentsSearch: '',
      shipmentsSearchField: 'shipmentNo',
      shipmentsFilterStatus: 'all',
      shipmentsFilterSupplierId: '',
      shipmentsDateFrom: '',
      shipmentsDateTo: '',
      shipmentsPage: 1,
      shipmentsVisibleColumns: {},
      returnsSearch: '',
      returnsSearchField: 'returnNo',
      returnsFilterStatus: 'all',
      returnsFilterCompanyId: '',
      returnsFilterReason: '',
      returnsDateFrom: '',
      returnsDateTo: '',
      returnsPage: 1,
      returnsVisibleColumns: {},
      transfersSearch: '',
      transfersSearchField: 'transferNo',
      transfersFilterStatus: 'all',
      transfersFilterCompanyId: '',
      transfersDateFrom: '',
      transfersDateTo: '',
      transfersPage: 1,
      transfersVisibleColumns: {},
      contractsFilterStatus: 'all',
      contractWizard: { step: 1, editingId: null, f: emptyContractForm() },
      nodeWizard: { step: 1, editingId: null, f: emptyNodeForm() },
      setLang: (lang) => set({ lang, langMenuOpen: false }),
      toggleLangMenu: () => set({ langMenuOpen: !get().langMenuOpen }),
      closeLangMenu: () => set({ langMenuOpen: false }),
      setNodeListSearch: (value) => set({ nodeListSearch: value }),
      toggleNodeExpanded: (id) => {
        const cur = get().nodeListExpanded
        set({ nodeListExpanded: { ...cur, [id]: !cur[id] } })
      },
      setDashboardDateFrom: (v) => set({ dashboardDateFrom: v }),
      setDashboardDateTo: (v) => set({ dashboardDateTo: v }),
      setReportsFilter: (key, v) => set({ [key]: v } as Partial<UiState>),
      setReportsCompanySelection: (sel) => set({ reportsCompanySelection: sel }),
      setReportsProvinceSelection: (sel) => set({ reportsProvinceSelection: sel }),
      setReportsKindSelection: (sel) => set({ reportsKindSelection: sel }),
      setReportsChannelSelection: (sel) => set({ reportsChannelSelection: sel }),
      setReportsVisibleColumns: (cols) => set({ reportsVisibleColumns: cols }),
      setAllShipmentsReportFilter: (key, v) => set({ [key]: v, allShipmentsReportPage: 1 } as Partial<UiState>),
      setAllShipmentsReportCompanySelection: (sel) => set({ allShipmentsReportCompanySelection: sel, allShipmentsReportPage: 1 }),
      setAllShipmentsReportKindSelection: (sel) => set({ allShipmentsReportKindSelection: sel, allShipmentsReportPage: 1 }),
      setAllShipmentsReportProvinceSelection: (sel) => set({ allShipmentsReportProvinceSelection: sel, allShipmentsReportPage: 1 }),
      setAllShipmentsReportVisibleColumns: (cols) => set({ allShipmentsReportVisibleColumns: cols }),
      setAllShipmentsReportPage: (page) => set({ allShipmentsReportPage: page }),
      setRoutingSimulator: (patch) => set({ routingSimulator: { ...get().routingSimulator, ...patch } }),
      setRoutingWeights: (patch) => set({ routingWeights: { ...get().routingWeights, ...patch } }),
      setShipmentsFilter: (patch) => set(patch),
      resetShipmentsFilters: () =>
        set({
          shipmentsSearch: '',
          shipmentsFilterStatus: 'all',
          shipmentsFilterSupplierId: '',
          shipmentsDateFrom: '',
          shipmentsDateTo: '',
          shipmentsPage: 1,
        }),
      setReturnsFilter: (patch) => set(patch),
      resetReturnsFilters: () =>
        set({
          returnsSearch: '',
          returnsFilterStatus: 'all',
          returnsFilterCompanyId: '',
          returnsFilterReason: '',
          returnsDateFrom: '',
          returnsDateTo: '',
          returnsPage: 1,
        }),
      setTransfersFilter: (patch) => set(patch),
      resetTransfersFilters: () =>
        set({
          transfersSearch: '',
          transfersFilterStatus: 'all',
          transfersFilterCompanyId: '',
          transfersDateFrom: '',
          transfersDateTo: '',
          transfersPage: 1,
        }),
      setContractsFilterStatus: (status) => set({ contractsFilterStatus: status }),
      setContractWizard: (patch) =>
        set({ contractWizard: { ...get().contractWizard, ...patch } }),
      resetContractWizard: () =>
        set({ contractWizard: { step: 1, editingId: null, f: emptyContractForm() } }),
      setNodeWizard: (patch) => set({ nodeWizard: { ...get().nodeWizard, ...patch } }),
      resetNodeWizard: () => set({ nodeWizard: { step: 1, editingId: null, f: emptyNodeForm() } }),
    }),
    {
      name: 'shipment-hub:ui',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (s) => ({
        lang: s.lang,
        nodeListSearch: s.nodeListSearch,
        nodeListExpanded: s.nodeListExpanded,
        dashboardDateFrom: s.dashboardDateFrom,
        dashboardDateTo: s.dashboardDateTo,
        reportsDateFrom: s.reportsDateFrom,
        reportsDateTo: s.reportsDateTo,
        reportsCompanySelection: s.reportsCompanySelection,
        reportsProvinceSelection: s.reportsProvinceSelection,
        reportsKindSelection: s.reportsKindSelection,
        reportsChannelSelection: s.reportsChannelSelection,
        reportsVisibleColumns: s.reportsVisibleColumns,
        allShipmentsReportDateFrom: s.allShipmentsReportDateFrom,
        allShipmentsReportDateTo: s.allShipmentsReportDateTo,
        allShipmentsReportCompanySelection: s.allShipmentsReportCompanySelection,
        allShipmentsReportKindSelection: s.allShipmentsReportKindSelection,
        allShipmentsReportProvinceSelection: s.allShipmentsReportProvinceSelection,
        allShipmentsReportVisibleColumns: s.allShipmentsReportVisibleColumns,
        allShipmentsReportPage: s.allShipmentsReportPage,
        routingWeights: s.routingWeights,
        shipmentsSearch: s.shipmentsSearch,
        shipmentsSearchField: s.shipmentsSearchField,
        shipmentsFilterStatus: s.shipmentsFilterStatus,
        shipmentsFilterSupplierId: s.shipmentsFilterSupplierId,
        shipmentsDateFrom: s.shipmentsDateFrom,
        shipmentsDateTo: s.shipmentsDateTo,
        shipmentsPage: s.shipmentsPage,
        shipmentsVisibleColumns: s.shipmentsVisibleColumns,
        returnsSearch: s.returnsSearch,
        returnsSearchField: s.returnsSearchField,
        returnsFilterStatus: s.returnsFilterStatus,
        returnsFilterCompanyId: s.returnsFilterCompanyId,
        returnsFilterReason: s.returnsFilterReason,
        returnsDateFrom: s.returnsDateFrom,
        returnsDateTo: s.returnsDateTo,
        returnsPage: s.returnsPage,
        returnsVisibleColumns: s.returnsVisibleColumns,
        transfersSearch: s.transfersSearch,
        transfersSearchField: s.transfersSearchField,
        transfersFilterStatus: s.transfersFilterStatus,
        transfersFilterCompanyId: s.transfersFilterCompanyId,
        transfersDateFrom: s.transfersDateFrom,
        transfersDateTo: s.transfersDateTo,
        transfersPage: s.transfersPage,
        transfersVisibleColumns: s.transfersVisibleColumns,
        contractsFilterStatus: s.contractsFilterStatus,
        contractWizard: s.contractWizard,
        nodeWizard: s.nodeWizard,
      }),
      version: 8,
      migrate: (persisted, version) => {
        let state = persisted as UiState
        if (version < 7) {
          state = { ...state, routingWeights: { cost: 4, deliveryTime: 3, successRate: 4, damagedRate: 2, avgPickupHours: 2, costDiffPct: 2 } } as UiState
        }
        if (version < 8) {
          // 'cost' (Maliyet) was dropped as a routing weighting criterion — strip any
          // leftover key from a session that persisted before this change.
          const { cost: _cost, ...rest } = state.routingWeights as UiState['routingWeights'] & { cost?: number }
          state = { ...state, routingWeights: rest }
        }
        return state
      },
    },
  ),
)
