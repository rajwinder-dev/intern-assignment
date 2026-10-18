import { useFieldArray } from 'core/form'
import { Button } from 'ui/basic/button'
import { Card, CardContent, CardHeader } from 'ui/basic/card'
import { Input } from 'ui/inputs/input'
import { BillSelect, dateType, type TabProps } from '../utils'

const goodsSources = [
  { value: 'I', label: 'Imported' },
  { value: 'D', label: 'Indigenous' }
]

export function LicensesSection({ formCtx }: TabProps) {
  const { register, control } = formCtx.hooks
  const { fields: licenses, append, remove } = useFieldArray({ control, name: 'licenses' })
  const addButton = (
    <Button variant="outline" size="sm" onClick={() => append({ registrationNumber: '' })}>
      + Add licence
    </Button>
  )

  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-gray-950">Licences</h3>
          <p className="mt-1 text-sm text-gray-500">Only enter these for schemes that require a licence.</p>
        </div>
        {licenses.length > 0 && addButton}
      </CardHeader>
      <CardContent className="space-y-4">
        {licenses.length === 0 && addButton}
        {licenses.map((field, index) => (
          <div key={field.id} className="rounded-lg border border-gray-200 p-4">
            <div className="mb-3 flex justify-between">
              <h3 className="text-sm font-semibold">Licence {index + 1}</h3>
              <Button size="sm" variant="ghost" onClick={() => remove(index)}>
                Remove
              </Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Input label="Registration number" {...register(`licenses.${index}.registrationNumber`)} />
              <Input label="Registration date" type={dateType} {...register(`licenses.${index}.registrationDate`)} />
              <Input
                label="Invoice serial number"
                type="number"
                {...register(`licenses.${index}.invoiceSerialNumber`)}
              />
              <Input label="Item serial number" type="number" {...register(`licenses.${index}.itemSerialNumber`)} />
              <Input
                label="Licence serial number"
                type="number"
                {...register(`licenses.${index}.licenseSerialNumber`)}
              />
              <Input label="Item serial, Part E" {...register(`licenses.${index}.itemSerialNumberPartE`)} />
              <Input label="Item serial, Part C" {...register(`licenses.${index}.itemSerialNumberPartC`)} />
              <Input label="Licence quantity" type="number" {...register(`licenses.${index}.licenseQuantity`)} />
              <Input label="Export quantity" type="number" {...register(`licenses.${index}.licenseExportQuantity`)} />
              <BillSelect
                label="Goods source"
                name={`licenses.${index}.indigenousOrImported`}
                options={goodsSources}
                placeholder="Select if needed"
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
