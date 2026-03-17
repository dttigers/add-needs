import { db } from './sqlite';

export interface CustomMapping {
  id: number;
  label: string;
  emoji: string;
  need: string;
  suggestion1: string;
  suggestion2: string;
}

db.runSync(
  `CREATE TABLE IF NOT EXISTS custom_mappings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    label TEXT NOT NULL,
    emoji TEXT NOT NULL,
    need TEXT NOT NULL,
    suggestion1 TEXT NOT NULL,
    suggestion2 TEXT NOT NULL
  )`
);

export function getCustomMappings(): CustomMapping[] {
  return db.getAllSync<CustomMapping>('SELECT * FROM custom_mappings ORDER BY id ASC');
}

export function addCustomMapping(m: Omit<CustomMapping, 'id'>): number {
  const result = db.runSync(
    'INSERT INTO custom_mappings (label, emoji, need, suggestion1, suggestion2) VALUES (?, ?, ?, ?, ?)',
    [m.label, m.emoji, m.need, m.suggestion1, m.suggestion2]
  );
  return Number(result.lastInsertRowId);
}

export function updateCustomMapping(id: number, m: Omit<CustomMapping, 'id'>): void {
  db.runSync(
    'UPDATE custom_mappings SET label = ?, emoji = ?, need = ?, suggestion1 = ?, suggestion2 = ? WHERE id = ?',
    [m.label, m.emoji, m.need, m.suggestion1, m.suggestion2, id]
  );
}

export function deleteCustomMapping(id: number): void {
  db.runSync('DELETE FROM custom_mappings WHERE id = ?', [id]);
}
