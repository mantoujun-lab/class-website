// Enforce bun as the only allowed package manager.
// Runs as a preinstall hook; blocks npm/pnpm/yarn so the committed bun.lock
// stays the single source of truth for the dependency tree.
const ua = process.env.npm_config_user_agent || '';
if (!ua.startsWith('bun/')) {
  const detected = ua.split(' ')[0] || 'unknown';
  console.error(`Error: This project requires bun. Detected: ${detected}`);
  console.error('Please use: bun install');
  process.exit(1);
}
