import { useFieldArray } from 'core/form'
import { Button } from 'ui/basic/button'
import { emptyInvoice, type ShippingBillFormValues } from '@/shipping-bills/model'
import type { TabProps } from '../utils'
import { InvoiceEditor } from './invoice-editor'

/** Top-level fields owned by this tab. Used to jump to the tab when validation fails. */
export const invoicesTabFields = ['invoices'] as const satisfies readonly (keyof ShippingBillFormValues)[]

export function InvoicesTab({ formCtx }: TabProps) {
  const { fields: invoices, append, remove } = useFieldArray({ control: formCtx.hooks.control, name: 'invoices' })

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold">Invoices & goods</h2>
          <p className="text-sm text-gray-500">One invoice and one item are ready to fill in.</p>
        </div>
        <Button variant="outline" onClick={() => append(emptyInvoice())}>
          + Add invoice
        </Button>
      </div>
      {invoices.map((field, index) => (
        <InvoiceEditor
          key={field.id}
          formCtx={formCtx}
          index={index}
          onRemove={() => remove(index)}
          canRemove={invoices.length > 1}
        />
      ))}
    </>
  )
}
