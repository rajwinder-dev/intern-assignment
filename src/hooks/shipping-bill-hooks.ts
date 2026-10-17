import { shippingBillApi } from '@/api/shipping-bill-api'
import type { SavedBill, ShippingBillFormValues } from '@/types/types'
import { queryClient, useMutation, useQuery } from 'core/react-query'
import { useDemoData } from '@/data/demo-store'

export const shippingBillsQueryKey = ['shipping-bills'] as const

export function useShippingBills() {
  return useQuery({
    queryKey: shippingBillsQueryKey,
    queryFn: () => shippingBillApi.list()
  })
}

export function useUpsertBill() {
  return useMutation({
    mutationFn: (data: ShippingBillFormValues) => shippingBillApi.upsert(data),
    onSuccess: async () => {
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
