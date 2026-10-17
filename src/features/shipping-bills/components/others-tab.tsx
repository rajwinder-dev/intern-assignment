import type { ShippingBillFormValues } from '@/types/types'
import type { TabProps } from '../utils'
import { CargoSection } from './cargo-section'
import { DocumentsSection } from './documents-section'
import { LicensesSection } from './licenses-section'

/** Top-level fields owned by this tab. Used to jump to the tab when validation fails. */
export const othersTabFields = [
  'containers',
  'packingRanges',
  'documents',
  'licenses'
] as const satisfies readonly (keyof ShippingBillFormValues)[]

export function OthersTab({ formCtx }: TabProps) {
  return (
    <>
      <CargoSection formCtx={formCtx} />
      <DocumentsSection formCtx={formCtx} />
      <LicensesSection formCtx={formCtx} />
    </>
  )
}
