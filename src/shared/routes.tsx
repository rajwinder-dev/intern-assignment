import ListDashboard from '@/dashboard/list-dashboard'
import { ApplicationLayout } from '@/shared/application-layout'
import ShippingBillCreate from '@/shipping-bills/components/shipping-bill-create'
import ShippingBillEdit from '@/shipping-bills/components/shipping-bill-edit'
import { Route, RouteObject } from 'core/routing/route-utils'
import { routes } from './route-paths'

const homeWrapper = <ApplicationLayout />

export const routeObjects: RouteObject[] = [
  Route(routes.dashboard, <ListDashboard />, 'Shipping Bills', homeWrapper),
  Route('/shipping-bills/new', <ShippingBillCreate />, 'New Shipping Bill', homeWrapper),
  Route('/shipping-bills/:id', <ShippingBillEdit />, 'Shipping Bill', homeWrapper),
  // Misc
  Route('*', () => import('core/components/404-page'), 'Not Found')
]
