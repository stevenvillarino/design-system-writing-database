# Speed Rail UI Development Guide

## Overview

Speed Rail now uses a modern **React + TypeScript + Vite** stack for the UI. This provides better developer experience, type safety, and component reusability.

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Fast build tool with HMR
- **vite-plugin-singlefile** - Bundles everything into a single HTML file for Figma

## Project Structure

```
design-system-writing-database/
├── src/
│   ├── main.tsx              # Entry point
│   ├── App.tsx               # Main app component
│   ├── App.css               # Global styles
│   ├── types.ts              # TypeScript types
│   └── components/
│       ├── DatabaseSelector.tsx
│       ├── PlatformFilter.tsx
│       ├── ActionButtons.tsx
│       ├── TermsList.tsx
│       └── ValidationDisplay.tsx
├── index.html                # Vite entry HTML
├── vite.config.ts           # Vite configuration
├── tsconfig.json            # TypeScript configuration
├── build.js                 # Post-build script
├── package.json             # Dependencies
└── ui.html                  # Built output (for Figma)
```

## Development Workflow

### 1. Install Dependencies

```bash
npm install
```

### 2. Development Mode

Run the dev server with hot module replacement:

```bash
npm run dev
```

This starts a local server at `http://localhost:3000` where you can develop the UI with live reloading.

**Note:** In dev mode, the plugin communication won't work since it needs to run inside Figma. Use this mode for visual development and component work.

### 3. Build for Production

Build the UI and generate `ui.html`:

```bash
npm run build
```

This will:
1. Type-check with TypeScript
2. Build with Vite (creates `dist/index.html`)
3. Copy `dist/index.html` to `ui.html` (used by Figma)

### 4. Type Checking

Check TypeScript types without building:

```bash
npm run type-check
```

## Component Architecture

### App.tsx

Main component that:
- Manages global state (database, platform, terms, invalid terms)
- Handles message passing with Figma plugin
- Coordinates child components

### DatabaseSelector

Dropdown for selecting between databases (UX Writing, Zone Tiles, etc.)

### PlatformFilter

Badge-based filter for platforms (iOS, Android, Web, All Platforms)

### ActionButtons

Primary actions:
- Scan Frame for Invalid Terms
- Generate Mocks from Template

### TermsList

Scrollable list of approved terms with explanations. Clicking a term inserts it into Figma.

### ValidationDisplay

Shows invalid terms found during frame scanning with their locations.

## Type Definitions

All types are defined in `src/types.ts`:

```typescript
// Data models
interface Term {
  term: string;
  platform: string;
  explanation: string;
}

interface Database {
  id: string;
  displayName: string;
}

// Plugin → UI messages
type MessageType =
  | { type: 'update-terms'; terms: Term[] }
  | { type: 'update-platforms'; platforms: string[] }
  | { type: 'invalid-terms-found'; terms: Array<{ text: string; location: string }> }
  | { type: 'validation-result'; isValid: boolean; text: string }
  | { type: 'error'; message: string };

// UI → Plugin messages
type UIMessageType =
  | { type: 'database-changed'; database: string }
  | { type: 'platform-changed'; platform: string }
  | { type: 'create-text'; text: string }
  | { type: 'scan-frame' }
  | { type: 'create-mocks' };
```

## Styling

The UI uses a custom design system defined in `App.css`:

### CSS Variables

```css
--color-bg: Background color
--color-border: Border color
--color-primary: Primary action color
--spacing-sm/md/lg: Spacing scale
--font-size-sm/base/md/lg: Typography scale
--radius-sm/md/lg: Border radius scale
```

### Component Classes

- `.button` - Primary button
- `.button-secondary` - Secondary button
- `.badge` - Platform filter badge
- `.badge.active` - Active state
- `.term-item` - Term card
- `.section` - Layout section
- `.validation-section` - Validation results

## Communication with Figma

### Sending Messages to Plugin

```typescript
parent.postMessage({ pluginMessage: message }, '*');
```

### Receiving Messages from Plugin

```typescript
window.onmessage = (event: MessageEvent) => {
  const message = event.data.pluginMessage as MessageType;
  // Handle message
};
```

## Build Configuration

### vite.config.ts

Key settings:
- `viteSingleFile()` - Inlines all assets into a single HTML file
- `assetsInlineLimit: 100000000` - Inline all assets
- `inlineDynamicImports: true` - Bundle everything together

### package.json

```json
{
  "type": "module",  // Enable ES modules
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build && node build.js",
    "build:ui": "npm run build"
  }
}
```

## Adding New Components

1. Create component in `src/components/`
2. Define props interface
3. Import and use in `App.tsx`
4. Add styles to `App.css` or create component-specific CSS

Example:

```typescript
// src/components/MyComponent.tsx
interface MyComponentProps {
  data: string;
  onClick: () => void;
}

export function MyComponent({ data, onClick }: MyComponentProps) {
  return (
    <div className="my-component" onClick={onClick}>
      {data}
    </div>
  );
}
```

## Testing the Plugin

1. Build the UI: `npm run build`
2. Update `code.js` with your Airtable credentials (if using `code.template.js`, copy it to `code.js`)
3. In Figma: Plugins → Development → Import plugin from manifest
4. Select `manifest.json`
5. Run the plugin: Plugins → Development → Speed Rail

## Troubleshooting

### Build fails with TypeScript errors

Run `npm run type-check` to see all type errors. Fix them before building.

### Plugin doesn't load in Figma

- Check that `ui.html` exists and is not empty
- Check `manifest.json` points to correct files
- Check browser console in Figma for errors

### Styles not applying

- CSS is inlined during build, so rebuild after CSS changes
- Check browser dev tools in Figma to inspect styles

### Communication issues

- Ensure messages use the `pluginMessage` wrapper
- Check message types match between UI and plugin code
- Use console.log in both UI and plugin to debug

## Performance

The bundled `ui.html` is ~150KB (48KB gzipped), which loads instantly in Figma.

## Future Improvements

- [ ] Add dark mode support
- [ ] Add loading states
- [ ] Add unit tests with Vitest
- [ ] Add Storybook for component development
- [ ] Add accessibility improvements (ARIA labels, keyboard nav)
- [ ] Add search/filter for terms list
- [ ] Add recent terms history
