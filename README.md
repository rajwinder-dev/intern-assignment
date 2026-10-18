# Shipping Bill Frontend

A refactor of the starter Shipping Bill creation application for the Frontend Engineering Assignment. The work focuses on a clearer feature structure, step-based form validation, and asynchronous mock services that can later be replaced with HTTP implementations.

## Getting started

### Requirements

- Node.js compatible with the project’s Vite toolchain
- pnpm
- Git with submodule support

### Install and run

```bash
git submodule update --init --recursive
pnpm install
pnpm dev
```

The development server starts at the URL printed by Vite (normally `http://localhost:5173`).

### Available scripts

```bash
pnpm dev          # Start the development server
pnpm build        # Create a production build
pnpm preview      # Preview the production build
pnpm lint-check   # Run the repository lint pipeline
pnpm lint         # Run the lint pipeline with fixes enabled
```

## Project structure

Application code lives in `src/` and is grouped by responsibility:

```text
src/
├── api/                 # Promise-based mock services and payload mapping
├── data/                # Demo fixtures and local demo store
├── features/
│   ├── dashboard/       # Shipping bill list page
│   └── shipping-bills/  # Form workflow, feature constants, schema, and components
├── hooks/               # React Query hooks and cache invalidation
├── model/               # Form defaults and domain transformations
├── layout/              # App layout
├── lib/                 # Shared utilities and interceptors
├── routes/              # Route definitions and paths
└── types/               # Shared TypeScript types
```

The form follows a one-way data flow:

```text
Components → React Query hooks → API services → demo data
```

Components handle presentation and user input. `useBillForm` coordinates the wizard and submission. React Query hooks own query and mutation state and invalidate the bills query after a save. API services contain mock behavior and are the intended seam for future HTTP calls.

## Shipping bill workflow

The form has three steps: shipment details, invoices and goods, and other cargo and supporting information. Each step validates its required fields before moving forward; selecting a later step also validates the preceding steps. Validation errors are rendered below their fields. Saving validates the complete form, maps the form values to the backend-shaped payload, logs that payload for inspection, saves the bill in the local demo store, and returns to the bills list.

The demo store persists local bills in browser `localStorage`. The bills list combines sample records with locally saved bills. Lookup services return Promise-based results using local fixtures and simulated latency. Upsert currently returns a mock success response; flat-file downloads are generated locally from the selected bill.

There is no live backend integration. Mock services and demo data are kept outside UI components so real service implementations can replace them without moving data-access logic into the UI. The mock covers the assignment workflow and is not intended to enforce exhaustive customs rules.

## Validation and scope

TypeScript can be checked with:

```bash
npx tsc --noEmit
```

The refactor keeps the existing React, TypeScript, React Query, and form architecture and adds no dependencies. It concentrates on the Shipping Bill form and its data flow rather than building a production customs platform.

## AI Usage & Approach

AI tools assisted with codebase inspection, refactoring, and this README. The resulting changes were reviewed and checked with TypeScript.

## Decisions and trade-offs

- Create and edit bills share one schema and form flow. If business rules diverge, the schema can be selected or composed based on the form mode.
- Shipping-bill-specific lookup data and UI option lists live in the feature's `constants.ts`; generic reference data and the core form library stay outside the feature.
- The implementation favors smaller feature components to keep form sections and business concerns easier to change independently.
- The core form wrapper exposes a limited set of React Hook Form types. The feature imports types such as `Path` and `RegisterOptions` directly from `ui/form` where needed.
- The bill model gives root fields and nested rows explicit TypeScript types. Field names passed to form controls use React Hook Form's `Path<ShippingBillFormValues>`, and repeatable sections use `useFieldArray` for invoices, items, containers, documents, licenses, and packing ranges.
- Nested array paths are not perfectly type-safe. Paths built dynamically from array indexes in validation configuration are cast to `Path<ShippingBillFormValues>`
- The core library itself was left unchanged. Improving its nested schema/path typing would be a separate shared-library change.
