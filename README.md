# Writing On The Wall

A Figma plugin for content design teams to ensure consistent, approved language across designs. It connects to Airtable to fetch a centralized list of terms, explanations, and platform-specific content guidelines.

## What It Does
- Fetches approved terms and explanations from Airtable.
- Lets you browse, search, and insert terms directly into your Figma canvas.
- Scans selected frames or groups for unapproved terms and highlights them.
- Validates selected text layers against the approved list.
- Supports filtering by platform (e.g., iOS, Android, Web).

## How It Helps
- Ensures content consistency and compliance with your team's writing standards.
- Reduces manual review by surfacing unapproved or inconsistent terms.
- Speeds up content creation by making approved language easily accessible.
- Centralizes updates—changes in Airtable are reflected in Figma instantly.

## How It Works
- The plugin connects to a specified Airtable base and table using an API key.
- On launch, it fetches all terms and their explanations from Airtable.
- You can filter terms by platform, insert them into your design, or scan for invalid terms.
- Invalid terms are highlighted in red, and suggestions are provided.

## Usage
1. Open a Figma file and run the Writing On The Wall plugin.
2. Browse or search for approved terms.
3. Click a term to insert it as a text layer.
4. Select a frame or group and click "Scan Selected Frame" to highlight unapproved terms.
5. Filter terms by platform as needed.

## Airtable Integration
- The plugin requires access to an Airtable base with columns for Content, Platform, and Examples + Explanation.
- Only terms in the Airtable table are considered approved.
- The plugin uses the Airtable API to fetch and update terms in real time.

## Requirements
- Figma account with plugin installation permissions.
- Access to the relevant Airtable base and API key.

---

For setup or customization, update the Airtable API key, base ID, and table name in `code.js` as needed. 