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
import Animated, {
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

interface ComplejoCardProps {
  complejo: IComplejo[];
  isLoading: boolean;
  ratings?: { complexId: string; rating: number }[];
}

const SkeletonItem = ({ style }: { style: any }) => {
  const opacity = useSharedValue(0.3);

  // Animación declarativa sin useEffect
  const animatedOpacity = useDerivedValue(() =>
    withRepeat(withTiming(1, { duration: 800 }), -1, true)
  );

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(animatedOpacity.value, [0.3, 1], [0.3, 1]),
  }));

  return <Animated.View style={[style, animatedStyle]} />;
};

const SkeletonCard = () => {
  return (
    <View style={styles.card}>
      <SkeletonItem style={styles.skeletonImage} />
      <View style={styles.cardContent}>
        <View style={styles.textContainer}>
          <SkeletonItem style={styles.skeletonTitle} />
          <SkeletonItem style={styles.skeletonSubtitle} />
          <SkeletonItem style={styles.skeletonCountry} />
        </View>
        <View style={styles.starsContainer}>
          <SkeletonItem style={styles.skeletonStar} />
          <SkeletonItem style={styles.skeletonRating} />
        </View>
      </View>
    </View>
  );
};

export function ComplejoCardSkeleton({
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
          .replace(/[ -\u036f]/g, "")
          .toLowerCase();
        const normalizedTargetCity = city
          .normalize("NFD")
          .replace(/[ -\u036f]/g, "")
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
            <SkeletonCard key={index} />
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

      {!isLoading && (
        <Pressable
          onPress={() => setNumberOfItems((prev) => prev + 10)}
          style={{ marginTop: 20 }}
        >
          <Text style={{ color: "#007BFF" }}>Cargar más...</Text>
        </Pressable>
      )}
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
    width: screenWidth,
  },
  image: {
    width: screenWidth - 24,
    height: 300,
    borderRadius: 15,
    marginBottom: 8,
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: screenWidth - 24,
    paddingHorizontal: 0,
  },
  textContainer: {
    marginTop: 8,
    flex: 1,
  },
  starsContainer: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  starsText: {
    marginLeft: 4,
    fontSize: 14,
    color: "#666",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    textAlign: "left",
  },
  cardSub: {
    fontSize: 14,
    color: "#666",
    textAlign: "left",
  },
  // Skeleton styles
  skeletonImage: {
    width: screenWidth - 24,
    height: 300,
    borderRadius: 15,
    marginBottom: 8,
    backgroundColor: "#e0e0e0",
  },
  skeletonTitle: {
    height: 22,
    width: "70%",
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    marginBottom: 6,
  },
  skeletonSubtitle: {
    height: 16,
    width: "85%",
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    marginBottom: 4,
  },
  skeletonCountry: {
    height: 16,
    width: "50%",
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
  },
  skeletonStar: {
    width: 15,
    height: 15,
    backgroundColor: "#e0e0e0",
    borderRadius: 7.5,
    marginRight: 4,
  },
  skeletonRating: {
    width: 30,
    height: 14,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
  },
});
