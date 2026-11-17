/**
 * Hook de autenticación conectado al AuthContext global
 * Compatible con dev-clase-2, dev-clase-4 y dev-clase-6
 */

import { useAuthContext, AuthContextType } from '../context/AuthContext';

export function useAuth(): AuthContextType {
  return useAuthContext();
}
