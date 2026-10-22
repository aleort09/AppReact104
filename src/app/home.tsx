import { useRouter } from "expo-router";
import { useState } from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

import SideMenu from "../components/SideMenu";
import { RootState, logout } from "../store/store";
import { removeStorage } from "../utils/authStorage";

export default function HomeScreen() {
    const router = useRouter();
    const dispatch = useDispatch();
    const [menuOpen, setMenuOpen] = useState(false);

    // Leer usuario dinámico desde Redux
    const user = useSelector((state: RootState) => state.auth.user);

    // Nombre para mostrar en el saludo
    const firstName = user?.nombre
        ? user.nombre
        
        : user?.email ? user.email.split("@")[0] : "Usuario";

    const handleLogout = async () => {
        setMenuOpen(false);
        await removeStorage("user_token");
        await removeStorage("user_info");
        dispatch(logout());
        router.replace("/");
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => setMenuOpen(true)}>
                    <Text style={styles.menuIcon}>☰</Text>
                </TouchableOpacity>

                {/* Saludo dinámico con el nombre del estado global */}
                <Text style={styles.greeting}>
                    Hola, {firstName} 👋
                </Text>

                <TouchableOpacity onPress={() => router.push("/profile")}>
                    <Text style={styles.profile}>👤</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                <Text style={styles.title}>¡Bienvenido/a!</Text>
                <Text style={styles.subtitle}>
                    Nos alegra verte nuevamente.
                </Text>
            </View>

            <SideMenu
                visible={menuOpen}
                onClose={() => setMenuOpen(false)}
                onProfile={() => {
                    setMenuOpen(false);
                    router.push("/profile");
                }}
                onSettings={() => {
                    setMenuOpen(false);
                    router.push("/settings");
                }}
                onLogout={handleLogout}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f0f9ff",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        marginTop: 30,
        marginBottom: 20,
    },
    menuIcon: {
        fontSize: 24,
        color: "#0f172a",
        padding: 4,
    },
    greeting: {
        fontSize: 20,
        fontWeight: "700",
        color: "#0f172a",
        letterSpacing: 0.5,
    },
    profile: {
        fontSize: 24,
        padding: 4,
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    title: {
        fontSize: 28,
        fontWeight: "800",
        color: "#0f172a",
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: "#64748b",
        lineHeight: 24,
    },
});