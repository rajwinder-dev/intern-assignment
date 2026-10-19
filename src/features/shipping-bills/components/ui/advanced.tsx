interface AdvancedProps {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}

export function Advanced({ title, children, defaultOpen }: AdvancedProps) {
  return (
    <details className="rounded-lg border border-gray-200 bg-gray-50/50 p-4" open={defaultOpen}>
      <summary className="cursor-pointer text-sm font-medium text-gray-700">{title}</summary>
      <div className="mt-4">{children}</div>
    </details>
  )
}
