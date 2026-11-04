/**
 * API de autenticación
 * Funciones para login, registro, refresh token y logout
 */

import apiClient from './client';
import { User, UserMeResponse } from '../types/user';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  user: User;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  token: string;
  refreshToken: string;
}

/**
 * Inicia sesión con email y password
 * Retorna el token, refresh token y datos del usuario
 */
export async function login(data: LoginRequest): Promise<LoginResponse> {
  const response = await apiClient.post<any>('/api/auth/login', data);
  const d = response.data;
  return {
    token: d.token || d.accessToken,
    refreshToken: d.refreshToken,
    user: d.user,
  };
}

/**
 * Registra un nuevo usuario
 */
export async function register(data: RegisterRequest): Promise<{ user: User }> {
  const response = await apiClient.post<{ user: User }>('/api/auth/register', data);
  return response.data;
}

/**
 * Obtiene la información del usuario actual
 * Requiere token de autenticación
 */
export async function getCurrentUser(): Promise<User> {
  const response = await apiClient.get<any>('/api/auth/me');
  return response.data.data || response.data.user;
}

/**
 * Renueva el access token usando el refresh token
 */
export async function refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
  const response = await apiClient.post<RefreshTokenResponse>('/api/auth/refresh', { refreshToken });
  return response.data;
}

/**
 * Cierra sesión (revoca el token actual)
 */
export async function logout(): Promise<void> {
  await apiClient.post('/api/auth/logout');
}
