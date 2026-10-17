import type { ShippingBillFormValues } from '@/types/types'
import type { TabProps } from '../utils'
import { DetailsTab, detailsTabFields } from './details-tab'
import { InvoicesTab, invoicesTabFields } from './invoices-tab'
import { OthersTab, othersTabFields } from './others-tab'

interface TabConfig {
  id: string
  label: string
  /** Validation errors on any of these fields send the user to this tab. */
  errorFields: readonly (keyof ShippingBillFormValues)[]
  Content: (props: TabProps) => React.ReactNode
}

// Adding a tab = one new entry here. Order is the order of the stepper.
export const tabs: TabConfig[] = [
  { id: 'details', label: '1. Details', errorFields: detailsTabFields, Content: DetailsTab },
  { id: 'invoices', label: '2. Invoices & goods', errorFields: invoicesTabFields, Content: InvoicesTab },
  { id: 'documents', label: '3. Others', errorFields: othersTabFields, Content: OthersTab }
]
