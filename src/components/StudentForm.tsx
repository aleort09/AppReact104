/**
 * Formulario para crear/editar estudiantes con soporte de tema
 */

import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text, Alert, Platform } from 'react-native';
import { Student } from '../types/student';
import { useTheme } from '../context/ThemeContext';

interface StudentFormProps {
  student?: Student;
  onSubmit: (data: Omit<Student, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  onCancel: () => void;
}

export default function StudentForm({ student, onSubmit, onCancel }: StudentFormProps) {
  const { colors } = useTheme();
  const [nombre, setNombre] = useState(student?.nombre || '');
  const [apellido, setApellido] = useState(student?.apellido || '');
  const [matricula, setMatricula] = useState(student?.matricula || '');
  const [email, setEmail] = useState(student?.email || '');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (student) {
      setNombre(student.nombre || '');
      setApellido(student.apellido || '');
      setMatricula(student.matricula || '');
      setEmail(student.email || '');
    }
  }, [student]);

  const handleSubmit = async () => {
    if (!nombre.trim() || !apellido.trim() || !matricula.trim() || !email.trim()) {
      if (Platform.OS === 'web') {
        alert('Todos los campos son obligatorios.');
      } else {
        Alert.alert('Campos incompletos', 'Por favor llena todos los datos del alumno.');
      }
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        matricula: matricula.trim(),
        email: email.trim(),
      });
    } catch (error) {
      // Manejado por el padre
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Text style={[styles.formTitle, { color: colors.text }]}>
        {student ? 'Editar Estudiante' : 'Datos del Alumno'}
      </Text>

      <Text style={[styles.label, { color: colors.secondary }]}>Nombre</Text>
      <TextInput
        style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
        placeholder="Ej. Juan"
        placeholderTextColor={colors.secondary}
        value={nombre}
        onChangeText={setNombre}
      />

      <Text style={[styles.label, { color: colors.secondary }]}>Apellido</Text>
      <TextInput
        style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
        placeholder="Ej. Pérez González"
        placeholderTextColor={colors.secondary}
        value={apellido}
        onChangeText={setApellido}
      />

      <Text style={[styles.label, { color: colors.secondary }]}>Matrícula</Text>
      <TextInput
        style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
        placeholder="Ej. MAT2026-001"
        placeholderTextColor={colors.secondary}
        value={matricula}
        onChangeText={setMatricula}
        autoCapitalize="characters"
      />

      <Text style={[styles.label, { color: colors.secondary }]}>Correo Electrónico</Text>
      <TextInput
        style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
        placeholder="correo@ejemplo.com"
        placeholderTextColor={colors.secondary}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <View style={styles.buttons}>
        <TouchableOpacity 
          style={[styles.cancelButton, { borderColor: colors.border }]} 
          onPress={onCancel}
          activeOpacity={0.7}
        >
          <Text style={[styles.cancelText, { color: colors.secondary }]}>Cancelar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.submitButton, { backgroundColor: colors.primary }, submitting && styles.submitButtonDisabled]} 
          onPress={handleSubmit}
          disabled={submitting}
          activeOpacity={0.8}
        >
          <Text style={styles.submitText}>
            {submitting ? 'Guardando...' : (student ? 'Actualizar' : 'Guardar Alumno')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 22,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 3,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    fontSize: 15,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 15,
    fontWeight: '600',
  },
  submitButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
});
