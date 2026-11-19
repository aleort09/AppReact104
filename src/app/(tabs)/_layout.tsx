/**
 * Layout de tabs con navegación inferior
 * Incluye Inicio, Estudiantes, Carrito (con badge dinámico), Perfil y Ajustes
 */

import React from 'react';
import { Tabs } from 'expo-router';
import { View, Text, StyleSheet, ColorValue } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
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
          tabBarIcon: ({ size, color }) => (
            <TabIcon name="home" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="students"
        options={{
          title: 'Estudiantes',
          tabBarLabel: 'Estudiantes',
          tabBarIcon: ({ size, color }) => (
            <TabIcon name="people" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="cart"
        options={{
          title: 'Carrito',
          tabBarLabel: 'Carrito',
          tabBarIcon: ({ size, color }) => (
            <TabIcon name="cart" size={size} color={color} />
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
          tabBarIcon: ({ size, color }) => (
            <TabIcon name="person" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: 'Ajustes',
          tabBarLabel: 'Ajustes',
          tabBarIcon: ({ size, color }) => (
            <TabIcon name="settings" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

interface TabIconProps {
  name: 'home' | 'people' | 'cart' | 'person' | 'settings';
  size?: number;
  color?: string;
}

function TabIcon({ name, size, color }: TabIconProps) {
  const iconMap: Record<TabIconProps['name'], React.ComponentProps<typeof FontAwesome>['name']> = {
    home: 'home',
    people: 'users',
    cart: 'shopping-cart',
    person: 'user',
    settings: 'cog',
  };

  return (
    <View style={styles.iconContainer}>
      <FontAwesome name={iconMap[name]} size={size || 22} color={color || '#64748B'} />
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
