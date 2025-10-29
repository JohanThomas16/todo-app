import React from 'react';
import { View, Text } from 'react-native';
import useNetworkStatus from '../hooks/useNetworkStatus';

export default function OfflineIndicator() {
  const online = useNetworkStatus();
  if (online) return null;
  return (
    <View style={{
      backgroundColor: '#ffb84c',
      padding: 8,
      alignItems: 'center'
    }}>
      <Text style={{color: '#333', fontWeight: 'bold'}}>
        📡 You're offline. Changes will sync when reconnected.
      </Text>
    </View>
  );
}
