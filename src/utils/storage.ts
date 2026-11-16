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
 * Guarda el access token de forma segura (ignora valores undefined o nulos)
 */
export async function saveAccessToken(token: string): Promise<void> {
  if (!token || token === 'undefined' || token === 'null') {
    await removeAccessToken();
    return;
  }
  if (isWeb) {
    setWebItem(ACCESS_TOKEN_KEY, token);
    return;
  }
  try {
    await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token);
  } catch (error) {
    console.error('Error al guardar access token:', error);
  }
}

/**
 * Obtiene el access token almacenado (valida que no sea 'undefined')
 */
export async function getAccessToken(): Promise<string | null> {
  if (isWeb) {
    const val = getWebItem(ACCESS_TOKEN_KEY);
    return val && val !== 'undefined' && val !== 'null' ? val : null;
  }
  try {
    const val = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
    return val && val !== 'undefined' && val !== 'null' ? val : null;
  } catch (error) {
    return null;
  }
}

/**
 * Elimina el access token
 */
export async function removeAccessToken(): Promise<void> {
  if (isWeb) {
    removeWebItem(ACCESS_TOKEN_KEY);
    return;
  }
  try {
    await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
  } catch (error) {
    console.error('Error al eliminar access token:', error);
  }
}

/**
 * Guarda el refresh token de forma segura
 */
export async function saveRefreshToken(token: string): Promise<void> {
  if (!token || token === 'undefined' || token === 'null') {
    await removeRefreshToken();
    return;
  }
  if (isWeb) {
    setWebItem(REFRESH_TOKEN_KEY, token);
    return;
  }
  try {
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token);
  } catch (error) {
    console.error('Error al guardar refresh token:', error);
  }
}

/**
 * Obtiene el refresh token almacenado
 */
export async function getRefreshToken(): Promise<string | null> {
  if (isWeb) {
    const val = getWebItem(REFRESH_TOKEN_KEY);
    return val && val !== 'undefined' && val !== 'null' ? val : null;
  }
  try {
    const val = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
    return val && val !== 'undefined' && val !== 'null' ? val : null;
  } catch (error) {
    return null;
  }
}

/**
 * Elimina el refresh token
 */
export async function removeRefreshToken(): Promise<void> {
  if (isWeb) {
    removeWebItem(REFRESH_TOKEN_KEY);
    return;
  }
  try {
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
  } catch (error) {
    console.error('Error al eliminar refresh token:', error);
  }
}

/**
 * Limpia todos los tokens (logout)
 */
export async function clearTokens(): Promise<void> {
  await Promise.all([removeAccessToken(), removeRefreshToken()]);
}
