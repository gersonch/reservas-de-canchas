import LocationComponent from "@/components/Location";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { fetchData } from "@/store/fetch"; // o tu función fetch centralizada
import { useComplexStore } from "@/store/useComplexStore"; // importa el store
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { ComplejoCard } from "../../../components/home/components/ComplejoCard";
import { SearchModal } from "../../../components/home/components/SearchModal";

type Complex = {
  _id: string;
};

export default function Home() {
  const isLoading = false;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const searchModalRef = useRef<{ openModal: () => void }>(null);
  const [refresh, setRefresh] = useState(false);

  // Obtén los complejos desde el store
  const complejos = useComplexStore((state) => state.complejos);
  const setComplejos = useComplexStore((state) => state.setComplejos);
  const [ratings, setRatings] = useState([]);

  // Move fetchComplejos outside useEffect so it can be reused
  const fetchComplejos = useCallback(async () => {
    try {
      const complexes = await fetchData("complexes");
      if (
        complexes &&
        complexes.data &&
        Array.isArray(complexes.data) &&
        complexes.data.length > 0
      ) {
        setComplejos(complexes.data);
        const ids = (complexes.data as Complex[]).map((c) => c._id).join(",");
        const ratingsRes = await fetchData(`rating?ids=${ids}`);
        setRatings(ratingsRes && ratingsRes.data ? ratingsRes.data : []);
      } else {
        console.warn("No complexes data available");
        setComplejos([]);
        setRatings([]);
      }
    } catch (error) {
      console.warn("Failed to fetch complejos or ratings:", error);
      // Asegurar que los estados tengan valores por defecto
      setComplejos([]);
      setRatings([]);
    }
  }, [setComplejos]);

  useEffect(() => {
    fetchComplejos();
  }, [fetchComplejos]);

  function handleSearchPressable() {
    if (searchModalRef.current) {
      searchModalRef.current.openModal();
    }
  }

  function handleRefresh() {
    setRefresh(true);

    fetchComplejos();
    setTimeout(() => {
      setRefresh(false);
    }, 1000); // Simula un delay para la actualización
  }
  return (
    <View style={styles.container}>
      {/* Cabecera con input */}
      <View style={styles.header}>
        <Pressable style={styles.input} onPress={handleSearchPressable}>
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
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1 }}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refresh} onRefresh={handleRefresh} />
            }
          >
            <SearchModal
              ref={searchModalRef}
              isModalOpen={isModalOpen}
              setIsModalOpen={setIsModalOpen}
            />

            {complejos.length === 0 ? (
              <Text>No hay complejos cargados</Text>
            ) : (
              <ComplejoCard
                complejo={complejos}
                isLoading={isLoading}
                ratings={ratings}
              />
            )}
          </ScrollView>
        </SafeAreaView>
      </SafeAreaProvider>
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
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingTop: 150,
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  modalCloseButton: {
    marginTop: 20,
    backgroundColor: "#333",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
});
