import { API_SEED_SHIPPING_BILLS } from '@/data/api-seed-shipping-bills'
import { getDemoData } from '@/data/demo-store'
import { emptyBill, emptyInvoice } from '@/model/model'
import type { SavedBill, ShippingBillFormValues } from '@/types/types'

/**
 * Transforms form values into the payload structure required by POST /api/shipping-bills
 * as defined in shipping_bill.http
 */
export function toHttpShippingBillPayload(values: ShippingBillFormValues) {
  function parseNum(val: any)  (val != null && val !== '' ? Number(val) : undefined)

  function parseDate(dateStr?: string)  {
    if (!dateStr) return undefined
    // Returns days since Unix Epoch (1970-01-01)
    return Math.floor(new Date(dateStr).getTime() / 86400000)
  }

  const CURRENCY_MAP: Record<string, number> = {
    USD: 840,
    INR: 356,
    EUR: 978,
    AED: 784,
    GBP: 826,
    SGD: 702
  }
  function parseCurrency(c?: string)  (c ? CURRENCY_MAP[c] || parseNum(c) || 840 : 840)

  return {
    chaId: 1000,
    jobDate: parseDate(values.jobDate),
    exporterId: parseNum(values.exporterId),
    exporterBranchId: parseNum(values.exporterBranchId),
    consigneeId: parseNum(values.consigneeId),
    consigneeAddressId: parseNum(values.consigneeBranchId),
    originStateCode: parseNum(values.originStateCode),
    loadingPort: values.loadingPort,
    finalDestinationPort: values.finalDestinationPort,
    dischargePort: values.dischargePort || values.finalDestinationPort,
    sealType: parseNum(values.sealType),
    natureOfCargo: parseNum(values.natureOfCargo),
    grossWeight: parseNum(values.grossWeight),
    netWeight: parseNum(values.netWeight),
    measurementUnit: values.measurementUnit === 'KG' ? 'KGS' : values.measurementUnit,
    totalPackages: parseNum(values.totalPackages),
    marksAndNumbers: values.marksAndNumbers,
    loosePackets: parseNum(values.loosePackets),
    numberOfContainers: values.containers.length || parseNum(values.numberOfContainers) || 0,
    invoices: (values.invoices || []).map((inv, index) => ({
      serialNumber: index + 1,
      invoiceNumber: inv.invoiceNumber,
      date: parseDate(inv.invoiceDate),
      currency: parseCurrency(inv.currency),
      contractType: parseNum(inv.contractType),
      buyerId: parseNum(inv.buyerSameAsConsignee ? values.consigneeId : inv.buyerId),
      buyerAddressId: parseNum(inv.buyerSameAsConsignee ? values.consigneeBranchId : inv.buyerBranchId),
      freightCurrency: parseCurrency(inv.freightCurrency || inv.currency),
      freightAmount: parseNum(inv.freightAmount) || 0,
      insuranceCurrency: parseCurrency(inv.insuranceCurrency || inv.currency),
      insuranceAmount: parseNum(inv.insuranceAmount) || 0,
      commissionCurrency: parseCurrency(inv.commissionCurrency || inv.currency),
      commissionAmount: parseNum(inv.commissionAmount) || 0,
      discountCurrency: parseCurrency(inv.discountCurrency || inv.currency),
      discountAmount: parseNum(inv.discountAmount) || 0,
      otherDeductionsCurrency: parseCurrency(inv.otherDeductionsCurrency || inv.currency),
      otherDeductionsAmount: parseNum(inv.otherDeductionsAmount) || 0,
      freightInsauranceIncluded: parseNum(inv.freightInsuranceIncluded),
      packingCharges: parseNum(inv.packingCharges) || 0,
      natureOfPayment: parseNum(inv.natureOfPayment),
      periodOfPayment: parseNum(inv.periodOfPayment),
      items: (inv.items || []).map((item, itemIdx) => ({
        itemSerialNumber: itemIdx + 1,
        schemeCode: item.schemeCode,
        ritcCode: item.ritcCode,
        goodsDescription: item.goodsDescription1,
        unitOfMeasurement: item.unitOfMeasurement,
        quantity: parseNum(item.quantity),
        unitPrice: parseNum(item.unitPrice),
        unitOfRate: item.unitOfRate || item.unitOfMeasurement,
        noOfUnits: parseNum(item.numberOfUnits) || 1,
        presentMarketValue: parseNum(item.presentMarketValue),
        thirdParty: Boolean(item.thirdPartyItem),
        rewardItem: Boolean(item.rewardItem),
        totalPackage: parseNum(item.totalPackage),
        endUseOfItem: item.endUseOfItem,
        igstPaymentStatus: parseNum(item.igstPaymentStatus),
        originDistrictCode: parseNum(item.originDistrictCode),
        tradeAgreementsCode: item.tradeAgreementsCode,
        drawbackSerialNumber: item.drawbackSerialNumber,
        drawbackQuantity: parseNum(item.drawbackQuantity)
      }))
    })),
    packgingList: (values.packingRanges || []).map((range) => ({
      packingNumberFrom: parseNum(range.packingNumberFrom),
      packingNumberTo: parseNum(range.packingNumberTo),
      packingCode: range.packingCode
    })),
    documents: (values.documents || []).map((doc, docIdx) => ({
      invoiceSerialNumber: parseNum(doc.invoiceSerialNumber) || 1,
      itemSerialNumber: parseNum(doc.itemSerialNumber) || 1,
      serialNumber: docIdx + 1,
      imageReferenceNumber: doc.imageReferenceNumber,
      documentTypeCode: doc.documentTypeCode,
      documentIssueDate: parseDate(doc.documentIssueDate),
      useDefault: true,
      fileType: parseNum(doc.fileType) || 1
    }))
  }
}

export type ShippingBillApiPayload = ReturnType<typeof toHttpShippingBillPayload>

export function normalizeApiBill(raw: any): SavedBill {
  if (!raw) return { id: 0, created: '', updated: '', values: emptyBill() }
  function formatIsoString(val: any)  {
    if (!val) return new Date().toISOString()
    if (typeof val === 'number') {
      const ms = val < 10000000000 ? val * 1000 : val
      const d = new Date(ms)
      return !isNaN(d.getTime()) ? d.toISOString() : new Date().toISOString()
    }
    const d = new Date(val)
    return !isNaN(d.getTime()) ? d.toISOString() : new Date().toISOString()
  }

  if (raw.values && raw.id) {
    return {
      ...raw,
      updated: formatIsoString(raw.updated),
      created: formatIsoString(raw.created)
    } as SavedBill
  }

  function formatEpochDays(days?: any)  {
    if (typeof days === 'number') {
      const d = new Date(days * 86400000)
      if (!isNaN(d.getTime())) return d.toISOString().split('T')[0]
    }
    return String(days || '')
  }

  const id = Number(raw.id ?? raw.shippingBillId ?? raw.chaId ?? Math.floor(Math.random() * 100000))
  const jobDateStr = formatEpochDays(raw.jobDate)
  const updated = formatIsoString(raw.updatedAt || raw.updated || raw.createdAt)
  const created = formatIsoString(raw.createdAt || raw.created || updated)

  const values: ShippingBillFormValues = {
    ...emptyBill(),
    jobNumber: raw.jobNumber ? String(raw.jobNumber) : `JOB-${id}`,
    jobDate: jobDateStr || new Date().toISOString().split('T')[0],
    exporterId: String(raw.exporterId ?? ''),
    exporterBranchId: String(raw.exporterBranchId ?? ''),
    exporterName: raw.exporterName || '',
    consigneeId: String(raw.consigneeId ?? ''),
    consigneeBranchId: String(raw.consigneeAddressId ?? raw.consigneeBranchId ?? ''),
    consigneeName: raw.consigneeName || '',
    originStateCode: raw.originStateCode ? String(raw.originStateCode) : '',
    loadingPort: raw.loadingPort || '',
    finalDestinationPort: raw.destinationPort || raw.finalDestinationPort || '',
    dischargePort: raw.dischargePort || raw.destinationPort || raw.finalDestinationPort || '',
    sealType: raw.sealType ? String(raw.sealType) : '3',
    natureOfCargo: raw.natureOfCargo ? String(raw.natureOfCargo) : '1',
    grossWeight: raw.grossWeight ? String(raw.grossWeight) : '',
    netWeight: raw.netWeight ? String(raw.netWeight) : '',
    measurementUnit: raw.measurementUnit || 'KGS',
    totalPackages: raw.totalPackages ? String(raw.totalPackages) : '',
    marksAndNumbers: raw.marksAndNumbers || '',
    loosePackets: raw.loosePackets ? String(raw.loosePackets) : '0',
    numberOfContainers: raw.numberOfContainers ? String(raw.numberOfContainers) : '0',
    containers: raw.containers || [],
    invoices:
      Array.isArray(raw.invoices) && raw.invoices.length > 0
        ? raw.invoices.map((inv: any, idx: number) => ({
            invoiceNumber: inv.invoiceNumber || `INV-${idx + 1}`,
            invoiceDate: formatEpochDays(inv.date || inv.invoiceDate) || new Date().toISOString().split('T')[0],
            currency:
              typeof inv.currency === 'number'
                ? inv.currency === 840
                  ? 'USD'
                  : inv.currency === 356
                    ? 'INR'
                    : String(inv.currency)
                : inv.currency || 'USD',
            contractType: String(inv.contractType ?? '1'),
            buyerId: String(inv.buyerId ?? ''),
            buyerBranchId: String(inv.buyerAddressId ?? inv.buyerBranchId ?? ''),
            buyerSameAsConsignee: inv.buyerId == null || String(inv.buyerId) === String(raw.consigneeId),
            freightAmount: inv.freightAmount ? String(inv.freightAmount) : '',
            insuranceAmount: inv.insuranceAmount ? String(inv.insuranceAmount) : '',
            items:
              Array.isArray(inv.items) && inv.items.length > 0
                ? inv.items.map((item: any) => ({
                    schemeCode: item.schemeCode || '',
                    ritcCode: item.ritcCode || '',
                    goodsDescription1: item.goodsDescription || item.goodsDescription1 || '',
                    quantity: item.quantity ? String(item.quantity) : '',
                    unitOfMeasurement: item.unitOfMeasurement || 'PCS',
                    unitPrice: item.unitPrice ? String(item.unitPrice) : '',
                    unitOfRate: item.unitOfRate || item.unitOfMeasurement || 'PCS',
                    numberOfUnits: item.noOfUnits ? String(item.noOfUnits) : '1',
                    presentMarketValue: item.presentMarketValue ? String(item.presentMarketValue) : '',
                    thirdPartyItem: Boolean(item.thirdParty),
                    rewardItem: Boolean(item.rewardItem),
                    totalPackage: item.totalPackage ? String(item.totalPackage) : '',
                    endUseOfItem: item.endUseOfItem || '',
                    igstPaymentStatus: item.igstPaymentStatus ? String(item.igstPaymentStatus) : '2',
                    originDistrictCode: item.originDistrictCode ? String(item.originDistrictCode) : '',
                    tradeAgreementsCode: item.tradeAgreementsCode || '',
                    drawbackSerialNumber: item.drawbackSerialNumber || '',
                    drawbackQuantity: item.drawbackQuantity ? String(item.drawbackQuantity) : ''
                  }))
                : []
          }))
        : [emptyInvoice()],
    packingRanges: Array.isArray(raw.packgingList || raw.packingRanges)
      ? (raw.packgingList || raw.packingRanges).map((p: any) => ({
          packingNumberFrom: String(p.packingNumberFrom ?? ''),
          packingNumberTo: String(p.packingNumberTo ?? ''),
          packingCode: p.packingCode || 'CTN'
        }))
      : [],
    documents: Array.isArray(raw.documents)
      ? raw.documents.map((doc: any) => ({
          invoiceSerialNumber: String(doc.invoiceSerialNumber ?? '1'),
          itemSerialNumber: String(doc.itemSerialNumber ?? '1'),
          imageReferenceNumber: doc.imageReferenceNumber || '',
          documentTypeCode: doc.documentTypeCode || '',
          documentIssueDate: formatEpochDays(doc.documentIssueDate) || new Date().toISOString().split('T')[0],
          fileType: String(doc.fileType ?? '1')
        }))
      : []
  }

  return {
    id,
    created,
    updated,
    values,
    payload: raw
  }
}

export function normalizeApiBills(raw: any): SavedBill[] {
  if (!raw) return []
  const list = Array.isArray(raw)
    ? raw
    : Array.isArray(raw.data)
      ? raw.data
      : Array.isArray(raw.bills)
        ? raw.bills
        : Array.isArray(raw.shippingBills)
          ? raw.shippingBills
          : Array.isArray(raw.items)
            ? raw.items
            : []
  return list.map(normalizeApiBill)
}

export function generateFlatFileContent(bill: SavedBill): string {
  const v = bill.values
  const lines: string[] = []

  lines.push(`HREC**ZZ*${v.loadingPort || 'INMUN1'}*ZZ*ICEGATE*01*SB*1.0*`)
  lines.push(`<TABLE>SHIPPING_BILL`)
  lines.push(
    `<F>MESSAGE_TYPE^CHA_ID^JOB_NO^JOB_DATE^EXPORTER_ID^EXPORTER_BRANCH^CONSIGNEE_ID^LOADING_PORT^DEST_PORT^DISCHARGE_PORT^SEAL_TYPE^NATURE_OF_CARGO^GROSS_WEIGHT^NET_WEIGHT^UOM^PACKAGES^MARKS`
  )
  lines.push(
    `<R>F^1000^${v.jobNumber || bill.id}^${v.jobDate || ''}^${v.exporterId || ''}^${v.exporterBranchId || ''}^${v.consigneeId || ''}^${v.loadingPort || ''}^${v.finalDestinationPort || ''}^${v.dischargePort || v.finalDestinationPort || ''}^${v.sealType || ''}^${v.natureOfCargo || ''}^${v.grossWeight || ''}^${v.netWeight || ''}^${v.measurementUnit || 'KGS'}^${v.totalPackages || ''}^${(v.marksAndNumbers || '').replace(/[\^\r\n]+/g, ' ')}`
  )

  if (v.invoices && v.invoices.length > 0) {
    lines.push(`<TABLE>INVOICE`)
    lines.push(`<F>INVOICE_SN^INVOICE_NO^INVOICE_DATE^CURRENCY^CONTRACT_TYPE^BUYER_ID^FREIGHT_AMOUNT^INSURANCE_AMOUNT`)
    v.invoices.forEach((inv, idx) => {
      lines.push(
        `<R>${idx + 1}^${inv.invoiceNumber}^${inv.invoiceDate || ''}^${inv.currency || 'USD'}^${inv.contractType || '1'}^${inv.buyerId || v.consigneeId || ''}^${inv.freightAmount || 0}^${inv.insuranceAmount || 0}`
      )
    })

    lines.push(`<TABLE>ITEM`)
    lines.push(`<F>INVOICE_SN^ITEM_SN^RITC_CODE^DESCRIPTION^QUANTITY^UOM^UNIT_PRICE^LINE_TOTAL^SCHEME_CODE`)
    v.invoices.forEach((inv, invIdx) => {
      ;(inv.items || []).forEach((item, itemIdx) => {
        const total = (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0)
        lines.push(
          `<R>${invIdx + 1}^${itemIdx + 1}^${item.ritcCode || ''}^${(item.goodsDescription1 || '').replace(/[\^\r\n]+/g, ' ')}^${item.quantity || ''}^${item.unitOfMeasurement || 'PCS'}^${item.unitPrice || ''}^${total.toFixed(2)}^${item.schemeCode || ''}`
        )
      })
    })
  }

  if (v.packingRanges && v.packingRanges.length > 0) {
    lines.push(`<TABLE>PACKING`)
    lines.push(`<F>FROM_PKG^TO_PKG^PKG_CODE`)
    v.packingRanges.forEach((pkg) => {
      lines.push(`<R>${pkg.packingNumberFrom}^${pkg.packingNumberTo}^${pkg.packingCode || 'CTN'}`)
    })
  }

  lines.push(`TREC**ZZ*${v.loadingPort || 'INMUN1'}*ZZ*ICEGATE*01*SB*1.0*`)

  return lines.join('\r\n')
}

function triggerBlobDownload(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => window.URL.revokeObjectURL(url), 1000)
}

const internalBills: SavedBill[] = normalizeApiBills(API_SEED_SHIPPING_BILLS)

export const shippingBillApi = {
  /**
   * Find bill by id
   */
  getById(id: string | number): SavedBill | undefined {
    return internalBills.find((b) => String(b.id) === String(id))
  },

  /**
   * GET /api/shipping-bills
   * List all shipping bills (per shipping_bill.http)
   */
  async list(): Promise<SavedBill[]> {
    // Mocked GET /api/shipping-bills. Keep local demo bills visible alongside sample API records.
    // Real backend call, retained for when GET integration is re-enabled:
    // const response = await fetch(`${BASE_URL}/api/shipping-bills`, {
    //   method: 'GET',
    //   headers: DEFAULT_HEADERS
    // })
    // if (!response.ok) throw new Error(`Failed to list shipping bills: ${response.status}`)
    // return normalizeApiBills(await response.json())
    const bills = new Map(internalBills.map((bill) => [bill.id, bill]))
    getDemoData().bills.forEach((bill) => bills.set(bill.id, bill))
    return [...bills.values()]
  },

  /**
   * GET /api/shipping-bills/:id/flat-file
   * Fetch flat file text or payload (per shipping_bill.http)
   */
  async getFlatFile(id: string | number) {
    // Real backend call, retained for when flat-file GET integration is re-enabled:
    // const response = await fetch(`${BASE_URL}/api/shipping-bills/${id}/flat-file`, {
    //   method: 'GET',
    //   headers: DEFAULT_HEADERS
    // })
    // if (!response.ok) throw new Error(`Failed to get flat file: ${response.status} ${response.statusText}`)
    // return response.headers.get('content-type')?.includes('application/json')
    //   ? response.json()
    //   : response.text()
    const bill = getDemoData().bills.find((item) => item.id === Number(id)) ?? this.getById(id)
    if (!bill) throw new Error(`No local shipping bill was found for ${id}.`)
    return generateFlatFileContent(bill)
  },

  /**
   * Download shipping bill flat file (.sb) directly in the browser.
   * Generates and downloads the .sb flat file from local bill data.
   */
  async downloadFlatFile(
    id: string | number,
    billData?: SavedBill,
    fallbackFilename?: string
  ): Promise<{ source: 'api' | 'local' }> {
    // Real backend call, retained for when flat-file download integration is re-enabled:
    // const response = await fetch(`${BASE_URL}/api/shipping-bills/${id}/flat-file`, {
    //   method: 'GET',
    //   headers: { Accept: '*/*', Authorization: DEFAULT_HEADERS.Authorization }
    // })
    // if (!response.ok) throw new Error(`Failed to download flat file: ${response.status}`)
    // const blob = await response.blob()
    // triggerBlobDownload(blob, filename)
    // return { source: 'api' }

    if (billData) {
      const flatFileContent = generateFlatFileContent(billData)
      const blob = new Blob([flatFileContent], { type: 'text/plain;charset=utf-8' })
      const safeJob = billData.values.jobNumber || billData.id
      triggerBlobDownload(blob, fallbackFilename || `shipping_bill_${safeJob}.sb`)
      return { source: 'local' }
    }

    throw new Error(`No local bill data was found for shipping bill ${id}.`)
  },

  /**
   * POST /api/shipping-bills
   * Local mock for the shipping-bill upsert. The form persists the bill to
   * demo-store; this response keeps the mutation flow shaped like the backend.
   */
  async upsert(payload: ShippingBillApiPayload) {
    // Real backend call, retained for when POST integration is re-enabled:
    // const response = await fetch(`${BASE_URL}/api/shipping-bills`, {
    //   method: 'POST',
    //   headers: DEFAULT_HEADERS,
    //   body: JSON.stringify(payload)
    // })
    // if (!response.ok) {
    //   throw new Error(`Failed to save shipping bill: ${response.status} ${response.statusText}`)
    // }
    // return response.json()

    return {
      success: true,
      message: 'Shipping bill saved in demo state',
      data: payload
    }
  }
}
