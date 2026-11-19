/**
 * Pantalla de inicio (Dashboard Principal)
 * Muestra métricas rápidas de alumnos y carrito, y accesos directos
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useTheme } from '../../context/ThemeContext';
import { useAuthContext } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useStudents } from '../../hooks/useStudents';

export default function HomeScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const { user } = useAuthContext();
  const { itemCount, total } = useCart();
  const { students } = useStudents();

  const displayName = user?.nombre 
    ? `${user.nombre} ${user.apellido_paterno || ''}`.trim()
    : (user?.email?.split('@')[0] || 'Estudiante');

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.content}>
        {/* TARJETA DE BIENVENIDA */}
        <View style={[styles.welcomeCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <FontAwesome name="hand-peace-o" size={28} color="#F59E0B" style={styles.emoji} />
          <Text style={[styles.welcomeTitle, { color: colors.text }]}>
            ¡Hola, {displayName}!
          </Text>
          <Text style={[styles.welcomeSubtitle, { color: colors.secondary }]}>
            Panel de Gestión Escolar y Matrículas
          </Text>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>Resumen del Sistema</Text>
        
        <View style={styles.statsRow}>
          <TouchableOpacity 
            style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => router.push('/(tabs)/students' as any)}
            activeOpacity={0.7}
          >
            <View style={styles.statIcon}>
              <FontAwesome name="graduation-cap" size={24} color={colors.primary} />
            </View>
            <Text style={[styles.statNumber, { color: colors.primary }]}>{students.length}</Text>
            <Text style={[styles.statLabel, { color: colors.secondary }]}>Estudiantes</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => router.push('/(tabs)/cart' as any)}
            activeOpacity={0.7}
          >
            <View style={styles.statIcon}>
              <FontAwesome name="shopping-cart" size={24} color="#10B981" />
            </View>
            <Text style={[styles.statNumber, { color: '#10B981' }]}>{itemCount}</Text>
            <Text style={[styles.statLabel, { color: colors.secondary }]}>
              {itemCount > 0 ? `$${total.toFixed(0)} MXN` : 'En Carrito'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => router.push('/(tabs)/settings' as any)}
            activeOpacity={0.7}
          >
            <View style={styles.statIcon}>
              <FontAwesome name={isDark ? "moon-o" : "sun-o"} size={24} color="#8B5CF6" />
            </View>
            <Text style={[styles.statNumber, { color: '#8B5CF6' }]}>{isDark ? 'Dark' : 'Light'}</Text>
            <Text style={[styles.statLabel, { color: colors.secondary }]}>Tema</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 14 }]}>
          Acciones Rápidas
        </Text>

        <TouchableOpacity
          style={[styles.actionCard, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={() => router.push('/(tabs)/students' as any)}
          activeOpacity={0.7}
        >
          <View style={[styles.actionIconContainer, { backgroundColor: '#3B82F6' }]}>
            <FontAwesome name="users" size={18} color="#FFFFFF" />
          </View>
          <View style={styles.actionInfo}>
            <Text style={[styles.actionTitle, { color: colors.text }]}>Ver Lista de Alumnos</Text>
            <Text style={[styles.actionSubtitle, { color: colors.secondary }]}>
              Consulta matrículas, busca y administra estudiantes
            </Text>
          </View>
          <Text style={[styles.arrow, { color: colors.secondary }]}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionCard, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={() => router.push('/student/create' as any)}
          activeOpacity={0.7}
        >
          <View style={[styles.actionIconContainer, { backgroundColor: '#10B981' }]}>
            <FontAwesome name="user-plus" size={18} color="#FFFFFF" />
          </View>
          <View style={styles.actionInfo}>
            <Text style={[styles.actionTitle, { color: colors.text }]}>Registrar Nuevo Alumno</Text>
            <Text style={[styles.actionSubtitle, { color: colors.secondary }]}>
              Da de alta un nuevo estudiante en la base de datos
            </Text>
          </View>
          <Text style={[styles.arrow, { color: colors.secondary }]}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionCard, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={() => router.push('/(tabs)/cart' as any)}
          activeOpacity={0.7}
        >
          <View style={[styles.actionIconContainer, { backgroundColor: '#F59E0B' }]}>
            <FontAwesome name="shopping-cart" size={18} color="#FFFFFF" />
          </View>
          <View style={styles.actionInfo}>
            <Text style={[styles.actionTitle, { color: colors.text }]}>Revisar Carrito de Inscripciones</Text>
            <Text style={[styles.actionSubtitle, { color: colors.secondary }]}>
              {itemCount > 0 ? `${itemCount} pendiente(s) por pagar` : 'Vaciar o simular inscripciones'}
            </Text>
          </View>
          <Text style={[styles.arrow, { color: colors.secondary }]}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionCard, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={() => router.push('/(tabs)/profile' as any)}
          activeOpacity={0.7}
        >
          <View style={[styles.actionIconContainer, { backgroundColor: '#8B5CF6' }]}>
            <FontAwesome name="user" size={18} color="#FFFFFF" />
          </View>
          <View style={styles.actionInfo}>
            <Text style={[styles.actionTitle, { color: colors.text }]}>Mi Perfil</Text>
            <Text style={[styles.actionSubtitle, { color: colors.secondary }]}>
              Edita tus nombres y gestiona tu sesión
            </Text>
          </View>
          <Text style={[styles.arrow, { color: colors.secondary }]}>›</Text>
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
  welcomeCard: {
    borderRadius: 18,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 2,
  },
  emoji: {
    fontSize: 44,
    marginBottom: 8,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: 14,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  statIcon: {
    fontSize: 26,
    marginBottom: 4,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  actionIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  actionIcon: {
    fontSize: 20,
  },
  actionInfo: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  actionSubtitle: {
    fontSize: 12,
  },
  arrow: {
    fontSize: 20,
    fontWeight: '300',
    marginLeft: 6,
  },
});
