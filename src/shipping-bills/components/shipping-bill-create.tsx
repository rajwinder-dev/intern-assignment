import { emptyBill } from '@/shipping-bills/model'
import { ShippingBillForm } from './shipping-bill-form'

export default function ShippingBillCreate() {
  return (
    <ShippingBillForm
      title="New shipping bill"
      initialValues={emptyBill()}
      successMessage="Shipping bill created"
    />
  )
}
