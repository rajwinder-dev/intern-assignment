import { countries } from '@/data/countries'
import { documentCodes } from '@/data/e-sanchit-codes'
import { ports } from '@/data/ports'
import { quantityCodes } from '@/data/quantity-code'
import schemeCodes from '@/data/scheme-codes'
import { stateOptions } from '@/data/states'
import { Trades } from '@/data/trade-agrements'

export const sealTypes = [
  { value: 'S', label: 'S - Self sealed' },
  { value: 'A', label: 'A - Agency / Customs sealed' },
  { value: 'W', label: 'W - Warehouse / Port sealed' }
]

export const contractTypes = [
  { value: 'FOB', label: 'FOB (Free on Board)' },
  { value: 'CF', label: 'CF (Cost + Freight)' },
  { value: 'CIF', label: 'CIF (Cost + Insurance + Freight)' },
  { value: 'CI', label: 'CI - (Cost + Insurance)' }
]

export const weightUnits = [
  { value: 'KG', label: 'kg (kilogram)' },
  { value: 'g', label: 'g (gram)' },
  { value: 'MT', label: 'mt (metric ton)' },
  { value: 'lb', label: 'lb (pound)' }
]

export const paymentTypes = [
  { value: 'DP', label: 'DP (Direct payment)' },
  { value: 'AP', label: 'AP (Advance payment)' },
  { value: 'LC', label: 'LC (Letter of credit)' },
  { value: 'DA', label: 'DA (Delivery against acceptance)' },
  { value: 'NA', label: 'NA (Not applicable)' }
]

export const priceInclusionTypes = [
  { value: 'B', label: 'Freight and insurance - B' },
  { value: 'F', label: 'Freight only - F' },
  { value: 'I', label: 'Insurance only - I' },
  { value: 'N', label: 'Neither - N' }
]

export const currencyOptions = [
  { value: 'USD', label: 'USD' },
  { value: 'EUR', label: 'EUR' },
  { value: 'INR', label: 'INR' },
  { value: 'AED', label: 'AED' },
  { value: 'GBP', label: 'GBP' },
  { value: 'SGD', label: 'SGD' }
]

export const cargoOptions = [
  { value: 'P', label: 'Packaged cargo - P' },
  { value: 'C', label: 'Containerized - C' },
  { value: 'CP', label: 'Containerized packages - CP' },
  { value: 'LB', label: 'Liquid bulk - LB' },
  { value: 'DB', label: 'Dry bulk - DB' }
]

export const lookupLists = {
  documentCodes,
  quantityCodes,
  schemeCodes,
  stateOptions,
  trades: Trades,
  cargoOptions,
  contractTypes,
  currencyOptions,
  paymentTypes,
  priceInclusionTypes,
  sealTypes,
  weightUnits,
  countries,
  fileTypeOptions: [{ value: 'pdf', label: 'PDF' }],
  portOptions: ports.map((port) => ({ value: port.code, label: `${port.name} · ${port.code}` }))
}
