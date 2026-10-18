import { getDemoData } from '@/data/demo-store'
import { documentCodes } from '@/data/e-sanchit-codes'
import type { MarksAndNumbersOption } from '@/data/marks-and-numbers'
import { marksByExporter } from '@/data/marks-and-numbers'
import { loadingPorts, ports } from '@/data/ports'
import type { Branch, Business, Exporter, PortOption } from '@/types/types'

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
