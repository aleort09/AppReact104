import React, { useState } from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../context/ThemeContext';
import { useNotification } from '../context/NotificationContext';

export default function RegisterScreen() {
  const router = useRouter();
  const { register, loading } = useAuth();
  const { showSuccess, showError } = useNotification();
  const { colors } = useTheme();

  const [nombre, setNombre] = useState('');
  const [apellidoPaterno, setApellidoPaterno] = useState('');
  const [apellidoMaterno, setApellidoMaterno] = useState('');
  const [matricula, setMatricula] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = async () => {
    if (!nombre.trim() || !apellidoPaterno.trim() || !matricula.trim() || !email.trim() || !password || !confirmPassword) {
      showError('Error', 'Todos los campos obligatorios deben completarse');
      return;
    }

    if (password !== confirmPassword) {
      showError('Error', 'Las contraseñas no coinciden');
      return;
    }

    if (password.length < 6) {
      showError('Error', 'La contraseña debe tener al menos 6 caracteres');
      return;
    }

    const success = await register(email.trim(), password, {
      nombre: nombre.trim(),
      apellido_paterno: apellidoPaterno.trim(),
      apellido_materno: apellidoMaterno.trim() || undefined,
      matricula: matricula.trim(),
    });

    if (success) {
      showSuccess('Éxito', 'Alumno registrado correctamente');
      router.replace('/(tabs)' as any);
    } else {
      showError('Error al registrar', 'No se pudo crear la cuenta de alumno');
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.header}>
          <View style={[styles.iconCircle, { backgroundColor: colors.primary }]}>
            <FontAwesome name="graduation-cap" size={28} color="#FFFFFF" />
          </View>
          <Text style={[styles.title, { color: colors.text }]}>Registro de Alumno</Text>
          <Text style={[styles.subtitle, { color: colors.secondary }]}>
            Crea tu cuenta de estudiante para acceder a la plataforma
          </Text>
        </View>

        <Text style={[styles.label, { color: colors.secondary }]}>Nombre(s) *</Text>
        <View style={[styles.inputWrapper, { backgroundColor: colors.background, borderColor: colors.border }]}>
          <FontAwesome name="user" size={16} color={colors.secondary} style={styles.inputIcon} />
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder="Nombre"
            placeholderTextColor={colors.secondary}
            value={nombre}
            onChangeText={setNombre}
          />
        </View>

        <Text style={[styles.label, { color: colors.secondary }]}>Apellido Paterno *</Text>
        <View style={[styles.inputWrapper, { backgroundColor: colors.background, borderColor: colors.border }]}>
          <FontAwesome name="user" size={16} color={colors.secondary} style={styles.inputIcon} />
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder="Apellido Paterno"
            placeholderTextColor={colors.secondary}
            value={apellidoPaterno}
            onChangeText={setApellidoPaterno}
          />
        </View>

        <Text style={[styles.label, { color: colors.secondary }]}>Apellido Materno</Text>
        <View style={[styles.inputWrapper, { backgroundColor: colors.background, borderColor: colors.border }]}>
          <FontAwesome name="user" size={16} color={colors.secondary} style={styles.inputIcon} />
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder="Apellido Materno (opcional)"
            placeholderTextColor={colors.secondary}
            value={apellidoMaterno}
            onChangeText={setApellidoMaterno}
          />
        </View>

        <Text style={[styles.label, { color: colors.secondary }]}>Matrícula *</Text>
        <View style={[styles.inputWrapper, { backgroundColor: colors.background, borderColor: colors.border }]}>
          <FontAwesome name="id-card" size={16} color={colors.secondary} style={styles.inputIcon} />
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder="Ej. EST001"
            placeholderTextColor={colors.secondary}
            value={matricula}
            onChangeText={setMatricula}
            autoCapitalize="characters"
          />
        </View>

        <Text style={[styles.label, { color: colors.secondary }]}>Correo Electrónico *</Text>
        <View style={[styles.inputWrapper, { backgroundColor: colors.background, borderColor: colors.border }]}>
          <FontAwesome name="envelope" size={16} color={colors.secondary} style={styles.inputIcon} />
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder="alumno@ejemplo.com"
            placeholderTextColor={colors.secondary}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <Text style={[styles.label, { color: colors.secondary }]}>Contraseña *</Text>
        <View style={[styles.inputWrapper, { backgroundColor: colors.background, borderColor: colors.border }]}>
          <FontAwesome name="lock" size={16} color={colors.secondary} style={styles.inputIcon} />
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder="Mínimo 6 caracteres"
            placeholderTextColor={colors.secondary}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <Text style={[styles.label, { color: colors.secondary }]}>Confirmar Contraseña *</Text>
        <View style={[styles.inputWrapper, { backgroundColor: colors.background, borderColor: colors.border }]}>
          <FontAwesome name="lock" size={16} color={colors.secondary} style={styles.inputIcon} />
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder="Repite la contraseña"
            placeholderTextColor={colors.secondary}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary }, loading && styles.buttonDisabled]}
          onPress={handleRegister}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <View style={styles.buttonContent}>
              <FontAwesome name="user-plus" size={16} color="#FFFFFF" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Registrar Alumno</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/login' as any)}>
          <Text style={[styles.link, { color: colors.primary }]}>
            ¿Ya tienes cuenta? Inicia sesión aquí
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: '100%',
    maxWidth: 480,
    borderWidth: 1,
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: 4,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  link: {
    textAlign: 'center',
    marginTop: 18,
    fontSize: 14,
  },
});
