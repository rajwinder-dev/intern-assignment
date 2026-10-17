import type { Exporter } from '@/types/types'

export const exporters: Exporter[] = [
  {
    id: 1000,
    name: 'Aarav Textiles Pvt Ltd',
    iec: 'AAECA1234F',
    class: 'F',
    type: 'P',
    branches: [
      {
        id: 1000,
        branchName: 'Ludhiana factory',
        address1: '12 Industrial Area',
        city: 'Ludhiana',
        state: 'Punjab',
        pincode: '141015',
        countryCode: 'IN',
        gstnId: '03AAECA1234F1Z5',
        adCode: '62093230170136'
      },
      {
        id: 1001,
        branchName: 'Tirupur Processing Unit',
        address1: '45 Cotton Mill Road',
        city: 'Tirupur',
        state: 'Tamil Nadu',
        pincode: '641601',
        countryCode: 'IN'
      }
    ]
  },
  {
    id: 1002,
    name: 'Blue Harbor Exports',
    iec: 'AABCB5678G',
    class: 'R',
    type: 'P',
    branches: [
      {
        id: 1003,
        branchName: 'Mumbai office',
        address1: '8 Dock Road',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        countryCode: 'IN'
      },
      {
        id: 1005,
        branchName: 'Mundra Port Logistics Hub',
        address1: 'Plot 14 Port SEZ',
        city: 'Mundra',
        state: 'Gujarat',
        pincode: '370421',
        countryCode: 'IN'
      }
    ]
  },
  {
    id: 1010,
    name: 'Apex Garments & Fashion Pvt Ltd',
    iec: 'AAACG9876K',
    class: 'F',
    type: 'P',
    branches: [
      {
        id: 1011,
        branchName: 'Surat Apparel Park',
        address1: 'Sector 3 GIDC Khatodara',
        city: 'Surat',
        state: 'Gujarat',
        pincode: '395002',
        countryCode: 'IN'
      },
      {
        id: 1012,
        branchName: 'Ahmedabad Central Warehouse',
        address1: 'NH-8 Narol Highway',
        city: 'Ahmedabad',
        state: 'Gujarat',
        pincode: '382405',
        countryCode: 'IN'
      }
    ]
  },
  {
    id: 1020,
    name: 'Zenith Spices & Agri Corp',
    iec: 'AADCZ3456M',
    class: 'R',
    type: 'P',
    branches: [
      {
        id: 1021,
        branchName: 'Kochi Export Hub',
        address1: 'Willingdon Island Terminal',
        city: 'Kochi',
        state: 'Kerala',
        pincode: '682003',
        countryCode: 'IN'
      },
      {
        id: 1022,
        branchName: 'Guntur Spice Processing Center',
        address1: 'Guntur GT Road',
        city: 'Guntur',
        state: 'Andhra Pradesh',
        pincode: '522001',
        countryCode: 'IN'
      }
    ]
  },
  {
    id: 1030,
    name: 'Titanium Engineering Works',
    iec: 'AAEET7788P',
    class: 'F',
    type: 'P',
    branches: [
      {
        id: 1031,
        branchName: 'Pune Auto Cluster Plant',
        address1: 'Chinchwad MIDC Industrial Zone',
        city: 'Pune',
        state: 'Maharashtra',
        pincode: '411019',
        countryCode: 'IN'
      },
      {
        id: 1032,
        branchName: 'Chennai Guindy Depot',
        address1: 'Guindy Industrial Estate',
        city: 'Chennai',
        state: 'Tamil Nadu',
        pincode: '600032',
        countryCode: 'IN'
      }
    ]
  },
  {
    id: 1040,
    name: 'Evergreen Organics Pvt Ltd',
    iec: 'AAEOE5544R',
    class: 'F',
    type: 'P',
    branches: [
      {
        id: 1041,
        branchName: 'Bengaluru Biotech Park Branch',
        address1: 'Electronics City Phase 1',
        city: 'Bengaluru',
        state: 'Karnataka',
        pincode: '560100',
        countryCode: 'IN'
      },
      {
        id: 1042,
        branchName: 'Mysuru Herbal Extraction Unit',
        address1: 'Hebbal Industrial Area',
        city: 'Mysuru',
        state: 'Karnataka',
        pincode: '570016',
        countryCode: 'IN'
      }
    ]
  },
  {
    id: 1050,
    name: 'Rajputana Handicrafts Ltd',
    iec: 'AARPR9911X',
    class: 'R',
    type: 'P',
    branches: [
      {
        id: 1051,
        branchName: 'Jaipur Artisan Export Hub',
        address1: 'Sitapura Industrial Area',
        city: 'Jaipur',
        state: 'Rajasthan',
        pincode: '302022',
        countryCode: 'IN'
      },
      {
        id: 1052,
        branchName: 'Jodhpur Wooden Craft Depot',
        address1: 'Boranada SEZ Phase II',
        city: 'Jodhpur',
        state: 'Rajasthan',
        pincode: '342012',
        countryCode: 'IN'
      }
    ]
  }
]
