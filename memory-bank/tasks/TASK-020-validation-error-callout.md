# TASK-020 - Validation error callout

**Status:** Completed  
**Added:** 2025-09-10  
**Updated:** 2025-09-10

## Original Request
Add a robust, accessible validation error callout to the UI, blocking outputs when errors exist.

## Thought Process
- Validation should be soft, user-friendly, and block outputs but not input.
- Error callout must be visually distinct, accessible, and compact.

## Implementation Plan
- Implement validateLoanInputs with all business rules.
- Integrate into app/page.tsx.
- Render a red error callout above outputs if errors exist.
- Block all outputs (KPIs, metrics, chart) if errors exist.

## Progress Tracking
**Overall Status:** Completed - 100%

### Subtasks
| ID | Description | Status | Updated | Notes |
|----|-------------|--------|---------|-------|
| 1.1 | Implement validateLoanInputs | Complete | 2025-09-10 | |
| 1.2 | Integrate error callout in UI | Complete | 2025-09-10 | |
| 1.3 | Block outputs on error | Complete | 2025-09-10 | |

## Progress Log
### 2025-09-10
- Implemented full validation logic.
- Integrated error callout into UI.
- All outputs now blocked if errors exist.
