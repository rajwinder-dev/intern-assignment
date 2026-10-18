import type { ShippingBillApiPayload } from '@/api/shipping-bill-api'
import { toHttpShippingBillPayload } from '@/api/shipping-bill-api'
import { saveBill } from '@/data/demo-store'
import { useUpsertBill } from '@/hooks/shipping-bill-hooks'
import { routes } from '@/routes/route-paths'
import type { ShippingBillFormValues } from '@/types/types'
import { useForm } from 'core/form'
import { navigate } from 'core/routing'
import { toast } from 'core/toast-manager'
import { useState } from 'react'
import { tabs } from './components/tabs'
import { billSchema } from './schema'

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

  async function validateThrough(targetIndex: number) {
    for (let index = 0; index < targetIndex; index += 1) {
      const tab = tabs[index]
      const isValid = await formCtx.hooks.trigger(tab.validationFields(formCtx.hooks.getValues()))
      if (!isValid) {
        toast.error('Please fix the errors in this step before continuing')
        setActiveTab(tab.id)
        return false
      }
    }
    return true
  }

  async function goNext() {
    const isValid = await validateThrough(tabIndex + 1)
    if (!isValid) return
    saveDraft()
    toast.success('Details saved')
    setActiveTab(tabs[tabIndex + 1].id)
  }

  async function goToTab(tabId: string) {
    const targetIndex = tabs.findIndex((tab) => tab.id === tabId)
    if (targetIndex < 0 || targetIndex <= tabIndex) {
      setActiveTab(tabId)
      return
    }
    if (await validateThrough(targetIndex)) setActiveTab(tabId)
  }

  async function handleSave(data: ShippingBillFormValues) {
    try {
      const payload: ShippingBillApiPayload = toHttpShippingBillPayload(data)
      console.log('Shipping bill payload:', payload)
      saveBill(data, draftId)
      // The bill is already saved locally, so a backend failure should not block the user.
      await upsertBill.mutateAsync(payload).catch(() => undefined)
      toast.success(successMessage)
      navigate(routes.dashboard)
    } catch {
      toast.error('Failed to save shipping bill')
    }
  }

  function handleInvalid(errors: object) {
    toast.error('Please check the required fields')
    const errorFields = new Set(Object.keys(errors))
    const tab = tabs.find((item) => item.errorFields.some((field) => errorFields.has(field)))
    if (tab) setActiveTab(tab.id)
  }

  const submitFinal = formCtx.hooks.handleSubmit(handleSave, handleInvalid)

  return {
    formCtx,
    activeTab,
    setActiveTab,
    isFirstTab: tabIndex === 0,
    isLastTab: tabIndex === tabs.length - 1,
    goPrevious,
    goNext,
    goToTab,
    handleSave,
    handleInvalid,
    submitFinal
  }
}
