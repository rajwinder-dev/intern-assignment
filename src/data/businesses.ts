import type { Business } from '@/shipping-bills/model'

export const businesses: Business[] = [
  {
    id: 1000,
    name: 'Gulf Retail LLC',
    isConsignee: true,
    isBuyer: true,
    isNotify: false,
    isThirdParty: false,
    branches: [
      {
        id: 1000,
        branchName: 'Dubai head office',
        address1: '18 Creek Road',
        city: 'Dubai',
        countryCode: 'AE'
      },
      {
        id: 2004,
        branchName: 'Abu Dhabi Distribution Hub',
        address1: 'KIZAD Industrial Zone',
        city: 'Abu Dhabi',
        countryCode: 'AE'
      }
    ]
  },
  {
    id: 2002,
    name: 'Northstar Trading Inc',
    isConsignee: true,
    isBuyer: true,
    isNotify: true,
    isThirdParty: false,
    branches: [
      {
        id: 2003,
        branchName: 'New Orleans warehouse',
        address1: '456 Import Street',
        city: 'New Orleans',
        state: 'Louisiana',
        countryCode: 'US'
      },
      {
        id: 2005,
        branchName: 'Houston Fulfillment Center',
        address1: '8900 Port of Houston Parkway',
        city: 'Houston',
        state: 'Texas',
        countryCode: 'US'
      }
    ]
  },
  {
    id: 2010,
    name: 'EuroGlobal Fashion GmbH',
    isConsignee: true,
    isBuyer: true,
    isNotify: true,
    isThirdParty: false,
    branches: [
      {
        id: 2011,
        branchName: 'Hamburg Central Hub',
        address1: 'Speicherstadt Logistics Park 4',
        city: 'Hamburg',
        countryCode: 'DE'
      },
      {
        id: 2012,
        branchName: 'Frankfurt Distribution Depot',
        address1: 'Flughafen Gateway Gardens',
        city: 'Frankfurt',
        countryCode: 'DE'
      }
    ]
  },
  {
    id: 2020,
    name: 'Pacific Rim Import Co.',
    isConsignee: true,
    isBuyer: true,
    isNotify: false,
    isThirdParty: false,
    branches: [
      {
        id: 2021,
        branchName: 'Los Angeles Port Terminal Branch',
        address1: '700 Harbor Boulevard',
        city: 'Los Angeles',
        state: 'California',
        countryCode: 'US'
      },
      {
        id: 2022,
        branchName: 'Seattle Gateway Warehouse',
        address1: '1200 Pacific Highway',
        city: 'Seattle',
        state: 'Washington',
        countryCode: 'US'
      }
    ]
  },
  {
    id: 2030,
    name: 'Al-Mansoor Trading FZE',
    isConsignee: true,
    isBuyer: true,
    isNotify: true,
    isThirdParty: false,
    branches: [
      {
        id: 2031,
        branchName: 'Jebel Ali Free Zone Office',
        address1: 'JAFZA North Tower 2',
        city: 'Dubai',
        countryCode: 'AE'
      },
      {
        id: 2032,
        branchName: 'Sharjah Industrial Depot',
        address1: 'SAIF Zone Building 5',
        city: 'Sharjah',
        countryCode: 'AE'
      }
    ]
  },
  {
    id: 2040,
    name: 'Apex Overseas Pte Ltd',
    isConsignee: true,
    isBuyer: true,
    isNotify: false,
    isThirdParty: false,
    branches: [
      {
        id: 2041,
        branchName: 'Singapore Tech Park Branch',
        address1: '50 Jurong East Street 21',
        city: 'Singapore',
        countryCode: 'SG'
      },
      {
        id: 2042,
        branchName: 'Changi Air Freight Center',
        address1: 'Cargo Agents Building C',
        city: 'Singapore',
        countryCode: 'SG'
      }
    ]
  },
  {
    id: 2050,
    name: 'British Heritage Imports Ltd',
    isConsignee: true,
    isBuyer: true,
    isNotify: true,
    isThirdParty: false,
    branches: [
      {
        id: 2051,
        branchName: 'London Gateway Terminal',
        address1: 'Thames Port Logistics Park',
        city: 'London',
        countryCode: 'GB'
      },
      {
        id: 2052,
        branchName: 'Manchester Regional Depot',
        address1: 'Trafford Industrial Estate',
        city: 'Manchester',
        countryCode: 'GB'
      }
    ]
  }
]
