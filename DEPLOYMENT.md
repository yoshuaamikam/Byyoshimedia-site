# Deploy: yoshimedia.agency (static)

GitHub Pages deploys this site on merge to `main`.

Static site at repo root: `index.html`, `portfolio.html`, `styles.css`, and image assets.

## Cloudflare Pages

**Workers & Pages → Create → Pages → Connect to Git**

| Setting | Value |
|--------|--------|
| Repository | `yoshuaamikam/Byyoshimedia-site` |
| Production branch | `main` |
| Framework preset | None |
| Build command | *(empty)* |
| Build output directory | `/` |
| Deploy command | *(empty)* |

**Custom domains:** `yoshimedia.agency`, `www.yoshimedia.agency`

Do not attach these domains to the CRM project (`By-Yoshi-Media`).

## Remove Vercel

If this repo or domain is linked in [Vercel](https://vercel.com/dashboard), remove the domain and disconnect Git.

## DNS

Zone `yoshimedia.agency` uses Cloudflare nameservers. Add custom domains via the Pages UI (CNAME to `*.pages.dev`). See [By-Yoshi-Media DEPLOYMENT.md](https://github.com/yoshuaamikam/By-Yoshi-Media/blob/main/DEPLOYMENT.md) for full split-domain and DNS cleanup steps.

## Verify

```bash
curl -sI https://yoshimedia.agency | grep -E '^(HTTP|x-vercel|server:)'
curl -sI https://yoshimedia.agency/portfolio | grep -E '^(HTTP|x-vercel|server:)'
```

Expect `HTTP/2 200` and no `x-vercel-error` header.
