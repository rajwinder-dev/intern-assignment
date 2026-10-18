import { lookupLists } from '@/constants/constants'
import { Input } from 'ui/inputs/input'
import { BillSelect, hasValue, type BillFormContext } from '../utils'

const { currencyOptions } = lookupLists

export type ChargeName = 'freight' | 'insurance' | 'commission' | 'discount' | 'otherDeductions'

interface ChargeRowProps {
  formCtx: BillFormContext
  invoiceIndex: number
  name: ChargeName
  label: string
  currency?: string
}

export function ChargeRow({ formCtx, invoiceIndex, name, label, currency }: ChargeRowProps) {
  const { register, watch } = formCtx.hooks
  const rate = watch(`invoices.${invoiceIndex}.${name}Rate`)
  const amount = watch(`invoices.${invoiceIndex}.${name}Amount`)

  return (
    <div className="p-2">
      <div className="flex flex-wrap items-center gap-2 lg:flex-nowrap">
        <span className="w-28 shrink-0 font-medium text-gray-900">{label}</span>
        <div className="flex items-center gap-1">
          <Input
            type="number"
            {...register(`invoices.${invoiceIndex}.${name}Rate`)}
            className="text-right"
            disabled={hasValue(amount)}
            placeholder="Rate"
          />
          <span className="text-xs text-gray-500">%</span>
        </div>
        <Input
          type="number"
          {...register(`invoices.${invoiceIndex}.${name}Amount`)}
          className="py-1 text-right"
          disabled={hasValue(rate)}
          placeholder="Amount"
        />
        <BillSelect
          name={`invoices.${invoiceIndex}.${name}Currency`}
          options={currencyOptions}
          placeholder={currency}
        />
      </div>
    </div>
  )
}
