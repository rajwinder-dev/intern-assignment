import type { ShippingBillFormValues } from '@/types/types'
import type { Path } from 'ui/form'
import type { BillFormContext } from '../../utils'

interface FormFieldErrorProps {
  formCtx: BillFormContext
  name: Path<ShippingBillFormValues>
}

export function FormFieldError({ formCtx, name }: FormFieldErrorProps) {
  const error = formCtx.hooks.getFieldState(name, formCtx.hooks.formState).error
  const message = error?.type === 'required' ? 'This field is required' : error?.message
  if (!message) return null

  return (
    <p role="alert" className="mt-1 text-xs text-red-600">
      {message}
    </p>
  )
}
