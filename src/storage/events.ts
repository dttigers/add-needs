import { db } from './sqlite';

export interface RedirectEvent {
  id: number;
  craving_id: string;
  craving_label: string;
  need_name: string;
  timestamp: number; // Unix ms (Date.now())
  feedback: 'yes' | 'no' | 'skip' | null;
}

db.runSync(
  `CREATE TABLE IF NOT EXISTS redirect_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    craving_id TEXT NOT NULL,
    craving_label TEXT NOT NULL,
    need_name TEXT NOT NULL,
    timestamp INTEGER NOT NULL,
    feedback TEXT
  )`
);

export function logEvent(cravingId: string, cravingLabel: string, needName: string): number {
  const result = db.runSync(
    'INSERT INTO redirect_events (craving_id, craving_label, need_name, timestamp, feedback) VALUES (?, ?, ?, ?, NULL)',
    [cravingId, cravingLabel, needName, Date.now()]
  );
  return Number(result.lastInsertRowId);
}

export function setFeedback(eventId: number, feedback: 'yes' | 'no' | 'skip'): void {
  db.runSync('UPDATE redirect_events SET feedback = ? WHERE id = ?', [feedback, eventId]);
}

export function getHistory(): RedirectEvent[] {
  return db.getAllSync<RedirectEvent>('SELECT * FROM redirect_events ORDER BY timestamp DESC');
}

export interface TopCraving {
  craving_id: string;
  craving_label: string;
  count: number;
}

export function getTopCravings(limit = 10): TopCraving[] {
  return db.getAllSync<TopCraving>(
    'SELECT craving_id, craving_label, COUNT(*) as count FROM redirect_events GROUP BY craving_id ORDER BY count DESC LIMIT ?',
    [limit]
  );
}

export interface FeedbackStat {
  craving_id: string;
  craving_label: string;
  yes: number;
  no: number;
  skip: number;
  total: number;
}

export function getFeedbackStats(): FeedbackStat[] {
  return db.getAllSync<FeedbackStat>(
    `SELECT craving_id, craving_label,
      SUM(CASE WHEN feedback = 'yes' THEN 1 ELSE 0 END) as yes,
      SUM(CASE WHEN feedback = 'no' THEN 1 ELSE 0 END) as no,
      SUM(CASE WHEN feedback = 'skip' THEN 1 ELSE 0 END) as skip,
      COUNT(*) as total
    FROM redirect_events
    GROUP BY craving_id
    ORDER BY yes DESC`,
    []
  );
}
