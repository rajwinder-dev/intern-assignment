import { routes } from '@/routes/route-paths'
import { Form } from 'core/form/components'
import { navigate } from 'core/routing'
import { Button } from 'ui/basic/button'
import { Tabs, TabsList, TabsTrigger } from 'ui/interactive/tabs'
import { useBillForm, type UseBillFormOptions } from '../use-bill-form'
import { PersistentTab } from './layout'
import { tabs } from './tabs'
import { WorkflowSteps } from './workflow-steps'

interface ShippingBillFormProps extends UseBillFormOptions {
  title: string
}

/** Shared form shell used by both the create and edit pages. */
export function ShippingBillForm({ title, ...options }: ShippingBillFormProps) {
  const { formCtx, activeTab, goToTab, isFirstTab, isLastTab, goPrevious, goNext, handleSave, submitFinal } =
    useBillForm(options)

  return (
    <div className="space-y-5">
      <div>
        <button className="mb-2 text-sm text-gray-500 hover:underline" onClick={() => navigate(routes.dashboard)}>
          ← Shipping bills
        </button>
        <h1 className="text-2xl font-semibold text-gray-950">{title}</h1>
        <p className="mt-1 text-sm text-gray-500">
          Enter the everyday details first. Open advanced sections only when needed.
        </p>
      </div>

      <WorkflowSteps />

      <Form ctx={formCtx} handleSubmit={handleSave} className="space-y-5">
        <Tabs value={activeTab} onValueChange={(value) => void goToTab(String(value))}>
          <TabsList className="flex w-full justify-start overflow-x-auto">
            {tabs.map((tab) => (
              <TabsTrigger key={tab.id} value={tab.id}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {tabs.map(({ id, Content }) => (
            <PersistentTab key={id} value={id} activeTab={activeTab} className="space-y-4">
              <Content formCtx={formCtx} />
            </PersistentTab>
          ))}
        </Tabs>

        <div className="flex flex-wrap justify-between gap-2 border-t border-gray-200 pt-4">
          <Button variant="outline" type="button" onClick={() => navigate(routes.dashboard)}>
            Cancel
          </Button>
          <div className="flex gap-2">
            {!isFirstTab && (
              <Button variant="outline" type="button" onClick={goPrevious}>
                Previous
              </Button>
            )}
            {isLastTab ? (
              <Button type="button" onClick={() => void submitFinal()}>
                Save changes
              </Button>
            ) : (
              <Button type="button" onClick={goNext}>
                Save & Next
              </Button>
            )}
          </div>
        </div>
      </Form>
    </div>
  )
}
