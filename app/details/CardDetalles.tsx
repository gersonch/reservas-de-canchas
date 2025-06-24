import { IconSymbol } from "@/components/ui/IconSymbol";
import { API_URL } from "@/constants/api-url";
import api from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { IComplejo } from "../common/types/compejo";

export function CardDetalles({ item, param }: { item: IComplejo; param: any }) {
  const imagenReserva =
    "https://img.freepik.com/vector-premium/vector-icono-imagen-predeterminado-pagina-imagen-faltante-diseno-sitio-web-o-aplicacion-movil-no-hay-foto-disponible_87543-11093.jpg";

  const [rating, setRating] = useState<number>(0);
  const [submitting, setSubmitting] = useState(false);
  const { user, token } = useAuthStore();
  const [numberOfStars, setNumberOfStars] = useState<number>(0);

  const ratingForComplex = api.get(`${API_URL}/rating/${param}`);
  ratingForComplex.then((response) => {
    setNumberOfStars(response.data);
  });

  useEffect(() => {
    const fetchRatingForUser = async () => {
      try {
        const response = await api.get(`${API_URL}/rating/${param}/user`);
        // Verifica si la respuesta tiene el array rating y al menos un elemento
        if (
          response.data &&
          Array.isArray(response.data.rating) &&
          response.data.rating.length > 0
        ) {
          setRating(response.data.rating[0].stars);
          console.log("Rating for user:", response.data.rating[0].stars);
        } else {
          setRating(0); // O el valor que quieras por defecto si no hay rating
          console.log("El usuario no tiene rating para este complejo");
        }
      } catch (error) {
        console.error("Error fetching rating for user:", error);
      }
    };
    fetchRatingForUser();
  }, [param, token]);
  console.log(user?.id);
  // Función para enviar el rating al servidor
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

  return (
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
            <IconSymbol size={15} name="star" color={"#FFD700"} />
            <Text style={styles.ratingText}>
              {numberOfStars === null ? "No calificado" : numberOfStars}
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

        <View style={styles.rating}></View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    marginTop: 0, // Sin márgenes
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
