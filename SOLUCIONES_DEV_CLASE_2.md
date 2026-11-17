# 📘 Documentación de Soluciones — dev-clase-2 (RepoApp)

> **Rama:** `soluciondc2`  
> **Base unificada:** `dev-clase-2`, `dev-clase-4` y `dev-clase-6` (`richie20502/react_native_102.git`)  
> **Fecha:** Noviembre 2026  
> **Estado:** 100% verificado (`tsc --noEmit` completado con 0 errores).

---

## 📋 Resumen General

En la rama `soluciondc2` se consolidaron y armonizaron todos los desarrollos de **dev-clase-2**, **dev-clase-4** y **dev-clase-6**:
1. **Los 10 errores fundamentales en componentes de interfaz** (`StudentCard.tsx`, `ErrorMessage.tsx` y `Loading.tsx`).
2. **Los errores de dependencias y módulos CSS** (`axios`, `expo-secure-store`, `expo-env.d.ts`).
3. **Los contextos de estado global** (`ThemeContext`, `NotificationContext`, `CartContext`, `AuthContext`).
4. **La pantalla interactiva de Carrito** (`(tabs)/cart.tsx`) conectada a `CartContext` con badge dinámico, sumas automáticas y checkout.
5. **La pantalla de Detalle de Alumno** (`src/app/student/[id].tsx`, de `dev-clase-4`) y registro de nuevo alumno (`student/create.tsx`).
6. **La edición de Perfil de Alumno** (`(tabs)/profile.tsx`, de `dev-clase-6`) con persistencia en `AuthContext.updateUser`.
7. **El rediseño visual moderno y modo oscuro global** en todas las pantallas y tarjetas.

---

## 🧩 PARTE 1: Errores en Componentes UI (Iniciales)

### 📁 Archivo: `src/components/StudentCard.tsx`

#### 🔴 ERROR #1: Optimización de Renderizado (Performance)
* **Problema:** En listas largas, cada cambio en el padre re-renderizaba todas las tarjetas.
* **Solución:** Envolver con `React.memo` y asignar `displayName = 'StudentCard'`.

#### 🔴 ERROR #2: Accesibilidad en Componentes Interactivos (WCAG 2.1 AA)
* **Problema:** `TouchableOpacity` carecía de etiquetas de accesibilidad para lectores de pantalla.
* **Solución:** Incorporar `accessible={true}`, `accessibilityRole="button"`, `accessibilityLabel` y `accessibilityHint`.

#### 🔴 ERROR #3: Crash por Valores null / undefined en Cadenas (Runtime TypeError)
* **Problema:** `student.nombre.charAt(0)` colapsaba con `TypeError: Cannot read property 'charAt' of null`.
* **Solución:** Incorporar optional chaining y coalescencia nula: `{student.nombre?.charAt(0) || '?'}`.

#### 🔴 ERROR #4: Manejo de Texto Largo (Overflow / Ellipsis)
* **Problema:** Nombres o emails largos rompían la maquetación.
* **Solución:** Añadir `numberOfLines={1}` y `ellipsizeMode="tail"`.

#### 🔴 ERROR #5: Feedback Táctil Inconsistente (UX)
* **Problema:** Opacidad por defecto demasiado brusca en interacciones táctiles.
* **Solución:** Configurar `activeOpacity={0.7}`.

---

### 📁 Archivo: `src/components/ErrorMessage.tsx`

#### 🔴 ERROR #6: Desestructuración Insegura de Objetos de Error
* **Problema:** Asumir que `error` siempre era string provocaba crash si se pasaba un objeto `Error` o `AxiosError`.
* **Solución:** Función normalizadora `getErrorMessage(error)` para extraer mensajes de `Error`, objetos API o strings.

#### 🔴 ERROR #7: Dependencias Faltantes en `useEffect` (Infinite Loop / Stale Closures)
* **Problema:** Omitir dependencias en hooks de animación.
* **Solución:** Incluir todas las referencias requeridas en el arreglo de dependencias.

---

### 📁 Archivo: `src/components/Loading.tsx`

#### 🔴 ERROR #8: Memory Leaks por Animaciones no Limpiadas
* **Problema:** Animaciones en loop continuo seguían ejecutándose tras desmontar el componente.
* **Solución:** Retornar función de limpieza `animation.stop()` en el return de `useEffect`.

#### 🔴 ERROR #9: `useNativeDriver: false` Innecesario
* **Problema:** Animar opacidad por software en lugar de aceleración por hardware.
* **Solución:** Configurar `useNativeDriver: true`.

#### 🔴 ERROR #10: Orden Inválido de Hooks de React
* **Problema:** Declarar `useEffect` antes de `useRef`.
* **Solución:** Mantener siempre `useRef` primero y `useEffect` después.

---

## ⚙️ PARTE 2: Errores de Entorno y Compilación TypeScript

| # | Archivo | Causa Raíz | Solución Aplicada |
|---|---------|------------|-------------------|
| **E1** | `package.json` | `src/api/client.ts` y `src/utils/storage.ts` requerían `axios` y `expo-secure-store`. | Se ejecutó `npm install axios expo-secure-store` y se registraron en `package.json`. |
| **E2** | `expo-env.d.ts` | TS2307 por falta de tipos para `*.module.css` y `@/global.css`. | Se creó el archivo de declaraciones `expo-env.d.ts`. |

---

## 🚀 PARTE 3: Errores de Contexts, Tabs y Autenticación

### 1. `src/context/ThemeContext.tsx` — Dependencia Faltante y Error de Tipado
* **Error:** Falta de `@react-native-async-storage/async-storage` y error TS2345 con `systemColorScheme`.
* **Solución:** Se instaló `@react-native-async-storage/async-storage`, se añadió fallback isomórfico para Web (`window.localStorage`) y se condicionó `systemColorScheme === 'dark' || systemColorScheme === 'light'`.

### 2. `src/components/SearchBar.tsx` — Incompatibilidad de tipos en `NodeJS.Timeout`
* **Solución:** Reemplazado por `ReturnType<typeof setTimeout> | null`.

### 3. `src/app/_layout.tsx` — Envoltura Global de Providers
* **Solución:** Se proveyó el árbol completo con `ThemeProvider`, `NotificationProvider`, `CartProvider`, `AuthProvider` y montaje de `<NotificationList />`.

### 4. `src/utils/storage.ts` & `src/api/auth.api.ts` — Desalineación `token` vs `accessToken`
* **Problema:** En el backend Express se responde `accessToken`, pero el frontend leía `response.token`, guardando literalmente `"undefined"` en `localStorage`.
* **Solución:** Normalización en `auth.api.ts` (`d.accessToken || d.token`), filtro en `storage.ts` para descartar `'undefined'` y reenvío limpio de cabeceras en `client.ts`.

### 5. `src/app/login.tsx` & `src/app/register.tsx` — Pérdida Inmediata de Foco en Inputs
* **Problema:** `TouchableWithoutFeedback onPress={Keyboard.dismiss}` en React Native Web ejecutaba `document.activeElement.blur()`, quitándole el foco al input de inmediato al hacer clic.
* **Solución:** Eliminación del wrapper `TouchableWithoutFeedback`, permitiendo hacer clic y escribir normalmente.

---

## 🌟 PARTE 4: Unificación Total de `dev-clase-2`, `dev-clase-4` y `dev-clase-6`

### 1. 🛒 Pantalla Completa de Carrito (`src/app/(tabs)/cart.tsx`)
* Se creó la pestaña interactiva **Carrito**:
  - Lista dinámica de elementos agregados desde Estudiantes o Detalle.
  - Botones `+` y `−` para modificar cantidad en tiempo real.
  - Botón de eliminación individual (`🗑️`) y vaciado general (`clearCart`).
  - Cálculo automático de totales (`$150.00 MXN`).
  - Botón de checkout con confirmación multiplataforma y feedback con notificaciones toast.
  - Badge dinámico en el TabBar (`tabBarBadge: itemCount > 0 ? itemCount : undefined`) en color rojo.

### 2. 👨‍🎓 Pantalla de Detalle de Alumno (`src/app/student/[id].tsx`, de `dev-clase-4`)
* Traída e integrada con el diseño actual:
  - Tarjeta de presentación con iniciales automáticas y matrícula.
  - Datos de contacto y fechas de registro formateadas.
  - Botón **"🛒 Añadir al Carrito"** conectado directamente a `useCart().addItem`.
  - Botón de eliminación con confirmación (`studentService.delete(id)`).

### 3. ➕ Registro de Alumno en Base de Datos (`src/app/student/create.tsx`)
* Formulario para dar de alta nuevos estudiantes (`StudentForm.tsx`) con validación de campos, guardado inmediato en `RepoApi` y notificación de confirmación.

### 4. ✏️ Edición de Perfil de Alumno (de `dev-clase-6`)
* En `src/app/(tabs)/profile.tsx`:
  - Modo edición (`isEditing`) para actualizar `nombre`, `apellido_paterno` y `apellido_materno`.
  - Integrado con `useAuthContext().updateUser` y `apiClient.put`.
  - Badge de rol de usuario ("Alumno" / "Administrador").

### 5. 🎨 Rediseño Visual Moderno & Modo Oscuro Global
* Las 5 pestañas del TabBar (`Inicio`, `Estudiantes`, `Carrito`, `Perfil`, `Ajustes`) cuentan con navegación uniforme:
  - Tarjetas redondeadas (`borderRadius: 16`), sombras sutiles y bordes adaptables a modo oscuro (`colors.border`).
  - Margen inferior de seguridad (`paddingBottom: 110`) en todos los scroll views para que ninguna tarjeta quede tapada por el menú inferior.
  - Soporte completo de tema oscuro en componentes, inputs, tarjetas y listas.

---

## ✅ Verificación de Calidad

Ejecución de TypeScript Compiler:
```bash
npx tsc --noEmit
# Resultado: 0 errores encontrados en toda la aplicación.
```
