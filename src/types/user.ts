/**
 * Tipos para el módulo de usuario
 * Unificado para dev-clase-2, dev-clase-4 y dev-clase-6
 */

export interface User {
  id: number;
  email: string;
  nombre?: string;
  apellido_paterno?: string;
  apellido_materno?: string | null;
  rol_id?: number;
  rol_nombre?: string;
}

export interface UserMeResponse {
  data: User;
  user?: User;
}

export interface UpdateUserData {
  nombre?: string;
  apellido_paterno?: string;
  apellido_materno?: string | null;
  email?: string;
  rol_id?: number;
}
