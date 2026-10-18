import { emptyBill } from '@/model/model'
import { ShippingBillForm } from '../components/shipping-bill-form'

export default function ShippingBillCreate() {
  return (
    <ShippingBillForm title="New shipping bill" initialValues={emptyBill()} successMessage="Shipping bill created" />
  )
}
