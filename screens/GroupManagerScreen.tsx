import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useUser } from '@clerk/clerk-expo';
import { v4 as uuidv4 } from 'uuid';
import OfflineIndicator from '../components/OfflineIndicator';
import { db } from '../services/localDb';
import { addToSyncQueue } from '../services/syncQueue';

export default function GroupManagerScreen() {
  const { user } = useUser();
  const userId = user?.id ?? '';
  const [groups, setGroups] = useState([]);
  const [newGroupName, setNewGroupName] = useState('');

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = () => {
    db.transaction(tx => {
      tx.executeSql(
        `SELECT * FROM groups WHERE user_id = ? ORDER BY created_at DESC`,
        [userId],
        (_, { rows }) => setGroups(rows._array),
      );
    });
  };

  const addGroup = () => {
    if (!newGroupName.trim()) {
      Alert.alert('Validation', 'Group name cannot be empty.');
      return;
    }
    const newGroup = {
      id: uuidv4(),
      user_id: userId,
      name: newGroupName.trim(),
      created_at: new Date().toISOString(),
      synced: false,
    };
    db.transaction(tx => {
      tx.executeSql(
        `INSERT INTO groups (id, user_id, name, created_at, synced) VALUES (?, ?, ?, ?, 0)`,
        [newGroup.id, newGroup.user_id, newGroup.name, newGroup.created_at],
        () => {
          addToSyncQueue('CREATE', 'group', newGroup.id, newGroup);
          setNewGroupName('');
          fetchGroups();
        },
        () => Alert.alert('Error', 'Failed to add group.'),
      );
    });
  };

  const renameGroup = group => {
    Alert.prompt(
      'Rename Group',
      'Enter new group name:',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Rename',
          onPress: newName => {
            if (!newName.trim()) {
              Alert.alert('Validation', 'Group name cannot be empty.');
              return;
            }
            db.transaction(tx => {
              tx.executeSql(
                `UPDATE groups SET name = ?, synced = 0 WHERE id = ?`,
                [newName.trim(), group.id],
                () => {
                  addToSyncQueue('UPDATE', 'group', group.id, { ...group, name: newName.trim() });
                  fetchGroups();
                },
                () => Alert.alert('Error', 'Failed to rename group.'),
              );
            });
          },
        },
      ],
      'plain-text',
      group.name,
    );
  };

  const deleteGroup = group => {
    Alert.alert(
      'Confirm Delete',
      `Delete the group "${group.name}"? All its todos will be deleted.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            db.transaction(tx => {
              tx.executeSql(
                `DELETE FROM groups WHERE id = ?`,
                [group.id],
                () => {
                  addToSyncQueue('DELETE', 'group', group.id, {});
                  fetchGroups();
                },
                () => Alert.alert('Error', 'Failed to delete group.'),
              );
            });
          },
        },
      ],
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.groupRow}>
      <Text style={styles.groupName}>{item.name}</Text>
      <View style={styles.buttons}>
        <TouchableOpacity onPress={() => renameGroup(item)} style={styles.button}>
          <Text style={styles.buttonText}>Rename</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => deleteGroup(item)} style={[styles.button, styles.deleteBtn]}>
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <OfflineIndicator />
      <View style={styles.addGroupContainer}>
        <TextInput
          style={styles.input}
          placeholder="New group name"
          value={newGroupName}
          onChangeText={setNewGroupName}
          returnKeyType="done"
          onSubmitEditing={addGroup}
        />
        <TouchableOpacity style={styles.addButton} onPress={addGroup}>
          <Text style={styles.addButtonText}>Add Group</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={groups}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  addGroupContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 8,
  },
  addButton: {
    backgroundColor: '#4c72e0',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  addButtonText: {
    color: 'white',
    fontWeight: '700',
  },
  groupRow: {
    backgroundColor: '#f7f9fc',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  groupName: { fontSize: 18, fontWeight: '500', color: '#222' },
  buttons: { flexDirection: 'row', gap: 12 },
  button: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: '#4c72e0',
    borderRadius: 6,
  },
  deleteBtn: {
    backgroundColor: '#e44',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
