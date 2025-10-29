import React from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function LoadingSpinner() {
  return (
    <View style={{justifyContent: 'center', alignItems: 'center'}}>
      <ActivityIndicator size="large" color="#4c72e0" />
    </View>
  );
}
