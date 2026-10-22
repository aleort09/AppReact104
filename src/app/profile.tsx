import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import MenuItem from "../components/MenuItem"; // Reutilizamos tu componente MenuItem
import { RootState, logout } from "../store/store";
import { removeStorage } from "../utils/authStorage";

export default function ProfileScreen() {
    const router = useRouter();
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.auth.user);

    const displayName = user?.nombre
        ? `${user.nombre} ${user.apellido}`.trim()
        : user?.email ? user.email.split("@")[0] : "Alumno";

    const initial = displayName.charAt(0).toUpperCase();

    const handleGoBack = () => {
        if (router.canGoBack()) {
            router.back();
        } else {
            router.replace("/home");
        }
    };

    const handleLogout = async () => {
        await removeStorage("user_token");
        await removeStorage("user_info");
        dispatch(logout());
        router.replace("/");
    };

    return (
        <View style={styles.container}>
            {/* Header con botón regresar */}
            <View style={styles.header}>
                <TouchableOpacity onPress={handleGoBack}>
                    <Text style={styles.back}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Mi Perfil</Text>
            </View>

            {/* Datos del Alumno */}
            <View style={styles.profile}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{initial}</Text>
                </View>
                <Text style={styles.name}>{displayName}</Text>
                <Text style={styles.email}>{user?.email || "Sin correo"}</Text>
                {user?.matricula ? (
                    <Text style={styles.matricula}>Matrícula: {user.matricula}</Text>
                ) : null}
            </View>

            {/* Opciones con MenuItem */}
            <View style={styles.options}>
                <MenuItem
                    title="Inicio"
                    icon="🏠"
                    onPress={() => router.replace("/home")}
                />

                <MenuItem
                    title="Mi Perfil"
                    icon="👤"
                    onPress={() => {}} // Ya estamos en Perfil
                />

                <MenuItem
                    title="Configuración"
                    icon="⚙️"
                    onPress={() => router.push("/settings")}
                />
            </View>

            <View style={styles.spacer} />

            {/* Cerrar sesión */}
            <TouchableOpacity
                style={styles.logout}
                onPress={handleLogout}
            >
                <Text style={styles.logoutIcon}>🚪</Text>
                <Text style={styles.logoutText}>Cerrar sesión</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#f0f9ff",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 30,
        marginBottom: 20,
    },
    back: {
        fontSize: 24,
        marginRight: 15,
        color: "#0f172a",
        padding: 4,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: "700",
        color: "#0f172a",
        letterSpacing: 0.5,
    },
    profile: {
        alignItems: "center",
        marginBottom: 35,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: "#3b82f6",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 16,
        borderWidth: 3,
        borderColor: "#bae6fd",
        shadowColor: "#0284c7",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 6,
    },
    avatarText: {
        fontSize: 42,
        fontWeight: "bold",
        color: "#ffffff",
    },
    name: {
        fontSize: 24,
        fontWeight: "800",
        color: "#0f172a",
        marginBottom: 6,
    },
    email: {
        fontSize: 15,
        color: "#64748b",
        marginBottom: 12,
    },
    matricula: {
        fontSize: 13,
        fontWeight: "700",
        color: "#0369a1",
        backgroundColor: "#e0f2fe",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        overflow: "hidden",
    },
    options: {
        backgroundColor: "#ffffff",
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 16,
        shadowColor: "#94a3b8",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 3,
    },
    spacer: {
        flex: 1,
    },
    logout: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fee2e2",
        paddingVertical: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#fecaca",
    },
    logoutIcon: {
        fontSize: 20,
        marginRight: 10,
    },
    logoutText: {
        fontSize: 16,
        color: "#ef4444",
        fontWeight: "700",
    },
});