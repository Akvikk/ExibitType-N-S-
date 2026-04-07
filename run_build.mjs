import { execSync } from 'child_process';
import { writeFileSync } from 'fs';
try {
  const out = execSync('npx vite build --logLevel error', { 
    encoding: 'utf8', 
    stdio: ['pipe','pipe','pipe'], 
    timeout: 30000,
    env: { ...process.env, NO_COLOR: '1', FORCE_COLOR: '0' }
  });
  writeFileSync('build_clean.txt', 'SUCCESS:\n' + out, 'ascii');
} catch (e) {
  const combined = (e.stdout || '') + '\nSTDERR:\n' + (e.stderr || '');
  // strip ANSI
  const clean = combined.replace(/\x1b\[[0-9;]*m/g, '').replace(/[\x00-\x08\x0b\x0c\x0e-\x1f]/g, '');
  writeFileSync('build_clean.txt', clean, 'ascii');
}
