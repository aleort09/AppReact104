/**
 * Pantalla de perfil de usuario
 * Soporta cambio de tema claro/oscuro y scroll fluido sin cortes por el TabBar
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../hooks/useAuth';

export default function ProfileScreen() {
  const router = useRouter();
  const { colors, theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    if (Platform.OS === 'web') {
      const confirm = typeof window !== 'undefined'
        ? window.confirm('¿Estás seguro que deseas cerrar sesión?')
        : true;
      if (confirm) {
        await logout();
        router.replace('/login' as any);
      }
      return;
    }

    Alert.alert(
      'Cerrar sesión',
      '¿Estás seguro que deseas cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar sesión',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/login' as any);
          },
        },
      ]
    );
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.innerContainer}>
        {/* AVATAR Y DATOS BÁSICOS */}
        <View style={[styles.avatarContainer, { backgroundColor: colors.primary }]}>
          <Text style={styles.avatarText}>
            {user?.email?.charAt(0).toUpperCase() || 'U'}
          </Text>
        </View>

        <Text style={[styles.email, { color: colors.text }]}>
          {user?.email || 'usuario@ejemplo.com'}
        </Text>

        {/* SECCIÓN PREFERENCIAS */}
        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Preferencias de apariencia
          </Text>

          <TouchableOpacity 
            style={[styles.settingItem, { borderBottomColor: colors.border }]} 
            onPress={toggleTheme}
            activeOpacity={0.7}
          >
            <Text style={[styles.settingLabel, { color: colors.text }]}>
              {theme === 'dark' ? '🌙 Modo Oscuro' : '☀️ Modo Claro'}
            </Text>
            <Text style={[styles.settingValue, { color: colors.primary }]}>
              Cambiar a {theme === 'dark' ? 'Claro' : 'Oscuro'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* INFORMACIÓN DE CUENTA */}
        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Información de cuenta
          </Text>

          <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
            <Text style={[styles.infoLabel, { color: colors.secondary }]}>ID de usuario:</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>{user?.id || 1}</Text>
          </View>

          <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
            <Text style={[styles.infoLabel, { color: colors.secondary }]}>Email:</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>{user?.email || 'usuario@ejemplo.com'}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.secondary }]}>Estado:</Text>
            <Text style={[styles.infoValue, { color: '#10B981' }]}>Activo</Text>
          </View>
        </View>

        {/* BOTÓN CERRAR SESIÓN */}
        <TouchableOpacity 
          style={styles.logoutButton} 
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Text style={styles.logoutText}>🚪 Cerrar sesión</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 110,
    alignItems: 'center',
  },
  innerContainer: {
    width: '100%',
    maxWidth: 600,
    alignItems: 'center',
  },
  avatarContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 38,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 24,
  },
  section: {
    width: '100%',
    borderRadius: 14,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 14,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingLabel: {
    fontSize: 15,
  },
  settingValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  infoLabel: {
    fontSize: 14,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  logoutButton: {
    width: '100%',
    backgroundColor: '#EF4444',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
