/**
 * Componente de tarjeta de estudiante
 * Muestra la información básica de un estudiante en formato de tarjeta
 * Con soporte de tema claro/oscuro y accesibilidad
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Student } from '../types/student';
import { useTheme } from '../context/ThemeContext';

interface StudentCardProps {
  student: Student;
  onPress?: (student: Student) => void;
}

const StudentCard = React.memo(({ student, onPress }: StudentCardProps) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={() => onPress?.(student)}
      activeOpacity={0.7}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={`Estudiante ${student.nombre} ${student.apellido}`}
      accessibilityHint="Toca para ver los detalles del estudiante"
    >
      <View style={styles.header}>
        <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
          <Text style={styles.avatarText}>
            {student.nombre?.charAt(0) || '?'}{student.apellido?.charAt(0) || '?'}
          </Text>
        </View>
        <View style={styles.info}>
          <Text style={[styles.name, { color: colors.text }]} numberOfLines={1} ellipsizeMode="tail">
            {student.nombre} {student.apellido}
          </Text>
          <Text style={[styles.matricula, { color: colors.secondary }]}>
            Matrícula: {student.matricula}
          </Text>
        </View>
      </View>
      <View style={[styles.divider, { backgroundColor: colors.border }]} />
      <View style={styles.footer}>
        <Text style={[styles.label, { color: colors.secondary }]}>Email:</Text>
        <Text style={[styles.email, { color: colors.primary }]} numberOfLines={1} ellipsizeMode="tail">
          {student.email}
        </Text>
      </View>
    </TouchableOpacity>
  );
});

StudentCard.displayName = 'StudentCard';

export default StudentCard;

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 6,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  matricula: {
    fontSize: 13,
  },
  divider: {
    height: 1,
    marginVertical: 10,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 13,
    marginRight: 6,
  },
  email: {
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
  },
});
