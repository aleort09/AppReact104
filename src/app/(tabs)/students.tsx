/**
 * Pantalla de lista de estudiantes (Pestaña del TabBar)
 * Consume useStudents, soporta pull-to-refresh, tema claro/oscuro
 * y permite agregar elementos al CartContext para probar el badge de la pestaña
 */

import React, { useState, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useStudents } from '../../hooks/useStudents';
import { useTheme } from '../../context/ThemeContext';
import { useCart } from '../../context/CartContext';
import { useNotification } from '../../context/NotificationContext';
import StudentList from '../../components/StudentList';
import { ErrorMessage, Loading } from '../../components';
import { Student } from '../../types/student';

export default function StudentsTabScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { students, loading, error, refresh, deleteStudent } = useStudents();
  const { addItem, itemCount, clearCart } = useCart();
  const { showSuccess, showInfo } = useNotification();
  const [refreshing, setRefreshing] = useState(false);

  const handleStudentPress = (student: Student) => {
    // Al presionar un estudiante, se agrega al CartContext (simulado según Ejercicios Prácticos Clase 3 y 4)
    addItem({
      id: student.id,
      name: `${student.nombre} ${student.apellido}`,
      price: 150,
      quantity: 1,
    });
    showSuccess('Estudiante seleccionado', `${student.nombre} agregado al contador del badge`);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  }, [refresh]);

  if (loading && !refreshing) {
    return <Loading message="Cargando estudiantes..." />;
  }

  if (error) {
    return <ErrorMessage error={error} onRetry={refresh} />;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Barra de estado rápido del Cart/Badge */}
      {itemCount > 0 && (
        <View style={[styles.badgeBar, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.badgeText, { color: colors.text }]}>
            🎓 Elementos en Badge: <Text style={{ fontWeight: 'bold', color: colors.primary }}>{itemCount}</Text>
          </Text>
          <TouchableOpacity 
            onPress={() => {
              clearCart();
              showInfo('Badge reiniciado', 'Se vació el contador de estudiantes');
            }}
            style={styles.clearBadgeButton}
          >
            <Text style={styles.clearBadgeText}>Limpiar</Text>
          </TouchableOpacity>
        </View>
      )}

      <StudentList 
        students={students} 
        onStudentPress={handleStudentPress}
        onRefresh={onRefresh}
        refreshing={refreshing}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  badgeBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 14,
  },
  clearBadgeButton: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  clearBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
});
