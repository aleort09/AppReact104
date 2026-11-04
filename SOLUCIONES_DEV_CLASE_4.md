# 📘 Documentación de Soluciones — dev-clase-4 (RepoApp)

> **Rama:** `soluciondc4`  
> **Base:** `dev-clase-4` (commit `b8e7a18` *"Errores #11-20"*)  
> **Fecha:** Noviembre 2026  
> **Estado:** 100% verificado (`tsc --noEmit` completado con 0 errores).

---

## 📋 Resumen General

La rama `dev-clase-4` introduce una arquitectura completa con navegación por pestañas (`(tabs)`), componentes de búsqueda con debounce (`SearchBar.tsx`), manejo de estado global con `AuthContext.tsx`, `ErrorBoundary.tsx` y gestión de estudiantes (`studentService.ts`, `StudentList.tsx`, `StudentForm.tsx`).

Durante la revisión y prueba de compilación se identificaron y solucionaron **7 errores críticos de integración, tipado y ejecución**.

---

## 🛠️ Detalle de Soluciones Implementadas

### 1. `src/components/SearchBar.tsx` — Incompatibilidad de tipos en `NodeJS.Timeout`
* **Error:** `error TS2694: Namespace 'global.NodeJS' has no exported member 'Timeout'`.
* **Causa:** En React Native / Expo (y navegadores), `setTimeout` no siempre expone el namespace global de Node.js, lo que rompe la compilación estricta de TypeScript.
* **Solución:** Se reemplazó el tipo por `ReturnType<typeof setTimeout>` para máxima compatibilidad cross-platform:
  ```tsx
  // Antes
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Corregido
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  ```

---

### 2. `src/utils/storege.ts` — Archivo fantasma con error tipográfico
* **Error:** Existía un archivo vacío (0 bytes) `src/utils/storege.ts` comiteado por error.
* **Causa:** Confusión de nombre con el archivo real `storage.ts`.
* **Solución:** Se eliminó con `git rm src/utils/storege.ts` para mantener limpio el árbol de archivos.

---

### 3. `src/api/auth.api.ts` — Desalineación del contrato de Login y `/me` con la API
* **Error:** El hook `useAuth` y el `AuthContext` guardaban `response.token`, pero el backend (`RepoApi`) responde con `accessToken`. Asimismo, el endpoint `/api/auth/me` responde `{ data: { id, email } }` y no `{ user: ... }`.
* **Solución:** Se normalizó la respuesta en `auth.api.ts`:
  ```tsx
  export async function login(data: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<any>('/api/auth/login', data);
    const d = response.data;
    return {
      token: d.token || d.accessToken,
      refreshToken: d.refreshToken,
      user: d.user,
    };
  }

  export async function getCurrentUser(): Promise<User> {
    const response = await apiClient.get<any>('/api/auth/me');
    return response.data.data || response.data.user;
  }
  ```

---

### 4. `src/api/client.ts` — Renovación de token 401
* **Error:** Al refrescar el token en el interceptor, se extraía únicamente `response.data.token`.
* **Solución:** Se adaptó para admitir indistintamente `response.data.accessToken` o `response.data.token`.

---

### 5. `src/services/auth.service.tsx` e `index.tsx` — Persistencia y Enrutamiento a Tabs
* **Error:**
  - `loginService` validaba credenciales pero no persistía los tokens en `SecureStore`.
  - En `index.tsx`, tras iniciar sesión se llamaba a `router.replace("/home")`, pero `home` ya no es la ruta principal en el nuevo esquema de pestañas.
* **Solución:**
  - Se añadieron `saveAccessToken` y `saveRefreshToken` en `auth.service.tsx`.
  - Se redirige a la ruta principal de tabs `router.replace("/(tabs)" as any)` en `index.tsx`.

---

### 6. `src/services/studentService.ts` — Fallback defensivo para búsqueda (`/search`)
* **Error:** Al llamar a `studentService.search(query)`, el cliente hacía petición a `/api/students/search`. En Express, esa ruta coincidía con `/api/students/:id`, fallando con error HTTP 400 (`id debe ser un entero positivo`).
* **Solución:** Se implementó un fallback resiliente: si el backend no cuenta con endpoint `/search`, se obtienen los estudiantes con `getAll()` y se realiza el filtrado de búsqueda en el cliente por nombre, apellido, matrícula o correo.

---

### 7. `expo-env.d.ts` — Tipado de estilos CSS y CSS Modules
* **Error:** TS2307 por falta de tipos para `*.module.css` y `@/global.css`.
* **Solución:** Declaración global de módulos CSS en `expo-env.d.ts`.

---

## ✅ Verificación de Calidad

Ejecución de TypeScript Compiler:
```bash
npx tsc --noEmit
# Resultado: 0 errores encontrados en toda la aplicación.
```
