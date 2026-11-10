# 📘 Documentación de Soluciones — dev-clase-2 (RepoApp)

> **Rama:** `soluciondc2`  
> **Base:** `dev-clase-2` (`richie20502/react_native_102.git`)  
> **Últimos commits integrados:** `8a106c9` (*resolver errores avanzados*) y `64fd148` (*contexts, navegación tabs, notificaciones y tema oscuro*)  
> **Fecha:** Noviembre 2026  
> **Estado:** 100% verificado (`tsc --noEmit` completado con 0 errores).

---

## 📋 Resumen General

En la rama `dev-clase-2` se integraron las soluciones a:
1. **Los 10 errores fundamentales en componentes de interfaz** (`StudentCard.tsx`, `ErrorMessage.tsx` y `Loading.tsx`).
2. **Los errores de dependencias y módulos CSS** (`axios`, `expo-secure-store`, `expo-env.d.ts`).
3. **Los nuevos errores introducidos en el último commit del profesor** (`ThemeContext`, `NotificationContext`, `CartContext`, navegación de pestañas `(tabs)`, tema oscuro y notificaciones toast/push).

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

## 🚀 PARTE 3: Errores del Nuevo Commit (`64fd148` & `8a106c9`) — Contexts, Tabs, Tema Oscuro y Notificaciones

### 1. `src/context/ThemeContext.tsx` — Dependencia Faltante y Error de Tipado
* **Error:** 
  - `error TS2307: Cannot find module '@react-native-async-storage/async-storage'`
  - `error TS2345: Argument of type 'ColorSchemeName' is not assignable to parameter of type 'SetStateAction<Theme>'. Type '"unspecified"' is not assignable.`
* **Causa:** El commit introdujo el uso de `AsyncStorage` sin instalarlo en `package.json`, y `useColorScheme()` puede retornar `'unspecified'`.
* **Solución:**
  1. Se instaló `@react-native-async-storage/async-storage` en `package.json`.
  2. Se añadió fallback isomórfico para Web (`window.localStorage`).
  3. Se validó estrictamente `systemColorScheme === 'dark' || systemColorScheme === 'light'`.

---

### 2. `src/components/SearchBar.tsx` — Incompatibilidad de tipos en `NodeJS.Timeout`
* **Error:** `error TS2694: Namespace 'NodeJS' has no exported member 'Timeout'`.
* **Causa:** `NodeJS.Timeout` no forma parte del entorno global de TypeScript en React Native / Expo.
* **Solución:** Reemplazado por `ReturnType<typeof setTimeout> | null`.

---

### 3. `src/app/(tabs)/_layout.tsx` — Incompatibilidad de `ColorValue` en `TabIconProps`
* **Error:** `error TS2322: Type 'ColorValue' is not assignable to type 'string'`.
* **Causa:** El callback `tabBarIcon` de React Navigation entrega `ColorValue` (que puede ser `OpaqueColorValue`), pero la interfaz exigía `string`.
* **Solución:**
  1. Se actualizó la interfaz con `color: ColorValue | string`.
  2. Se sustituyeron las letras estáticas ('H', 'P', 'U', 'S') por iconos emoji de alta legibilidad (`🏠`, `👥`, `👤`, `⚙️`).

---

### 4. `src/app/_layout.tsx` — Ausencia de Context Providers en el Árbol Raíz
* **Problema en ejecución:** Al usar `useTheme()`, `useNotification()`, `useCart()` o `useAuth()` en cualquier pantalla, la app colapsaba en runtime con:
  `Error: useTheme must be used within a ThemeProvider`.
* **Solución:** Se envolvió el árbol de navegación completo en `src/app/_layout.tsx`:
  ```tsx
  <ThemeProvider>
    <NotificationProvider>
      <CartProvider>
        <AuthProvider>
          <Stack screenOptions={{ headerShown: false }}>
            ...
          </Stack>
          <NotificationList />
        </AuthProvider>
      </CartProvider>
    </NotificationProvider>
  </ThemeProvider>
  ```
  Esto garantiza que cualquier componente acceda al tema, al carrito y a las notificaciones toast flotantes sin fallos.

---

### 5. `src/app/(tabs)/students.tsx` — Archivo Faltante en la Ruta de Pestañas
* **Problema:** `(tabs)/_layout.tsx` declaraba `<Tabs.Screen name="students" ... />`, pero el commit colocó `students.tsx` únicamente en `src/app/students.tsx` (raíz), dejando la pestaña rota al pulsar en el menú inferior.
* **Solución:** Se creó [`src/app/(tabs)/students.tsx`](file:///c:/xampp/htdocs/IDGS%20104/DesarrolloMovil/RepoApp/src/app/(tabs)/students.tsx), integrando:
  - Soporte de Tema Claro/Oscuro (`useTheme`).
  - Lista de estudiantes con filtrado y pull-to-refresh.
  - Vinculación con `CartContext` (`addItem`) para incrementar dinámicamente el badge rojo en la pestaña de estudiantes según los requisitos de la Clase 4.

---

### 6. `src/app/(tabs)/profile.tsx` y `settings.tsx` — Contenido Cortado por el TabBar
* **Problema:** En pantallas y navegadores web estándar, las secciones inferiores quedaban ocultas o no permitían scroll debido a la altura fija del `TabBar`.
* **Solución:**
  - Se configuró `contentContainerStyle={{ paddingBottom: 110 }}`.
  - En `profile.tsx` se añadió confirmación de cierre de sesión multiplataforma (`window.confirm` en Web / `Alert.alert` en Móvil).
  - En `settings.tsx` se sustituyeron los bordes estáticos `#E5E7EB` por `colors.border` para que luzcan bien en modo oscuro.

---

### 7. `src/context/NotificationContext.tsx` y `Notification.tsx` — Notificaciones Toast / Push
* **Mejoras implementadas:**
  - Se reordenó la declaración de `dismiss` antes de `show` dentro de `useCallback` para evitar variables no inicializadas.
  - Se reemplazó el método obsoleto `substr` por `substring`.
  - En `Notification.tsx` se agregaron animaciones fluidas con `Animated.timing` (opacidad y traslación vertical `translateY`) para que las notificaciones aparezcan y desaparezcan de manera atractiva.

---

### 8. `src/services/studentService.ts` — Resiliencia en Búsqueda (`/search`)
* **Problema:** En el backend Express, `/api/students/search` chocaba con la ruta parametrizada `/api/students/:id`.
* **Solución:** Se incorporó un bloque `try/catch`: si el endpoint `/search` falla, se ejecuta automáticamente un filtrado en cliente sobre `getAll()` comparando nombre, apellido, matrícula y correo.

---

### 9. Adaptación Global de Tema Oscuro en Listas e Inputs
* En `StudentList.tsx`, `index.tsx`, `login.tsx` y `register.tsx` se integraron las variables `colors.background`, `colors.card`, `colors.text` y `colors.border`, asegurando que al alternar el switch en **Ajustes** toda la interfaz cambie de color inmediatamente.

---

## ✅ Verificación de Calidad

Ejecución de TypeScript Compiler:
```bash
npx tsc --noEmit
# Resultado: 0 errores encontrados en toda la aplicación.
```
