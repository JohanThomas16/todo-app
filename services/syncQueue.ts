import { db } from './localDb';
import { SyncOperation } from '../types';

export const addToSyncQueue = (
  operation: "CREATE" | "UPDATE" | "DELETE",
  entityType: "todo" | "group",
  entityId: string,
  entityData: any
) => {
  db.transaction(tx => {
    tx.executeSql(
      `INSERT INTO sync_queue
        (operation, entity_type, entity_id, entity_data, timestamp, synced)
        VALUES (?, ?, ?, ?, ?, 0);`,
      [operation, entityType, entityId, JSON.stringify(entityData), new Date().toISOString()]
    );
  });
};

export const getUnsyncedOperations = async (): Promise<SyncOperation[]> =>
  new Promise((resolve) => {
    db.transaction(tx => {
      tx.executeSql(
        `SELECT * FROM sync_queue WHERE synced = 0 ORDER BY timestamp ASC`,
        [],
        (_, { rows }) => resolve(rows._array as SyncOperation[])
      );
    });
  });

export const markOperationSynced = (id: number) => {
  db.transaction(tx => {
    tx.executeSql(`UPDATE sync_queue SET synced = 1 WHERE id = ?`, [id]);
  });
};
