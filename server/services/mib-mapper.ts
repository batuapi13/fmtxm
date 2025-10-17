import fs from 'fs';
import path from 'path';

type SymbolLink = { parent: string; index: number };

// Pre-seeded base OID mappings for common roots
const BASES: Record<string, string> = {
  iso: '1',
  org: '1.3',
  dod: '1.3.6',
  internet: '1.3.6.1',
  private: '1.3.6.1.4',
  enterprises: '1.3.6.1.4.1',
};

/**
 * Very lightweight MIB parser to resolve OBJECT IDENTIFIER and OBJECT-TYPE assignments
 * to numeric OIDs. It scans .mib files and builds a symbol->numeric OID map.
 *
 * Note: This is a heuristic parser sufficient for Elenos MIBs included in mibs/elenos.
 */
export async function loadMibMappings(mibDir = path.resolve(process.cwd(), 'mibs', 'elenos')): Promise<Map<string, string>> {
  const symbolLinks: Record<string, SymbolLink> = { ...BASES } as any;
  const resolved: Map<string, string> = new Map();

  // Seed resolved with bases
  for (const [k, v] of Object.entries(BASES)) {
    resolved.set(k, v);
  }

  const files = await fs.promises.readdir(mibDir).catch(() => []);
  for (const file of files) {
    if (!file.endsWith('.mib')) continue;
    const fullPath = path.join(mibDir, file);
    let text = '';
    try {
      text = await fs.promises.readFile(fullPath, 'utf-8');
    } catch {
      continue;
    }

    // OBJECT IDENTIFIER ::= { parent idx }
    const oidIdRegex = /\n([A-Za-z0-9_-]+)\s+OBJECT\s+IDENTIFIER\s*::=\s*\{\s*([A-Za-z0-9_-]+)\s+(\d+)\s*\}/g;
    let m: RegExpExecArray | null;
    while ((m = oidIdRegex.exec(text)) !== null) {
      const name = m[1];
      const parent = m[2];
      const index = parseInt(m[3], 10);
      symbolLinks[name] = { parent, index };
    }

    // OBJECT-TYPE ... ::= { parent idx }
    const objTypeRegex = /\n([A-Za-z0-9_-]+)\s+OBJECT-TYPE[\s\S]*?::=\s*\{\s*([A-Za-z0-9_-]+)\s+(\d+)\s*\}/g;
    while ((m = objTypeRegex.exec(text)) !== null) {
      const name = m[1];
      const parent = m[2];
      const index = parseInt(m[3], 10);
      symbolLinks[name] = { parent, index };
    }
  }

  // Resolve recursively
  const resolve = (name: string, seen = new Set<string>()): string | undefined => {
    if (resolved.has(name)) return resolved.get(name);
    const link = symbolLinks[name];
    if (!link) return undefined;
    if (seen.has(name)) return undefined; // cycle guard
    seen.add(name);
    const parentNum = resolve(link.parent, seen);
    if (!parentNum) return undefined;
    const num = `${parentNum}.${link.index}`;
    resolved.set(name, num);
    return num;
  };

  Object.keys(symbolLinks).forEach((sym) => resolve(sym));

  return resolved;
}

/** Find the best matching MIB symbol name for a numeric OID by longest-prefix match */
export function mapOidToName(oid: string, map: Map<string, string>): string | undefined {
  // Ensure both are dotted numeric
  const entries = Array.from(map.entries());
  let best: { name: string; len: number } | undefined;
  for (const [name, numeric] of entries) {
    if (oid === numeric || oid.startsWith(numeric + '.')) {
      const len = numeric.length;
      if (!best || len > best.len) {
        best = { name, len };
      }
    }
  }
  return best?.name;
}

/** Strip a trailing instance index .0 for scalars */
export function stripInstance(oid: string): string {
  return oid.endsWith('.0') ? oid.slice(0, -2) : oid;
}