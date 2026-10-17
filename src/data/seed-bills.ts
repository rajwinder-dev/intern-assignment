import type { SavedBill } from '@/shipping-bills/model'

export const seedBills: SavedBill[] = [
  {
    id: 3000,
    created: '2026-09-18T08:00:00.000Z',
    updated: '2026-09-18T08:00:00.000Z',
    values: {
      jobNumber: '2081',
      jobDate: '2026-09-18',
      exporterId: '1000',
      exporterBranchId: '1001',
      consigneeId: '2002',
      consigneeBranchId: '2003',
      loadingPort: 'INMUN1',
      finalDestinationPort: 'USMSY',
      natureOfCargo: 'P',
      grossWeight: '34.6',
      netWeight: '23.5',
      measurementUnit: 'KG',
      totalPackages: '12',
      invoices: [
        {
          invoiceNumber: 'EX/2081/2026',
          invoiceDate: '2026-09-17',
          currency: 'USD',
          contractType: 'FOB',
          buyerSameAsConsignee: true,
          buyerId: '2002',
          buyerBranchId: '2003',
          items: [
            {
              ritcCode: '61091000',
              goodsDescription1: 'Cotton T-shirts',
              quantity: '51',
              unitOfMeasurement: 'PCS',
              unitPrice: '3.831',
              igstPaymentStatus: 'LUT',
              rewardItem: true
            }
          ]
        }
      ],
      containers: [],
      packingRanges: [],
      documents: [],
      licenses: []
    }
  }
]
