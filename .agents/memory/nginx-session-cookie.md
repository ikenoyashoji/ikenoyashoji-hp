---
name: Nginx session cookie fix
description: express-session Secure cookie works only when nginx forwards X-Forwarded-Proto
---

## Rule
Nginx reverse proxy must include `proxy_set_header X-Forwarded-Proto $scheme;` for express-session cookies to work correctly with `trust proxy: 1`.

**Why:** Without this header, the browser receives a `Secure` cookie but subsequent requests may not properly maintain the session through the nginx→node chain. Adding the header fixed admin login on ikenoyashoji.jp VPS.

**How to apply:** Always add to nginx location block when Express app uses `secure: true` cookies in production:
```
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
proxy_set_header X-Forwarded-Proto $scheme;
```
