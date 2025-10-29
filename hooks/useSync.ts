import { useEffect } from 'react';
import useNetworkStatus from './useNetworkStatus';
import { getUnsyncedOperations, markOperationSynced } from '../services/syncQueue';
import { supabase } from '../services/supabase';

export default function useSync(userId: string) {
  const isOnline = useNetworkStatus();

  useEffect(() => {
    if (isOnline) {
      (async () => {
        const ops = await getUnsyncedOperations();
        for (let op of ops) {
          const data = JSON.parse(op.entity_data);
          if (op.entity_type === 'todo') {
            if (op.operation === 'CREATE' || op.operation === 'UPDATE') {
              await supabase.from('todos').upsert({ ...data, user_id: userId });
            } else if (op.operation === 'DELETE') {
              await supabase.from('todos').delete().eq('id', op.entity_id);
            }
            markOperationSynced(op.id);
          }
        }
      })();
    }
  }, [isOnline, userId]);
}
