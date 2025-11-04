# Demo Setup Guide
## How to Set Up Your Airtable Database for the Perfect Demo

---

## 📦 What You're Getting

The `demo-airtable-import.csv` file contains **47 approved UX terms** specifically designed to showcase Speed Rail's capabilities:

### Content Categories
- **Subscription Flow** (15+ terms): Perfect for showing a real-world use case
  - `Start Free Trial`, `Subscribe Now`, `Confirm Subscription`
  - `Manage Subscription`, `Cancel Subscription`, `Update Payment Method`
  - `Your trial ends on [date]`, `Renews on [date]`

- **Authentication** (6 terms): Common patterns every app needs
  - `Sign In`, `Sign Up`, `Get Started`

- **Error States** (9 terms): Show how to handle failures
  - `Something went wrong`, `Payment Failed`, `Try Again`

- **Settings & Account** (10+ terms): CRUD operations
  - `Save Changes`, `Delete Account`, `Update Card`

- **Onboarding** (7+ terms): First-run experience
  - `Welcome to [app name]`, `You're all set!`, `Skip for Now`

### Platform Coverage
Every term includes entries for:
- ✅ iOS
- ✅ Android
- ✅ Web

**Total Records:** 141 rows (47 terms × 3 platforms)

---

## 🚀 Step 1: Import to Airtable

### Option A: Create New Base (Recommended for Demo)

1. **Go to Airtable:** https://airtable.com
2. **Create a new base:** Click "+ Create a base"
3. **Name it:** "Speed Rail Demo - UX Writing Database"
4. **Import CSV:**
   - Click the dropdown next to the default table name
   - Select "Import data" → "CSV file"
   - Upload `demo-airtable-import.csv`
   - Ensure column mapping:
     - `Content` → Text field
     - `Platform` → Single select (or Text)
     - `Examples + Explanation` → Long text

5. **Rename Table:** "Common Terms" (to match code.js)

### Option B: Add to Existing Base

If you already have an Airtable base:
1. Create a new table: Click "+" → "Import data" → "CSV file"
2. Upload `demo-airtable-import.csv`
3. Name the table: "Common Terms"
4. Verify column names match exactly

---

## 🔑 Step 2: Get Airtable API Credentials

### Get Your API Key

1. Go to https://airtable.com/account
2. Scroll to "API" section
3. Click "Generate API key" (if you don't have one)
4. Copy your API key (starts with `pat...`)

### Get Your Base ID

1. Go to https://airtable.com/api
2. Select your "Speed Rail Demo - UX Writing Database" base
3. Your Base ID is in the URL: `https://airtable.com/app...`
   - The part after `app` is your Base ID
   - Format: `appXXXXXXXXXXXXXX`

---

## ⚙️ Step 3: Configure the Plugin

### Update code.js

Open `code.js` and update the `DATABASES` configuration:

```javascript
const DATABASES = {
    commonTerms: {
        apiKey: 'YOUR_AIRTABLE_API_KEY_HERE',  // Replace this
        baseId: 'YOUR_BASE_ID_HERE',            // Replace this
        tableName: 'Common Terms',               // Must match exactly
        displayName: 'UX Writing Database',
        fields: {
            term: 'Content',
            platform: 'Platform',
            explanation: 'Examples + Explanation'
        }
    }
};
```

**Example:**
```javascript
const DATABASES = {
    commonTerms: {
        apiKey: 'patAbCdEf12345678.a1b2c3d4e5f6g7h8',
        baseId: 'appABCDEFGHIJKLM',
        tableName: 'Common Terms',
        displayName: 'UX Writing Database',
        fields: {
            term: 'Content',
            platform: 'Platform',
            explanation: 'Examples + Explanation'
        }
    }
};
```

### If You Have Multiple Databases

You can keep the sports database or remove it. To have just one database:

```javascript
const DATABASES = {
    commonTerms: {
        apiKey: 'YOUR_AIRTABLE_API_KEY_HERE',
        baseId: 'YOUR_BASE_ID_HERE',
        tableName: 'Common Terms',
        displayName: 'UX Writing Database',
        fields: {
            term: 'Content',
            platform: 'Platform',
            explanation: 'Examples + Explanation'
        }
    }
};
```

---

## 🎨 Step 4: Create Demo Figma File

### Recommended Demo File Structure

Create a Figma file with these frames to showcase different features:

#### Frame 1: "Valid Terms Example"
**Purpose:** Show terms that pass validation

Create a simple mobile screen with:
- Header: "Subscription"
- Button: "Start Free Trial" (approved ✅)
- Button: "Choose Plan" (approved ✅)
- Link: "Sign In" (approved ✅)

**Demo Action:** Scan this frame → All terms valid!

---

#### Frame 2: "Invalid Terms Example"
**Purpose:** Show automatic validation catching mistakes

Create a similar screen with:
- Header: "Subscription"
- Button: "Start Trial" (NOT in database ❌)
- Button: "Pick a Plan" (NOT in database ❌)
- Link: "Log In" (NOT in database ❌)

**Demo Action:** Scan this frame → Terms turn red!

---

#### Frame 3: "Mock Generation Template"
**Purpose:** Show the killer feature - instant variations

Create a subscription card template:

```
┌─────────────────────────┐
│   Premium Plan          │
│                         │
│   {{Content}}           │← This is the placeholder!
│                         │
│   $9.99/month          │
└─────────────────────────┘
```

**Important:** The button text must be exactly `{{Content}}` (with double curly braces)

**Alternative:** Name the text layer `{{Content}}` instead

**Demo Action:**
1. Select this frame
2. Filter to "iOS" platform
3. Click "Generate Mocks from Template"
4. Watch 40+ variations appear in seconds!

---

#### Frame 4: "Subscription Flow Showcase"
**Purpose:** Show a complete flow with approved copy

Create 3-4 screens showing a subscription journey:

**Screen 1: Paywall**
- "Unlock Premium Features"
- "Start Free Trial"
- "Maybe Later"

**Screen 2: Plan Selection**
- "Choose Plan"
- "Continue"

**Screen 3: Confirmation**
- "Confirm Subscription"
- "View Details"

**Screen 4: Success**
- "Subscription Confirmed"
- "You're all set!"

**Demo Action:** Walk through the flow, showing how every term is approved and consistent

---

## 🎬 Demo Script Using This Data

### Part 1: Show the Database (30 sec)

**Say:**
> "This is my Airtable database with 47 approved UX terms. Each term has a platform tag—iOS, Android, Web—and an explanation of when to use it. Content designers can manage this without any code."

**Show:** Airtable with the imported data, scroll through a few terms

---

### Part 2: Browse Terms in Plugin (30 sec)

**Say:**
> "In Figma, I open Speed Rail and see all approved terms. I can filter by platform—let's say iOS—and it shows only iOS terms. If I need 'Start Free Trial', I just click and it's inserted."

**Show:** Plugin UI, filter by iOS, click a term

---

### Part 3: Validate Content (60 sec)

**Say:**
> "Now here's where it gets powerful. I have two frames here—one with approved terms, one with unapproved. Let me scan the valid one first."

**Show:** Scan Frame 1 → Success message

**Say:**
> "All good! Now let me scan this frame with terms I made up."

**Show:** Scan Frame 2 → Terms turn red, error message shows

**Say:**
> "It caught three invalid terms: 'Start Trial' instead of 'Start Free Trial', 'Pick a Plan' instead of 'Choose Plan', and 'Log In' instead of 'Sign In'. This prevents inconsistent copy from shipping."

---

### Part 4: Mock Generation (90 sec)

**Say:**
> "And here's the feature that no competitor has. I created one template with a placeholder—see the {{Content}} tag in this button? Now I'll filter to iOS and generate mocks."

**Show:**
1. Select template frame
2. Point to {{Content}} placeholder
3. Filter to iOS in plugin
4. Click "Generate Mocks from Template"
5. Zoom out to show 40+ variations

**Say:**
> "In 2 seconds, it created 40 variations—one for every iOS term in my database. This used to take an hour of copy-pasting. Now it's instant. And if I filter to Web, I'd get all the Web terms instead."

**Show:** Grid of generated mocks, scroll through them

**Say:**
> "This is a 30x productivity boost for designers working on button states, empty states, multi-language designs—any scenario where you need multiple variations."

---

## 🎯 Demo Tips

### Make It Interactive

If the interviewer asks questions, you can show:

**"Can you add a new term?"**
→ Open Airtable, add a new row, refresh plugin, show it appears instantly

**"What if we have different databases?"**
→ Show the database dropdown (if you kept the sports database)

**"What about mobile vs desktop?"**
→ Filter by Android, show different platform-specific terms

### Highlight the Subscription Flow Use Case

Since your CSV includes comprehensive subscription terms, position this as:

> "I focused on subscription flows because they're critical for SaaS businesses and Design Nurse. Every company with a subscription model needs this—consistent copy across sign-up, billing, cancellation, and reactivation. This database ensures designers use the right term at every step."

### Show the "Before/After" Impact

**Before Speed Rail:**
- Designer opens Notion doc
- Searches for "button copy subscription"
- Finds 3 different versions
- Asks in Slack "which should I use?"
- Waits for content designer response
- **Total time: 15-30 minutes**

**After Speed Rail:**
- Designer opens plugin
- Filters to "iOS"
- Clicks "Start Free Trial"
- **Total time: 5 seconds**

---

## 🐛 Troubleshooting

### "No terms found" Error

**Check:**
1. API key is correct (starts with `pat`)
2. Base ID is correct (starts with `app`)
3. Table name is exactly "Common Terms" (case-sensitive)
4. Column names match: "Content", "Platform", "Examples + Explanation"

**Test:** Open https://airtable.com/api, select your base, try the example API call

### Platform Filter Not Working

**Check:**
- Platform column in Airtable has values: "iOS", "Android", "Web" (case-sensitive)
- No extra spaces before/after platform names

### Mock Generation Shows "No placeholders found"

**Check:**
- Placeholder is exactly `{{Content}}` (two curly braces on each side)
- Or layer name is exactly `{{Content}}`
- Selected frame contains text layers
- Try a simpler template first (just a button with `{{Content}}`)

---

## 📊 What Makes This Demo Data Great

### 1. Real-World Use Case
Subscription flows are ubiquitous—every SaaS has them. Shows Speed Rail solving a real, relatable problem.

### 2. Shows All Features
- ✅ Content validation (approved vs unapproved)
- ✅ Platform filtering (iOS/Android/Web)
- ✅ Mock generation (47 terms = 47 variations)
- ✅ Multi-database support (if you keep sports DB)

### 3. Demonstrates AI Opportunity
Terms like "Renews on [date]" and "Welcome to [app name]" with placeholders show where AI could:
- Auto-fill dates
- Personalize with user name
- Contextualize for specific flows

### 4. Professional Quality
Every term has:
- Clear explanation of when to use it
- Voice & tone consistency
- Platform-specific guidance
- Best practice rationale

This shows you understand content design, not just development.

---

## 🚀 Quick Setup Checklist

Before your demo:

- [ ] Import CSV to Airtable
- [ ] Get API key from Airtable account settings
- [ ] Get Base ID from Airtable API page
- [ ] Update `code.js` with your credentials
- [ ] Reload plugin in Figma
- [ ] Verify terms load (should see 141 records or ~47 per platform)
- [ ] Create 3-4 demo frames:
  - [ ] Frame with valid terms
  - [ ] Frame with invalid terms
  - [ ] Template with {{Content}} placeholder
  - [ ] Subscription flow example
- [ ] Test each feature:
  - [ ] Browse and insert terms ✓
  - [ ] Filter by platform ✓
  - [ ] Scan for invalid terms ✓
  - [ ] Generate mocks ✓
- [ ] Practice demo script 2x
- [ ] Have Airtable tab open during demo

---

## 💡 Pro Tips

### Customize for Your Interview

Replace `[app name]` with "Design Nurse" in Airtable:
- "Welcome to Design Nurse" instead of "Welcome to [app name]"

This makes it feel personalized and shows attention to detail.

### Add a Few "Wrong" Terms

To make validation more impressive, add 2-3 common but incorrect terms to Airtable:
- "Login" (instead of "Sign In")
- "Register" (instead of "Sign Up")
- "Ok" (instead of "Done")

Then show how teams often use these by mistake, but Speed Rail catches them.

### Show the Business Value

When showing the subscription flow, mention:
> "Subscription flows are the most critical part of any SaaS product. One wrong word—'Payment Failed' vs 'Transaction Declined' vs 'Card Error'—can affect conversion rates. This ensures we use the exact right term, every time, across every platform."

This connects the tool to revenue impact.

---

## 📞 If You Get Stuck

**Can't access Airtable API?**
- Make sure you're logged in
- Try generating a new API key
- Check base sharing settings (must be at least "Editor")

**Plugin won't load terms?**
- Open browser console (F12) in Figma
- Look for error messages
- Common issue: CORS error = API key wrong
- Common issue: 404 error = Base ID wrong

**Need help?**
- Airtable API docs: https://airtable.com/api
- Figma plugin docs: https://www.figma.com/plugin-docs/

---

**You're all set!** 🎉

With this demo data and setup, you can show:
1. Real, professional content design work
2. All of Speed Rail's features working live
3. Clear value proposition (validation, speed, automation)
4. Business understanding (subscription flows = revenue)

Now go import that CSV and build your demo frames!
