import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  useSignIn,
  useUser,
  useClerk,
} from '@clerk/clerk-expo';
import { tokenCache } from '../services/clerkProvider';
import OfflineIndicator from '../components/OfflineIndicator';
import { useNavigation } from '@react-navigation/native';

export default function AuthScreen() {
  const navigation = useNavigation();

  return (
    <ClerkProvider
      publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!}
      tokenCache={tokenCache}
    >
      <SignedIn>
        {() => {
          React.useEffect(() => {
            navigation.replace('Todo');
          }, []);
          return null;
        }}
      </SignedIn>
      <SignedOut>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView contentContainerStyle={styles.container}>
            <SignInForm />
            <OfflineIndicator />
          </ScrollView>
        </KeyboardAvoidingView>
      </SignedOut>
    </ClerkProvider>
  );
}

function SignInForm() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onSignIn = async () => {
    if (!isLoaded || loading) return;
    setLoading(true);
    try {
      const result = await signIn.create({ identifier: email, password });
      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
      }
    } catch (err: any) {
      Alert.alert('Sign In Error', err.errors?.[0]?.message || err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const onGoogleSignIn = async () => {
    if (!isLoaded || loading) return;
    setLoading(true);
    try {
      await signIn.create({ strategy: 'oauth_google' });
    } catch (err: any) {
      Alert.alert('Google Sign In Error', err.errors?.[0]?.message || err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.form}>
      <Text style={styles.title}>Welcome Back</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        onChangeText={setEmail}
        value={email}
        editable={!loading}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        onChangeText={setPassword}
        value={password}
        editable={!loading}
      />
      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={onSignIn}
        disabled={loading || !email || !password}
      >
        <Text style={styles.buttonText}>{loading ? 'Signing In...' : 'Sign In'}</Text>
      </TouchableOpacity>

      <Text style={styles.or}>— OR —</Text>

      <TouchableOpacity
        style={[styles.googleButton, loading && styles.buttonDisabled]}
        onPress={onGoogleSignIn}
        disabled={loading}
      >
        <Text style={styles.buttonText}>Sign In with Google</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  form: {
    backgroundColor: '#f7f9fc',
    borderRadius: 8,
    padding: 24,
    elevation: 2,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 24,
    color: '#283e4a',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#cfd8dc',
    borderRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#4c72e0',
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  or: {
    marginVertical: 18,
    textAlign: 'center',
    color: '#888',
  },
  googleButton: {
    backgroundColor: '#de5246',
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: 'center',
  },
});
