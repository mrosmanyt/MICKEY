# MICKEY — Go-Live / Deploy Guide

Sab kuch (install page + client portal + install scripts + netlify.toml) **code mein ready** hai. Live karne ke liye sirf ye steps.

> **Honest note:** main aapke GitHub par seedha push nahi kar sakta (mere paas aapke git credentials nahi, aur build sandbox abhi down hai). Ye 2 git steps aapko (ya kisi developer ko) ek baar karne honge — baaki sab uske baad **automatic** hai.

---

## A. Website live karein (install page + portal + scripts)

Aapki site `mrosmanyt/MICKEYAI` repo se connected hai aur Netlify har push par **khud deploy** karta hai. To bas naye files push karne hain:

```
cd D:\MICKEY\mickey-website
git add .
git commit -m "Add install page, client portal, one-line installers"
git push origin main
```

Bas. ~1–2 min mein ye live ho jayega:
- `https://mickeyai.site/install`  ← install page
- `https://mickeyai.site/login` + `/app` ← client portal
- `https://mickeyai.site/install.sh` aur `/install.ps1` ← one-line scripts

(Netlify build settings + script headers `netlify.toml` mein already set hain — kuch aur configure karne ki zaroorat nahi.)

> Git command line nahi aati? **GitHub Desktop** app se: open repo → Commit → Push. Ya bolein to main har file ka content de doon jo aap GitHub web par paste karke commit kar dein.

---

## B. Desktop installers auto-build (Mac ke bina bhi)

Taake testers ki ek-line command actually installer download kare, MICKEY desktop app ke installers GitHub Releases par chahiye. Maine GitHub Actions workflow bana diya jo **Windows + Mac dono khud build** karta hai (free runners — aapko Mac ki zaroorat nahi).

**Ek-baar setup:**
1. Desktop app ko ek GitHub repo par push karein, naam **`mrosmanyt/MICKEY`**
   (agar doosra naam chahiye, to `install.ps1`, `install.sh`, aur `release.yml` mein ek line badal dein).
   ```
   cd D:\MICKEY
   git init
   git remote add origin https://github.com/mrosmanyt/MICKEY.git
   git add .
   git commit -m "MICKEY desktop app"
   git push -u origin main
   ```
2. Release banane ke liye ek version tag push karein:
   ```
   git tag v0.1.0
   git push origin v0.1.0
   ```
3. GitHub → Actions tab khulega, ~10–15 min mein build complete → **Release automatically ban jayega** in files ke saath:
   - `MICKEY_0.1.0_x64-setup.exe` (Windows)
   - `MICKEY_0.1.0_x64.dmg` (Mac Intel)
   - `MICKEY_0.1.0_aarch64.dmg` (Mac Apple Silicon)

Iske baad testers ki command turant kaam karegi.

**Naya version (aage):** `tauri.conf.json` mein version barhayein → `git tag vX.Y.Z && git push origin vX.Y.Z`. Install scripts ke top par `Version` bhi update kar dein.

---

## C. Testers ko bhejein

Build complete hone ke baad:

> **Windows:** PowerShell mein:
> `powershell -c "irm https://mickeyai.site/install.ps1 | iex"`
>
> **Mac:** Terminal mein:
> `curl -fsSL https://mickeyai.site/install.sh | bash`

---

## Quick checklist
- [ ] `mickey-website` push → website + install page + portal live (Step A)
- [ ] Desktop app `mrosmanyt/MICKEY` repo par push (Step B.1)
- [ ] `v0.1.0` tag push → installers auto-build (Step B.2)
- [ ] Testers ko 2 commands bhejein (Step C)

---

## Aage ke liye (jab bolein, main kar deta hoon)
- **Code-signing** (warnings khatam) — Apple Developer ($99/yr) + Windows cert.
- **Portal ka cloud backend** (OAuth + real stats + auto-upload) — Phase 3.
- **Supabase auth** ko portal login se wire karna (abhi demo mode hai).
