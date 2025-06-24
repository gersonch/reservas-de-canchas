import { IconSymbol } from "@/components/ui/IconSymbol"; // Asegúrate de importar el icono
import { useRouter } from "expo-router";
import { Platform, StyleSheet, TouchableOpacity } from "react-native";

export function BackButton() {
  const router = useRouter(); // Inicializa el router

  return (
    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
      <IconSymbol size={40} name="arrow.backward.circle.fill" color="#fff" />
    </TouchableOpacity>
  );
}

const isAndroid = Platform.OS === "android";
const backButtonBg = isAndroid ? "rgba(200,200,200,0.6)" : "transparent";

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 15,
    zIndex: 1,
    padding: 10,
    shadowColor: "#000", // Color de la sombra
    backgroundColor: backButtonBg,
    shadowOffset: { width: 0, height: 4 }, // Desplazamiento de la sombra (hacia abajo)
    borderRadius: 50, // Bordes redondeados
    shadowOpacity: 0.3, // Opacidad de la sombra
    shadowRadius: 5, // Radio de la sombra (difusión)
    elevation: 5, // Sombra en Android
  },
});
