import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";

import { useRouter } from "expo-router";

export default function SettingsScreen() {

    const router = useRouter();

    const handleLogout = () => {
        router.replace("/");
    };

    return (
        <View style={styles.container}>

            <View style={styles.header}>

                <TouchableOpacity
                    onPress={() => router.back()}
                >
                    <Text style={styles.back}>
                        ←
                    </Text>
                </TouchableOpacity>

                <Text style={styles.headerTitle}>
                    Configuración
                </Text>

            </View>

            <View style={styles.options}>
                <Text>ⓘ  Información de la app</Text>
                <Text>⚙  Preferencias</Text>
                <Text>🔔  Notificaciones</Text>
                <Text>🔒  Privacidad</Text>
                <Text>❓  Ayuda y soporte</Text>
            </View>

            <TouchableOpacity
                style={styles.logout}
                onPress={handleLogout}
            >
                <Text>🚪  Cerrar sesión</Text>
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
        marginBottom: 30,
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
    options: {
        backgroundColor: "#ffffff",
        borderRadius: 20,
        paddingVertical: 20,
        paddingHorizontal: 20,
        shadowColor: "#94a3b8",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 3,
        marginBottom: 30,
        gap: 16,
    },
    logout: {
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fee2e2",
        paddingVertical: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#fecaca",
    },
});