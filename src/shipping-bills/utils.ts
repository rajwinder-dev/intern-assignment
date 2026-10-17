import type { useForm } from 'core/form'
import { Select } from 'ui/inputs/select'
import type { ShippingBillFormValues } from '@/shipping-bills/model'

// ---------------------------------------------------------------------------
// Types are derived from ShippingBillFormValues (model.ts), which is the single
// source of truth. Add a field there and every `satisfies` check, register() path
// and schema rule in this folder tells you where it needs to go.
// ---------------------------------------------------------------------------
type ElementOf<T> = NonNullable<T> extends readonly (infer U)[] ? U : never

export type Invoice = ElementOf<ShippingBillFormValues['invoices']>
export type Item = ElementOf<Invoice['items']>
export type BillDocument = ElementOf<ShippingBillFormValues['documents']>
export type Container = ElementOf<ShippingBillFormValues['containers']>
export type PackingRange = ElementOf<ShippingBillFormValues['packingRanges']>
export type License = ElementOf<ShippingBillFormValues['licenses']>

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
