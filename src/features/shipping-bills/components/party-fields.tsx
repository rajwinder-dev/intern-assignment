import { useState } from 'react'
import {
  LabelHook,
  OptionsHook,
  useBusinessBranchLabel,
  useBusinessBranchOptions,
  useBusinessLabel,
  useBuyerOptions,
  useConsigneeOptions,
  useExporterBranchLabel,
  useExporterBranchOptions,
  useExporterLabel,
  useExporterOptions,
  useThirdPartyOptions
} from '@/hooks/lookup-hooks'
import type { Branch, Business, Exporter } from '@/types/types'
import { BranchDialog, PartyDialog } from './party-dialogs'
import { AsyncSelect } from './async-select'
import { BillFormContext } from '../utils'

export type PartyRole = 'exporter' | 'consignee' | 'buyer' | 'thirdParty'

export type OwnerPath =
  | 'exporterId'
  | 'consigneeId'
  | `invoices.${number}.buyerId`
  | `invoices.${number}.thirdPartyId`
  | `invoices.${number}.items.${number}.itemThirdPartyId`

export type BranchPath =
  | 'exporterBranchId'
  | 'consigneeBranchId'
  | `invoices.${number}.buyerBranchId`
  | `invoices.${number}.thirdPartyBranchId`
  | `invoices.${number}.items.${number}.itemThirdPartyBranchId`

interface Lookup {
  useOptions: OptionsHook
  useLabel: LabelHook
}

const businessBranch: Lookup = { useOptions: useBusinessBranchOptions, useLabel: useBusinessBranchLabel }

// To support a new party role: add it to PartyRole and give it a row here.
const partyLookups: Record<PartyRole, { owner: Lookup; branch: Lookup }> = {
  exporter: {
    owner: { useOptions: useExporterOptions, useLabel: useExporterLabel },
    branch: { useOptions: useExporterBranchOptions, useLabel: useExporterBranchLabel }
  },
  consignee: { owner: { useOptions: useConsigneeOptions, useLabel: useBusinessLabel }, branch: businessBranch },
  buyer: { owner: { useOptions: useBuyerOptions, useLabel: useBusinessLabel }, branch: businessBranch },
  thirdParty: { owner: { useOptions: useThirdPartyOptions, useLabel: useBusinessLabel }, branch: businessBranch }
}

interface PartyFieldsProps {
  formCtx: BillFormContext
  role: PartyRole
  ownerName: OwnerPath
  branchName: BranchPath
  label: string
  required?: boolean
  onOwnerChange?: () => void
}

/** Owner + branch pickers. Owns its own "add new party" and "add branch" dialogs. */
export function PartyFields({
  formCtx,
  role,
  ownerName,
  branchName,
  label,
  required = true,
  onOwnerChange
}: PartyFieldsProps) {
  const { watch, setValue } = formCtx.hooks
  const ownerId = watch(ownerName)
  const [dialog, setDialog] = useState<'party' | 'branch' | null>(null)
  const lookup = partyLookups[role]
  const kind = role === 'exporter' ? 'exporter' : 'business'

  function handleOwnerSelected() {
    setValue(branchName, '', { shouldValidate: true })
    onOwnerChange?.()
  }

  function handlePartySaved(party: Exporter | Business) {
    const branchId = party.branches[0]?.id
    if (!branchId) return
    setValue(ownerName, String(party.id), { shouldValidate: true })
    setValue(branchName, String(branchId), { shouldValidate: true })
    onOwnerChange?.()
  }

  return (
    <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div>
        <div className="mb-1 flex items-center justify-between gap-2">
          <span className="text-sm font-medium">{label}</span>
          <button
            type="button"
            className="text-primary-700 text-xs font-medium hover:underline"
            onClick={() => setDialog('party')}>
            + Add new
          </button>
        </div>
        <AsyncSelect
          name={ownerName}
          placeholder={`Search & select ${kind}...`}
          rules={{ required }}
          useOptions={lookup.owner.useOptions}
          useLabel={lookup.owner.useLabel}
          onValueChange={handleOwnerSelected}
        />
      </div>
      <div>
        <div className="mb-1 flex items-center justify-between gap-2">
          <span className="text-sm font-medium">Branch / address</span>
          {ownerId && (
            <button
              type="button"
              className="text-primary-700 text-xs font-medium hover:underline"
              onClick={() => setDialog('branch')}>
              + Add branch
            </button>
          )}
        </div>
        <AsyncSelect
          name={branchName}
          placeholder={ownerId ? 'Search & select branch...' : `Choose ${kind} first`}
          disabled={!ownerId}
          rules={{ required: required || !!ownerId }}
          parentId={ownerId}
          useOptions={lookup.branch.useOptions}
          useLabel={lookup.branch.useLabel}
        />
      </div>

      {dialog === 'party' && (
        <PartyDialog
          kind={kind}
          initialRole={role === 'exporter' ? undefined : role}
          onClose={() => setDialog(null)}
          onSaved={handlePartySaved}
        />
      )}
      {dialog === 'branch' && ownerId && (
        <BranchDialog
          kind={kind}
          ownerId={Number(ownerId)}
          onClose={() => setDialog(null)}
          onSaved={(branch: Branch) => setValue(branchName, String(branch.id), { shouldValidate: true })}
        />
      )}
    </div>
  )
}
