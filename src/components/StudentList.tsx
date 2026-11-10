/**
 * Componente de lista de estudiantes con filtrado y soporte de tema
 */

import React, { useState, useMemo } from 'react';
import { View, FlatList, TextInput, StyleSheet, Text, RefreshControl } from 'react-native';
import StudentCard from './StudentCard';
import { Student } from '../types/student';
import { useTheme } from '../context/ThemeContext';

interface StudentListProps {
  students: Student[];
  onStudentPress: (student: Student) => void;
  onRefresh?: () => void;
  refreshing?: boolean;
}

export default function StudentList({ 
  students, 
  onStudentPress,
  onRefresh,
  refreshing = false
}: StudentListProps) {
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStudents = useMemo(() => {
    if (!searchQuery) return students;
    
    const query = searchQuery.toLowerCase();
    return students.filter(student =>
      (student.nombre && student.nombre.toLowerCase().includes(query)) ||
      (student.apellido && student.apellido.toLowerCase().includes(query)) ||
      (student.matricula && student.matricula.toLowerCase().includes(query))
    );
  }, [students, searchQuery]);

  const renderStudent = ({ item }: { item: Student }) => (
    <StudentCard student={item} onPress={() => onStudentPress(item)} />
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <TextInput
        style={[
          styles.searchInput, 
          { 
            backgroundColor: colors.card, 
            color: colors.text, 
            borderColor: colors.border 
          }
        ]}
        placeholder="Buscar por nombre, apellido o matrícula..."
        placeholderTextColor={colors.secondary}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <FlatList
        data={filteredStudents}
        renderItem={renderStudent}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        refreshControl={
          onRefresh ? (
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.primary]}
            />
          ) : undefined
        }
        ListEmptyComponent={
          <Text style={[styles.emptyText, { color: colors.secondary }]}>
            No se encontraron estudiantes
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchInput: {
    padding: 12,
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 15,
  },
  listContent: {
    padding: 16,
    paddingBottom: 110,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 40,
  },
});
