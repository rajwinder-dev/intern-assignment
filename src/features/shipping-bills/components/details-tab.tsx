import { Card, CardContent, CardHeader } from 'ui/basic/card'
import { Input } from 'ui/inputs/input'
import { lookupLists } from '@/constants/constants'
import {
  useDestinationPortOptions,
  useLoadingPortOptions,
  useMarksAndNumbers,
  usePortLabel
} from '@/hooks/lookup-hooks'
import { portCountry } from '@/model/model'
import type { ShippingBillFormValues } from '@/types/types'
import { AsyncSelect } from '../components/async-select'
import { Advanced, SectionHeading } from '../components/layout'
import { PartyFields } from '../components/party-fields'
import { BillSelect, dateType, type TabProps } from '../utils'

const { cargoOptions, portOptions, sealTypes, stateOptions, weightUnits } = lookupLists

/** Top-level fields owned by this tab. Used to jump to the tab when validation fails. */
export const detailsTabFields = [
  'jobDate',
  'exporterId',
  'exporterBranchId',
  'consigneeId',
  'consigneeBranchId',
  'loadingPort',
  'finalDestinationPort'
] as const satisfies readonly (keyof ShippingBillFormValues)[]

const nfeiCategories = [
  { value: '01', label: 'Free trade sample' },
  { value: '02', label: 'Diplomatic goods' },
  { value: '03', label: 'Warranty replacement' },
  { value: '07', label: 'Gift parcel' },
  { value: '08', label: 'Other' }
]

export function DetailsTab({ formCtx }: TabProps) {
  const { register, setValue, watch } = formCtx.hooks
  const exporterId = watch('exporterId')
  const loadingPort = watch('loadingPort')
  const finalDestinationPort = watch('finalDestinationPort')
  const containers = watch('containers')
  const marks = useMarksAndNumbers(exporterId)

  return (
    <Card>
      <CardHeader title="Shipment basics" description="Parties and route are the core details for this bill." />
      <CardContent className="space-y-5">
        <PartyFields
          formCtx={formCtx}
          role="exporter"
          ownerName="exporterId"
          branchName="exporterBranchId"
          label="Exporter"
          onOwnerChange={() => setValue('marksAndNumbers', '', { shouldValidate: true })}
        />
        <PartyFields
          formCtx={formCtx}
          role="consignee"
          ownerName="consigneeId"
          branchName="consigneeBranchId"
          label="Consignee"
        />

        <div className="border-t border-gray-200 pt-5">
          <SectionHeading title="Route" />
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <span className="mb-1 block text-sm font-medium">Port of loading</span>
              <AsyncSelect
                name="loadingPort"
                placeholder="Select Indian port"
                rules={{ required: true }}
                useOptions={useLoadingPortOptions}
                useLabel={usePortLabel}
              />
            </div>
            <div>
              <span className="mb-1 block text-sm font-medium">Final destination port</span>
              <AsyncSelect
                name="finalDestinationPort"
                placeholder="Select destination"
                rules={{ required: true }}
                useOptions={useDestinationPortOptions}
                useLabel={usePortLabel}
              />
            </div>
          </div>
          <p className="mt-3 text-xs text-gray-500">
            Countries are derived from the port codes when saved: {portCountry(loadingPort) || '—'} →{' '}
            {portCountry(finalDestinationPort) || '—'}.
          </p>
        </div>

        <Advanced title="Regulatory and route exceptions">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <BillSelect
              label="Discharge port"
              name="dischargePort"
              options={portOptions}
              placeholder="Defaults to destination"
            />
            <BillSelect
              label="Origin state"
              name="originStateCode"
              options={stateOptions}
              placeholder="Defaults to Branch State Code"
            />
            <div></div>
            <BillSelect label="NFEI category" name="nfeiCategory" options={nfeiCategories} placeholder="Not applicable" />
            <Input label="RBI waiver number" {...register('rbiWaiverNumber')} />
            <Input label="RBI waiver date" type={dateType} {...register('rbiWaiverDate')} />
          </div>
        </Advanced>

        <div className="border-t border-gray-200 pt-5">
          <SectionHeading title="Package Detail" />
          <div className="grid gap-4 pb-4 sm:grid-cols-2 lg:grid-cols-4">
            <BillSelect label="Nature of cargo" name="natureOfCargo" options={cargoOptions} />
            <Input label="Gross weight" type="number" {...register('grossWeight')} />
            <Input label="Net weight" type="number" {...register('netWeight')} />
            <BillSelect label="Weight unit" name="measurementUnit" options={weightUnits} />
            <Input label="Total packages" type="number" {...register('totalPackages')} />
            <BillSelect
              label="Marks and numbers"
              name="marksAndNumbers"
              options={marks.data ?? []}
              placeholder={
                !exporterId
                  ? 'Select exporter first'
                  : marks.isFetching
                    ? 'Loading marks and numbers...'
                    : 'Select marks and numbers'
              }
              disabled={!exporterId || marks.isFetching || !marks.data?.length}
              wrapClass="sm:col-span-3"
            />
          </div>
          <Advanced title="Additional Details">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <BillSelect label="Seal type" name="sealType" options={sealTypes} placeholder="Select if relevant" />
              {!containers?.length && <Input label="Number of containers" type="number" {...register('numberOfContainers')} />}
              <Input label="Loose packets" type="number" {...register('loosePackets')} />
              <Input label="MAWB number" {...register('mawbNumber')} />
              <Input label="HAWB number" {...register('hawbNumber')} />
            </div>
          </Advanced>
        </div>
      </CardContent>
    </Card>
  )
}
