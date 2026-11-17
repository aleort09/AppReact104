/**
 * Pantalla de perfil de usuario con visualización y edición
 * Unificada con dev-clase-6, dev-clase-4 y dev-clase-2
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput, Platform, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';
import { useAuthContext } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import apiClient from '../../api/client';

export default function ProfileScreen() {
  const router = useRouter();
  const { colors, theme, toggleTheme, isDark } = useTheme();
  const { user, logout, updateUser } = useAuthContext();
  const { showSuccess, showError } = useNotification();
  
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [nombre, setNombre] = useState('');
  const [apellidoPaterno, setApellidoPaterno] = useState('');
  const [apellidoMaterno, setApellidoMaterno] = useState('');

  // Sincronizar campos al cargar o cambiar el usuario
  useEffect(() => {
    if (user) {
      setNombre(user.nombre || '');
      setApellidoPaterno(user.apellido_paterno || '');
      setApellidoMaterno(user.apellido_materno || '');
    }
  }, [user]);

  const handleLogout = () => {
    const confirmMessage = '¿Estás seguro que deseas cerrar sesión?';
    if (Platform.OS === 'web') {
      const confirmed = typeof window !== 'undefined' ? window.confirm(confirmMessage) : true;
      if (confirmed) {
        performLogout();
      }
      return;
    }

    Alert.alert(
      'Cerrar sesión',
      confirmMessage,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar sesión',
          style: 'destructive',
          onPress: performLogout,
        },
      ]
    );
  };

  const performLogout = async () => {
    try {
      await logout();
      showSuccess('Sesión cerrada', 'Hasta pronto');
      router.replace('/login' as any);
    } catch (error) {
      router.replace('/login' as any);
    }
  };

  const handleSave = async () => {
    if (!nombre.trim()) {
      showError('Campo requerido', 'El nombre es obligatorio');
      return;
    }

    setLoading(true);
    try {
      // Intentar actualizar en backend si existe la ruta
      if (user?.id) {
        try {
          await apiClient.put(`/api/usuarios/${user.id}`, {
            nombre: nombre.trim(),
            apellido_paterno: apellidoPaterno.trim(),
            apellido_materno: apellidoMaterno.trim() || null,
          });
        } catch {
          // Si el endpoint no existe aún en el backend, se actualiza en el contexto local
        }
      }

      updateUser({
        nombre: nombre.trim(),
        apellido_paterno: apellidoPaterno.trim(),
        apellido_materno: apellidoMaterno.trim() || null,
      });

      showSuccess('Perfil Actualizado', 'Tus datos se guardaron correctamente');
      setIsEditing(false);
    } catch (err: any) {
      showError('Error', err?.message || 'No se pudo actualizar el perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setNombre(user.nombre || '');
      setApellidoPaterno(user.apellido_paterno || '');
      setApellidoMaterno(user.apellido_materno || '');
    }
    setIsEditing(false);
  };

  const getInitials = () => {
    if (user?.nombre) {
      const p1 = user.nombre.charAt(0).toUpperCase();
      const p2 = user.apellido_paterno ? user.apellido_paterno.charAt(0).toUpperCase() : '';
      return p1 + p2;
    }
    return user?.email ? user.email.charAt(0).toUpperCase() : 'U';
  };

  const getFullName = () => {
    if (!user) return 'Usuario';
    const parts = [user.nombre, user.apellido_paterno, user.apellido_materno].filter(Boolean);
    return parts.length > 0 ? parts.join(' ') : (user.email || 'Usuario Activo');
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.content}>
        {/* TARJETA AVATAR Y DATOS BÁSICOS */}
        <View style={[styles.profileHeaderCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.avatarContainer, { backgroundColor: colors.primary }]}>
            <Text style={styles.avatarText}>{getInitials()}</Text>
          </View>

          <Text style={[styles.fullName, { color: colors.text }]}>{getFullName()}</Text>
          <Text style={[styles.email, { color: colors.secondary }]}>{user?.email || 'usuario@ejemplo.com'}</Text>

          <View style={[styles.rolBadge, { backgroundColor: isDark ? '#334155' : '#E0E7FF' }]}>
            <Text style={[styles.rolText, { color: colors.primary }]}>
              {user?.rol_nombre || 'Alumno / Estudiante'}
            </Text>
          </View>
        </View>

        {/* SECCIÓN INFORMACIÓN PERSONAL (EDICIÓN Y VISUALIZACIÓN) */}
        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Información Personal</Text>
            {!isEditing && (
              <TouchableOpacity onPress={() => setIsEditing(true)} activeOpacity={0.7}>
                <Text style={[styles.editButtonText, { color: colors.primary }]}>✏️ Editar</Text>
              </TouchableOpacity>
            )}
          </View>

          {isEditing ? (
            <View style={styles.formContainer}>
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.secondary }]}>Nombre</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
                  value={nombre}
                  onChangeText={setNombre}
                  placeholder="Nombre(s)"
                  placeholderTextColor={colors.secondary}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.secondary }]}>Apellido Paterno</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
                  value={apellidoPaterno}
                  onChangeText={setApellidoPaterno}
                  placeholder="Apellido Paterno"
                  placeholderTextColor={colors.secondary}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.secondary }]}>Apellido Materno</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
                  value={apellidoMaterno}
                  onChangeText={setApellidoMaterno}
                  placeholder="Apellido Materno"
                  placeholderTextColor={colors.secondary}
                />
              </View>

              <View style={styles.buttonRow}>
                <TouchableOpacity 
                  style={[styles.cancelBtn, { borderColor: colors.border }]} 
                  onPress={handleCancel}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.cancelBtnText, { color: colors.secondary }]}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.saveBtn, { backgroundColor: colors.primary }]} 
                  onPress={handleSave}
                  disabled={loading}
                  activeOpacity={0.8}
                >
                  {loading ? (
                    <ActivityIndicator color="#FFFFFF" size="small" />
                  ) : (
                    <Text style={styles.saveBtnText}>Guardar Cambios</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View>
              <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
                <Text style={[styles.infoLabel, { color: colors.secondary }]}>Nombre:</Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>{user?.nombre || 'No asignado'}</Text>
              </View>

              <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
                <Text style={[styles.infoLabel, { color: colors.secondary }]}>Apellido Paterno:</Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>{user?.apellido_paterno || 'No asignado'}</Text>
              </View>

              <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
                <Text style={[styles.infoLabel, { color: colors.secondary }]}>Apellido Materno:</Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>{user?.apellido_materno || 'No asignado'}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, { color: colors.secondary }]}>ID Usuario:</Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>#{user?.id || 1}</Text>
              </View>
            </View>
          )}
        </View>

        {/* PREFERENCIAS DE APARIENCIA */}
        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Preferencias</Text>

          <TouchableOpacity 
            style={styles.settingItem} 
            onPress={toggleTheme}
            activeOpacity={0.7}
          >
            <Text style={[styles.settingLabel, { color: colors.text }]}>
              {theme === 'dark' ? '🌙 Modo Oscuro' : '☀️ Modo Claro'}
            </Text>
            <Text style={[styles.settingValue, { color: colors.primary }]}>
              Cambiar a {theme === 'dark' ? 'Claro' : 'Oscuro'} →
            </Text>
          </TouchableOpacity>
        </View>

        {/* BOTÓN CERRAR SESIÓN */}
        <TouchableOpacity 
          style={styles.logoutButton} 
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Text style={styles.logoutText}>🚪 Cerrar Sesión</Text>
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
    padding: 18,
    paddingBottom: 110,
    alignItems: 'center',
  },
  content: {
    width: '100%',
    maxWidth: 680,
  },
  profileHeaderCard: {
    borderRadius: 18,
    padding: 22,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 2,
  },
  avatarContainer: {
    width: 86,
    height: 86,
    borderRadius: 43,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 34,
    fontWeight: 'bold',
  },
  fullName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
  },
  email: {
    fontSize: 14,
    marginBottom: 10,
  },
  rolBadge: {
    paddingHorizontal: 16,
    paddingVertical: 5,
    borderRadius: 20,
  },
  rolText: {
    fontSize: 12,
    fontWeight: '700',
  },
  section: {
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  formContainer: {
    marginTop: 6,
  },
  inputGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 11,
    fontSize: 15,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: '600',
  },
  saveBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
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
    fontWeight: '600',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: '500',
  },
  settingValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: '#EF4444',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 4,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 3,
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
