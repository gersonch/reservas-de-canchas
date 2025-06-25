import { useAuthStore } from "@/store/useAuthStore";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function Profile() {
  const { user, loading, logout } = useAuthStore();

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil</Text>
      <Text style={styles.welcome}>
        Bienvenido {user?.name || "Usuario Desconocido"}!
      </Text>
      {user?.email && <Text style={styles.email}>{user.email}</Text>}
      {user ? (
        <Pressable onPress={logout} style={styles.logoutButton}>
          <FontAwesome5 name="door-open" size={20} color="white" />
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </Pressable>
      ) : (
        <Text style={styles.loginMsg}>Inicia sesión para ver tu perfil.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 16,
  },
  welcome: {
    fontSize: 18,
    marginBottom: 8,
  },
  email: {
    fontSize: 16,
    color: "#555",
    marginBottom: 24,
  },
  logoutButton: {
    backgroundColor: "#E53935",
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  logoutIcon: {
    marginRight: 8,
  },
  logoutText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  loginMsg: {
    color: "#888",
    marginTop: 20,
  },
});
