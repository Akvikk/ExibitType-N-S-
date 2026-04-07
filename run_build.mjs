import { execSync } from 'child_process';
import { writeFileSync } from 'fs';
try {
  const out = execSync('npx vite build', { encoding: 'utf8', stdio: ['pipe','pipe','pipe'], timeout: 30000 });
  writeFileSync('build_result.txt', out);
} catch (e) {
  writeFileSync('build_result.txt', (e.stdout || '') + '\n---STDERR---\n' + (e.stderr || '') + '\n---MSG---\n' + e.message);
}
