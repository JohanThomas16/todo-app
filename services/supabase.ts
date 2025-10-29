import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';
import { getToken } from './clerkProvider';

export const supabase = createClient(
  Constants.expoConfig?.extra?.supabaseUrl,
  Constants.expoConfig?.extra?.supabaseAnonKey,
  {
    global: {
      headers: async () => {
        const token = await getToken();
        return token ? { Authorization: `Bearer ${token}` } : {};
      },
    }
  }
);
