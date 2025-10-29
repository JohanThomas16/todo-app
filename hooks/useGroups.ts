import { useEffect, useState } from 'react';
import { db } from '../services/localDb';
import { Group } from '../types';

export default function useGroups(userId: string) {
  const [groups, setGroups] = useState<Group[]>([]);
  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql(
        `SELECT * FROM groups WHERE user_id = ? ORDER BY created_at DESC`,
        [userId],
        (_, { rows }) => setGroups(rows._array as Group[])
      );
    });
  }, [userId]);
  return groups;
}
