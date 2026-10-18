import type { ShippingBillApiPayload } from '@/api/shipping-bill-api'
import { shippingBillApi } from '@/api/shipping-bill-api'
import { getDemoData, useDemoData } from '@/data/demo-store'
import type { SavedBill } from '@/types/types'
import { queryClient, useMutation, useQuery } from 'core/react-query'

export const shippingBillsQueryKey = ['shipping-bills'] as const

export function useShippingBills() {
  return useQuery({
    queryKey: shippingBillsQueryKey,
    queryFn: async () => {
      const apiBills = await shippingBillApi.list()
      const mergedBills = new Map(apiBills.map((bill) => [bill.id, bill]))
      getDemoData().bills.forEach((bill) => mergedBills.set(bill.id, bill))
      return [...mergedBills.values()]
    }
  })
}

export function useUpsertBill() {
  return useMutation({
    mutationFn: (payload: ShippingBillApiPayload) => shippingBillApi.upsert(payload),
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: shippingBillsQueryKey })
    }
  })
}

export function useDownloadFlatFile() {
  return useMutation({
    mutationFn: ({ id, bill }: { id: number; bill: SavedBill }) => shippingBillApi.downloadFlatFile(id, bill)
  })
}

export function useShippingBillLookup() {
  const { bills } = useDemoData()
  return {
    getBillById(id?: string | number): SavedBill | undefined {
      if (id == null || id === '') return undefined
      return bills.find((item) => item.id === Number(id)) || shippingBillApi.getById(id)
    }
  }
}
