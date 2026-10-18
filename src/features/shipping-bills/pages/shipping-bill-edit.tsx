import { useShippingBillLookup } from '@/hooks/shipping-bill-hooks'
import { routes } from '@/routes/route-paths'
import { navigate, useParams } from 'core/routing'
import { Button } from 'ui/basic/button'
import { ShippingBillForm } from '../components/shipping-bill-form'

export default function ShippingBillEdit() {
  const { id } = useParams<{ id?: string }>()
  const { getBillById } = useShippingBillLookup()
  const bill = getBillById(id)

  if (!bill)
    return (
      <div className="space-y-3">
        <h1 className="text-xl font-semibold">Shipping bill not found</h1>
        <Button onClick={() => navigate(routes.dashboard)}>Back to list</Button>
      </div>
    )

  return (
    <ShippingBillForm
      key={bill.id}
      title={`Edit shipping bill #${bill.id}`}
      initialValues={bill.values}
      billId={bill.id}
      successMessage="Shipping bill updated"
    />
  )
}
