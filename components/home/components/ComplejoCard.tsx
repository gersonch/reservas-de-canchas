import { IComplejo } from "@/common/types/compejo";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useLocationStore } from "@/store/useLocation";
import { Link } from "expo-router";
import { useState } from "react";
import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

interface ComplejoCardProps {
  complejo: IComplejo[];
  isLoading: boolean;
  ratings?: { complexId: string; rating: number }[];
}

export function ComplejoCard({
  complejo,
  isLoading,
  ratings = [],
}: ComplejoCardProps) {
  const city = useLocationStore((state) => state.city);
  const imagenReserva =
    "https://img.freepik.com/vector-premium/vector-icono-imagen-predeterminado-pagina-imagen-faltante-diseno-sitio-web-o-aplicacion-movil-no-hay-foto-disponible_87543-11093.jpg";

  const [numberOfItems, setNumberOfItems] = useState(10);

  // Convierte el array de ratings a un objeto para acceso rápido
  const ratingsMap = Object.fromEntries(
    ratings.map((r) => [r.complexId, r.rating])
  );

  const dataFilterdByCity = city
    ? complejo.filter((item) => {
        if (!item.region || !city) return false;
        const normalizedCity = item.region
          .normalize("NFD")
          .replace(/[ -\u036f]/g, "")
          .toLowerCase();
        const normalizedTargetCity = city
          .normalize("NFD")
          .replace(/[ -\u036f]/g, "")
          .toLowerCase();
        return normalizedCity === normalizedTargetCity;
      })
    : complejo;
  if (numberOfItems > dataFilterdByCity.length) {
    setNumberOfItems(dataFilterdByCity.length);
  }

  return (
    <View style={styles.container}>
      {isLoading
        ? // Renderiza el skeleton mientras se cargan los datos
          Array.from({ length: 3 }).map((_, index) => (
            <View key={index} style={styles.skeletonCard}>
              <View style={styles.skeletonImage} />
              <View style={styles.skeletonText} />
              <View style={styles.skeletonText} />
            </View>
          ))
        : dataFilterdByCity
            .map((item, index) => {
              const sourceImage = item.image_url?.[0]
                ? item.image_url?.[0]
                : imagenReserva;
              const rating = ratingsMap[item._id] ?? null;

              return (
                <Link
                  href={{
                    pathname: "/details/[id]",
                    params: { id: item._id },
                  }}
                  key={index}
                  style={styles.card}
                >
                  <Image
                    source={{ uri: sourceImage }}
                    style={styles.image}
                    resizeMode="cover"
                    // Oculta el skeleton cuando la imagen se carga
                  />
                  <View style={styles.cardContent}>
                    <View style={styles.textContainer}>
                      <Text style={styles.cardTitle}>{item.name}</Text>
                      <Text style={styles.cardSub}>
                        {item.address}, {item.city}
                      </Text>
                      <Text style={styles.cardSub}>{item.country}</Text>
                    </View>
                    <View style={styles.starsContainer}>
                      <IconSymbol
                        size={15}
                        name="star.fill"
                        color={
                          typeof rating === "number" && rating > 0
                            ? "#FFD700"
                            : "#DDD"
                        }
                      />
                      <Text style={styles.starsText}>
                        {typeof rating === "number" && !isNaN(rating)
                          ? rating.toFixed(1)
                          : "n.n"}
                      </Text>
                    </View>
                  </View>
                </Link>
              );
            })
            .slice(0, numberOfItems)}

      <Pressable
        onPress={() => setNumberOfItems((prev) => prev + 10)}
        style={{ marginTop: 20 }}
      >
        <Text style={{ color: "#007BFF" }}>Cargar más...</Text>
      </Pressable>
    </View>
  );
}

const screenWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  container: {
    paddingBottom: 16,
    width: "100%",
    flex: 1,
    alignItems: "center",
  },
  noDataText: {
    textAlign: "center",
    fontSize: 18,
    color: "#888",
  },
  card: {
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: "center",
    width: screenWidth, // en vez de hardcodear 100% o 380px
  },
  image: {
    width: screenWidth, // igual que la card
    height: 300,
    borderRadius: 15,
    marginBottom: 8,
  },
  cardContent: {
    flexDirection: "row", // Coloca el texto y las estrellas en una fila
    justifyContent: "space-between", // Distribuye los elementos a los extremos
    width: screenWidth,
  },
  textContainer: { marginTop: 8 },
  starsContainer: {
    marginTop: 8, // Espacio entre la imagen y las estrellas
    flexDirection: "row",
    alignItems: "flex-start", // <-- Esto alinea arriba el contenido
  },
  starsText: {
    marginLeft: 4, // Espaciado entre el ícono y el número
    fontSize: 14,
    color: "#666",
    // Elimina marginTop aquí
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    textAlign: "left", // Asegura que el texto esté alineado a la izquierda
  },
  cardSub: {
    fontSize: 14,
    color: "#666",
    textAlign: "left", // Asegura que el subtítulo esté alineado a la izquierda
  },
  skeletonCard: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    backgroundColor: "#e0e0e0",
    width: screenWidth - 50,
    justifyContent: "center",
    alignItems: "center",
  },
  skeletonImage: {
    width: screenWidth - 100,
    height: 300,
    borderRadius: 15,
    marginBottom: 8,
    backgroundColor: "#c0c0c0",
  },
  skeletonText: {
    height: 20,
    borderRadius: 4,
    marginBottom: 8,
    backgroundColor: "#c0c0c0",
  },
});
