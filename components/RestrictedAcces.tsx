import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export function RestrictedAccess() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>¡Acceso restringido! 🥲</Text>
      <Text style={styles.subtitle}>
        Inicia sesión para acceder a esta sección
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          router.push("/(tabs)/(login)");
        }}
      >
        <Text style={styles.buttonText}>Iniciar sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    padding: 24,
  },
  image: {
    width: 120,
    height: 120,
    marginBottom: 24,
    opacity: 0.8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#444",
    marginBottom: 24,
    textAlign: "center",
  },
  button: {
    backgroundColor: "green",
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
