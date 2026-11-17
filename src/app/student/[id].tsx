/**
 * Pantalla de detalle de estudiante (Heredada y mejorada de dev-clase-4)
 * Permite visualizar información completa, agregar al carrito de matrículas o eliminar
 */

import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { studentService } from '../../services/studentService';
import { Student } from '../../types/student';
import { useTheme } from '../../context/ThemeContext';
import { useCart } from '../../context/CartContext';
import { useNotification } from '../../context/NotificationContext';
import { Loading, ErrorMessage } from '../../components';

export default function StudentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const { addItem, items } = useCart();
  const { showSuccess, showError, showInfo } = useNotification();

  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadStudent = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await studentService.getById(Number(id));
      setStudent(data);
    } catch (err: any) {
      setError(err?.message || 'Error al cargar los datos del estudiante');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadStudent();
  }, [loadStudent]);

  const handleAddToCart = () => {
    if (!student) return;
    addItem({
      id: student.id,
      name: `${student.nombre} ${student.apellido}`,
      price: 150,
      quantity: 1,
    });
    showSuccess('Agregado al Carrito', `${student.nombre} fue añadido a tu selección escolar`);
  };

  const isAlreadyInCart = items.some(item => item.id === Number(id));

  const handleDelete = () => {
    if (!student) return;

    const confirmMsg = `¿Estás seguro que deseas eliminar permanentemente a ${student.nombre} ${student.apellido}?`;

    if (Platform.OS === 'web') {
      const confirmed = typeof window !== 'undefined' ? window.confirm(confirmMsg) : true;
      if (confirmed) {
        performDelete();
      }
      return;
    }

    Alert.alert(
      'Eliminar estudiante',
      confirmMsg,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: performDelete,
        },
      ]
    );
  };

  const performDelete = async () => {
    if (!student) return;
    setDeleting(true);
    try {
      await studentService.delete(student.id);
      showSuccess('Estudiante eliminado', `${student.nombre} fue removido del sistema`);
      router.back();
    } catch (err) {
      showError('Error', 'No se pudo eliminar al estudiante');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <Loading message="Cargando información del estudiante..." />;
  }

  if (error || !student) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ErrorMessage error={error || 'Estudiante no encontrado'} onRetry={loadStudent} />
      </View>
    );
  }

  const initials = `${student.nombre?.charAt(0) || '?'}${student.apellido?.charAt(0) || '?'}`;

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Detalle de Alumno',
          headerStyle: { backgroundColor: colors.card },
          headerTintColor: colors.text,
          headerShadowVisible: false,
        }}
      />

      <View style={styles.content}>
        {/* TARJETA PRINCIPAL DE CABECERA */}
        <View style={[styles.headerCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={[styles.name, { color: colors.text }]}>
            {student.nombre} {student.apellido}
          </Text>
          <View style={[styles.matriculaBadge, { backgroundColor: isDark ? '#334155' : '#E0E7FF' }]}>
            <Text style={[styles.matriculaText, { color: colors.primary }]}>
              Matrícula: {student.matricula}
            </Text>
          </View>
        </View>

        {/* INFORMACIÓN DE CONTACTO */}
        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Datos Académicos y Contacto</Text>

          <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
            <Text style={styles.icon}>📧</Text>
            <View style={styles.infoContent}>
              <Text style={[styles.label, { color: colors.secondary }]}>Correo Electrónico</Text>
              <Text style={[styles.value, { color: colors.text }]}>{student.email}</Text>
            </View>
          </View>

          <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
            <Text style={styles.icon}>🆔</Text>
            <View style={styles.infoContent}>
              <Text style={[styles.label, { color: colors.secondary }]}>ID en Base de Datos</Text>
              <Text style={[styles.value, { color: colors.text }]}>#{student.id}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.icon}>🏷️</Text>
            <View style={styles.infoContent}>
              <Text style={[styles.label, { color: colors.secondary }]}>Cuota de Inscripción</Text>
              <Text style={[styles.value, { color: '#10B981', fontWeight: 'bold' }]}>$150.00 MXN</Text>
            </View>
          </View>
        </View>

        {/* FECHAS */}
        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Historial de Registro</Text>

          <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
            <Text style={styles.icon}>📅</Text>
            <View style={styles.infoContent}>
              <Text style={[styles.label, { color: colors.secondary }]}>Fecha de Alta</Text>
              <Text style={[styles.value, { color: colors.text }]}>
                {student.created_at ? new Date(student.created_at).toLocaleDateString('es-MX', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                }) : 'Reciente'}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.icon}>🔄</Text>
            <View style={styles.infoContent}>
              <Text style={[styles.label, { color: colors.secondary }]}>Última Actualización</Text>
              <Text style={[styles.value, { color: colors.text }]}>
                {student.updated_at ? new Date(student.updated_at).toLocaleDateString('es-MX', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                }) : 'Sin cambios'}
              </Text>
            </View>
          </View>
        </View>

        {/* ACCIONES */}
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity 
            style={[styles.cartActionButton, { backgroundColor: isAlreadyInCart ? '#059669' : colors.primary }]}
            onPress={handleAddToCart}
            activeOpacity={0.8}
          >
            <Text style={styles.cartActionText}>
              {isAlreadyInCart ? '🛒 Agregar otro al Carrito' : '🛒 Añadir al Carrito'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={handleDelete}
            disabled={deleting}
            activeOpacity={0.8}
          >
            {deleting ? (
              <ActivityIndicator color="#EF4444" />
            ) : (
              <Text style={styles.deleteButtonText}>🗑️ Eliminar estudiante</Text>
            )}
          </TouchableOpacity>
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
    padding: 18,
    paddingBottom: 90,
    alignItems: 'center',
  },
  content: {
    width: '100%',
    maxWidth: 680,
  },
  headerCard: {
    borderRadius: 18,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 2,
  },
  avatar: {
    width: 86,
    height: 86,
    borderRadius: 43,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
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
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  matriculaBadge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  matriculaText: {
    fontSize: 14,
    fontWeight: '600',
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 14,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
    borderBottomWidth: 1,
  },
  icon: {
    fontSize: 22,
    marginRight: 14,
  },
  infoContent: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    marginBottom: 2,
  },
  value: {
    fontSize: 15,
    fontWeight: '500',
  },
  actionButtonsContainer: {
    marginTop: 8,
    gap: 12,
  },
  cartActionButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  cartActionText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  deleteButtonText: {
    color: '#EF4444',
    fontSize: 15,
    fontWeight: '600',
  },
});
