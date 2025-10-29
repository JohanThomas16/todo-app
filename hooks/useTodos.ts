import { useEffect, useState } from 'react';
import { db } from '../services/localDb';
import { Todo } from '../types';

export default function useTodos(groupId: string) {
  const [todos, setTodos] = useState<Todo[]>([]);
  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql(
        `SELECT * FROM todos WHERE group_id = ? ORDER BY is_completed ASC, created_at DESC`,
        [groupId],
        (_, { rows }) => setTodos(rows._array as Todo[])
      );
    });
  }, [groupId]);
  return todos;
}
