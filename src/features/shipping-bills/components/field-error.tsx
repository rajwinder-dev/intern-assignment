import { ShippingBillFormValues } from '@/model/model'
import { Path } from 'ui/form'
import { BillFormContext } from '../utils'

export function FormFieldError({ formCtx, name }: { formCtx: BillFormContext; name: Path<ShippingBillFormValues> }) {
  const error = formCtx.hooks.getFieldState(name, formCtx.hooks.formState).error
  const type = error?.type
  const message = type === 'required' ? 'This field is required' : undefined
  if (!message) return null

  return (
    <p role="alert" className="mt-1 text-xs text-red-600">
      {message}
    </p>
  )
}
