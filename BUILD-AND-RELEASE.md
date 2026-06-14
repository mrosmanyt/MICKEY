# MICKEY — Build & Release Guide (testers ke liye)

Goal: 2 testers (Mac + Windows) ko ek-line command se MICKEY install karwana.

> **Ek baar ka setup:** scripts ready hain, par unhe chalne ke liye aapko **installer files build karke host** karni hain. Cross-build nahi hota — **Windows ka build Windows par, Mac ka build Mac par**.

---

## Aapke testers ke liye 2 commands

**Windows** (PowerShell, "Run as Administrator" zaroori nahi):
```
powershell -c "irm https://mickeyai.site/install.ps1 | iex"
```

**macOS** (Terminal):
```
curl -fsSL https://mickeyai.site/install.sh | bash
```

Ye commands abhi tabhi chalengi jab aap niche ke 2 steps kar lein.

---

## Step 1 — Installers build karein

### Windows (.exe) — Windows machine par
```
cd D:\MICKEY
npm install
npm run tauri build
```
Output yahan banega:
`src-tauri/target/release/bundle/nsis/MICKEY_0.1.0_x64-setup.exe`

### macOS (.dmg) — kisi Mac par (zaroori — Windows se Mac build nahi hota)
```
cd MICKEY
npm install
npm run tauri build
```
Output:
- Apple Silicon (M1/M2/M3): `.../bundle/dmg/MICKEY_0.1.0_aarch64.dmg`
- Intel Mac: `.../bundle/dmg/MICKEY_0.1.0_x64.dmg`

> Mac nahi hai? GitHub Actions (macos-latest runner) se free build kar sakte hain — bata dein to workflow bana doon.

---

## Step 2 — Files host karein

`install.ps1` aur `install.sh` pehle se `mickey-website/public/` mein hain — site deploy karte hi ye live ho jayenge:
- `https://mickeyai.site/install.ps1`
- `https://mickeyai.site/install.sh`

Ab build ki hui installer files ko `downloads/` folder mein daalein (in exact naamon se):
```
mickey-website/public/downloads/MICKEY_0.1.0_x64-setup.exe      (Windows)
mickey-website/public/downloads/MICKEY_0.1.0_aarch64.dmg        (Mac Apple Silicon)
mickey-website/public/downloads/MICKEY_0.1.0_x64.dmg            (Mac Intel)
```
Phir site dobara deploy karein (Netlify). Bas — commands chal padengi.

> **Bड़ी files:** agar Netlify par size issue ho, installers **GitHub Releases** par upload karein aur dono scripts mein `BaseUrl`/`BASE_URL` ko us release URL par point kar dein. (Scripts ke top par ek hi line badalni hai.)

---

## Naya version release karna (aage ke liye)
1. `src-tauri/tauri.conf.json` mein `version` barhayein (e.g. 0.1.1).
2. Dono OS par `npm run tauri build`.
3. Nayi installer files `downloads/` mein upload.
4. `install.ps1` aur `install.sh` ke top par `Version` / `VERSION` update karein.
5. Site deploy. (Auto-update bhi configured hai — tab sirf updater endpoint par naya artifact chahiye.)

---

## Unsigned app warnings (testing phase — normal hai)

Abhi app **code-signed/notarized nahi** (wo paid Apple/Windows certs maangti hai). Testers ko ek baar:

- **Windows:** "Windows protected your PC" → **More info → Run anyway**.
- **macOS:** install script quarantine khud hata deta hai. Phir bhi "unidentified developer" aaye → **System Settings → Privacy & Security → Open Anyway**.

Ye sirf testing phase ke liye. Public launch se pehle code-signing certs le lena (Apple Developer $99/yr, Windows OV/EV cert) — tab koi warning nahi aayegi. Bata dein to woh setup bhi guide kar doon.

---

## Tester ko bhejne ke liye message (copy-paste)

> MICKEY testing ke liye taiyaar hai 🎉
> • **Windows:** PowerShell kholein, paste karein:
>   `powershell -c "irm https://mickeyai.site/install.ps1 | iex"`
> • **Mac:** Terminal kholein, paste karein:
>   `curl -fsSL https://mickeyai.site/install.sh | bash`
> Install ke baad MICKEY khulegi — sign in karke try karein. Koi bhi masla ho to screenshot bhej dein.
