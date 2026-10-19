import { clsx } from 'ui/utils'

interface PersistentTabProps {
  value: string
  activeTab: string
  children: React.ReactNode
  className?: string
}

// Keep fields registered while another tab is open so RHF validates the entire bill on submit.
export function PersistentTab({ value, activeTab, children, className }: PersistentTabProps) {
  return (
    <div role="tabpanel" hidden={activeTab !== value} className={clsx('mt-3', className)}>
      {children}
    </div>
  )
}
