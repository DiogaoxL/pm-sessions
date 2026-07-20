const path = require('path');

module.exports = {
  'apps/web/**/*.{js,jsx,ts,tsx}': (filenames) => {
    // Convert absolute paths to paths relative to apps/web with forward slashes
    const relativeFiles = filenames
      .map((file) => path.relative(path.join(process.cwd(), 'apps/web'), file))
      .map((file) => file.replace(/\\/g, '/'))
      .map((file) => `"${file}"`);
    
    if (relativeFiles.length === 0) return [];
    
    return [
      `pnpm --filter web run lint --fix ${relativeFiles.join(' ')}`,
      `pnpm --filter web exec prettier --write ${relativeFiles.join(' ')}`
    ];
  },
  '*.{json,md,css}': ['pnpm exec prettier --write']
};
