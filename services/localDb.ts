import * as SQLite from 'expo-sqlite';

export const db = SQLite.openDatabase('todos.db');

export const initDatabase = () => {
  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS groups (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        name TEXT,
        created_at TEXT,
        synced INTEGER DEFAULT 0
      );`
    );
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS todos (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        group_id TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        is_completed INTEGER DEFAULT 0,
        created_at TEXT NOT NULL,
        updated_at TEXT,
        synced INTEGER DEFAULT 0,
        FOREIGN KEY (group_id) REFERENCES groups(id)
      );`
    );
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS sync_queue (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        operation TEXT, entity_type TEXT, entity_id TEXT,
        entity_data TEXT,
        timestamp TEXT,
        synced INTEGER DEFAULT 0
      );`
    );
  });
};
