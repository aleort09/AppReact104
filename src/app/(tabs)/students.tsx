/**
 * Pantalla de lista de estudiantes (Pestaña del TabBar)
 * Consume useStudents, soporta búsqueda con SearchBar, pull-to-refresh,
 * creación de nuevos estudiantes y agregar elementos al CartContext
 */

import React, { useState, useCallback, useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, FlatList, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { useStudents } from '../../hooks/useStudents';
import { useTheme } from '../../context/ThemeContext';
import { useCart } from '../../context/CartContext';
import { useNotification } from '../../context/NotificationContext';
import SearchBar from '../../components/SearchBar';
import StudentCard from '../../components/StudentCard';
import { ErrorMessage, Loading } from '../../components';
import { Student } from '../../types/student';

export default function StudentsTabScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const { students, loading, error, refresh } = useStudents();
  const { addItem, itemCount } = useCart();
  const { showSuccess } = useNotification();
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  }, [refresh]);

  const handleStudentPress = (student: Student) => {
    router.push(`/student/${student.id}` as any);
  };

  const handleAddToCart = (student: Student) => {
    addItem({
      id: student.id,
      name: `${student.nombre} ${student.apellido}`,
      price: 150,
      quantity: 1,
    });
    showSuccess('Agregado al Carrito', `${student.nombre} añadido a tu lista de selección`);
  };

  const filteredStudents = useMemo(() => {
    if (!searchQuery.trim()) return students;
    const q = searchQuery.toLowerCase().trim();
    return students.filter(s =>
      (s.nombre && s.nombre.toLowerCase().includes(q)) ||
      (s.apellido && s.apellido.toLowerCase().includes(q)) ||
      (s.matricula && s.matricula.toLowerCase().includes(q)) ||
      (s.email && s.email.toLowerCase().includes(q))
    );
  }, [students, searchQuery]);

  if (loading && !refreshing && students.length === 0) {
    return <Loading message="Cargando estudiantes..." />;
  }

  if (error && students.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ErrorMessage error={error} onRetry={refresh} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* BARRA SUPERIOR: BOTÓN AGREGAR Y BANNER CARRITO */}
      <View style={styles.topBar}>
        <TouchableOpacity 
          style={[styles.createButton, { backgroundColor: colors.primary }]}
          onPress={() => router.push('/student/create' as any)}
          activeOpacity={0.8}
        >
          <Text style={styles.createButtonText}>➕ Registrar Nuevo Alumno</Text>
        </TouchableOpacity>

        {itemCount > 0 && (
          <TouchableOpacity 
            style={[styles.cartBanner, { backgroundColor: isDark ? '#1E293B' : '#FEF3C7', borderColor: isDark ? '#334155' : '#FCD34D' }]}
            onPress={() => router.push('/(tabs)/cart' as any)}
            activeOpacity={0.8}
          >
            <Text style={styles.cartBannerText}>
              🛒 Tienes <Text style={{ fontWeight: 'bold' }}>{itemCount}</Text> en carrito. <Text style={{ color: colors.primary, textDecorationLine: 'underline' }}>Ver Carrito →</Text>
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* BUSCADOR */}
      <SearchBar 
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Buscar por nombre, apellido, matrícula..."
        onClear={() => setSearchQuery('')}
      />

      {/* LISTA DE ESTUDIANTES */}
      <FlatList
        data={filteredStudents}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            <StudentCard student={item} onPress={handleStudentPress} />
            <TouchableOpacity 
              style={[styles.inlineCartBtn, { backgroundColor: isDark ? '#334155' : '#EEF2FF', borderColor: colors.primary }]}
              onPress={() => handleAddToCart(item)}
              activeOpacity={0.7}
            >
              <Text style={[styles.inlineCartBtnText, { color: colors.primary }]}>
                🛒 + Añadir al Carrito ($150)
              </Text>
            </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>🔍</Text>
            <Text style={[styles.emptyText, { color: colors.text }]}>
              {searchQuery ? 'No hay coincidencias para tu búsqueda' : 'No hay estudiantes registrados'}
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    paddingHorizontal: 16,
    paddingTop: 12,
    maxWidth: 720,
    width: '100%',
    alignSelf: 'center',
    gap: 8,
  },
  createButton: {
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  cartBanner: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  cartBannerText: {
    fontSize: 13,
  },
  cardWrapper: {
    maxWidth: 720,
    width: '100%',
    alignSelf: 'center',
    marginBottom: 8,
  },
  inlineCartBtn: {
    marginHorizontal: 16,
    marginTop: -8,
    marginBottom: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  inlineCartBtnText: {
    fontSize: 13,
    fontWeight: '600',
  },
  listContent: {
    paddingBottom: 110,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
});
