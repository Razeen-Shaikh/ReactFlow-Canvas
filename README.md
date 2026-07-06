# App Graph Builder

A take-home demo of an **App Graph Builder** UI built with React, ReactFlow, TanStack Query, Zustand, and shadcn/ui-style components.

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

### Scripts

| Script       | Description                    |
| ------------ | ------------------------------ |
| `npm run dev` | Start Vite dev server         |
| `npm run build` | Production build            |
| `npm run preview` | Preview production build  |
| `npm run lint` | ESLint                       |
| `npm run typecheck` | TypeScript check (no emit) |

## Features

- **Layout**: Top bar, left icon rail, right panel (apps + node inspector), dotted ReactFlow canvas
- **Responsive**: Right panel becomes a slide-over drawer on small screens (`lg` breakpoint)
- **ReactFlow**: 3+ service nodes, edges, drag, select, delete (Backspace/Delete), zoom/pan, fit view
- **Inspector**: Status pill, Config/Runtime tabs, synced slider + numeric input, editable name/description
- **TanStack Query**: Mock `GET /api/apps` and `GET /api/apps/:appId/graph` via MSW with loading/error states
- **Zustand**: `selectedAppId`, `selectedNodeId`, `isMobilePanelOpen`, `activeInspectorTab`, error simulation toggle

## Key Decisions

1. **MSW for mocking** — Handlers live in `src/mocks/` with simulated latency. A top-bar toggle flips error simulation and invalidates queries.
2. **ReactFlowProvider at layout level** — Both the canvas and node inspector share graph state via `useNodes` / `useReactFlow`, avoiding prop drilling.
3. **Minimal Zustand store** — Server data stays in TanStack Query; Zustand only holds UI selection state.
4. **Custom service node type** — Canvas nodes are styled cards; full configuration lives in the right-panel inspector.
5. **Tailwind v4 + hand-rolled shadcn primitives** — Keeps bundle small while matching the dark UI from the reference screenshot.

## Project Structure

```
src/
  components/
    apps/          # Application list
    canvas/        # ReactFlow canvas + service nodes
    inspector/     # Node inspector panel
    layout/        # Shell (top bar, rail, panels)
    ui/            # shadcn-style primitives
  hooks/           # TanStack Query hooks
  lib/             # API client, utils, service metadata
  mocks/           # MSW handlers + seed data
  store/           # Zustand store
  types/           # Shared TypeScript types
```

## Known Limitations

- Graph edits (inspector changes, node deletion) are local to the session and not persisted to the mock API.
- Only two apps have distinct graph data; others fall back to the default graph.
- Left rail icons are static placeholders.
- "Add app" and share buttons are non-functional placeholders.

## Tech Stack

- React 19 + Vite
- TypeScript (strict)
- @xyflow/react
- TanStack Query
- Zustand
- MSW
- Tailwind CSS v4
- Radix UI primitives (shadcn-style)
