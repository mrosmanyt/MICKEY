# MICKEY — Playwright Automation Sidecar

Playwright is a Node library and can't run inside MICKEY's WebView, so it runs
here as a tiny local server that the desktop app calls over `127.0.0.1:7878`.
When this server is running you get real browser automation in a visible,
persistent Chromium (logins for WhatsApp/Gmail/etc. are remembered). When it's
**not** running, MICKEY automatically falls back to opening your default
browser — so browser commands always work either way.

## Setup (once)

```bash
cd D:\MICKEY\playwright-server
npm install          # installs Playwright + downloads Chromium (postinstall)
```

## Run (keep open while using MICKEY)

```bash
npm start            # launches Chromium + the API on http://127.0.0.1:7878
```

Leave this terminal running. Start it before (or alongside) the MICKEY app.

## API

| Method | Path       | Body                     | Action                         |
|--------|------------|--------------------------|--------------------------------|
| GET    | `/health`  | —                        | liveness check                 |
| POST   | `/open`    | `{ url }`                | navigate to a URL              |
| POST   | `/search`  | `{ query }`              | Google search                  |
| POST   | `/youtube` | `{ query, play }`        | YouTube search; play first hit |

## Commands that use it (in MICKEY)

"open google", "open whatsapp", "open gmail", "open instagram", "open github",
"open notion.so", "search latest AI news", "google weather"… all route through
the Playwright `Browser Agent` fast-path (before the AI model), with a system-
browser fallback.

> The persistent Chromium profile is stored in your temp folder
> (`mickey-playwright-profile`). Delete it to reset saved logins/cookies.
