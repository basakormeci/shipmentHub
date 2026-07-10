import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Lang } from '../data/seed'
import type { ShipmentColumnKey, ShipmentSearchField } from '../lib/shipments'
import type { ContractForm, ReturnStatus, RoutingCargoType, ShipmentStatus, TransferStatus } from '../data/catalog'
import { emptyContractForm, type ContractFilterStatus } from '../lib/contracts'
import { emptyNodeForm, type NodeForm } from '../lib/nodes'
import type { ReturnColumnKey, ReturnSearchField } from '../lib/returns'
import type { TransferColumnKey, TransferSearchField } from '../lib/transfers'

interface UiState {
  lang: Lang
  langMenuOpen: boolean
  nodeListSearch: string
  nodeListExpanded: Record<number, boolean>
  dashboardDateFrom: string
  dashboardDateTo: string
  reportsDateFrom: string
  reportsDateTo: string
  reportsCompanyId: string
  reportsProvinceId: string
  routingSimulator: {
    desi: string
    provinceId: string
    amount: string
    cargoType: RoutingCargoType | ''
    resultId: number | null | false
  }
  routingWeights: { cost: number; deliveryTime: number; successRate: number }
  shipmentsSearch: string
  shipmentsSearchField: ShipmentSearchField
  shipmentsFilterStatus: ShipmentStatus | 'all'
  shipmentsFilterSupplierId: string
  shipmentsFilterCargoType: '' | 'order' | 'return'
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
  returnsVisibleColumns: Partial<Record<ReturnColumnKey, boolean>>
  transfersSearch: string
  transfersSearchField: TransferSearchField
  transfersFilterStatus: TransferStatus | 'all'
  transfersFilterCompanyId: string
  transfersDateFrom: string
  transfersDateTo: string
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
  setReportsFilter: (key: 'reportsDateFrom' | 'reportsDateTo' | 'reportsCompanyId' | 'reportsProvinceId', v: string) => void
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
        | 'shipmentsFilterCargoType'
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
      reportsCompanyId: '',
      reportsProvinceId: '',
      routingSimulator: { desi: '', provinceId: '', amount: '', cargoType: '', resultId: null },
      routingWeights: { cost: 34, deliveryTime: 33, successRate: 33 },
      shipmentsSearch: '',
      shipmentsSearchField: 'shipmentNo',
      shipmentsFilterStatus: 'all',
      shipmentsFilterSupplierId: '',
      shipmentsFilterCargoType: '',
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
      returnsVisibleColumns: {},
      transfersSearch: '',
      transfersSearchField: 'transferNo',
      transfersFilterStatus: 'all',
      transfersFilterCompanyId: '',
      transfersDateFrom: '',
      transfersDateTo: '',
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
      setRoutingSimulator: (patch) => set({ routingSimulator: { ...get().routingSimulator, ...patch } }),
      setRoutingWeights: (patch) => set({ routingWeights: { ...get().routingWeights, ...patch } }),
      setShipmentsFilter: (patch) => set(patch),
      resetShipmentsFilters: () =>
        set({
          shipmentsSearch: '',
          shipmentsFilterStatus: 'all',
          shipmentsFilterSupplierId: '',
          shipmentsFilterCargoType: '',
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
        }),
      setTransfersFilter: (patch) => set(patch),
      resetTransfersFilters: () =>
        set({
          transfersSearch: '',
          transfersFilterStatus: 'all',
          transfersFilterCompanyId: '',
          transfersDateFrom: '',
          transfersDateTo: '',
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
        reportsCompanyId: s.reportsCompanyId,
        reportsProvinceId: s.reportsProvinceId,
        routingWeights: s.routingWeights,
        shipmentsSearch: s.shipmentsSearch,
        shipmentsSearchField: s.shipmentsSearchField,
        shipmentsFilterStatus: s.shipmentsFilterStatus,
        shipmentsFilterSupplierId: s.shipmentsFilterSupplierId,
        shipmentsFilterCargoType: s.shipmentsFilterCargoType,
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
        returnsVisibleColumns: s.returnsVisibleColumns,
        transfersSearch: s.transfersSearch,
        transfersSearchField: s.transfersSearchField,
        transfersFilterStatus: s.transfersFilterStatus,
        transfersFilterCompanyId: s.transfersFilterCompanyId,
        transfersDateFrom: s.transfersDateFrom,
        transfersDateTo: s.transfersDateTo,
        transfersVisibleColumns: s.transfersVisibleColumns,
        contractsFilterStatus: s.contractsFilterStatus,
        contractWizard: s.contractWizard,
        nodeWizard: s.nodeWizard,
      }),
      version: 5,
    },
  ),
)
