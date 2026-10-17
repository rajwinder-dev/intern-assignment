import { Button } from 'ui/basic/button'
import { Checkbox } from 'ui/inputs/checkbox'
import { Input } from 'ui/inputs/input'
import { lookupLists } from '@/shipping-bills/lookup'
import { emptyItem, lineTotal } from '@/shipping-bills/model'
import { Advanced } from '../components/layout'
import { PartyFields } from '../components/party-fields'
import { BillSelect, dateType, formatMoney, type BillFormContext } from '../utils'

const { quantityCodes, schemeCodes, trades } = lookupLists

const igstStatuses = [
  { value: 'NA', label: 'Not applicable' },
  { value: 'LUT', label: 'Under LUT / bond' },
  { value: 'P', label: 'Against payment' }
]

const accessoryStatuses = [
  { value: '0', label: 'No accessory' },
  { value: '1', label: 'Included free of cost' },
  { value: '2', label: 'Entered separately' }
]

interface ItemEditorProps {
  formCtx: BillFormContext
  invoiceIndex: number
  itemIndex: number
  currency?: string
  onRemove: () => void
  canRemove: boolean
}

export function ItemEditor({ formCtx, invoiceIndex, itemIndex, currency, onRemove, canRemove }: ItemEditorProps) {
  const { register, watch } = formCtx.hooks
  const path = `invoices.${invoiceIndex}.items.${itemIndex}` as const
  const item = watch(path) ?? emptyItem()

  const scheme = schemeCodes.find((option) => option.value === item.schemeCode)
  const showDrawback = Boolean(scheme?.drawback || scheme?.RODTEP || scheme?.ROSCTL)

  return (
    <div className="rounded-lg border border-gray-200 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="text-sm font-semibold">Item {itemIndex + 1}</h4>
        {canRemove && (
          <Button size="sm" variant="ghost" onClick={onRemove}>
            Remove
          </Button>
        )}
      </div>

      <div className="mb-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
        <Input label="RITC / HS code" {...register(`${path}.ritcCode`)} placeholder="e.g. 61091000" />
        <BillSelect label="Scheme code" name={`${path}.schemeCode`} options={schemeCodes} placeholder="Select scheme" />
        <Input
          label="Goods description"
          {...register(`${path}.goodsDescription1`)}
          wrapClass="lg:col-span-4"
          placeholder="e.g. Cotton T-shirts"
        />
        <Input label="Quantity" type="number" {...register(`${path}.quantity`)} />
        <BillSelect label="Unit" name={`${path}.unitOfMeasurement`} options={quantityCodes} rules={{ required: true }} />
        <Input label={`Unit price (${currency || 'currency'})`} type="number" {...register(`${path}.unitPrice`)} />
        <Input
          label="Item Total"
          type="number"
          placeholder={`${currency} ${formatMoney(lineTotal(item))}`}
          {...register(`${path}.lineTotal`)}
        />
        <BillSelect
          label="IGST payment"
          name={`${path}.igstPaymentStatus`}
          options={igstStatuses}
          placeholder="Select if applicable"
        />
      </div>

      <div className="mb-3 flex flex-wrap items-end gap-4">
        {showDrawback && (
          <>
            <div className="w-36">
              <Input label="Drawback Serial no." {...register(`${path}.drawbackSerialNumber`)} />
            </div>
            <div className="w-32">
              <Input label="Drawback Unit" {...register(`${path}.drawbackUnit`)} />
            </div>
            <div className="w-36">
              <Input label="Drawback Quantity" type="number" {...register(`${path}.drawbackQuantity`)} />
            </div>
          </>
        )}
        <label className="flex items-center gap-2 pb-1 text-sm">
          <Checkbox {...register(`${path}.rewardItem`)} />
          Claim reward
        </label>
        <label className="flex items-center gap-2 pb-1 text-sm">
          <Checkbox {...register(`${path}.thirdPartyItem`)} />
          Third-party item
        </label>
      </div>

      {item.thirdPartyItem && (
        <div className="my-4">
          <PartyFields
            formCtx={formCtx}
            role="thirdParty"
            ownerName={`${path}.itemThirdPartyId`}
            branchName={`${path}.itemThirdPartyBranchId`}
            label="Item third party"
          />
        </div>
      )}

      <Advanced title="Item customs, taxes and incentives">
        <div className="mb-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <BillSelect
            label="Unit of rate"
            name={`${path}.unitOfRate`}
            options={quantityCodes}
            placeholder={item.unitOfMeasurement}
          />
          <Input label="Per Unit (Rate)" type="number" placeholder="1" {...register(`${path}.numberOfUnits`)} />
          <Input label="Present market value" type="number" {...register(`${path}.presentMarketValue`)} />
          <Input label="GCess" type="number" {...register(`${path}.cess`)} />
          <Input
            label="Accessories description"
            wrapClass="lg:col-span-3"
            {...register(`${path}.accessoriesDescription`)}
          />
          <BillSelect
            label="Accessory status"
            name={`${path}.accessoryStatus`}
            options={accessoryStatuses}
            placeholder="Select if relevant"
          />
          {item.igstPaymentStatus === 'P' && (
            <>
              <Input label="Taxable value" type="number" {...register(`${path}.taxableValue`)} />
              <Input label="IGST amount" type="number" {...register(`${path}.igstAmount`)} />
            </>
          )}
          <Input label="Origin district code" {...register(`${path}.originDistrictCode`)} />
          <BillSelect
            label="Trade agreement code"
            name={`${path}.tradeAgreementsCode`}
            options={trades}
            placeholder="NCPTI"
          />
          <Input label="End use code" {...register(`${path}.endUseOfItem`)} />
          <Input label="Packages for item" type="number" {...register(`${path}.totalPackage`)} />
        </div>
        <Advanced title="AR4 / excise details">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Input label="AR4 number" {...register(`${path}.ar4Number`)} />
            <Input label="AR4 date" type={dateType} {...register(`${path}.ar4Date`)} />
          </div>
        </Advanced>
      </Advanced>
    </div>
  )
}
