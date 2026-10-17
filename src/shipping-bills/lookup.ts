import { countries } from '@/data/countries'
import { documentCodes } from '@/data/e-sanchit-codes'
import { MarksAndNumbersOption, marksByExporter } from '@/data/marks-and-numbers'
import { loadingPorts, PortOption, ports } from '@/data/ports'
import { quantityCodes } from '@/data/quantity-code'
import schemeCodes from '@/data/scheme-codes'
import { stateOptions } from '@/data/states'
import { Trades } from '@/data/trade-agrements'
import {
  cargoOptions,
  contractTypes,
  currencyOptions,
  paymentTypes,
  priceInclusionTypes,
  sealTypes,
  weightUnits
} from '@/data/types'
import { getDemoData, useDemoData } from './demo-store'
import { Branch, Business, Exporter, SavedBill, ShippingBillFormValues } from './model'
import { shippingBillService } from './shipping-bill-service'
import { useMutation, useQuery } from 'core/react-query'

export type { MarksAndNumbersOption }

export interface LookupOption {
  value: string
  label: string
  sublabel?: string
}

export type BusinessRole = 'consignee' | 'buyer' | 'thirdParty'

const businessRoleFlag = { consignee: 'isConsignee', buyer: 'isBuyer', thirdParty: 'isThirdParty' } as const

/* -------------------------------------------------------------------------- */
/*  Plain async functions (used as queryFn)                                   */
/* -------------------------------------------------------------------------- */

// Mock latency. Delete together with `delay` once the real API is wired in.
const MOCK_DELAY_MS = 250

function delay<T>(value: T, ms = MOCK_DELAY_MS): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}

function toPortOption(port: PortOption): LookupOption {
  return {
    value: port.code,
    label: `${port.name} · ${port.code}`,
    sublabel: `Country: ${port.countryCode}`
  }
}

function branchLabel(branch?: Branch) {
  return branch ? `${branch.branchName} · ${branch.city}` : ''
}

export const lookupApi = {
  async searchExporters(query: string): Promise<Exporter[]> {
    const { exporters } = getDemoData()
    const q = query.trim().toLowerCase()
    return delay(
      exporters.filter(
        (item) => !item.disabled && (item.name.toLowerCase().includes(q) || item.iec.toLowerCase().includes(q))
      )
    )
  },

  async searchExporterBranches(exporterId: string, query: string): Promise<Branch[]> {
    if (!exporterId) return delay([])
    const { exporters } = getDemoData()
    const exporter = exporters.find((item) => String(item.id) === exporterId)
    if (!exporter) return delay([])
    const q = query.trim().toLowerCase()
    return delay(
      exporter.branches.filter(
        (branch) => branch.branchName.toLowerCase().includes(q) || branch.city.toLowerCase().includes(q)
      )
    )
  },

  async searchConsignees(query: string): Promise<Business[]> {
    const { businesses } = getDemoData()
    const q = query.trim().toLowerCase()
    return delay(businesses.filter((item) => item.isConsignee && item.name.toLowerCase().includes(q)))
  },

  async searchConsigneeBranches(consigneeId: string, query: string): Promise<Branch[]> {
    if (!consigneeId) return delay([])
    const { businesses } = getDemoData()
    const consignee = businesses.find((item) => String(item.id) === consigneeId)
    if (!consignee) return delay([])
    const q = query.trim().toLowerCase()
    return delay(
      consignee.branches.filter(
        (branch) => branch.branchName.toLowerCase().includes(q) || branch.city.toLowerCase().includes(q)
      )
    )
  },

  async getExporterById(exporterId: string): Promise<Exporter | undefined> {
    const { exporters } = getDemoData()
    return delay(
      exporters.find((item) => String(item.id) === exporterId),
      100
    )
  },

  async getConsigneeById(consigneeId: string): Promise<Business | undefined> {
    const { businesses } = getDemoData()
    return delay(
      businesses.find((item) => String(item.id) === consigneeId),
      100
    )
  },

  async searchLoadingPorts(query: string): Promise<PortOption[]> {
    const q = query.trim().toLowerCase()
    const portsList = loadingPorts.filter((port) => port.code.startsWith('IN'))
    return delay(portsList.filter((port) => port.name.toLowerCase().includes(q) || port.code.toLowerCase().includes(q)))
  },

  async searchDestinationPorts(query: string): Promise<PortOption[]> {
    const q = query.trim().toLowerCase()
    return delay(ports.filter((port) => port.name.toLowerCase().includes(q) || port.code.toLowerCase().includes(q)))
  },

  async getPortByCode(code: string): Promise<PortOption | undefined> {
    return delay(ports.find((port) => port.code === code) ?? loadingPorts.find((port) => port.code === code), 100)
  },

  async searchExporterOptions(query: string): Promise<LookupOption[]> {
    const items = await lookupApi.searchExporters(query)
    return items.map((item) => ({
      value: String(item.id),
      label: item.name,
      sublabel: item.iec ? `IEC: ${item.iec}` : undefined
    }))
  },

  async searchConsigneeOptions(query: string): Promise<LookupOption[]> {
    const items = await lookupApi.searchConsignees(query)
    return items.map((item) => ({
      value: String(item.id),
      label: item.name
    }))
  },

  // NEW: one search for consignee / buyer / third party (the form used to search consignees for all of them)
  async searchBusinessOptions(role: BusinessRole, query: string): Promise<LookupOption[]> {
    const { businesses } = getDemoData()
    const q = query.trim().toLowerCase()
    const items = businesses.filter((item) => item[businessRoleFlag[role]] && item.name.toLowerCase().includes(q))
    return delay(items.map((item) => ({ value: String(item.id), label: item.name })))
  },

  async searchExporterBranchOptions(exporterId: string, query: string): Promise<LookupOption[]> {
    const items = await lookupApi.searchExporterBranches(exporterId, query)
    return items.map((branch) => ({
      value: String(branch.id),
      label: branchLabel(branch),
      sublabel: branch.address1
    }))
  },

  async searchConsigneeBranchOptions(consigneeId: string, query: string): Promise<LookupOption[]> {
    const items = await lookupApi.searchConsigneeBranches(consigneeId, query)
    return items.map((branch) => ({
      value: String(branch.id),
      label: branchLabel(branch),
      sublabel: branch.address1
    }))
  },

  async getExporterLabel(id: string): Promise<string> {
    const item = await lookupApi.getExporterById(id)
    return item ? item.name : ''
  },

  async getConsigneeLabel(id: string): Promise<string> {
    const item = await lookupApi.getConsigneeById(id)
    return item ? item.name : ''
  },

  // NEW: branch labels (the form used to read these from the owner's branches in the demo store)
  async getExporterBranchLabel(exporterId: string, branchId: string): Promise<string> {
    const exporter = await lookupApi.getExporterById(exporterId)
    return branchLabel(exporter?.branches.find((branch) => String(branch.id) === branchId))
  },

  async getBusinessBranchLabel(businessId: string, branchId: string): Promise<string> {
    const business = await lookupApi.getConsigneeById(businessId)
    return branchLabel(business?.branches.find((branch) => String(branch.id) === branchId))
  },

  async searchLoadingPortOptions(query: string): Promise<LookupOption[]> {
    const items = await lookupApi.searchLoadingPorts(query)
    return items.map(toPortOption)
  },

  async searchDestinationPortOptions(query: string): Promise<LookupOption[]> {
    const items = await lookupApi.searchDestinationPorts(query)
    return items.map(toPortOption)
  },

  async getPortLabel(code: string): Promise<string> {
    const port = await lookupApi.getPortByCode(code)
    return port ? `${port.name} · ${port.code}` : code
  },

  async searchDocumentTypeOptions(query: string): Promise<LookupOption[]> {
    const q = query.toLowerCase().trim()
    const filtered = documentCodes.filter(
      (doc) => doc.label.toLowerCase().includes(q) || doc.value.toLowerCase().includes(q)
    )
    return delay(filtered.map((doc) => ({ value: doc.value, label: doc.label })))
  },

  async getDocumentTypeLabel(value: string): Promise<string> {
    const found = documentCodes.find((doc) => doc.value === value || doc.label === value)
    return delay(found ? found.label : value, 100)
  },

  async getMarksAndNumbersOptions(exporterId: string): Promise<MarksAndNumbersOption[]> {
    return delay(marksByExporter[exporterId] ?? [])
  }
}

/* -------------------------------------------------------------------------- */
/*  Static lists                                                              */
/* -------------------------------------------------------------------------- */

export const lookupLists = {
  documentCodes,
  quantityCodes,
  schemeCodes,
  stateOptions,
  trades: Trades,
  cargoOptions,
  contractTypes,
  currencyOptions,
  paymentTypes,
  priceInclusionTypes,
  sealTypes,
  weightUnits,
  countries,
  fileTypeOptions: [{ value: 'pdf', label: 'PDF' }],
  portOptions: ports.map((port) => ({ value: port.code, label: `${port.name} · ${port.code}` }))
}

/* -------------------------------------------------------------------------- */
/*  React Query hooks                                                         */
/* -------------------------------------------------------------------------- */

interface OptionsArgs {
  query: string
  parentId?: string // exporter / business id for branch lookups
  enabled?: boolean
}

interface LabelArgs {
  value: string
  parentId?: string
}

export type OptionsHook = (args: OptionsArgs) => UseQueryResult<LookupOption[]>
export type LabelHook = (args: LabelArgs) => UseQueryResult<string>

function useOptionsQuery(
  key: string,
  { query, parentId, enabled = true }: OptionsArgs,
  fn: () => Promise<LookupOption[]>
) {
  return useQuery({ queryKey: ['lookup', key, parentId ?? null, query], queryFn: fn, enabled })
}

function useLabelQuery(key: string, { value, parentId }: LabelArgs, fn: () => Promise<string>) {
  return useQuery({ queryKey: ['lookup', key, 'label', parentId ?? null, value], queryFn: fn, enabled: Boolean(value) })
}

// Exporter
export const useExporterOptions: OptionsHook = (args) =>
  useOptionsQuery('exporters', args, () => lookupApi.searchExporterOptions(args.query))

export const useExporterLabel: LabelHook = (args) =>
  useLabelQuery('exporters', args, () => lookupApi.getExporterLabel(args.value))

export const useExporterBranchOptions: OptionsHook = (args) =>
  useOptionsQuery('exporter-branches', args, () =>
    lookupApi.searchExporterBranchOptions(args.parentId ?? '', args.query)
  )

export const useExporterBranchLabel: LabelHook = (args) =>
  useLabelQuery('exporter-branches', args, () => lookupApi.getExporterBranchLabel(args.parentId ?? '', args.value))

// Businesses (consignee / buyer / third party)
export const useConsigneeOptions: OptionsHook = (args) =>
  useOptionsQuery('consignees', args, () => lookupApi.searchBusinessOptions('consignee', args.query))

export const useBuyerOptions: OptionsHook = (args) =>
  useOptionsQuery('buyers', args, () => lookupApi.searchBusinessOptions('buyer', args.query))

export const useThirdPartyOptions: OptionsHook = (args) =>
  useOptionsQuery('third-parties', args, () => lookupApi.searchBusinessOptions('thirdParty', args.query))

export const useBusinessLabel: LabelHook = (args) =>
  useLabelQuery('businesses', args, () => lookupApi.getConsigneeLabel(args.value))

export const useBusinessBranchOptions: OptionsHook = (args) =>
  useOptionsQuery('business-branches', args, () =>
    lookupApi.searchConsigneeBranchOptions(args.parentId ?? '', args.query)
  )

export const useBusinessBranchLabel: LabelHook = (args) =>
  useLabelQuery('business-branches', args, () => lookupApi.getBusinessBranchLabel(args.parentId ?? '', args.value))

// Ports
export const useLoadingPortOptions: OptionsHook = (args) =>
  useOptionsQuery('loading-ports', args, () => lookupApi.searchLoadingPortOptions(args.query))

export const useDestinationPortOptions: OptionsHook = (args) =>
  useOptionsQuery('destination-ports', args, () => lookupApi.searchDestinationPortOptions(args.query))

export const usePortLabel: LabelHook = (args) => useLabelQuery('ports', args, () => lookupApi.getPortLabel(args.value))

// Document types
export const useDocumentTypeOptions: OptionsHook = (args) =>
  useOptionsQuery('document-types', args, () => lookupApi.searchDocumentTypeOptions(args.query))

export const useDocumentTypeLabel: LabelHook = (args) =>
  useLabelQuery('document-types', args, () => lookupApi.getDocumentTypeLabel(args.value))

// Marks & numbers (depends on the selected exporter)
export function useMarksAndNumbers(exporterId?: string) {
  return useQuery({
    queryKey: ['lookup', 'marks-and-numbers', exporterId ?? null],
    queryFn: () => lookupApi.getMarksAndNumbersOptions(exporterId ?? ''),
    enabled: Boolean(exporterId)
  })
}

// Save
export function useUpsertBill() {
  return useMutation({ mutationFn: (data: ShippingBillFormValues) => shippingBillService.upsert(data) })
}

/* -------------------------------------------------------------------------- */

export function useLookup() {
  const { bills } = useDemoData()
  return {
    getBillById(id?: string | number): SavedBill | undefined {
      if (id == null || id === '') return undefined
      return bills.find((item) => item.id === Number(id)) || shippingBillService.getById(id)
    }
  }
}
