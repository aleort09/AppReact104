/**
 * Pantalla de perfil del usuario
 * Muestra información del usuario, acciones y botón de logout
 * Soporta scroll completo para que ninguna opción quede oculta por el TabBar
 */

import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Alert, 
  ScrollView, 
  Platform 
} from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { Loading } from '../../components';

export default function ProfileScreen() {
  const { user, loading, logout, isAuthenticated } = useAuth();

  // Mostrar loading mientras se verifica la autenticación
  if (loading) {
    return <Loading message="Cargando perfil..." />;
  }

  // Si no está autenticado, mostrar mensaje
  if (!isAuthenticated || !user) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No hay sesión activa</Text>
      </View>
    );
  }

  // Confirmar logout compatible con Web y Móvil
  const handleLogout = () => {
    if (Platform.OS === 'web') {
      const confirm = typeof window !== 'undefined' 
        ? window.confirm('¿Estás seguro que deseas cerrar sesión?')
        : true;
      if (confirm) {
        logout();
      }
      return;
    }

    Alert.alert(
      'Cerrar sesión',
      '¿Estás seguro que deseas cerrar sesión?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Cerrar sesión',
          style: 'destructive',
          onPress: () => logout(),
        },
      ]
    );
  };

  const showNotification = (title: string, msg: string) => {
    if (Platform.OS === 'web') {
      alert(`${title}: ${msg}`);
    } else {
      Alert.alert(title, msg);
    }
  };

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={true}
    >
      <View style={styles.innerContainer}>
        {/* TARJETA DE PERFIL */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatar}>
              {user.email ? user.email.charAt(0).toUpperCase() : 'U'}
            </Text>
          </View>
          <Text style={styles.title}>Mi Perfil</Text>
          <Text style={styles.email}>{user.email}</Text>
        </View>

        {/* INFORMACIÓN DE CUENTA */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información de cuenta</Text>
          
          <View style={styles.infoRow}>
            <Text style={styles.label}>ID de usuario:</Text>
            <Text style={styles.value}>{user.id}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{user.email}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Estado:</Text>
            <Text style={[styles.value, styles.activeStatus]}>Activo</Text>
          </View>
        </View>

        {/* ACCIONES DEL MENÚ */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acciones</Text>
          
          <TouchableOpacity 
            style={styles.menuItem}
            activeOpacity={0.7}
            onPress={() => showNotification('Configuración', 'Módulo de configuración del sistema')}
          >
            <Text style={styles.menuIcon}>⚙️</Text>
            <Text style={styles.menuText}>Configuración</Text>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            activeOpacity={0.7}
            onPress={() => showNotification('Notificaciones', 'No tienes notificaciones pendientes')}
          >
            <Text style={styles.menuIcon}>🔔</Text>
            <Text style={styles.menuText}>Notificaciones</Text>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.menuItem, styles.menuItemLast]}
            activeOpacity={0.7}
            onPress={() => showNotification('Ayuda', 'Soporte y documentación del sistema escolar')}
          >
            <Text style={styles.menuIcon}>❓</Text>
            <Text style={styles.menuText}>Ayuda</Text>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* BOTÓN CERRAR SESIÓN */}
        <TouchableOpacity 
          style={styles.logoutButton} 
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Text style={styles.logoutIcon}>🚪</Text>
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 110, // Margen para que el TabBar inferior nunca tape los botones
    alignItems: 'center',
  },
  innerContainer: {
    width: '100%',
    maxWidth: 700, // Buen centrado y límite de ancho en pantallas web
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  avatarContainer: {
    marginBottom: 14,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#3B82F6',
    color: '#FFFFFF',
    fontSize: 34,
    fontWeight: 'bold',
    textAlign: 'center',
    textAlignVertical: 'center',
    lineHeight: 80,
    overflow: 'hidden',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  email: {
    fontSize: 15,
    color: '#6B7280',
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 18,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  label: {
    fontSize: 14,
    color: '#6B7280',
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  activeStatus: {
    color: '#10B981',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuIcon: {
    fontSize: 20,
    marginRight: 14,
  },
  menuText: {
    fontSize: 15,
    color: '#1F2937',
    fontWeight: '500',
    flex: 1,
  },
  menuArrow: {
    fontSize: 20,
    color: '#9CA3AF',
    fontWeight: '400',
  },
  logoutButton: {
    backgroundColor: '#EF4444',
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 20,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 3,
  },
  logoutIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 40,
  },
});
