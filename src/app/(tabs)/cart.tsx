/**
 * Pantalla de Carrito de Compras / Inscripciones
 * Conectada al CartContext con conteo dinámico, actualización de cantidades y checkout
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import { useNotification } from '../../context/NotificationContext';

export default function CartScreen() {
  const router = useRouter();
  const { items, total, itemCount, updateQuantity, removeItem, clearCart } = useCart();
  const { colors, isDark } = useTheme();
  const { showSuccess, showInfo } = useNotification();

  const handleCheckout = () => {
    if (items.length === 0) {
      showInfo('Carrito vacío', 'Agrega estudiantes o cursos antes de continuar.');
      return;
    }

    const message = `¿Deseas confirmar la inscripción de ${itemCount} elemento(s) por un total de $${total.toFixed(2)} MXN?`;
    
    if (Platform.OS === 'web') {
      const confirm = typeof window !== 'undefined' ? window.confirm(message) : true;
      if (confirm) {
        clearCart();
        showSuccess('¡Inscripción Exitosa!', `Se procesó la orden por $${total.toFixed(2)} MXN.`);
      }
      return;
    }

    Alert.alert(
      'Confirmar Inscripción',
      message,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: () => {
            clearCart();
            showSuccess('¡Inscripción Exitosa!', `Se procesó la orden por $${total.toFixed(2)} MXN.`);
          },
        },
      ]
    );
  };

  const handleClear = () => {
    if (items.length === 0) return;
    clearCart();
    showInfo('Carrito vaciado', 'Todos los elementos han sido removidos.');
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.content}>
        {/* ENCABEZADO */}
        <View style={[styles.headerCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={styles.headerIcon}>🛒</Text>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Mi Carrito</Text>
          <Text style={[styles.headerSubtitle, { color: colors.secondary }]}>
            {itemCount > 0 
              ? `Tienes ${itemCount} elemento(s) en tu selección escolar`
              : 'Tu carrito está actualmente vacío'}
          </Text>
        </View>

        {/* LISTADO DE ITEMS O ESTADO VACÍO */}
        {items.length === 0 ? (
          <View style={[styles.emptyCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={styles.emptyIcon}>📦</Text>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No hay elementos en el carrito</Text>
            <Text style={[styles.emptySubtitle, { color: colors.secondary }]}>
              Ve a la pestaña de Estudiantes para agregar alumnos o cursos a tu lista.
            </Text>
            <TouchableOpacity 
              style={[styles.browseButton, { backgroundColor: colors.primary }]}
              onPress={() => router.push('/(tabs)/students' as any)}
              activeOpacity={0.8}
            >
              <Text style={styles.browseButtonText}>👥 Explorar Estudiantes</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.itemsContainer}>
            <View style={styles.itemsHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Elementos Seleccionados</Text>
              <TouchableOpacity onPress={handleClear} activeOpacity={0.7}>
                <Text style={styles.clearAllText}>Vaciar todo</Text>
              </TouchableOpacity>
            </View>

            {items.map((item) => (
              <View 
                key={item.id} 
                style={[styles.itemCard, { backgroundColor: colors.card, borderColor: colors.border }]}
              >
                <View style={[styles.itemAvatar, { backgroundColor: colors.primary }]}>
                  <Text style={styles.itemAvatarText}>🎓</Text>
                </View>

                <View style={styles.itemDetails}>
                  <Text style={[styles.itemName, { color: colors.text }]} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text style={[styles.itemPrice, { color: colors.primary }]}>
                    ${item.price.toFixed(2)} MXN c/u
                  </Text>
                  <Text style={[styles.itemSubtotal, { color: colors.secondary }]}>
                    Subtotal: ${(item.price * item.quantity).toFixed(2)} MXN
                  </Text>
                </View>

                {/* CONTROLES DE CANTIDAD */}
                <View style={styles.quantityControls}>
                  <TouchableOpacity 
                    style={[styles.qtyButton, { borderColor: colors.border, backgroundColor: isDark ? '#334155' : '#F1F5F9' }]}
                    onPress={() => updateQuantity(item.id, item.quantity - 1)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.qtyButtonText, { color: colors.text }]}>−</Text>
                  </TouchableOpacity>

                  <Text style={[styles.qtyText, { color: colors.text }]}>{item.quantity}</Text>

                  <TouchableOpacity 
                    style={[styles.qtyButton, { borderColor: colors.border, backgroundColor: isDark ? '#334155' : '#F1F5F9' }]}
                    onPress={() => updateQuantity(item.id, item.quantity + 1)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.qtyButtonText, { color: colors.text }]}>+</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={styles.deleteButton}
                    onPress={() => removeItem(item.id)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.deleteButtonText}>🗑️</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            {/* RESUMEN DE COMPRA */}
            <View style={[styles.summaryCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.summaryTitle, { color: colors.text }]}>Resumen del Carrito</Text>

              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: colors.secondary }]}>Total de elementos:</Text>
                <Text style={[styles.summaryValue, { color: colors.text }]}>{itemCount}</Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: colors.secondary }]}>Tarifa base:</Text>
                <Text style={[styles.summaryValue, { color: colors.text }]}>${total.toFixed(2)} MXN</Text>
              </View>

              <View style={[styles.summaryDivider, { backgroundColor: colors.border }]} />

              <View style={styles.totalRow}>
                <Text style={[styles.totalLabel, { color: colors.text }]}>Monto Total:</Text>
                <Text style={[styles.totalValue, { color: '#10B981' }]}>${total.toFixed(2)} MXN</Text>
              </View>

              <TouchableOpacity 
                style={[styles.checkoutButton, { backgroundColor: '#10B981' }]}
                onPress={handleCheckout}
                activeOpacity={0.8}
              >
                <Text style={styles.checkoutButtonText}>✓ Confirmar e Inscribir</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
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
  headerCard: {
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 18,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 5,
    elevation: 2,
  },
  headerIcon: {
    fontSize: 40,
    marginBottom: 6,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    textAlign: 'center',
  },
  emptyCard: {
    borderRadius: 16,
    padding: 36,
    alignItems: 'center',
    borderWidth: 1,
    marginTop: 20,
  },
  emptyIcon: {
    fontSize: 56,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  browseButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  browseButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  itemsContainer: {
    width: '100%',
  },
  itemsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
  },
  clearAllText: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '600',
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  itemAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  itemAvatarText: {
    fontSize: 20,
  },
  itemDetails: {
    flex: 1,
    marginRight: 8,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  itemPrice: {
    fontSize: 13,
    fontWeight: '600',
  },
  itemSubtotal: {
    fontSize: 12,
    marginTop: 2,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  qtyButton: {
    width: 28,
    height: 28,
    borderRadius: 6,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  qtyText: {
    marginHorizontal: 10,
    fontSize: 15,
    fontWeight: '600',
    minWidth: 16,
    textAlign: 'center',
  },
  deleteButton: {
    marginLeft: 10,
    padding: 4,
  },
  deleteButtonText: {
    fontSize: 16,
  },
  summaryCard: {
    borderRadius: 16,
    padding: 20,
    marginTop: 14,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 5,
    elevation: 2,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 14,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  summaryDivider: {
    height: 1,
    marginVertical: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  totalLabel: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  checkoutButton: {
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 3,
  },
  checkoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
