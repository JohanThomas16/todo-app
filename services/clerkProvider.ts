import { useAuth } from '@clerk/clerk-expo';
import * as SecureStore from 'expo-secure-store';

export const tokenCache = {
  async getToken(key: string) {
    return SecureStore.getItemAsync(key);
  },
  async saveToken(key: string, value: string) {
    await SecureStore.setItemAsync(key, value);
  },
};

// for supabase integration
export async function getToken() {
  // optionally use Clerk's useAuth() or get session token
  // return await useAuth().getToken({ template: 'supabase' });
}
