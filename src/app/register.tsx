import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../hooks/useAuth';
import { Loading, ErrorMessage } from '../components';
import { createStudent } from '../api/students.api';

export default function RegisterScreen() {
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    matricula: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [registering, setRegistering] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const { login } = useAuth();
  const router = useRouter();

  const updateForm = (key: string, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleRegister = async () => {
    setFormError(null);

    if (!form.nombre.trim() || !form.apellido.trim() || !form.matricula.trim() || 
        !form.email.trim() || !form.password) {
      setFormError('Por favor completa todos los campos');
      return;
    }

    if (form.password.length < 6) {
      setFormError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setFormError('Las contraseñas no coinciden');
      return;
    }

    setRegistering(true);
    try {
      // Registrar el estudiante en la API
      await createStudent({
        nombre: form.nombre.trim(),
        apellido: form.apellido.trim(),
        matricula: form.matricula.trim(),
        email: form.email.trim(),
        password: form.password,
      } as any);

      // Iniciar sesión automáticamente
      const logged = await login(form.email.trim(), form.password);
      if (logged) {
        Alert.alert('¡Éxito!', 'Cuenta creada correctamente');
        router.replace('/(tabs)' as any);
      } else {
        router.replace('/' as any);
      }
    } catch (err: any) {
      const msg = err?.response?.data?.error || err?.message || 'Error al crear la cuenta';
      setFormError(msg);
    } finally {
      setRegistering(false);
    }
  };

  if (registering) {
    return <Loading message="Creando cuenta..." />;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Crear Cuenta</Text>
          <Text style={styles.subtitle}>Completa tus datos para registrarte</Text>
        </View>

        {formError && (
          <ErrorMessage error={formError} />
        )}

        <View style={styles.form}>
          <View style={styles.row}>
            <View style={[styles.inputContainer, styles.half]}>
              <Text style={styles.label}>Nombre</Text>
              <TextInput
                style={styles.input}
                placeholder="Juan"
                value={form.nombre}
                onChangeText={(v) => updateForm('nombre', v)}
              />
            </View>

            <View style={[styles.inputContainer, styles.half]}>
              <Text style={styles.label}>Apellido</Text>
              <TextInput
                style={styles.input}
                placeholder="Pérez"
                value={form.apellido}
                onChangeText={(v) => updateForm('apellido', v)}
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Matrícula</Text>
            <TextInput
              style={styles.input}
              placeholder="A00123456"
              value={form.matricula}
              onChangeText={(v) => updateForm('matricula', v)}
              autoCapitalize="characters"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="tu@email.com"
              value={form.email}
              onChangeText={(v) => updateForm('email', v)}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Contraseña</Text>
            <TextInput
              style={styles.input}
              placeholder="Mínimo 6 caracteres"
              value={form.password}
              onChangeText={(v) => updateForm('password', v)}
              secureTextEntry
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirmar Contraseña</Text>
            <TextInput
              style={styles.input}
              placeholder="Repite tu contraseña"
              value={form.confirmPassword}
              onChangeText={(v) => updateForm('confirmPassword', v)}
              secureTextEntry
            />
          </View>

          <TouchableOpacity 
            style={styles.button} 
            onPress={handleRegister}
            disabled={registering}
          >
            <Text style={styles.buttonText}>Crear Cuenta</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.linkButton}
            onPress={() => router.back()}
          >
            <Text style={styles.linkText}>
              ¿Ya tienes cuenta? Inicia sesión
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
  },
  header: {
    marginTop: 20,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3B82F6',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 6,
  },
  form: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  half: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    backgroundColor: '#F9FAFB',
  },
  button: {
    backgroundColor: '#3B82F6',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
  linkButton: {
    marginTop: 18,
    alignItems: 'center',
  },
  linkText: {
    color: '#3B82F6',
    fontSize: 15,
  },
});
