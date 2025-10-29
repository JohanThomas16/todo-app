import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import useGroups from '../hooks/useGroups';
import TodoList from '../components/TodoList';
import GroupList from '../components/GroupList';
import OfflineIndicator from '../components/OfflineIndicator';
import { addTodoLocal } from '../services/localDb';

export default function TodoScreen({ userId }) {
  const groups = useGroups(userId);
  const [selectedGroup, setSelectedGroup] = useState(groups[0]?.id || '');
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');

  const handleAddTodo = () => {
    if (!title) return;
    addTodoLocal({
      id: Date.now().toString(),
      user_id: userId,
      group_id: selectedGroup,
      title,
      description: desc,
      is_completed: false,
      created_at: new Date().toISOString(),
      synced: false
    });
    setTitle('');
    setDesc('');
  };

  return (
    <ScrollView>
      <OfflineIndicator />
      <GroupList
        groups={groups}
        selectedGroup={selectedGroup}
        onSelect={setSelectedGroup}
        onRename={()=>{}}
        onDelete={()=>{}}
        onAdd={()=>{}}
      />

      <View style={{margin:12}}>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Todo title"
          style={styles.input}
        />
        <TextInput
          value={desc}
          onChangeText={setDesc}
          placeholder="Description (optional)"
          style={styles.input}
        />
        <TouchableOpacity onPress={handleAddTodo} style={styles.addBtn}>
          <Text style={{color:'#fff'}}>Add TODO</Text>
        </TouchableOpacity>
      </View>

      <TodoList
        groupId={selectedGroup}
        onToggle={id=>{/* toggle completion */}}
        onDelete={id=>{/* delete todo */}}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  input: {borderWidth:1, borderColor:'#ccc', borderRadius:4, padding:8, marginVertical:4},
  addBtn: {backgroundColor:'#4c72e0', padding:12, borderRadius:4, alignItems:'center'}
});
