/**
 * Pantalla de ajustes
 * Permite cambiar el tema (claro/oscuro) y probar el sistema de notificaciones toast
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useNotification } from '../../context/NotificationContext';

export default function SettingsScreen() {
  const { colors, theme, toggleTheme } = useTheme();
  const { showSuccess, showError, showWarning, showInfo } = useNotification();

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.content}>
        {/* APARIENCIA / TEMA */}
        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Apariencia
          </Text>

          <View style={styles.settingItem}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>
              Modo oscuro
            </Text>
            <Switch
              value={theme === 'dark'}
              onValueChange={toggleTheme}
              trackColor={{ false: '#767577', true: colors.primary }}
              thumbColor={theme === 'dark' ? colors.primary : '#f4f3f4'}
            />
          </View>
        </View>

        {/* NOTIFICACIONES */}
        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Sistema de Notificaciones
          </Text>

          <TouchableOpacity
            style={[styles.notificationButton, { borderBottomColor: colors.border }]}
            onPress={() => showSuccess('Éxito', 'Operación completada correctamente')}
            activeOpacity={0.7}
          >
            <Text style={[styles.notificationButtonText, { color: '#10B981' }]}>
              🟢 Mostrar Notificación de Éxito
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.notificationButton, { borderBottomColor: colors.border }]}
            onPress={() => showError('Error', 'No se pudo conectar al servidor escolar')}
            activeOpacity={0.7}
          >
            <Text style={[styles.notificationButtonText, { color: '#EF4444' }]}>
              🔴 Mostrar Notificación de Error
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.notificationButton, { borderBottomColor: colors.border }]}
            onPress={() => showWarning('Advertencia', 'Tu sesión expirará en 5 minutos')}
            activeOpacity={0.7}
          >
            <Text style={[styles.notificationButtonText, { color: '#F59E0B' }]}>
              🟡 Mostrar Notificación de Advertencia
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.notificationButton, { borderBottomWidth: 0 }]}
            onPress={() => showInfo('Información', 'Datos escolares sincronizados')}
            activeOpacity={0.7}
          >
            <Text style={[styles.notificationButtonText, { color: '#3B82F6' }]}>
              🔵 Mostrar Notificación Informativa
            </Text>
          </TouchableOpacity>
        </View>

        {/* ACERCA DE */}
        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Acerca del sistema
          </Text>

          <View style={[styles.aboutItem, { borderBottomColor: colors.border }]}>
            <Text style={[styles.aboutLabel, { color: colors.secondary }]}>
              Versión
            </Text>
            <Text style={[styles.aboutValue, { color: colors.text }]}>
              2.0.0 (Clase 2 & Contexts)
            </Text>
          </View>

          <View style={styles.aboutItem}>
            <Text style={[styles.aboutLabel, { color: colors.secondary }]}>
              Estado
            </Text>
            <Text style={[styles.aboutValue, { color: '#10B981' }]}>
              En línea
            </Text>
          </View>
        </View>
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
  section: {
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
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 14,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  notificationButton: {
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  notificationButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  aboutItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  aboutLabel: {
    fontSize: 15,
  },
  aboutValue: {
    fontSize: 15,
    fontWeight: '600',
  },
});
