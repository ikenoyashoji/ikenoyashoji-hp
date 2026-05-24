---
name: VPS PM2 env cache
description: PM2 caches environment variables internally; how to fully clear and reload them on the ikenoyashoji VPS
---

## Rule
When updating environment variables on the VPS (especially OPENAI_API_KEY), `pm2 restart --update-env` alone is NOT sufficient to clear PM2's internal env cache.

**Why:** PM2 stores a snapshot of env vars when the process is first started. Even with `--update-env`, stale values can persist if the old env was set via a previous `pm2 start` with inline env or an older version of ecosystem.config.cjs.

**How to apply:** Always use full delete + start to guarantee a clean env:
```bash
pm2 delete ikenoya && pm2 start /var/www/app/ecosystem.config.cjs && pm2 save
```

## ecosystem.config.cjs structure
The file reads `.env` dynamically at startup:
```js
const fs = require('fs');
const envFile = fs.readFileSync('/var/www/app/.env', 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) env[match[1].trim()] = match[2].trim();
});
module.exports = { apps: [{ name: 'ikenoya', script: '/var/www/app/dist/index.cjs', env }] };
```
So updating `.env` + `pm2 delete` + `pm2 start` is the correct update flow.

## Key update flow
1. Update `.env`: `sed -i "s|^OPENAI_API_KEY=.*|OPENAI_API_KEY=newkey|" /var/www/app/.env`
2. Full restart: `pm2 delete ikenoya && pm2 start /var/www/app/ecosystem.config.cjs && pm2 save`
