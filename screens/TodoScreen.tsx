import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useUser } from '@clerk/clerk-expo';
import useGroups from '../hooks/useGroups';
import useTodos from '../hooks/useTodos';
import TodoList from '../components/TodoList';
import GroupList from '../components/GroupList';
import OfflineIndicator from '../components/OfflineIndicator';
import { v4 as uuidv4 } from 'uuid';
import { addToSyncQueue } from '../services/syncQueue';
import { db } from '../services/localDb';

export default function TodoScreen() {
  const { user } = useUser();
  const userId = user?.id ?? '';
  const groups = useGroups(userId);

  const [selectedGroup, setSelectedGroup] = useState(groups[0]?.id ?? '');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const todos = useTodos(selectedGroup);

  useEffect(() => {
    if (groups.length > 0 && !selectedGroup) setSelectedGroup(groups[0].id);
  }, [groups]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
  };

  const handleAddTodo = () => {
    if (!title.trim()) {
      Alert.alert('Validation', 'Todo title is required.');
      return;
    }
    if (!selectedGroup) {
      Alert.alert('Validation', 'Please select a task group.');
      return;
    }
    const newTodo = {
      id: uuidv4(),
      user_id: userId,
      group_id: selectedGroup,
      title: title.trim(),
      description: description.trim() || undefined,
      is_completed: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      synced: false,
    };

    // Add todo locally in SQLite
    db.transaction(tx =>
      tx.executeSql(
        `INSERT INTO todos (id, user_id, group_id, title, description, is_completed, created_at, updated_at, synced)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0)`,
        [
          newTodo.id,
          newTodo.user_id,
          newTodo.group_id,
          newTodo.title,
          newTodo.description,
          0,
          newTodo.created_at,
          newTodo.updated_at,
        ],
        () => {
          addToSyncQueue('CREATE', 'todo', newTodo.id, newTodo);
          resetForm();
        },
        (_, error) => {
          Alert.alert('Error', 'Failed to add TODO.');
          return false;
        },
      ),
    );
  };

  const toggleTodoCompletion = todoId => {
    const todo = todos.find(t => t.id === todoId);
    if (!todo) return;

    const updatedCompleted = todo.is_completed ? 0 : 1;
    const updatedAt = new Date().toISOString();

    db.transaction(tx =>
      tx.executeSql(
        'UPDATE todos SET is_completed = ?, updated_at = ?, synced = 0 WHERE id = ?',
        [updatedCompleted, updatedAt, todoId],
        () => {
          addToSyncQueue('UPDATE', 'todo', todoId, {
            ...todo,
            is_completed: !todo.is_completed,
            updated_at: updatedAt,
            synced: false,
          });
        },
        () => Alert.alert('Error', 'Failed to update TODO.'),
      ),
    );
  };

  const deleteTodo = todoId => {
    Alert.alert('Confirm Delete', 'Delete this TODO?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          db.transaction(tx =>
            tx.executeSql(
              'DELETE FROM todos WHERE id = ?',
              [todoId],
              () => addToSyncQueue('DELETE', 'todo', todoId, {}),
              () => Alert.alert('Error', 'Failed to delete TODO.'),
            ),
          );
        },
      },
    ]);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <OfflineIndicator />
      <View style={styles.groupListWrapper}>
        <GroupList
          groups={groups}
          selectedGroup={selectedGroup}
          onSelect={setSelectedGroup}
          onRename={() => Alert.alert('Feature not implemented')}
          onDelete={() => Alert.alert('Feature not implemented')}
          onAdd={() => Alert.alert('Feature not implemented')}
        />
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <TextInput
          placeholder="Todo title *"
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          returnKeyType="done"
        />
        <TextInput
          placeholder="Description (optional)"
          style={styles.input}
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={2}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddTodo}>
          <Text style={styles.addButtonText}>Add TODO</Text>
        </TouchableOpacity>

        <TodoList
          groupId={selectedGroup}
          onToggle={toggleTodoCompletion}
          onDelete={deleteTodo}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  groupListWrapper: {
    height: 70,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 12,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#4c72e0',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
