import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Todo } from '../types';

type Props = {
  todo: Todo,
  onToggle: () => void,
  onDelete: () => void
};

export default function TodoItem({ todo, onToggle, onDelete }: Props) {
  return (
    <View style={{
      flexDirection: 'row', alignItems: 'center', padding: 12, marginVertical: 4,
      backgroundColor: '#fff', borderRadius: 6, shadowColor: '#000', shadowOpacity: 0.05
    }}>
      <TouchableOpacity onPress={onToggle} style={{marginRight:12}}>
        <Text style={{
          fontWeight: 'bold', color: todo.is_completed ? '#aaa' : '#333'
        }}>
          {todo.is_completed ? '☑️' : '⬜️'}
        </Text>
      </TouchableOpacity>
      <View style={{flex: 1}}>
        <Text style={{
          fontSize: 16, textDecorationLine: todo.is_completed ? 'line-through' : 'none'
        }}>{todo.title}</Text>
        {!!todo.description && <Text style={{fontSize:12, color:'#868686'}}>{todo.description}</Text>}
      </View>
      <TouchableOpacity onPress={onDelete}>
        <Text style={{color: 'red'}}>🗑</Text>
      </TouchableOpacity>
    </View>
  );
}
