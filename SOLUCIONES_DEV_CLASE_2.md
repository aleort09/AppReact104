# 📘 Documentación de Soluciones — dev-clase-2 (RepoApp)

> **Rama:** `soluciondc2`  
> **Base:** `dev-clase-2` (`richie20502/react_native_102.git`)  
> **Fecha:** Noviembre 2026  
> **Estado:** 100% verificado (`tsc --noEmit` completado con 0 errores).

---

## 📋 Resumen General

En la rama `dev-clase-2` se identificaron y solucionaron **10 errores fundamentales en componentes de interfaz** (divididos entre `StudentCard.tsx`, `ErrorMessage.tsx` y `Loading.tsx`), junto con **errores de compilación y dependencias** que impedían la ejecución correcta de la aplicación.

---

## 🧩 PARTE 1: Errores en Componentes UI

### 📁 Archivo: `src/components/StudentCard.tsx`

#### 🔴 ERROR #1: Optimización de Renderizado (Performance)
* **Problema:** El componente se definía como una función estándar. En listas largas (100+ elementos), cada vez que el componente padre cambiaba cualquier estado, **todas las tarjetas se re-renderizaban innecesariamente**, provocando lag en el scroll y alto consumo de CPU.
* **Solución:** Envolver el componente con `React.memo` para evitar re-renderizados cuando las props (`student`, `onPress`) no cambian. Se asigna `displayName = 'StudentCard'` para depuración en React DevTools.
* **Antes:**
  ```tsx
  export default function StudentCard({ student, onPress }: StudentCardProps) { ... }
  ```
* **Después:**
  ```tsx
  const StudentCard = React.memo(({ student, onPress }: StudentCardProps) => { ... });
  StudentCard.displayName = 'StudentCard';
  export default StudentCard;
  ```

---

#### 🔴 ERROR #2: Accesibilidad en Componentes Interactivos (WCAG 2.1 AA)
* **Problema:** El `TouchableOpacity` carecía de propiedades de accesibilidad. Lectores de pantalla (TalkBack / VoiceOver) anunciaban únicamente "Touch this element", sin informar qué estudiante representaba la tarjeta.
* **Solución:** Incorporar atributos de accesibilidad estándar:
  ```tsx
  <TouchableOpacity
    style={styles.card}
    onPress={() => onPress?.(student)}
    activeOpacity={0.7}
    accessible={true}
    accessibilityRole="button"
    accessibilityLabel={`Estudiante ${student.nombre} ${student.apellido}`}
    accessibilityHint="Toca para ver los detalles del estudiante"
  >
  ```

---

#### 🔴 ERROR #3: Crash por Valores null / undefined en Cadenas (Runtime TypeError)
* **Problema:** Para calcular las iniciales del avatar se usaba `student.nombre.charAt(0)`. Si el backend respondía con `nombre: null` o `undefined`, la app colapsaba con `TypeError: Cannot read property 'charAt' of null`.
* **Solución:** Implementar optional chaining (`?.`) y operador de coalescencia nula / fallback:
  ```tsx
  {student.nombre?.charAt(0) || '?'}{student.apellido?.charAt(0) || '?'}
  ```

---

### 📁 Archivo: `src/components/ErrorMessage.tsx`

#### 🔴 ERROR #4: Validación Defensiva de Datos de Error
* **Problema:** Se asumía que `error` siempre era un objeto con propiedad `message` o un string. Ante errores de red donde `error` era `null`, `undefined` o `{}` vacío, producía crash inmediato al acceder a `error.message`.
* **Solución:** Validación defensiva con fallback:
  ```tsx
  const message = typeof error === 'string' 
    ? error 
    : error?.message || 'Error desconocido';
  ```

---

#### 🔴 ERROR #5: Stale Closure en Callbacks (`useCallback`)
* **Problema:** `handleRetry` se envolvía en `useCallback` con array de dependencias vacío `[]`. Si la función `onRetry` cambiaba entre renders (ej. paginación o nuevo endpoint), el callback ejecutaba la versión vieja capturada en el closure.
* **Solución:** Emplear `useRef` para mantener siempre la referencia más reciente sin forzar la recreación del callback:
  ```tsx
  const onRetryRef = useRef(onRetry);

  useEffect(() => {
    onRetryRef.current = onRetry;
  }, [onRetry]);

  const handleRetry = useCallback(() => {
    if (onRetryRef.current) {
      Alert.alert('Reintentar', '¿Deseas reintentar la operación?', [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Reintentar', onPress: () => onRetryRef.current?.() }
      ]);
    }
  }, []);
  ```

---

#### 🔴 ERROR #6: Dependencias Faltantes en Hooks
* **Problema:** Efectos y callbacks omitían variables externas en sus arreglos de dependencias, violando las reglas oficiales de React Hooks (`react-hooks/exhaustive-deps`).
* **Solución:** Resuelto mediante el patrón de refs estables o declarando explícitamente todas las dependencias requeridas.

---

#### 🔴 ERROR #7: Accesibilidad en Contenido No Textual (Emojis)
* **Problema:** Se renderizaban iconos o emojis directamente sin etiquetas de accesibilidad. Los lectores de pantalla no podían interpretar su significado o leían caracteres confusos.
* **Solución:** Agregar `accessible={true}` y `accessibilityLabel` descriptivo en los elementos visuales de error.

---

### 📁 Archivo: `src/components/Loading.tsx`

#### 🔴 ERROR #8: Memory Leak en Animaciones
* **Problema:** `Animated.timing` iniciaba la animación pero no retornaba una función de limpieza (*cleanup*). Si el usuario cambiaba de pantalla mientras animaba, se producía un memory leak y la advertencia: *"Can't perform a React state update on an unmounted component"*.
* **Solución:** Retornar `animation.stop()` en la función cleanup del `useEffect`:
  ```tsx
  useEffect(() => {
    const animation = Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    });

    animation.start();

    return () => {
      animation.stop();
    };
  }, [fadeAnim]);
  ```

---

#### 🔴 ERROR #9: `useNativeDriver: false` Innecesario
* **Problema:** Se usaba `useNativeDriver: false` para animar opacidad (`opacity`), forzando el cálculo en el hilo de JavaScript y causando pérdida de fotogramas (FPS drop).
* **Solución:** Cambiar a `useNativeDriver: true` ya que la opacidad está 100% soportada por el motor nativo de animación.

---

#### 🔴 ERROR #10: Orden Inválido de Hooks de React
* **Problema:** Se llamaba `useEffect` antes de la inicialización de `useRef`. React exige que los hooks se invoquen en el mismo orden exacto en cada render.
* **Solución:** Declarar `useRef` al inicio del componente y `useEffect` posteriormente.

---

## ⚙️ PARTE 2: Errores de Entorno y Compilación TypeScript

| # | Archivo | Causa Raíz | Solución Aplicada |
|---|---------|------------|-------------------|
| **E1** | `package.json` | `src/api/client.ts` y `src/utils/storage.ts` requerían `axios` y `expo-secure-store`, pero no estaban en las dependencias. | Se ejecutó `npm install axios expo-secure-store` y se registraron en `package.json`. |
| **E2** | `expo-env.d.ts` | TypeScript reportaba errores en `animated-icon.web.tsx` (`*.module.css`) y `theme.ts` (`@/global.css`) por falta de declaraciones de módulos CSS. | Se creó el archivo de declaraciones `expo-env.d.ts` con `declare module '*.module.css'` y `declare module '*.css'`. |

---

## ✅ Verificación de Calidad

Ejecución de TypeScript Compiler:
```bash
npx tsc --noEmit
# Resultado: 0 errores encontrados.
```
