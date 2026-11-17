/**
 * Pantalla para registrar un nuevo estudiante
 */

import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { studentService } from '../../services/studentService';
import { useTheme } from '../../context/ThemeContext';
import { useNotification } from '../../context/NotificationContext';
import StudentForm from '../../components/StudentForm';
import { Student } from '../../types/student';

export default function CreateStudentScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { showSuccess, showError } = useNotification();

  const handleSubmit = async (data: Omit<Student, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const newStudent = await studentService.create(data);
      showSuccess('Estudiante Creado', `${newStudent.nombre} ha sido registrado exitosamente`);
      router.back();
    } catch (err: any) {
      showError('Error al crear', err?.message || 'No se pudo guardar el estudiante');
      throw err;
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Nuevo Estudiante',
          headerStyle: { backgroundColor: colors.card },
          headerTintColor: colors.text,
          headerShadowVisible: false,
        }}
      />

      <View style={styles.content}>
        <StudentForm onSubmit={handleSubmit} onCancel={handleCancel} />
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
    maxWidth: 600,
  },
});
