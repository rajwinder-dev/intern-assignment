import { marksByExporter, MarksAndNumbersOption } from '@/data/marks-and-numbers'

export type { MarksAndNumbersOption }

// Dummy data source. Replace this function's implementation with the API request
// when the exporter marks endpoint is available; the form only depends on this interface.
export function getMarksAndNumbersOptions(exporterId: string): Promise<MarksAndNumbersOption[]> {
  return Promise.resolve(marksByExporter[exporterId] ?? [])
}
