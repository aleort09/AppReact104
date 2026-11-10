/**
 * Layout raíz de la aplicación
 * Provee los contextos globales: Theme, Notification, Cart y Auth
 * y monta el componente flotante de notificaciones toast (NotificationList)
 */

import React from 'react';
import { Stack } from 'expo-router';
import { ThemeProvider } from '../context/ThemeContext';
import { NotificationProvider } from '../context/NotificationContext';
import { CartProvider } from '../context/CartContext';
import { AuthProvider } from '../context/AuthContext';
import NotificationList from '../components/NotificationList';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <CartProvider>
          <AuthProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="login" />
              <Stack.Screen name="register" />
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="home" />
              <Stack.Screen name="students" />
            </Stack>
            <NotificationList />
          </AuthProvider>
        </CartProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
}
