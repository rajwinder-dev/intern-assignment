import { lookupLists } from '@/constants/constants'
import { useDocumentTypeLabel, useDocumentTypeOptions } from '@/hooks/lookup-hooks'
import { emptyDocument } from '@/model/model'
import type { BillDocument } from '@/types/types'
import { useFieldArray } from 'core/form'
import { Button } from 'ui/basic/button'
import { Card, CardContent, CardHeader } from 'ui/basic/card'
import { Input } from 'ui/inputs/input'
import { AsyncSelect } from '../components/async-select'
import { Advanced } from '../components/layout'
import { BillSelect, dateType, type BillFormContext, type TabProps } from '../utils'

const { fileTypeOptions } = lookupLists

// If any of these has a value, the "Issuing party and ICEGATE details" panel starts open.
const customFields = [
  'placeOfIssue',
  'invoiceSerialNumber',
  'itemSerialNumber',
  'issuingPartyCode',
  'issuingPartyName',
  'issuingPartyAddress1',
  'issuingPartyAddress2',
  'issuingPartyCity',
  'issuingPartyPin',
  'beneficiaryPartyCode',
  'beneficiaryPartyName',
  'beneficiaryPartyAddress1',
  'beneficiaryPartyAddress2',
  'beneficiaryPartyCity',
  'beneficiaryPartyPin',
  'fileType',
  'icegateId'
] as const satisfies readonly (keyof BillDocument)[]

export function DocumentsSection({ formCtx }: TabProps) {
  const { fields: documents, append, remove } = useFieldArray({ control: formCtx.hooks.control, name: 'documents' })
  const addButton = (
    <Button variant="outline" size="sm" onClick={() => append(emptyDocument())}>
      + Add document
    </Button>
  )

  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-gray-950">Supporting documents</h3>
          <p className="mt-1 text-sm text-gray-500">Add references when required for this shipment.</p>
        </div>
        {documents.length > 0 && addButton}
      </CardHeader>
      <CardContent className="space-y-4">
        {documents.length === 0 && addButton}
        {documents.map((field, index) => (
          <DocumentItem key={field.id} formCtx={formCtx} index={index} onRemove={() => remove(index)} />
        ))}
      </CardContent>
    </Card>
  )
}

function DocumentItem({ formCtx, index, onRemove }: { formCtx: BillFormContext; index: number; onRemove: () => void }) {
  const { register, watch } = formCtx.hooks
  const document = watch(`documents.${index}`)
  const hasCustomValues = customFields.some((key) => document?.[key])

  return (
    <div className="space-y-3 rounded-lg border border-gray-200 bg-white p-3">
      <div className="mb-1 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">Document {index + 1}</h3>
        <Button size="sm" variant="ghost" className="h-7 px-2 text-xs" onClick={onRemove}>
          Remove
        </Button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <span className="mb-1 block text-sm font-medium text-gray-700">Document type code</span>
          <AsyncSelect
            name={`documents.${index}.documentTypeCode`}
            placeholder="Search document type..."
            useOptions={useDocumentTypeOptions}
            useLabel={useDocumentTypeLabel}
          />
        </div>
        <Input label="Image reference number" {...register(`documents.${index}.imageReferenceNumber`)} />
        <Input label="Issue date" type={dateType} {...register(`documents.${index}.documentIssueDate`)} />
      </div>

      <Advanced title="Issuing party and ICEGATE details" defaultOpen={hasCustomValues}>
        <div className="mb-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Input label="Reference number" {...register(`documents.${index}.documentReferenceNumber`)} />
          <Input label="Expiry date" type={dateType} {...register(`documents.${index}.documentExpiryDate`)} />
          <Input label="Invoice serial number" type="number" {...register(`documents.${index}.invoiceSerialNumber`)} />
          <Input label="Item serial number" type="number" {...register(`documents.${index}.itemSerialNumber`)} />
          <BillSelect
            label="File type"
            name={`documents.${index}.fileType`}
            options={fileTypeOptions}
            placeholder="Select file type"
          />
          <Input label="Place of issue" {...register(`documents.${index}.placeOfIssue`)} />
        </div>

        <Advanced title="Issuing & Beneficiary">
          <div className="flex flex-col gap-6 pt-2">
            <div>
              <h3 className="mb-3 text-sm font-semibold text-gray-900">Issuing Details</h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Input label="Issuing party code" {...register(`documents.${index}.issuingPartyCode`)} />
                <Input label="Issuing party name" {...register(`documents.${index}.issuingPartyName`)} />
                <Input label="Issuing address line 1" {...register(`documents.${index}.issuingPartyAddress1`)} />
                <Input label="Issuing address line 2" {...register(`documents.${index}.issuingPartyAddress2`)} />
                <Input label="Issuing city" {...register(`documents.${index}.issuingPartyCity`)} />
                <Input label="Issuing postal code" {...register(`documents.${index}.issuingPartyPin`)} />
              </div>
            </div>
            <div className="border-t border-gray-100 pt-5">
              <h3 className="mb-3 text-sm font-semibold text-gray-900">Beneficiary Details</h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Input label="Beneficiary code" {...register(`documents.${index}.beneficiaryPartyCode`)} />
                <Input label="Beneficiary name" {...register(`documents.${index}.beneficiaryPartyName`)} />
                <Input
                  label="Beneficiary address line 1"
                  {...register(`documents.${index}.beneficiaryPartyAddress1`)}
                />
                <Input
                  label="Beneficiary address line 2"
                  {...register(`documents.${index}.beneficiaryPartyAddress2`)}
                />
                <Input label="Beneficiary city" {...register(`documents.${index}.beneficiaryPartyCity`)} />
                <Input label="Beneficiary postal code" {...register(`documents.${index}.beneficiaryPartyPin`)} />
              </div>
            </div>
          </div>
        </Advanced>
      </Advanced>
    </div>
  )
}
