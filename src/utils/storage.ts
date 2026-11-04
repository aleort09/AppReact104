/**
 * Utilidades para almacenamiento de tokens
 * Soporta multiplataforma:
 * - Móvil (iOS/Android): Expo SecureStore (almacenamiento cifrado en Keychain/Keystore)
 * - Web (Navegador): localStorage (con fallback seguro en memoria si no está disponible)
 */

import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

// Memoria fallback por si localStorage falla o está en SSR
const memoryStorage = new Map<string, string>();

const isWeb = Platform.OS === 'web';

function setWebItem(key: string, value: string): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, value);
    }
  } catch {
    memoryStorage.set(key, value);
  }
}

function getWebItem(key: string): string | null {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem(key);
    }
  } catch {
    return memoryStorage.get(key) || null;
  }
  return memoryStorage.get(key) || null;
}

function removeWebItem(key: string): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(key);
    }
  } catch {
    memoryStorage.delete(key);
  }
}

/**
 * Guarda el access token de forma segura
 */
export async function saveAccessToken(token: string): Promise<void> {
  if (isWeb) {
    setWebItem(ACCESS_TOKEN_KEY, token);
    return;
  }
  try {
    await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token);
  } catch (error) {
    console.warn('Error guardando access token en SecureStore:', error);
  }
}

/**
 * Obtiene el access token almacenado
 */
export async function getAccessToken(): Promise<string | null> {
  if (isWeb) {
    return getWebItem(ACCESS_TOKEN_KEY);
  }
  try {
    return await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
  } catch (error) {
    console.warn('Error obteniendo access token en SecureStore:', error);
    return null;
  }
}

/**
 * Guarda el refresh token de forma segura
 */
export async function saveRefreshToken(token: string): Promise<void> {
  if (isWeb) {
    setWebItem(REFRESH_TOKEN_KEY, token);
    return;
  }
  try {
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token);
  } catch (error) {
    console.warn('Error guardando refresh token en SecureStore:', error);
  }
}

/**
 * Obtiene el refresh token almacenado
 */
export async function getRefreshToken(): Promise<string | null> {
  if (isWeb) {
    return getWebItem(REFRESH_TOKEN_KEY);
  }
  try {
    return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
  } catch (error) {
    console.warn('Error obteniendo refresh token en SecureStore:', error);
    return null;
  }
}

/**
 * Elimina todos los tokens almacenados (logout)
 */
export async function clearTokens(): Promise<void> {
  if (isWeb) {
    removeWebItem(ACCESS_TOKEN_KEY);
    removeWebItem(REFRESH_TOKEN_KEY);
    return;
  }
  try {
    await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
  } catch (error) {
    console.warn('Error eliminando tokens en SecureStore:', error);
  }
}
