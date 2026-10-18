import type { ShippingBillFormValues } from '@/types/types'
import type { Path } from 'ui/form'
import type { TabProps } from '../utils'
import { DetailsTab, detailsTabFields } from './details-tab'
import { InvoicesTab, invoicesTabFields } from './invoices-tab'
import { OthersTab, othersTabFields } from './others-tab'

interface TabConfig {
  id: string
  label: string
  /** Validation errors on any of these fields send the user to this tab. */
  errorFields: readonly (keyof ShippingBillFormValues)[]
  validationFields: (values: ShippingBillFormValues) => Path<ShippingBillFormValues>[]
  Content: (props: TabProps) => React.ReactNode
}

// Adding a tab = one new entry here. Order is the order of the stepper.
export const tabs: TabConfig[] = [
  {
    id: 'details',
    label: '1. Details',
    errorFields: detailsTabFields,
    validationFields: () => [...detailsTabFields],
    Content: DetailsTab
  },
  {
    id: 'invoices',
    label: '2. Invoices & goods',
    errorFields: invoicesTabFields,
    validationFields: (values) =>
      values.invoices.flatMap((invoice, invoiceIndex) => [
        `invoices.${invoiceIndex}.invoiceNumber`,
        `invoices.${invoiceIndex}.invoiceDate`,
        `invoices.${invoiceIndex}.currency`,
        `invoices.${invoiceIndex}.contractType`,
        ...invoice.items.flatMap((_, itemIndex) => [
          `invoices.${invoiceIndex}.items.${itemIndex}.ritcCode`,
          `invoices.${invoiceIndex}.items.${itemIndex}.goodsDescription1`,
          `invoices.${invoiceIndex}.items.${itemIndex}.quantity`,
          `invoices.${invoiceIndex}.items.${itemIndex}.unitOfMeasurement`,
          `invoices.${invoiceIndex}.items.${itemIndex}.unitPrice`
        ])
      ]) as Path<ShippingBillFormValues>[],
    Content: InvoicesTab
  },
  {
    id: 'documents',
    label: '3. Others',
    errorFields: othersTabFields,
    validationFields: (values) =>
      [
        ...values.containers.map((_, index) => `containers.${index}.containerNumber`),
        ...values.packingRanges.flatMap((_, index) => [
          `packingRanges.${index}.packingNumberFrom`,
          `packingRanges.${index}.packingNumberTo`
        ]),
        ...values.documents.flatMap((_, index) => [
          `documents.${index}.documentTypeCode`,
          `documents.${index}.documentReferenceNumber`
        ]),
        ...values.licenses.map((_, index) => `licenses.${index}.registrationNumber`)
      ] as Path<ShippingBillFormValues>[],
    Content: OthersTab
  }
]
