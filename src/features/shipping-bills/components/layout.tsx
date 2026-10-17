import { clsx } from 'ui/utils'

export function SectionHeading({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mb-4">
      <h2 className="text-base font-semibold text-gray-950">{title}</h2>
      {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
    </div>
  )
}

export function Advanced({
  title,
  children,
  defaultOpen
}: {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  return (
    <details className="rounded-lg border border-gray-200 bg-gray-50/50 p-4" open={defaultOpen}>
      <summary className="cursor-pointer text-sm font-medium text-gray-700">{title}</summary>
      <div className="mt-4">{children}</div>
    </details>
  )
}

// Keep fields registered while another tab is open so RHF validates the entire bill on submit.
export function PersistentTab({
  value,
  activeTab,
  children,
  className
}: {
  value: string
  activeTab: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div role="tabpanel" hidden={activeTab !== value} className={clsx('mt-3', className)}>
      {children}
    </div>
  )
}
