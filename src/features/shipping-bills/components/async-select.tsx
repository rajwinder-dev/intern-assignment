import type { LabelHook, OptionsHook } from '@/hooks/lookup-hooks'
import { RrCaretDown } from 'icons/rr/fi-rr-caret-down'
import { useState } from 'react'
import type { RegisterOptions } from 'ui/form'
import { getFormContext, getNestedSchema, useController } from 'ui/form'
import { Popover, PopoverContent, PopoverTrigger } from 'ui/interactive/popover'
import { PopoverContext } from 'ui/interactive/popover-context'
import { clsx, getContext } from 'ui/utils'

interface AsyncSelectProps {
  name: string
  placeholder?: string
  disabled?: boolean
  className?: string
  rules?: RegisterOptions
  showError?: boolean
  parentId?: string
  useOptions: OptionsHook
  useLabel: LabelHook
  onValueChange?: (value: string) => void
}

/** Searchable select whose options and selected label come from lookup query hooks. */
export function AsyncSelect({
  name,
  placeholder = 'Search...',
  disabled = false,
  className,
  rules,
  showError = true,
  parentId,
  useOptions,
  useLabel,
  onValueChange
}: AsyncSelectProps) {
  const ctx = getFormContext()
  const { field, fieldState } = useController({
    name,
    control: ctx.hooks.control,
    rules: (getNestedSchema(name, ctx.schema) as RegisterOptions) ?? rules,
    disabled
  })

  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)

  const value = String(field.value ?? '')
  const { data: options = [], isFetching } = useOptions({ query, parentId, enabled: open })
  const { data: label = '' } = useLabel({ value, parentId })

  function select(selected: string) {
    ctx.hooks.setValue(name, selected, { shouldValidate: true, shouldDirty: true, shouldTouch: true })
    onValueChange?.(selected)
    setQuery('')
  }

  return (
    <div>
      <Popover placement="bottom-start" fallbackPlacements={['top-start']} onOpenCallback={setOpen}>
        <PopoverTrigger
          className={clsx(
            clsx(
              'outline-focus-select group flex w-full cursor-pointer items-center justify-between rounded border border-gray-200 pr-2 hover:border-gray-300 disabled:cursor-not-allowed disabled:opacity-50',
              className || 'bg-white'
            ),
            disabled ? 'cursor-not-allowed opacity-50' : ''
          )}
          disabled={disabled}>
          <div className="flex items-center p-2 text-sm">
            <span className={value && label ? 'font-medium text-gray-900' : 'text-gray-400'}>
              {value && label ? label : placeholder}
            </span>
          </div>
          <RrCaretDown className="size-4 text-gray-400 transition-transform group-data-[state=open]:rotate-180" />
        </PopoverTrigger>
        <PopoverContent className="overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg">
          <div className="border-b border-gray-100 p-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type to search..."
              className="focus:border-primary-500 focus:ring-primary-500 w-full rounded border border-gray-200 px-2.5 py-1.5 text-sm outline-none focus:ring-1"
              autoFocus
            />
          </div>
          <div className="max-h-56 overflow-y-auto p-1">
            {isFetching ? (
              <div className="p-3 text-center text-xs text-gray-500">Searching...</div>
            ) : options.length === 0 ? (
              <div className="p-3 text-center text-xs text-gray-400">No matching results found</div>
            ) : (
              options.map((option) => (
                <OptionItem
                  key={option.value}
                  label={option.label}
                  sublabel={option.sublabel}
                  selected={value === option.value}
                  onSelect={() => select(option.value)}
                />
              ))
            )}
          </div>
        </PopoverContent>
      </Popover>
      {showError && fieldState.error?.message && (
        <p role="alert" className="mt-1 text-xs text-red-600">
          {fieldState.error.message}
        </p>
      )}
    </div>
  )
}

function OptionItem({
  label,
  sublabel,
  selected,
  onSelect
}: {
  label: string
  sublabel?: string
  selected: boolean
  onSelect: () => void
}) {
  const { setOpen } = getContext(PopoverContext)

  return (
    <div
      onClick={() => {
        onSelect()
        setOpen(false)
      }}
      className={clsx(
        'flex cursor-pointer flex-col rounded p-2 text-sm transition-colors',
        selected ? 'bg-primary-50 text-primary-900 font-semibold' : 'text-gray-950 hover:bg-gray-100'
      )}>
      <span>{label}</span>
      {sublabel && <span className="text-xs text-gray-500">{sublabel}</span>}
    </div>
  )
}
