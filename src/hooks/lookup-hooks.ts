import { lookupApi } from '@/api/lookup-api'
import type { LookupOption } from '@/api/lookup-api'
import { useQuery } from 'core/react-query'

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

interface LookupQueryResult<T> {
  data: T | undefined
  isFetching: boolean
}

export type OptionsHook = (args: OptionsArgs) => LookupQueryResult<LookupOption[]>
export type LabelHook = (args: LabelArgs) => LookupQueryResult<string>

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
