import type { useForm } from 'core/form'
import { createElement } from 'react'
import { getFormContext, getNestedSchema } from 'ui/form'
import type { RegisterOptions } from 'ui/form'
import { Select } from 'ui/inputs/select'
import type { FormSelectProps } from 'ui/inputs/select'
import type { ShippingBillFormValues } from '@/types/types'

export type BillFormContext = ReturnType<typeof useForm<ShippingBillFormValues>>

/** Props every tab receives. */
export interface TabProps {
  formCtx: BillFormContext
}

/** `Select` pre-bound to the bill form and its leaf-name schema rules. */
export function BillSelect(props: FormSelectProps<ShippingBillFormValues>) {
  const ctx = getFormContext<ShippingBillFormValues>()
  const schemaRules = getNestedSchema(props.name, ctx.schema) as RegisterOptions
  return createElement(Select<ShippingBillFormValues>, { ...props, rules: schemaRules ?? props.rules })
}

export const dateType = 'date' as 'text'

export const hasValue = (value: unknown) => value !== '' && value != null

export const formatMoney = (value: number) => value.toLocaleString(undefined, { maximumFractionDigits: 2 })
