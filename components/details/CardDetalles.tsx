import { IComplejo } from "@/common/types/compejo";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { API_URL } from "@/constants/api-url";
import api from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export function CardDetalles({ item, param }: { item: IComplejo; param: any }) {
  const imagenReserva =
    "https://img.freepik.com/vector-premium/vector-icono-imagen-predeterminado-pagina-imagen-faltante-diseno-sitio-web-o-aplicacion-movil-no-hay-foto-disponible_87543-11093.jpg";

  const [rating, setRating] = useState<number>(0);
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuthStore();
  const [numberOfStars, setNumberOfStars] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const stars = Array.from({ length: 5 }, (_, index) => index + 1);

  useEffect(() => {
    const fetchRatingForComplex = async () => {
      try {
        const response = await api.get(`${API_URL}/rating?ids=${param}`);
        if (Array.isArray(response.data) && response.data.length > 0) {
          setNumberOfStars(response.data[0].rating);
        } else {
          setNumberOfStars(null);
        }
      } catch (error) {
        setNumberOfStars(null);
        console.error("Error fetching rating for complex:", error);
      }
    };
    fetchRatingForComplex();
  }, [param]);

  const handleSubmitRating = async () => {
    setSubmitting(true);
    try {
      await api.post(`${API_URL}/rating/${param}`, {
        stars: rating,
      });
      Alert.alert("¡Gracias!", `Calificación enviada: ${rating}`);
      setRating(0); // limpiar input
    } catch {
      if (!user) {
        Alert.alert(
          "¡Ups! 😐",
          "Debes iniciar sesión para enviar una calificación."
        );
        return;
      }
      Alert.alert("Error", "No se pudo enviar la calificación.");
      return;
    } finally {
      setSubmitting(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);

    try {
      const response = await api.get(`${API_URL}/rating?ids=${param}`);
      if (Array.isArray(response.data) && response.data.length > 0) {
        setNumberOfStars(response.data[0].rating);
      } else {
        setNumberOfStars(null);
      }
    } catch (error) {
      console.error("Error al refrescar:", error);
    }

    // Simular una espera (por ejemplo 1s)
    setTimeout(() => {
      setRefreshing(false); // 👈 IMPORTANTE: detener el refresco
    }, 5000);
  };

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.card}>
        {/* Imagen en la parte superior */}
        <Image
          source={{
            uri: item.image_url === null ? imagenReserva : item.image_url[1],
          }}
          style={styles.image}
        />

        <View style={styles.textContainer}>
          {/* Título */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text style={styles.title}>{item.name}</Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <IconSymbol
                size={15}
                name="star.fill"
                color={"#FFD700"}
                style={{ marginRight: 4 }}
              />
              <Text style={styles.ratingText}>
                {numberOfStars === null
                  ? "No calificado"
                  : numberOfStars.toFixed(1)}
              </Text>
            </View>
          </View>

          {/* Dirección */}
          <Pressable style={styles.text}>
            <Text>
              Dirección:{" "}
              <Text
                style={{
                  color: "#555", // azul moderno
                  textDecorationLine: "underline",
                  fontSize: 14, // o lo que uses para detalles
                  fontWeight: "500",
                }}
              >
                {item.city}
              </Text>
            </Text>
          </Pressable>
          <Text style={{ marginTop: 10, fontWeight: "bold", fontSize: 20 }}>
            Reservar
          </Text>

          {/* Input para calificación */}
          <View style={{ width: 300, marginBottom: 18 }}>
            <Text style={{ marginBottom: 8, fontWeight: "bold" }}>
              Califica (1 a 5):
            </Text>
            <TextInput
              style={[styles.input, { width: 80, textAlign: "center" }]}
              keyboardType="numeric"
              maxLength={1}
              placeholder="1-5"
              value={rating ? String(rating) : ""}
              onChangeText={(text) => {
                const num = Number(text);
                if (num >= 1 && num <= 5) setRating(num);
                else if (text === "") setRating(0);
              }}
            />
            <Pressable
              style={[
                {
                  backgroundColor:
                    rating >= 1 && rating <= 5 ? "#4CAF50" : "#ccc",
                  paddingVertical: 10,
                  borderRadius: 6,
                  marginTop: 10,
                  alignItems: "center",
                  opacity: submitting ? 0.7 : 1,
                },
              ]}
              onPress={handleSubmitRating}
              disabled={submitting || !(rating >= 1 && rating <= 5)}
            >
              <Text style={{ color: "#fff", fontWeight: "bold" }}>
                {submitting ? "Enviando..." : "Enviar calificación"}
              </Text>
            </Pressable>
          </View>

          <View style={styles.rating}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {stars.map((star, index) => {
                return (
                  <Pressable
                    key={index}
                    onPress={() => alert(index + 1)}
                    style={{ marginRight: 2, display: "flex" }}
                  >
                    <IconSymbol size={35} name={"star"} color={"#FFD700"} />
                  </Pressable>
                );
              })}
            </View>
          </View>
          <Text style={{ marginTop: 4, marginLeft: 4 }}>¡Califícanos!</Text>

          {/* Instalaciones y equipamiento */}
          <View style={{ marginTop: 16 }}>
            <Text style={{ fontWeight: "bold", fontSize: 16, marginBottom: 6 }}>
              Instalaciones:
            </Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
              {/* Facilities */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginRight: 12,
                }}
              >
                <FontAwesome
                  name="glass"
                  size={24}
                  color={item.facilities?.bar ? "#4CAF50" : "#ccc"}
                />
                <Text
                  style={{
                    marginLeft: 4,
                    color: item.facilities?.bar ? "#222" : "#ccc",
                    textDecorationLine: item.facilities?.bar
                      ? "none"
                      : "line-through",
                  }}
                >
                  Bar
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginRight: 12,
                }}
              >
                <MaterialIcons
                  name="checkroom"
                  size={24}
                  color={item.facilities?.changingRooms ? "#4CAF50" : "#ccc"}
                />
                <Text
                  style={{
                    marginLeft: 4,
                    color: item.facilities?.changingRooms ? "#222" : "#ccc",
                    textDecorationLine: item.facilities?.changingRooms
                      ? "none"
                      : "line-through",
                  }}
                >
                  Camarines
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginRight: 12,
                }}
              >
                <FontAwesome
                  name="car"
                  size={24}
                  color={item.facilities?.parking ? "#4CAF50" : "#ccc"}
                />
                <Text
                  style={{
                    marginLeft: 4,
                    color: item.facilities?.parking ? "#222" : "#ccc",
                    textDecorationLine: item.facilities?.parking
                      ? "none"
                      : "line-through",
                  }}
                >
                  Estacionamiento
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginRight: 12,
                }}
              >
                <MaterialIcons
                  name="restaurant"
                  size={24}
                  color={item.facilities?.restaurant ? "#4CAF50" : "#ccc"}
                />
                <Text
                  style={{
                    marginLeft: 4,
                    color: item.facilities?.restaurant ? "#222" : "#ccc",
                    textDecorationLine: item.facilities?.restaurant
                      ? "none"
                      : "line-through",
                  }}
                >
                  Restaurante
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginRight: 12,
                }}
              >
                <FontAwesome
                  name="shower"
                  size={24}
                  color={item.facilities?.showers ? "#4CAF50" : "#ccc"}
                />
                <Text
                  style={{
                    marginLeft: 4,
                    color: item.facilities?.showers ? "#222" : "#ccc",
                    textDecorationLine: item.facilities?.showers
                      ? "none"
                      : "line-through",
                  }}
                >
                  Duchas
                </Text>
              </View>
            </View>
          </View>
          <View style={{ marginTop: 16 }}>
            <Text style={{ fontWeight: "bold", fontSize: 16, marginBottom: 6 }}>
              Equipamiento:
            </Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginRight: 12,
                }}
              >
                <FontAwesome
                  name="soccer-ball-o"
                  size={24}
                  color={item.equipment?.futbol ? "black" : "#ccc"}
                />
                <Text
                  style={{
                    marginLeft: 4,
                    color: item.equipment?.futbol ? "#222" : "#ccc",
                    textDecorationLine: item.equipment?.futbol
                      ? "none"
                      : "line-through",
                  }}
                >
                  Fútbol
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginRight: 12,
                }}
              >
                <MaterialIcons
                  name="sports-tennis"
                  size={24}
                  color={item.equipment?.tenis ? "#4CAF50" : "#ccc"}
                />
                <Text
                  style={{
                    marginLeft: 4,
                    color: item.equipment?.tenis ? "#222" : "#ccc",
                    textDecorationLine: item.equipment?.tenis
                      ? "none"
                      : "line-through",
                  }}
                >
                  Tenis
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginRight: 12,
                }}
              >
                <Ionicons
                  name="tennisball"
                  size={24}
                  color={item.equipment?.padel ? "#4CAF50" : "#ccc"}
                />
                <Text
                  style={{
                    marginLeft: 4,
                    color: item.equipment?.padel ? "#222" : "#ccc",
                    textDecorationLine: item.equipment?.padel
                      ? "none"
                      : "line-through",
                  }}
                >
                  Padel
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    marginTop: 0, // Sin márgenes
    minHeight: 1000,
    height: 1000,
  },
  image: {
    width: "100%",
    height: 300, // Altura considerable para que se vea como un banner
    borderRadius: 0, // Sin bordes redondeados para el estilo
  },
  textContainer: {
    paddingHorizontal: 20, // Margen izquierdo y derecho
    paddingTop: 20, // Para separar un poco del borde inferior de la imagen
  },
  title: {
    fontSize: 19,
    fontWeight: "bold",
  },
  label: {
    fontWeight: "600",
    marginTop: 10,
  },
  deporte: {
    marginLeft: 8,
    marginVertical: 4,
  },
  text: {
    marginTop: 10,
    fontSize: 14,
    color: "#333",
  },
  rating: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },
  ratingText: {
    fontWeight: "500",
    fontSize: 16,
    color: "#444",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 10,
    fontSize: 16,
  },
});
