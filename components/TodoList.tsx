import React from 'react';
import { View, Text } from 'react-native';
import useTodos from '../hooks/useTodos';
import TodoItem from './TodoItem';
import { Todo } from '../types';

type Props = {
  groupId: string,
  onToggle: (id: string) => void,
  onDelete: (id: string) => void
};

export default function TodoList({ groupId, onToggle, onDelete }: Props) {
  const todos = useTodos(groupId);
  return (
    <View>
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={() => onToggle(todo.id)}
          onDelete={() => onDelete(todo.id)}
        />
      ))}
    </View>
  );
}
