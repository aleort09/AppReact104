/**
 * Pantalla de login
 */

import React from 'react';
import { View, StyleSheet, Keyboard, TouchableWithoutFeedback, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../context/ThemeContext';
import { useNotification } from '../context/NotificationContext';
import LoginForm from '../components/LoginForm';

export default function LoginScreen() {
  const router = useRouter();
  const { login, loading, error } = useAuth();
  const { showError, showSuccess } = useNotification();
  const { colors } = useTheme();

  const handleLogin = async (email: string, password: string) => {
    const success = await login(email, password);
    if (success) {
      showSuccess('Bienvenido', 'Has iniciado sesión correctamente');
      router.replace('/(tabs)' as any);
    } else {
      showError('Error', 'Credenciales inválidas o error de red');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
    </TouchableWithoutFeedback>
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
