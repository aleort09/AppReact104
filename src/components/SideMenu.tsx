import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { useSelector } from "react-redux";

import { SideMenuProps } from "../interfaces/menu.interface";
import { RootState } from "../store/store";
import MenuItem from "./MenuItem";

export default function SideMenu({
    visible,
    onClose,
    onProfile,
    onSettings,
    onLogout
}: SideMenuProps) {

    // Obtener usuario del estado global de Redux
    const user = useSelector((state: RootState) => state.auth.user);

    if (!visible) {
        return null;
    }

    // Calcular el nombre completo o email por defecto
    const displayName = user?.nombre
        ? `${user.nombre} ${user.apellido}`.trim()
        : user?.email ? user.email.split("@")[0] : "Alumno";

    const initial = displayName.charAt(0).toUpperCase();

    return (
        <View style={styles.overlay}>

            {/* MENÚ LATERAL */}
            <View style={styles.menu}>

                {/* INFORMACIÓN DEL USUARIO */}
                <View style={styles.userContainer}>

                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>
                            {initial}
                        </Text>
                    </View>

                    <Text style={styles.name}>
                        {displayName}
                    </Text>

                    <Text style={styles.email}>
                        {user?.email || "Sin correo"}
                    </Text>

                </View>

                {/* OPCIÓN INICIO */}
                <MenuItem
                    title="Inicio"
                    icon="🏠"
                    onPress={onClose}
                />

                {/* OPCIÓN PERFIL */}
                <MenuItem
                    title="Mi Perfil"
                    icon="👤"
                    onPress={onProfile}
                />

                {/* OPCIÓN CONFIGURACIÓN */}
                <MenuItem
                    title="Configuración"
                    icon="⚙️"
                    onPress={onSettings}
                />

                {/* ESPACIO */}
                <View style={styles.spacer} />

                {/* CERRAR SESIÓN */}
                <TouchableOpacity
                    style={styles.logout}
                    onPress={onLogout}
                >

                    <Text style={styles.logoutIcon}>
                        🚪
                    </Text>

                    <Text style={styles.logoutText}>
                        Cerrar sesión
                    </Text>

                </TouchableOpacity>

            </View>

            <TouchableOpacity
                style={styles.background}
                onPress={onClose}
            />

        </View>
    );
}

const styles = StyleSheet.create({
    overlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        flexDirection: "row",
        zIndex: 1000,
    },
    menu: {
        width: "80%",
        height: "100%",
        backgroundColor: "#ffffff",
        paddingTop: 60,
        paddingBottom: 20,
        elevation: 10,
        shadowColor: "#0f172a",
        shadowOffset: { width: 2, height: 0 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
    },
    userContainer: {
        paddingHorizontal: 20,
        paddingBottom: 25,
        borderBottomWidth: 1,
        borderBottomColor: "#f1f5f9",
        alignItems: "center",
        marginBottom: 15,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
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
        color: "#ffffff",
        fontSize: 32,
        fontWeight: "bold",
    },
    name: {
        fontSize: 20,
        fontWeight: "800",
        color: "#0f172a",
        marginBottom: 4,
    },
    email: {
        fontSize: 14,
        color: "#64748b",
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
        marginHorizontal: 20,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#fecaca",
        marginBottom: 10,
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
    background: {
        flex: 1,
        backgroundColor: "rgba(15, 23, 42, 0.4)",
    },
});