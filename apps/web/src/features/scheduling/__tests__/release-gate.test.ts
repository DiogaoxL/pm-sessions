import { describe, it, expect, vi } from 'vitest';
import {
  parseMigrations,
  runMigrationCheck,
  isTransientError,
} from '../../../../../../scripts/audit-release.mjs';

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

describe('Release Gate Retry & Transient Error Suite', () => {
  it('Caso 1: migration list -> PASS', async () => {
    const mockExec = vi.fn().mockImplementation(() => 'Local | Remote\n20260718 | 20260718');
    const result = await runMigrationCheck(mockExec, [0, 0]);
    expect(result.status).toBe('RESOLVED');
    expect(result.output).toContain('20260718');
    expect(mockExec).toHaveBeenCalledTimes(1);
  });

  it('Caso 2: migration list -> Local != Remote -> FAIL', () => {
    const tableOutput = 'Local | Remote\n20260718 | ';
    expect(parseMigrations(tableOutput)).toBe(false);
  });

  it('Caso 3: 502 -> retry -> PASS', async () => {
    let calls = 0;
    const mockExec = vi.fn().mockImplementation(() => {
      calls++;
      if (calls === 1) {
        throw new Error('HTTP 502: Bad Gateway');
      }
      return 'Local | Remote\n20260718 | 20260718';
    });

    const result = await runMigrationCheck(mockExec, [0, 0]);
    expect(result.status).toBe('RESOLVED');
    expect(mockExec).toHaveBeenCalledTimes(2);
  });

  it('Caso 4: 502 -> 502 -> 502 -> UNKNOWN', async () => {
    const mockExec = vi.fn().mockImplementation(() => {
      throw new Error('HTTP 502: Bad Gateway');
    });

    const result = await runMigrationCheck(mockExec, [0, 0]);
    expect(result.status).toBe('UNKNOWN');
    expect(mockExec).toHaveBeenCalledTimes(3);
  });

  it('Caso 5: timeout -> retry -> PASS', async () => {
    let calls = 0;
    const mockExec = vi.fn().mockImplementation(() => {
      calls++;
      if (calls === 1) {
        throw new Error('ETIMEDOUT: Connection timed out');
      }
      return 'Local | Remote\n20260718 | 20260718';
    });

    const result = await runMigrationCheck(mockExec, [0, 0]);
    expect(result.status).toBe('RESOLVED');
    expect(mockExec).toHaveBeenCalledTimes(2);
  });

  it('Caso 6: Cloudflare origin_bad_gateway -> UNKNOWN', async () => {
    const mockExec = vi.fn().mockImplementation(() => {
      throw new Error('origin_bad_gateway');
    });

    const result = await runMigrationCheck(mockExec, [0, 0]);
    expect(result.status).toBe('UNKNOWN');
    expect(mockExec).toHaveBeenCalledTimes(3);
  });
});
