import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const distIndexPath = join(process.cwd(), 'dist', 'index.html');
const targetPath = join(process.cwd(), 'ui.html');

if (!existsSync(distIndexPath)) {
  console.error('❌ dist/index.html not found. Run `npm run build` first.');
  process.exit(1);
}

try {
  // Read the built index.html
  const content = readFileSync(distIndexPath, 'utf-8');

  // Write to ui.html
  writeFileSync(targetPath, content);

  console.log('✅ Successfully built ui.html from dist/index.html');
} catch (error) {
  console.error('❌ Error during build:', error);
  process.exit(1);
}
