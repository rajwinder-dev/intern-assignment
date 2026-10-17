import { routes } from '@/shared/route-paths'
import { useForm } from 'core/form'
import { navigate } from 'core/routing'
import { toast } from 'core/toast-manager'
import { useState } from 'react'
import { saveBill } from '@/data/demo-store'
import { useUpsertBill } from '@/hooks/shipping-bill-hooks'
import type { ShippingBillFormValues } from '@/types/types'
import { billSchema } from './schema'
import { tabs } from './components/tabs'

export interface UseBillFormOptions {
  initialValues: ShippingBillFormValues
  /** Present when editing an existing bill. */
  billId?: number
  successMessage: string
}

/** Form instance, tab navigation and submit handlers for the shipping bill form. */
export function useBillForm({ initialValues, billId, successMessage }: UseBillFormOptions) {
  const formCtx = useForm<ShippingBillFormValues>(billSchema, { defaultValues: initialValues })
  const upsertBill = useUpsertBill()
  const [activeTab, setActiveTab] = useState(tabs[0].id)
  const [draftId, setDraftId] = useState(billId)

  const tabIndex = tabs.findIndex((tab) => tab.id === activeTab)

  function saveDraft() {
    const saved = saveBill(formCtx.hooks.getValues(), draftId)
    setDraftId(saved.id)
  }

  function goPrevious() {
    saveDraft()
    setActiveTab(tabs[tabIndex - 1].id)
  }

  function goNext() {
    saveDraft()
    toast.success('Details saved')
    setActiveTab(tabs[tabIndex + 1].id)
  }

  async function handleSave(data: ShippingBillFormValues) {
    try {
      const saved = saveBill(data, draftId)
      // The bill is already saved locally, so a backend failure should not block the user.
      await upsertBill.mutateAsync(data).catch(() => undefined)
      toast.success(successMessage)
      navigate(routes.toShippingBillEdit(saved.id))
    } catch {
      toast.error('Failed to save shipping bill')
    }
  }

  function handleInvalid(errors: Record<string, unknown>) {
    toast.error('Please check the required fields')
    const tab = tabs.find((item) => item.errorFields.some((field) => field in errors))
    if (tab) setActiveTab(tab.id)
    // otherwise stay on the tab the user submitted from
  }

  return {
    formCtx,
    activeTab,
    setActiveTab,
    isFirstTab: tabIndex === 0,
    isLastTab: tabIndex === tabs.length - 1,
    goPrevious,
    goNext,
    handleSave,
    handleInvalid
  }
}
