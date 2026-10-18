import ListDashboard from '@/features/dashboard/list-dashboard'
import ShippingBillCreate from '@/features/shipping-bills/pages/shipping-bill-create'
import ShippingBillEdit from '@/features/shipping-bills/pages/shipping-bill-edit'
import { ApplicationLayout } from '@/layout/application-layout'
import NotFound from 'core/components/404-page'
import { Route, RouteObject } from 'core/routing/route-utils'
import { routes } from './route-paths'

export const routeObjects: RouteObject[] = [
  Route(routes.dashboard, <ListDashboard />, 'Shipping Bills', <ApplicationLayout />),
  Route(routes.shippingBillNew, <ShippingBillCreate />, 'New Shipping Bill', <ApplicationLayout />),
  Route(routes.shippingBillEdit, <ShippingBillEdit />, 'Shipping Bill', <ApplicationLayout />),
  Route('*', <NotFound />, 'Not Found')
]
