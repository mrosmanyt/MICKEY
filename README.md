# MICKEY

**Your Personal Intelligent Cyber Assistant** — premium futuristic desktop app built with Tauri 2.0, React 19, TypeScript, Tailwind CSS v4, Framer Motion, Three.js and Zustand.

## Prerequisites (Windows)

1. **Node.js 20+** — https://nodejs.org
2. **Rust (stable)** — https://rustup.rs (`rustup-init.exe`, default options)
3. **Microsoft C++ Build Tools** — Visual Studio Installer → "Desktop development with C++"
4. **WebView2** — preinstalled on Windows 10/11

## Setup (run inside `D:\MICKEY`)

```powershell
cd D:\MICKEY
npm install
npm run icon        # generates app-icon.png + all platform icons (required once)
npm run tauri dev   # launch MICKEY in dev mode
```

### Voice prerequisites (Phase 2)

```powershell
# STT — Faster-Whisper (required for the mic button)
pip install faster-whisper

# TTS fallback — Piper (optional; ElevenLabs is the primary engine)
# Download piper.exe + a voice (e.g. en_US-amy-medium.onnx) from
# https://github.com/rhasspy/piper/releases, put piper.exe on PATH and
# set the voice path in Settings → Voice.
```

First mic use will trigger a Windows microphone permission prompt for the app.

Production build:

```powershell
npm run tauri build   # installer lands in src-tauri\target\release\bundle\
```

## Project structure

```
D:\MICKEY
├── index.html                  # entry, loads Orbitron/Rajdhani fonts
├── package.json / vite.config.ts / tsconfig.json
├── scripts/make-icon.mjs       # zero-dependency app icon generator
├── src/
│   ├── main.tsx / App.tsx      # layout: sidebar | hub | chat+agents
│   ├── index.css               # design tokens, glass panels, neon styles
│   ├── lib/utils.ts            # cn() helper (shadcn-style)
│   ├── data/agents.ts          # the 15 sub-agent definitions
│   ├── store/useAppStore.ts    # Zustand: agents, chat, voice, settings
│   └── components/
│       ├── TopBar.tsx              # MICKEY title plate
│       ├── GlassPanel.tsx          # reusable sci-fi panel
│       ├── VoiceCommandBar.tsx     # waveform + mic (STT/TTS in Phase 3)
│       ├── sidebar/  MediaLink, SatLinkFeed, TodayHeadlines
│       ├── center/   ConnectedNodes, IntelligenceHub (Three.js orb)
│       └── right/    ChatPanel, SubAgentsPanel (15 agents)
└── src-tauri/
    ├── tauri.conf.json         # window: "MICKEY", 1500×940, dark
    ├── Cargo.toml / build.rs
    ├── capabilities/default.json
    └── src/ main.rs, lib.rs    # ping + core_status commands
```

## The 15 sub-agents

Security, Editor, Social Media Manager, World Reports, PC Reporter, CRM, Email, WhatsApp Manager, Personal Manager, Planner, Local, Finance, Research, Leads Closer, YT & TikTok Manager — all rendered in the SUB AGENTS panel with live Active/Standby toggling.

## Roadmap

- **Phase 1 ✅** UI shell matching reference design
- **Phase 2 ✅** Settings modal (API / Voice / Agents / General), persisted via
  Tauri store; functional voice loop — mic → Faster-Whisper STT → chat →
  ElevenLabs TTS (Piper fallback); always-on-top, autostart, reset
- **Phase 3 ✅** Animated neural wires (Connected nodes → orb), World Monitor
  tab (embedded worldmonitor.app), Orchestrator + Agent Router — Gemini primary
  / Ollama fallback, with a live "Thought Process" block in chat
- **Phase 4 🔄** Agent implementations (`src/lib/agents/`) — framework + agents
  rolling out one by one. Done: **Security Agent** (system snapshot via sysinfo,
  netstat network audit, firewall check → LLM threat analysis with severity
  tags). Status in SUB AGENTS panel: ACTIVE / PROCESSING / IDLE.
- **Licensing ✅** Full production gate — registration → activation → lock,
  Supabase-backed, hardware-bound, startup + 7-day re-verification with offline
  grace. See *Licensing & Production Build* below.

## Licensing & Production Build

### How the gate works

On launch, `LicenseGate` (wrapping the whole app in `main.tsx`) verifies the
license before any of MICKEY is reachable:

```
checking ──► register ──► activate ──► unlocked  (confetti 🎉)
                 ▲            │
                 └──── "I already have a key"
unlocked ──(7-day re-check / expiry / revoke / wrong device)──► locked
```

- **Registration** (`registration_requests` table, anon insert) → you approve
  in MICKEY ADMIN → a key is generated and sent to the customer.
- **Activation** calls the `verify-license` edge function; on success the
  license is saved locally (`mickey-license.json`) and the device is bound by
  **Hardware ID** (Windows MachineGuid, read by the Rust `hardware_id` command).
- **Startup + every 7 days** it re-verifies. If the server is unreachable it
  honours a **7-day offline grace** (cached `last_verified`) so connectivity
  blips never lock out a paying user. Expired / revoked / wrong-device → lock.
- **Settings → License** shows status, plan, expiry, key, bound Hardware ID,
  Re-check Now, and Deactivate-on-this-device.

Everything (15 agents, Mickey Player, World Monitor, voice, Settings) is behind
the gate — none of it renders until `phase === "unlocked"`.

### Backend env

The desktop reads Supabase creds from `.env` (gitignored):

```env
VITE_SUPABASE_URL=https://<project>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon / publishable key>
```

Deploy the edge function once: `supabase functions deploy verify-license --no-verify-jwt`
(schema + function live in `admin/supabase/`).

### Build the customer installer (Windows)

```powershell
cd D:\MICKEY
npm install
npm run icon          # once — generates app icons
npm run tauri build   # production build
```

Installers are written to:

```
src-tauri\target\release\bundle\nsis\MICKEY_0.1.0_x64-setup.exe   (recommended)
src-tauri\target\release\bundle\msi\MICKEY_0.1.0_x64_en-US.msi
```

Ship the `.exe`. On a clean machine it launches straight into the Registration
/ Activation flow — the app stays locked until a valid key is entered.

### Optional: auto-updater

Tauri's updater is supported but needs signing keys + an update endpoint, so
it's left off by default. To enable:

1. `npm run tauri signer generate` → save the keys (keep the private key safe).
2. Add `@tauri-apps/plugin-updater` (JS) + `tauri-plugin-updater` (Cargo) and
   register the plugin in `lib.rs`.
3. In `tauri.conf.json` add a `plugins.updater` block with your public key and
   an `endpoints` URL pointing at a hosted `latest.json`.
4. Add `"updater:default"` to `capabilities/default.json`.
5. Set `MICKEY_UPDATE_PUBKEY` and re-build; upload the generated `.sig` +
   installer + `latest.json` to your endpoint for each release.

### Mickey Player (YouTube)

Third center tab: **MICKEY PLAYER**. Say or type *"play despacito on youtube"*,
*"open youtube and play nabila sardara"*, *"play latest tech news"* — MICKEY
searches the YouTube Data API, auto-plays the best match and switches to the
player tab. Custom neon controls (play/pause, volume, mute, fullscreen) +
result rail for alternates. API key lives in Settings → API → YouTube API Key.

### Using the Orchestrator (Phase 3)

1. Open Settings (gear) → API → paste your Gemini API key (free at
   https://aistudio.google.com/apikey) — or run Ollama locally
   (`ollama pull llama3.2`) and select "Ollama (local)" as default model.
2. Type in Chat or use the mic. The Orchestrator analyzes the request, routes
   it to the relevant sub-agents (shown live in the THOUGHT PROCESS block),
   answers, and speaks the reply on voice input.

> ⚠️ **Secrets:** API keys are stored locally in `mickey-settings.json`
> (Tauri app data). A default ElevenLabs key is pre-filled in
> `src/store/useSettingsStore.ts` — rotate it and never commit this repo publicly.
