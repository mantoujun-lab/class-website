// Enforce npm as the only allowed package manager.
// Runs as a preinstall hook; blocks pnpm/yarn/bun to avoid symlink layout
// issues on Windows that break the Vercel adapter's bundling step.
const ua = process.env.npm_config_user_agent || '';
if (!ua.startsWith('npm/')) {
  const detected = ua.split(' ')[0] || 'unknown';
  console.error(`Error: This project requires npm. Detected: ${detected}`);
  console.error('Please use: npm install');
  process.exit(1);
}
