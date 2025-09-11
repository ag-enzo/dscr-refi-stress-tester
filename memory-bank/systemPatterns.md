# systemPatterns.md

## System Architecture
- Next.js (App Router) + React 18 for UI and state.
- All finance logic in pure TypeScript functions in lib/finance/core.ts.
- Canonical interfaces in lib/types/finance.ts.
- UI components in app/components/ (KPI cards, metrics panel, chart, container).
- State is local to the main page; no global store needed for v1.
- All outputs are disabled or show placeholders if validation errors exist.
- Chart is implemented with Recharts and updates live with user input.

## Key Technical Decisions
- Use of shadcn/ui for all cards and panels.
- Use of Recharts for charting.
- All code is TypeScript and testable.

## Design Patterns in Use
- Pure functions for all finance calculations.
- Controlled React state for all inputs.
- Presentational components for UI (no business logic in components).
- Validation logic is centralized and blocks outputs, not input.

## Component Relationships
- Main page (app/page.tsx) manages state and data flow.
- Components receive props and display results or placeholders.
- Chart receives computed shock table and displays three series.
