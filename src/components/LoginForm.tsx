import { LoginFormProps } from "@/interfaces/auth.interface";
import { useState, useEffect, useRef } from "react";
import { Button, StyleSheet, Text, TextInput, View, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function LoginForm({
    onLogin,
    loading,
    error
}: LoginFormProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const mountedRef = useRef(true);
    const router = useRouter();

    useEffect(() => {
        return () => {
            mountedRef.current = false;
        };
    }, []);

    const handleLogin = async () => {
        onLogin(email, password);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Iniciar sesión</Text>

            <TextInput
                style={styles.input}
                placeholder="Correo electrónico o usuario"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
            />

            <TextInput
                style={styles.input}
                placeholder="Contraseña"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            {error !== "" && (
                <Text style={styles.error}>{error}</Text>
            )}

            <Button
                title={loading ? "Validando..." : "Iniciar sesión"}
                onPress={handleLogin}
                disabled={loading}
            />

            <TouchableOpacity 
                style={styles.registerLink}
                onPress={() => router.push('/register' as any)}
            >
                <Text style={styles.registerText}>
                    ¿No tienes cuenta? <Text style={styles.registerHighlight}>Regístrate aquí</Text>
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 30,
        color: "#111827",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 12,
        marginBottom: 15,
        backgroundColor: "#FFFFFF",
    },
    error: {
        color: "red",
        marginBottom: 15,
        textAlign: "center",
    },
    registerLink: {
        marginTop: 20,
        alignItems: "center",
        padding: 8,
    },
    registerText: {
        fontSize: 15,
        color: "#4B5563",
    },
    registerHighlight: {
        color: "#3B82F6",
        fontWeight: "600",
    },
});
