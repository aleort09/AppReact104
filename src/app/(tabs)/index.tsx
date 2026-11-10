/**
 * Pantalla de inicio (Dashboard de Tabs)
 * Muestra bienvenida al usuario y accesos rápidos a las pestañas principales
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../hooks/useAuth';

export default function HomeScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { user } = useAuth();

  const quickActions = [
    { title: 'Ver Estudiantes', subtitle: 'Listado completo de alumnos', route: '/(tabs)/students', icon: '👥', color: '#3B82F6' },
    { title: 'Mi Perfil', subtitle: 'Ver credenciales y cerrar sesión', route: '/(tabs)/profile', icon: '👤', color: '#10B981' },
    { title: 'Ajustes y Notificaciones', subtitle: 'Tema oscuro y pruebas toast', route: '/(tabs)/settings', icon: '⚙️', color: '#8B5CF6' },
  ];

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.content}>
        {/* TARJETA DE BIENVENIDA */}
        <View style={[styles.welcomeCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={styles.emoji}>👋</Text>
          <Text style={[styles.welcomeTitle, { color: colors.text }]}>
            ¡Bienvenido!
          </Text>
          <Text style={[styles.welcomeSubtitle, { color: colors.secondary }]}>
            {user?.email || 'Usuario Activo'}
          </Text>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Acciones rápidas
        </Text>

        {quickActions.map((action, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.actionCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => router.push(action.route as any)}
            activeOpacity={0.7}
          >
            <View style={[styles.actionIcon, { backgroundColor: action.color }]}>
              <Text style={styles.iconText}>{action.icon}</Text>
            </View>
            <View style={styles.actionContent}>
              <Text style={[styles.actionTitle, { color: colors.text }]}>
                {action.title}
              </Text>
              <Text style={[styles.actionSubtitle, { color: colors.secondary }]}>
                {action.subtitle}
              </Text>
            </View>
            <Text style={[styles.arrow, { color: colors.secondary }]}>›</Text>
          </TouchableOpacity>
        ))}
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
  content: {
    width: '100%',
    maxWidth: 600,
  },
  welcomeCard: {
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  emoji: {
    fontSize: 44,
    marginBottom: 8,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  welcomeSubtitle: {
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  iconText: {
    fontSize: 22,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  actionSubtitle: {
    fontSize: 13,
  },
  arrow: {
    fontSize: 22,
    fontWeight: '300',
    marginLeft: 8,
  },
});
