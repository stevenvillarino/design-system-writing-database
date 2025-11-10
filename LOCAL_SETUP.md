# Local Setup Instructions

## Quick Setup (2 minutes)

### Step 1: Create Your Local Config

Copy the template file to create your local configuration:

```bash
cp code.template.js code.js
```

### Step 2: Add Your Credentials

Edit `code.js` and replace the placeholders:

```javascript
const DATABASES = {
    commonTerms: {
        apiKey: 'YOUR_AIRTABLE_PAT_HERE', // Your actual PAT
        baseId: 'YOUR_BASE_ID_HERE',       // Your actual Base ID
        // ... rest stays the same
    }
};
```

**Your Credentials:**
- **API Key (PAT):** Get from https://airtable.com/account
- **Base ID:** Get from https://airtable.com/api (in the URL: `appXXXXXXXXXXXXXX`)

**Example:**
```javascript
apiKey: 'patXXXXXXXXXXXXXX.XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
baseId: 'appXXXXXXXXXXXXXX',
```

### Step 3: Verify

Your `code.js` file is automatically ignored by git (see `.gitignore`), so your secrets stay local.

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

**"code.js not found" error in Figma:**
- Make sure you ran `cp code.template.js code.js`
- Check that `code.js` exists in your project directory

**"No terms found" error:**
- Verify your API key is correct (starts with `pat`)
- Verify your Base ID is correct (starts with `app`)
- Check that table name is exactly "Common Terms"

---

**That's it!** Your local setup is complete and your secrets are safe.
