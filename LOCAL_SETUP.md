# Local Setup Instructions

## Quick Setup (new machine)

1) Install dependencies (installs `tsc`, Vite, etc.)
```bash
npm install
```

2) Create your local config (gitignored)
```bash
cp code.template.js code.js
```

3) Add your Airtable credentials in `code.js`
```javascript
const DATABASES = {
    commonTerms: {
        apiKey: 'patXXXXXXXX...',      // Your Airtable PAT
        baseId: 'appXXXXXXXXXXXXXX',   // Your Base ID
        tableName: 'Common Terms',
        fields: {
            term: 'Content',
            platform: 'Platform',
            type: 'Type',
            explanation: 'Examples & Explanation'
        }
    }
};
```
- Get PAT: https://airtable.com/account (starts with `pat`)
- Get Base ID: https://airtable.com/api (starts with `app`)

4) Build the plugin bundle
```bash
npm run build
```
This outputs `ui.html` that Figma loads.

5) Load into Figma Desktop
- `Plugins → Development → Import plugin from manifest`
- Pick `manifest.json` in this repo
- Launch the plugin

---

## Why This Setup?

- **Security:** Your API token never gets committed to git
- **Collaboration:** Other developers can copy `code.template.js` and add their own credentials
- **GitHub:** Won't block pushes for exposed secrets

---

## For Infisical Users

If you're using Infisical for secret management, you can automate this:

### Option 1: Manual Fetch

```bash
# Get your token from Infisical
infisical secrets get AIRTABLE_WRITING_DATABASE_PAT --plain

# Manually paste it into code.js
```

### Option 2: Build Script (Advanced)

Create `build-config.sh`:

```bash
#!/bin/bash
AIRTABLE_PAT=$(infisical secrets get AIRTABLE_WRITING_DATABASE_PAT --plain)
AIRTABLE_BASE_ID="appRFw3DnA7CNOSit"

cp code.template.js code.js
sed -i "s/{{AIRTABLE_PAT}}/$AIRTABLE_PAT/g" code.js
sed -i "s/{{AIRTABLE_BASE_ID}}/$AIRTABLE_BASE_ID/g" code.js

echo "✅ code.js configured with Infisical secrets"
```

Make it executable and run:
```bash
chmod +x build-config.sh
./build-config.sh
```

---

## Troubleshooting

**"code.js not found":**
- Ensure `code.js` exists (from the `cp` command) and lives in the repo root.

**"tsc: command not found":**
- Rerun `npm install` to install dev deps.

**"No terms found":**
- Verify PAT (`pat...`) and Base ID (`app...`)
- Confirm `tableName` and field names match your Airtable schema exactly.

---

**That's it!** Your local setup is complete and your secrets are safe.
