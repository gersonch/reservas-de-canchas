import LocationComponent from "@/components/Location";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { complejos } from "@/mockups/complejos";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { ComplejoCard } from "./components/ComplejoCard";
interface Complejo {
  id: number;
  name: string;
  country: string;
  city: string;
  address: string;
  stars: number | null;
  image_url: string;
}
export default function Home() {
  const isLoading = false; // Simula el estado de carga, puedes cambiarlo según tu lógica

  return (
    <View style={styles.container}>
      {/* Cabecera con input */}
      <View style={styles.header}>
        <Pressable
          style={styles.input}
          onPress={() => alert("Aquí se abrirá una sección de búsqueda")}
        >
          <View style={styles.iconTextContainer}>
            <IconSymbol size={20} name="magnifyingglass" color="black" />
            <Text style={styles.text}>Buscar complejo</Text>
          </View>
        </Pressable>
        <View style={styles.headerTextContainer}>
          <LocationComponent />
        </View>
      </View>

      {/* Contenido scrollable */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <ComplejoCard
          complejo={complejos.map((c) => ({
            ...c,
            id: Number(c.id),
            image_url: c.image_url === null ? "" : c.image_url,
          }))}
          isLoading={isLoading}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "#fff",
    width: "100%",
    paddingTop: 70,
    paddingBottom: 0,
    position: "relative",
  },
  input: {
    width: "90%",
    height: 60,
    borderWidth: 1,
    borderColor: "#D0D0D0",
    paddingHorizontal: 20,
    borderRadius: 30,
    alignSelf: "center",
    position: "absolute",
    top: 50,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    zIndex: 1,
  },
  iconTextContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    fontSize: 20,
    color: "black",
    marginLeft: 8,
  },
  headerTextContainer: {
    marginTop: 60,
    alignItems: "center",
    borderBottomColor: "rgba(0, 0, 0, 0.1)",
    borderBottomWidth: 1,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    paddingBottom: 10,
  },
  scrollView: {
    flex: 1,
    width: "100%",
  },
  scrollContent: {
    paddingBottom: 40,
    paddingTop: 10,
    alignItems: "center",
  },
});
