export interface Group {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
}

export interface Todo {
  id: string;
  user_id: string;
  group_id: string;
  title: string;
  description?: string;
  is_completed: boolean;
  created_at: string;
  updated_at?: string;
  synced?: boolean;
}

export interface SyncOperation {
  id: number;
  operation: "CREATE" | "UPDATE" | "DELETE";
  entity_type: "todo" | "group";
  entity_id: string;
  entity_data: string;
  timestamp: string;
  synced: boolean;
}
