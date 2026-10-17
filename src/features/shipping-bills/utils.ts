import type { useForm } from 'core/form'
import { Select } from 'ui/inputs/select'
import type { ShippingBillFormValues } from '@/types/types'

export type BillFormContext = ReturnType<typeof useForm<ShippingBillFormValues>>

/** Props every tab receives. */
export interface TabProps {
  formCtx: BillFormContext
}

/** `Select` pre-bound to the bill form, so call sites don't repeat the generic. */
export const BillSelect = Select as typeof Select<ShippingBillFormValues>

export const dateType = 'date' as 'text'

export const hasValue = (value: unknown) => value !== '' && value != null

export const formatMoney = (value: number) => value.toLocaleString(undefined, { maximumFractionDigits: 2 })
