import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useUser, useClerk } from '@clerk/clerk-expo';
import OfflineIndicator from '../components/OfflineIndicator';

export default function ProfileScreen() {
  const { user } = useUser();
  const { signOut } = useClerk();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (err) {
      Alert.alert('Logout failed', 'Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <OfflineIndicator />
      <Text style={styles.title}>User Profile</Text>
      <Text style={styles.label}>Name:</Text>
      <Text style={styles.value}>{user?.fullName || 'Unknown'}</Text>
      <Text style={styles.label}>Email:</Text>
      <Text style={styles.value}>{user?.primaryEmailAddress?.emailAddress || 'Unknown'}</Text>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 24 },
  label: { fontWeight: '600', marginTop: 16, color: '#444' },
  value: { fontSize: 18, marginTop: 4 },
  logoutButton: {
    marginTop: 48,
    backgroundColor: '#e44',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
