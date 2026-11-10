/**
 * Pantalla de lista de estudiantes (Ruta raíz /students)
 */

import React, { useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useStudents } from '../hooks/useStudents';
import { useTheme } from '../context/ThemeContext';
import StudentList from '../components/StudentList';
import { ErrorMessage, Loading } from '../components';

export default function StudentsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { students, loading, error, refresh } = useStudents();
  const [refreshing, setRefreshing] = useState(false);

  const handleStudentPress = (student: any) => {
    router.push(`/student/${student.id}` as any);
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
});
