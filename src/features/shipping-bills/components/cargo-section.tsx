import { useFieldArray } from 'core/form'
import { Button } from 'ui/basic/button'
import { Card, CardContent, CardHeader } from 'ui/basic/card'
import { Input } from 'ui/inputs/input'
import { Advanced, SectionHeading } from '../components/layout'
import { BillSelect, dateType, type TabProps } from '../utils'

const containerSizes = [
  { value: '20', label: '20 ft' },
  { value: '40', label: '40 ft' },
  { value: '45', label: '45 ft' }
]

const containerSealTypes = [
  { value: 1, label: 'BTSL - Bottle Seal' },
  { value: 2, label: 'ESEAL - Electronic Seal' },
  { value: 3, label: 'RFID - Radio Frequency Identifier' }
]

/** Containers and packing-list ranges. */
export function CargoSection({ formCtx }: TabProps) {
  const { register, control } = formCtx.hooks
  const {
    fields: containers,
    append: addContainer,
    remove: removeContainer
  } = useFieldArray({ control, name: 'containers' })
  const {
    fields: packingRanges,
    append: addPackingRange,
    remove: removePackingRange
  } = useFieldArray({ control, name: 'packingRanges' })

  return (
    <Card>
      <CardHeader title="Cargo & Package Detail" />
      <CardContent className="space-y-5">
        <div className="mb-3 flex items-center justify-between">
          <SectionHeading
            title={`Containers (${containers.length})`}
            description="Add only when the cargo is containerized."
          />
          <Button size="sm" variant="outline" onClick={() => addContainer({ containerNumber: '' })}>
            + Add container
          </Button>
        </div>
        <div className="space-y-3">
          {containers.map((field, index) => (
            <div key={field.id} className="rounded-lg border border-gray-200 p-4">
              <div className="mb-3 flex justify-between">
                <h3 className="text-sm font-semibold">Container {index + 1}</h3>
                <Button size="sm" variant="ghost" onClick={() => removeContainer(index)}>
                  Remove
                </Button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Input label="Container number" {...register(`containers.${index}.containerNumber`)} />
                <BillSelect
                  label="Size"
                  name={`containers.${index}.containerSize`}
                  options={containerSizes}
                  placeholder="Select size"
                />
                <Input label="Seal number" {...register(`containers.${index}.exciseSealNumber`)} />
                <Input label="Seal date" type={dateType} {...register(`containers.${index}.sealDate`)} />
                <BillSelect
                  label="Seal type"
                  name={`containers.${index}.sealType`}
                  options={containerSealTypes}
                  placeholder="Select if needed"
                />
                <Input label="Seal device ID" {...register(`containers.${index}.sealDeviceId`)} />
                <Input label="Movement document type" {...register(`containers.${index}.movementDocumentType`)} />
                <Input label="Movement document number" {...register(`containers.${index}.movementDocumentNumber`)} />
              </div>
            </div>
          ))}
        </div>

        <Advanced title={`Packing list ranges (${packingRanges.length})`}>
          <div className="space-y-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => addPackingRange({ packingNumberFrom: '', packingNumberTo: '' })}>
              + Add packing range
            </Button>
            {packingRanges.map((field, index) => (
              <div key={field.id} className="rounded-lg border border-gray-200 p-3">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-medium">Range {index + 1}</span>
                  <Button size="sm" variant="ghost" onClick={() => removePackingRange(index)}>
                    Remove
                  </Button>
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <Input
                    label="Package from"
                    type="number"
                    {...register(`packingRanges.${index}.packingNumberFrom`)}
                  />
                  <Input label="Package to" type="number" {...register(`packingRanges.${index}.packingNumberTo`)} />
                  <Input label="Packing code" {...register(`packingRanges.${index}.packingCode`)} />
                </div>
              </div>
            ))}
          </div>
        </Advanced>
      </CardContent>
    </Card>
  )
}
