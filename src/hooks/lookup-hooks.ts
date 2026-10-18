import type { LookupOption } from '@/api/lookup-api'
import { lookupApi } from '@/api/lookup-api'
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
export function useExporterOptions(args) 
  useOptionsQuery('exporters', args, () => lookupApi.searchExporterOptions(args.query))

export function useExporterLabel(args) 
  useLabelQuery('exporters', args, () => lookupApi.getExporterLabel(args.value))

export function useExporterBranchOptions(args) 
  useOptionsQuery('exporter-branches', args, () =>
    lookupApi.searchExporterBranchOptions(args.parentId ?? '', args.query)
  )

export function useExporterBranchLabel(args) 
  useLabelQuery('exporter-branches', args, () => lookupApi.getExporterBranchLabel(args.parentId ?? '', args.value))

// Businesses (consignee / buyer / third party)
export function useConsigneeOptions(args) 
  useOptionsQuery('consignees', args, () => lookupApi.searchBusinessOptions('consignee', args.query))

export function useBuyerOptions(args) 
  useOptionsQuery('buyers', args, () => lookupApi.searchBusinessOptions('buyer', args.query))

export function useThirdPartyOptions(args) 
  useOptionsQuery('third-parties', args, () => lookupApi.searchBusinessOptions('thirdParty', args.query))

export function useBusinessLabel(args) 
  useLabelQuery('businesses', args, () => lookupApi.getConsigneeLabel(args.value))

export function useBusinessBranchOptions(args) 
  useOptionsQuery('business-branches', args, () =>
    lookupApi.searchConsigneeBranchOptions(args.parentId ?? '', args.query)
  )

export function useBusinessBranchLabel(args) 
  useLabelQuery('business-branches', args, () => lookupApi.getBusinessBranchLabel(args.parentId ?? '', args.value))

// Ports
export function useLoadingPortOptions(args) 
  useOptionsQuery('loading-ports', args, () => lookupApi.searchLoadingPortOptions(args.query))

export function useDestinationPortOptions(args) 
  useOptionsQuery('destination-ports', args, () => lookupApi.searchDestinationPortOptions(args.query))

export function usePortLabel(args)  useLabelQuery('ports', args, () => lookupApi.getPortLabel(args.value))

// Document types
export function useDocumentTypeOptions(args) 
  useOptionsQuery('document-types', args, () => lookupApi.searchDocumentTypeOptions(args.query))

export function useDocumentTypeLabel(args) 
  useLabelQuery('document-types', args, () => lookupApi.getDocumentTypeLabel(args.value))

// Marks & numbers (depends on the selected exporter)
export function useMarksAndNumbers(exporterId?: string) {
  return useQuery({
    queryKey: ['lookup', 'marks-and-numbers', exporterId ?? null],
    queryFn: () => lookupApi.getMarksAndNumbersOptions(exporterId ?? ''),
    enabled: Boolean(exporterId)
  })
}
