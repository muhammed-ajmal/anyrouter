# AnyRouter

A universal API proxy service that supports unified forwarding of any
HTTP API, including OpenAI, Anthropic, Google, Azure, Groq, and more.

## Features

-   **Universal Proxy** -- Supports any HTTP/HTTPS API\
-   **Three Authentication Modes** -- SK alias / Key ID / Direct Token\
-   **Statistics & Monitoring** -- Request stats, IP rankings, blacklist
    management\
-   **Edge Acceleration** -- Powered by Cloudflare's global network

## Deployment

### Method 1: One-click Deployment (Recommended)

[![Deploy to Cloudflare
Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/muhammed-ajmal/anyrouter)

### Method 2: GitHub-linked Deployment

1.  Fork this repository to your GitHub account\
2.  Log in to Cloudflare Dashboard → Workers & Pages → Create\
3.  Choose **Workers** → Import from GitHub → Select your fork\
4.  Use the default settings and click Deploy\
5.  After deployment, go to Settings → Variables and Secrets to add
    environment variables

### Method 3: Command-line Deployment

``` bash
git clone https://github.com/dext7r/anyrouter.git
cd anyrouter
npm install

# Local development: copy example configuration and fill in your values
cp wrangler.toml.example wrangler.toml.local
# Edit wrangler.toml.local to add your environment variables
npx wrangler dev -c wrangler.toml.local

# Deploy to Cloudflare
npm run build
npx wrangler deploy
# Then configure environment variables in the Dashboard
```

### Method 4: GitHub Actions

``` yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm install && npm run build
      - run: npx wrangler deploy
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          CLOUDFLARE_ACCOUNT_ID: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
```

## Environment Variables 

  Variable                Required   Description
  ----------------------- ---------- ----------------------------
  `ADMIN_PASSWORD`        ✅         Admin panel login password
  `SUPABASE_URL`          ❌         Supabase project URL
  `SUPABASE_KEY`          ❌         Supabase anon key
  `UPSTASH_REDIS_URL`     ❌         Upstash Redis REST URL
  `UPSTASH_REDIS_TOKEN`   ❌         Upstash Redis token

> You can use direct-pass mode without configuring Supabase/Redis.

## Usage

``` bash
# SK Alias Mode (Recommended)
curl -H "Authorization: Bearer sk-ar-xxxxxxxx" https://your-proxy/v1/chat/completions

# Key ID Mode
curl -H "Authorization: Bearer https://api.openai.com:a3x9k2" https://your-proxy/v1/chat/completions

# Direct Token Mode
curl -H "Authorization: Bearer https://api.openai.com:sk-xxx" https://your-proxy/v1/chat/completions
```

## Routes

  Route      Description
  ---------- --------------------
  `/`        Status page
  `/docs`    Full documentation
  `/admin`   Admin panel
  `/*`       Proxied requests

## License

MIT
