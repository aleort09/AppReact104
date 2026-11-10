import React, { useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import LoginForm from '../components/LoginForm';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../context/ThemeContext';
import { useNotification } from '../context/NotificationContext';
import { getAccessToken } from '../utils/storage';

export default function SplashScreen() {
  const router = useRouter();
  const { login, loading, error, isAuthenticated } = useAuth();
  const { colors } = useTheme();
  const { showSuccess, showError } = useNotification();

  useEffect(() => {
    checkInitialSession();
  }, []);

  const checkInitialSession = async () => {
    const token = await getAccessToken();
    if (token) {
      router.replace('/(tabs)' as any);
    }
  };

  const handleLogin = async (email: string, password: string) => {
    const success = await login(email, password);
    if (success) {
      showSuccess('Bienvenido', 'Has iniciado sesión correctamente');
      router.replace('/(tabs)' as any);
    } else {
      showError('Error', 'Credenciales incorrectas');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LoginForm
        onLogin={handleLogin}
        loading={loading}
        error={error?.message || ''}
      />

      <TouchableOpacity 
        style={styles.registerLink}
        onPress={() => router.push('/register' as any)}
      >
        <Text style={[styles.linkText, { color: colors.primary }]}>
          ¿No tienes cuenta? Regístrate aquí
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  registerLink: {
    marginTop: 20,
  },
  linkText: {
    fontSize: 15,
    fontWeight: '500',
  },
});
