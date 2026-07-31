import { describe, it, expect } from 'vitest';

// Sourced directly from scripts/audit-release.mjs for unit testing
function parseMigrations(output: string): boolean {
  const trimmed = output.trim();
  if (!trimmed) return false;

  // 1. Attempt JSON parsing
  try {
    const parsed = JSON.parse(trimmed);
    const list = Array.isArray(parsed) ? parsed : parsed.migrations || [];
    if (list.length === 0) return false;
    for (const item of list) {
      if (!item.local || !item.remote || item.local !== item.remote) {
        return false;
      }
    }
    return true;
  } catch {
    // 2. Fallback to plaintext table parsing
    const lines = trimmed
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean);
    if (lines.length < 2) return false;

    // Verify headers
    const headerLine = lines[0];
    if (
      !headerLine.toLowerCase().includes('local') ||
      !headerLine.toLowerCase().includes('remote')
    ) {
      return false;
    }

    let migrationCount = 0;
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      if (line.startsWith('-') || line.includes('---')) continue;

      const parts = line.split('|').map((p) => p.trim().replace(/`/g, ''));
      if (parts.length >= 2) {
        const localVal = parts[0];
        const remoteVal = parts[1];
        if (!localVal || !remoteVal || localVal !== remoteVal) {
          return false;
        }
        migrationCount++;
      }
    }
    return migrationCount > 0;
  }
}

describe('Release Gate Migrations Parser Suite', () => {
  it('Caso 1: Tabela sincronizada (tudo pareado)', () => {
    const tableOutput = `
Local            | Remote           | Time (UTC)
------------------|------------------|-----------------------
 \`20260718000000\` | \`20260718000000\` | \`2026-07-18 00:00:00\`
 \`20260718000001\` | \`20260718000001\` | \`2026-07-18 00:00:01\`
    `;
    expect(parseMigrations(tableOutput)).toBe(true);

    const jsonOutput = JSON.stringify({
      migrations: [
        { local: '20260718000000', remote: '20260718000000' },
        { local: '20260718000001', remote: '20260718000001' },
      ],
    });
    expect(parseMigrations(jsonOutput)).toBe(true);
  });

  it('Caso 2: Migration faltando local', () => {
    const tableOutput = `
Local            | Remote           | Time (UTC)
------------------|------------------|-----------------------
                  | \`20260718000000\` | \`2026-07-18 00:00:00\`
    `;
    expect(parseMigrations(tableOutput)).toBe(false);

    const jsonOutput = JSON.stringify({
      migrations: [{ local: '', remote: '20260718000000' }],
    });
    expect(parseMigrations(jsonOutput)).toBe(false);
  });

  it('Caso 3: Migration faltando remoto', () => {
    const tableOutput = `
Local            | Remote           | Time (UTC)
------------------|------------------|-----------------------
 \`20260718000000\` |                  | \`2026-07-18 00:00:00\`
    `;
    expect(parseMigrations(tableOutput)).toBe(false);

    const jsonOutput = JSON.stringify({
      migrations: [{ local: '20260718000000', remote: '' }],
    });
    expect(parseMigrations(jsonOutput)).toBe(false);
  });

  it('Caso 4: Tabela vazia', () => {
    expect(parseMigrations('')).toBe(false);
    expect(parseMigrations('   \n  ')).toBe(false);
  });
});
