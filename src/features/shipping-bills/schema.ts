import { s } from 'core/form'
import type { ShippingBillFormValues } from '@/types/types'
import type { BillDocument, Container, Invoice, Item, License, PackingRange } from '@/types/types'

// Every key below must exist on the root form or on one of its nested rows.
// A typo or a renamed field in model.ts becomes a compile error here.
type FieldName =
  | keyof ShippingBillFormValues
  | keyof Invoice
  | keyof Item
  | keyof BillDocument
  | keyof Container
  | keyof PackingRange
  | keyof License

const positive = s.string().refine((value) => (Number(value) > 0 ? undefined : 'Enter a number above zero'))
const requiredString = s.string().refine((value) => (value.trim() ? undefined : 'This field is required'))

// Leaf names are deliberate: fe-zen-arch resolves nested RHF field rules by their final path segment.
const fieldRules = {
  jobNumber: s.string().optional(),
  jobDate: requiredString,
  exporterId: requiredString,
  exporterBranchId: requiredString,
  consigneeId: requiredString,
  consigneeBranchId: requiredString,
  loadingPort: requiredString,
  finalDestinationPort: requiredString,
  dischargePort: s.string().optional(),
  originStateCode: s.string().optional(),
  nfeiCategory: s.string().optional(),
  rbiWaiverNumber: s.string().optional(),
  rbiWaiverDate: s.string().optional(),
  sealType: s.string().optional(),
  numberOfContainers: s.string().optional(),
  natureOfCargo: s.string().optional(),
  grossWeight: s.string().optional(),
  netWeight: s.string().optional(),
  measurementUnit: s.string().optional(),
  totalPackages: s.string().optional(),
  marksAndNumbers: s.string().optional(),
  loosePackets: s.string().optional(),
  mawbNumber: s.string().optional(),
  hawbNumber: s.string().optional(),
  invoiceNumber: requiredString,
  invoiceDate: requiredString,
  currency: requiredString,
  invoiceTotal: s
    .string()
    .refine((value) => (!value || Number(value) >= 0 ? undefined : 'Total cannot be negative'))
    .optional(),
  contractType: requiredString,
  buyerId: s.string().optional(),
  buyerBranchId: s.string().optional(),
  thirdPartyId: s.string().optional(),
  thirdPartyBranchId: s.string().optional(),
  ritcCode: requiredString,
  goodsDescription1: requiredString,
  quantity: positive,
  unitOfMeasurement: requiredString,
  unitPrice: positive,
  containerNumber: requiredString,
  packingNumberFrom: requiredString,
  packingNumberTo: requiredString,
  documentTypeCode: requiredString,
  documentReferenceNumber: requiredString,
  registrationNumber: requiredString
} satisfies Partial<Record<FieldName, unknown>>

export const billSchema = s.object(fieldRules)
