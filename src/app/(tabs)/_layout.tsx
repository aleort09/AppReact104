/**
 * Layout de tabs con navegación inferior
 * Incluye Inicio, Estudiantes, Carrito (con badge dinámico), Perfil y Ajustes
 */

import React from 'react';
import { Tabs } from 'expo-router';
import { View, Text, StyleSheet, ColorValue } from 'react-native';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';

export default function TabLayout() {
  const { itemCount } = useCart();
  const { colors, isDark } = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.secondary,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 4,
          elevation: 5,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
        headerStyle: {
          backgroundColor: colors.card,
          borderBottomColor: colors.border,
          borderBottomWidth: 1,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 18,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarLabel: 'Inicio',
          tabBarIcon: ({ size }) => (
            <TabIcon name="home" size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="students"
        options={{
          title: 'Estudiantes',
          tabBarLabel: 'Estudiantes',
          tabBarIcon: ({ size }) => (
            <TabIcon name="people" size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="cart"
        options={{
          title: 'Carrito',
          tabBarLabel: 'Carrito',
          tabBarIcon: ({ size }) => (
            <TabIcon name="cart" size={size} />
          ),
          tabBarBadge: itemCount > 0 ? itemCount : undefined,
          tabBarBadgeStyle: {
            backgroundColor: '#EF4444',
            color: '#FFFFFF',
            fontSize: 10,
            fontWeight: 'bold',
            minWidth: 18,
            height: 18,
            borderRadius: 9,
          },
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarLabel: 'Perfil',
          tabBarIcon: ({ size }) => (
            <TabIcon name="person" size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: 'Ajustes',
          tabBarLabel: 'Ajustes',
          tabBarIcon: ({ size }) => (
            <TabIcon name="settings" size={size} />
          ),
        }}
      />
    </Tabs>
  );
}

interface TabIconProps {
  name: 'home' | 'people' | 'cart' | 'person' | 'settings';
  size?: number;
}

function TabIcon({ name, size }: TabIconProps) {
  const icons = {
    home: '🏠',
    people: '👥',
    cart: '🛒',
    person: '👤',
    settings: '⚙️',
  };

  return (
    <View style={styles.iconContainer}>
      <Text style={[styles.iconText, { fontSize: size || 22 }]}>
        {icons[name]}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    textAlign: 'center',
  },
});
