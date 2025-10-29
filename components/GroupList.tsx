import React from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { Group } from '../types';

type Props = {
  groups: Group[],
  selectedGroup: string,
  onSelect: (id:string) => void,
  onRename: (id:string) => void,
  onDelete: (id:string) => void,
  onAdd: () => void
};

export default function GroupList({
  groups, selectedGroup, onSelect, onRename, onDelete, onAdd
}: Props) {
  return (
    <FlatList
      data={groups}
      keyExtractor={grp => grp.id}
      horizontal
      renderItem={({item}) => (
        <View style={{marginHorizontal:8}}>
          <TouchableOpacity
            onPress={() => onSelect(item.id)}
            style={{
              padding: 10, borderRadius: 8,
              backgroundColor: item.id === selectedGroup ? '#4c72e0' : '#ddd'
            }}
          >
            <Text style={{color: item.id === selectedGroup ? '#fff' : '#222'}}>{item.name}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onRename(item.id)}>
            <Text style={{fontSize:12}}>✏️</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onDelete(item.id)}>
            <Text style={{fontSize:12, color:'#e44'}}>🗑</Text>
          </TouchableOpacity>
        </View>
      )}
      ListFooterComponent={<TouchableOpacity onPress={onAdd}><Text style={{fontSize:18}}>➕</Text></TouchableOpacity>}
    />
  );
}
