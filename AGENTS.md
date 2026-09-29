# Tahoe Kanban - Project Guide

## Deploy

### Production Build

```bash
bun run build          # produces dist/ with compiled frontend
```

### Run Production Server

```bash
bun run src/server.ts  # starts ElysiaJS on port 10002, serves dist/ static
```

### Deploy to Production Server

1. SSH into target server
2. Clone repo: `git clone <repo-url>`
3. Install dependencies: `bun install`
4. Build: `bun run build`
5. Run: `bun run src/server.ts`
6. Use a process manager (pm2, systemd, or supervisor) to keep it running

Example with pm2:

```bash
pm2 start "bun run src/server.ts" --name tahoe-kanban
pm2 save
pm2 startup
```

### Deploy to Fly.io

1. Install Fly CLI: `brew install fly`
2. Login: `fly auth login`
3. Create app: `fly launch`
4. Deploy: `fly deploy`

### Deploy to Cloudflare Workers

1. Install Wrangler: `npm install -g wrangler`
2. Create `wrangler.toml` and adapter entrypoint for Elysia
3. Deploy: `wrangler deploy`

## Git & GitHub

### Setup Remote

```bash
gh repo create tahoe-kanban --public --source=. --push
```

### Commit

```bash
git add .
git commit -m "feat: add draggable kanban columns"
```

### Push

```bash
git push -u origin main
```

### Create Pull Request

```bash
gh pr create \
  --title "feat: add draggable kanban columns" \
  --body "Implements drag-and-drop between todo, in progress, and done columns."
```

### Open PR in Browser

```bash
gh pr create --web
```

### Check PR Status

```bash
gh pr status
```

### Merge PR

```bash
gh pr merge <number> --squash --delete-branch
```

### Check GitHub Status

```bash
gh auth status
```

## Development

### Start Dev Servers (both frontend + backend)

```bash
bun run dev
```

- Frontend: http://localhost:10001
- Backend API: http://localhost:10002

### Type Check

```bash
tsc --noEmit
```
