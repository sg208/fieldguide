# Deployment

The live site, https://fieldguide.engg.app, is a Cloudflare Worker that renders pages on the server and serves the built assets. Deploy from `main` only.

## Build

```bash
pnpm install --frozen-lockfile
pnpm build
```

The build writes the client bundle and the Worker to `dist/`. It makes no network requests.

## Deploy

`wrangler.jsonc` binds the Worker to the `fieldguide.engg.app` custom domain. Wrangler creates the domain record on deploy.

```bash
pnpm run deploy   # pnpm build, then wrangler deploy
```

Requirements:

- `wrangler` v4, installed as a dev dependency by `pnpm install`
- `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` set in the environment, for the account that owns the `engg.app` zone

`workers_dev` and `preview_urls` are off, so the custom domain is the only public address.

## Rollback

- Run `wrangler rollback` to return to the previous version, or redeploy the previous commit from `main`.
- To take the site down, run `wrangler delete --name fieldguide` and remove the `fieldguide.engg.app` custom domain.

There is no persistent data, so nothing is lost. The only stored state is the Cache API cache at the edge, which expires on its own.

## Local check

```bash
pnpm build
pnpm preview
```

Preview runs the production build in the local Workers runtime. Use `pnpm test:e2e` to run the browser tests against it on port 4311.

## Troubleshooting

- `pnpm type-check` fails on a missing `routeTree.gen.ts`: the file is generated. Run `pnpm routes:generate` or `pnpm type-check` once on a fresh clone.
- Place pages show a rate-limit message: iNaturalist or Open-Meteo answered 429. The Worker serves the last cached answer when it has one; otherwise the page asks the visitor to try again later. Wait and retry.
- Error 1102 (Worker exceeded resource limits): the Free plan has a CPU time limit per request. Check the observability logs for the slow route.
- Responses are not cached locally or on `workers.dev`: the Cache API only works on the deployed custom domain, so every request goes to the upstream there.
- Dependency errors: delete `node_modules`, run `pnpm install`, and check that you are on the Node version in `.node-version`.
