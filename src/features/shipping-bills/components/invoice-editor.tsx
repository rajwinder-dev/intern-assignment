import { useFieldArray } from 'core/form'
import { Button } from 'ui/basic/button'
import { Card, CardContent, CardHeader } from 'ui/basic/card'
import { Checkbox } from 'ui/inputs/checkbox'
import { Input } from 'ui/inputs/input'
import { lookupLists } from '@/constants/constants'
import { emptyItem, invoiceTotal } from '@/model/model'
import { SectionHeading } from '../components/layout'
import { PartyFields } from '../components/party-fields'
import { BillSelect, dateType, formatMoney, type BillFormContext } from '../utils'
import { ChargeRow, type ChargeName } from './charge-row'
import { ItemEditor } from './item-editor'

const { contractTypes, currencyOptions, paymentTypes, priceInclusionTypes } = lookupLists

// Two charges per row, laid out as a bordered grid. Packing charges is rendered separately below.
const chargeRows: [ChargeName, string][][] = [
  [
    ['freight', 'Freight'],
    ['insurance', 'Insurance']
  ],
  [
    ['commission', 'Commission'],
    ['discount', 'Discount']
  ]
]

const rowClass = 'grid grid-cols-1 divide-y divide-gray-100 lg:grid-cols-2 lg:divide-x lg:divide-y-0'

interface InvoiceEditorProps {
  formCtx: BillFormContext
  index: number
  onRemove: () => void
  canRemove: boolean
}

export function InvoiceEditor({ formCtx, index, onRemove, canRemove }: InvoiceEditorProps) {
  const { register, control, watch } = formCtx.hooks
  const invoice = watch(`invoices.${index}`)
  const buyerSame = watch(`invoices.${index}.buyerSameAsConsignee`)
  const {
    fields: items,
    append: addItem,
    remove: removeItem
  } = useFieldArray({ control, name: `invoices.${index}.items` })

  return (
    <Card className="mb-4">
      <CardHeader className="flex-row items-start justify-between gap-3">
        <h3 className="font-semibold">Invoice {index + 1}</h3>
        {canRemove && (
          <Button size="sm" variant="ghost" onClick={onRemove}>
            Remove invoice
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Input label="Invoice number" {...register(`invoices.${index}.invoiceNumber`)} />
          <Input label="Invoice date" type={dateType} {...register(`invoices.${index}.invoiceDate`)} />
          <div className="flex gap-2">
            <div className="w-[100px] shrink-0">
              <BillSelect
                label="Currency"
                name={`invoices.${index}.currency`}
                options={currencyOptions}
                rules={{ required: true }}
              />
            </div>
            <div className="flex-1">
              <Input
                label="Total"
                type="number"
                min={0}
                {...register(`invoices.${index}.invoiceTotal`)}
                placeholder="0.00"
              />
            </div>
          </div>
          <BillSelect
            label="Contract"
            name={`invoices.${index}.contractType`}
            options={contractTypes}
            rules={{ required: true }}
          />
        </div>

        <label className="flex items-center gap-2 text-sm">
          <Checkbox {...register(`invoices.${index}.buyerSameAsConsignee`)} />
          Buyer & consignee are same
        </label>
        {!buyerSame && (
          <PartyFields
            formCtx={formCtx}
            role="buyer"
            ownerName={`invoices.${index}.buyerId`}
            branchName={`invoices.${index}.buyerBranchId`}
            label="Buyer"
          />
        )}

        <div className="space-y-4">
          <div className="divide-y divide-gray-100 rounded-lg border border-gray-200">
            {chargeRows.map((row) => (
              <div key={row[0][0]} className={rowClass}>
                {row.map(([name, label]) => (
                  <ChargeRow
                    key={name}
                    formCtx={formCtx}
                    invoiceIndex={index}
                    name={name}
                    label={label}
                    currency={invoice.currency}
                  />
                ))}
              </div>
            ))}
            <div className={rowClass}>
              <ChargeRow
                formCtx={formCtx}
                invoiceIndex={index}
                name="otherDeductions"
                label="Other Deductions"
                currency={invoice.currency}
              />
              <div className="p-2">
                <div className="flex flex-wrap items-center gap-2 lg:flex-nowrap">
                  <span className="w-28 shrink-0 font-medium text-gray-900">Packing Charges</span>
                  <Input
                    type="number"
                    {...register(`invoices.${index}.packingCharges`)}
                    className="py-1 text-right"
                    placeholder="Amount"
                  />
                  <span className="w-14 text-sm text-gray-500">—</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <BillSelect
              label="Price includes"
              name={`invoices.${index}.freightInsuranceIncluded`}
              options={priceInclusionTypes}
              placeholder="Select if applicable"
            />
            <Input label="Contract / order number" {...register(`invoices.${index}.contractNumber`)} />
            <BillSelect
              label="Payment type"
              name={`invoices.${index}.natureOfPayment`}
              options={paymentTypes}
              placeholder="Select if applicable"
            />
            <Input label="Payment period (days)" type="number" {...register(`invoices.${index}.periodOfPayment`)} />
          </div>

          <PartyFields
            formCtx={formCtx}
            role="thirdParty"
            ownerName={`invoices.${index}.thirdPartyId`}
            branchName={`invoices.${index}.thirdPartyBranchId`}
            label="Third party (optional)"
            required={false}
          />
        </div>

        <div className="border-t border-gray-200 pt-5">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <SectionHeading title="Goods" />
            <Button size="sm" variant="outline" onClick={() => addItem(emptyItem())}>
              + Add item
            </Button>
          </div>
          <div className="space-y-4">
            {items.map((field, itemIndex) => (
              <ItemEditor
                key={field.id}
                formCtx={formCtx}
                invoiceIndex={index}
                itemIndex={itemIndex}
                currency={invoice.currency}
                onRemove={() => removeItem(itemIndex)}
                canRemove={items.length > 1}
              />
            ))}
          </div>
        </div>

        <div className="text-right text-sm font-semibold">
          Invoice total: {invoice.currency} {formatMoney(invoiceTotal(invoice))}
        </div>
      </CardContent>
    </Card>
  )
}
