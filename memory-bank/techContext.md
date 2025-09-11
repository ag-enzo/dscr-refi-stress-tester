# techContext.md

## Technologies Used
- Next.js 14.x (App Router)
- React 18.x
- TypeScript 5.x
- Tailwind CSS 3.x
- shadcn/ui (local components)
- Recharts 2.x
- pnpm 8.x
- ESLint, Prettier, Vitest
- Vercel (deployment)

## Development Setup
- All code in TypeScript, strict mode enabled.
- Local state for all inputs; no global store.
- All UI components in app/components/.
- Finance logic in lib/finance/core.ts; types in lib/types/finance.ts.
- Unit tests in tests/finance.core.test.ts.

## Technical Constraints
- No backend or persistence for v1.
- All calculations must be deterministic and pure.
- All UI must be accessible and minimalist.
- All outputs must be disabled or show placeholders if validation errors exist.

## Dependencies
- See package.json for full list.
