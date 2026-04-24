# BFHL Graph Analyzer

A REST API + React frontend that accepts an array of node relationships, resolves hierarchical structures, detects cycles, and surfaces structured insights.

Built with Next.js 16.2 (App Router), TypeScript, and Tailwind CSS. Deployed on Vercel.

## API

### `POST /api/bfhl`

Accepts a JSON body with an array of directed edges and returns parsed hierarchies, cycle detection results, and a summary.

**Request:**

```json
{ "data": ["A->B", "A->C", "B->D"] }
```

**Response:**

```json
{
  "user_id": "meet_patel_24112005",
  "email_id": "mp4668@srmist.edu.in",
  "college_roll_number": "RA2311003020096",
  "hierarchies": [
    {
      "root": "A",
      "tree": { "A": { "B": { "D": {} }, "C": {} } },
      "depth": 3
    }
  ],
  "invalid_entries": [],
  "duplicate_edges": [],
  "summary": {
    "total_trees": 1,
    "total_cycles": 0,
    "largest_tree_root": "A"
  }
}
```

### `GET /api/bfhl`

Returns `{ "operation_code": 1 }`.

> The evaluator endpoint `/bfhl` redirects to `/api/bfhl` automatically.

## Getting Started

```bash
cp .env.example .env.local
# fill in USER_ID, EMAIL_ID, ROLL_NUMBER

npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to use the frontend.

## Project Structure

```
src/
├── app/
│   ├── api/bfhl/route.ts        # Controller (Edge Runtime)
│   ├── page.tsx                  # Client-side SPA
│   └── layout.tsx
├── services/bfhl.service.ts      # Graph processing pipeline
├── validators/node.validator.ts  # Edge validation rules
├── utils/graph.utils.ts          # Union-Find, cycle detection, tree builder
└── components/
    ├── InputPanel.tsx
    ├── HierarchyCard.tsx
    ├── SummaryStrip.tsx
    └── PillList.tsx
```

## Testing

### Simple tree

```bash
curl -s -X POST https://meetpatel-bfhl.vercel.app/api/bfhl \
  -H 'Content-Type: application/json' \
  -d '{"data": ["A->B", "A->C", "B->D"]}'
```

### Cycle detection

```bash
curl -s -X POST https://meetpatel-bfhl.vercel.app/api/bfhl \
  -H 'Content-Type: application/json' \
  -d '{"data": ["E->F", "F->G", "G->E"]}'
```

### Invalid entries and duplicates

```bash
curl -s -X POST https://meetpatel-bfhl.vercel.app/api/bfhl \
  -H 'Content-Type: application/json' \
  -d '{"data": ["A->B", "hello", "1->2", "A->A", "A->B", "A->C"]}'
```

### Mixed (trees + cycles + invalid + duplicates)

```bash
curl -s -X POST https://meetpatel-bfhl.vercel.app/api/bfhl \
  -H 'Content-Type: application/json' \
  -d '{"data": ["A->B", "A->C", "B->D", "hello", "A->B", "E->F", "F->E", "AB->C", ""]}'
```

### GET endpoint

```bash
curl -s https://meetpatel-bfhl.vercel.app/api/bfhl
```

### CORS check

```bash
curl -sI -X OPTIONS https://meetpatel-bfhl.vercel.app/api/bfhl | grep -i access-control
```

### Redirect (/bfhl -> /api/bfhl)

```bash
curl -s -L -X POST https://meetpatel-bfhl.vercel.app/bfhl \
  -H 'Content-Type: application/json' \
  -d '{"data": ["A->B"]}'
```

## Deploy

Connect the GitHub repo to Vercel. Add environment variables (`USER_ID`, `EMAIL_ID`, `ROLL_NUMBER`) in the Vercel dashboard. Deploy triggers automatically on push.

