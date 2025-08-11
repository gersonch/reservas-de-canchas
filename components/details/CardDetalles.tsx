import { IComplejo } from "@/common/types/compejo";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { API_URL } from "@/constants/api-url";
import api from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";

import {
  equipmentConfig,
  facilitiesConfig,
} from "@/constants/complexes-details";
import { useEffect, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { FieldsList } from "./FieldsList";

export function CardDetalles({ item, param }: { item: IComplejo; param: any }) {
  // Configuración de instalaciones (fuera del return)

  const imagenReserva =
    "https://img.freepik.com/vector-premium/vector-icono-imagen-predeterminado-pagina-imagen-faltante-diseno-sitio-web-o-aplicacion-movil-no-hay-foto-disponible_87543-11093.jpg";

  const [rating, setRating] = useState<number>(0);
  const [fields, setFields] = useState<any[]>([]);

  const { user } = useAuthStore();
  const [numberOfStars, setNumberOfStars] = useState<number | null>(null);

  const stars = Array.from({ length: 5 }, (_, index) => index + 1);
  const fetchFields = async () => {
    const response = await api.get(`${API_URL}/fields/complex/${param}`);
    setFields(response.data);
  };

  useEffect(() => {
    fetchFields();
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

  const showToast = (type: "success" | "error", message: string) => {
    Toast.show({
      type,
      text1: message,
    });
  };
  const handleRating = async (number: number) => {
    try {
      if (!user) {
        showToast("error", "Debes iniciar sesión para calificar.");
        return;
      }
      setRating(number);
      const response = await api.post(`${API_URL}/rating/${param}`, {
        stars: number,
      });

      if (response.status !== 201) {
        showToast("error", "Error al enviar calificación");
        return;
      }

      showToast("success", `Calificación enviada: ${number}`);
    } catch (error: object | any) {
      showToast(
        "error",
        `${error.response?.data?.message || "Error al enviar calificación"}`
      );
    }
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
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

          {/* Sección de Reservas */}
          <FieldsList fields={fields} />

          {/* Instalaciones y equipamiento */}
          <>
            <View style={{ marginTop: 16 }}>
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 16,
                  marginBottom: 6,
                }}
              >
                Instalaciones:
              </Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
                {facilitiesConfig.map((facility) => {
                  const Icon = facility.icon;
                  const value =
                    item.facilities?.[
                      facility.key as keyof typeof item.facilities
                    ];
                  return (
                    <View
                      key={facility.key}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginRight: 12,
                      }}
                    >
                      <Icon
                        {...facility.iconProps}
                        name={facility.iconProps.name as any}
                        color={value ? facility.color : "#ccc"}
                      />
                      <Text
                        style={{
                          marginLeft: 4,
                          color: value ? "#222" : "#ccc",
                          textDecorationLine: value ? "none" : "line-through",
                        }}
                      >
                        {facility.label}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>
            <View style={{ marginTop: 16 }}>
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 16,
                  marginBottom: 6,
                }}
              >
                Equipamiento:
              </Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
                {equipmentConfig.map((equip) => {
                  const Icon = equip.icon;
                  const value =
                    item.equipment?.[equip.key as keyof typeof item.equipment];
                  return (
                    <View
                      key={equip.key}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginRight: 12,
                      }}
                    >
                      <Icon
                        {...equip.iconProps}
                        name={equip.iconProps.name as any}
                        color={value ? equip.color : "#ccc"}
                      />
                      <Text
                        style={{
                          marginLeft: 4,
                          color: value ? "#222" : "#ccc",
                          textDecorationLine: value ? "none" : "line-through",
                        }}
                      >
                        {equip.label}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>
          </>
          <Text style={{ marginTop: 20, fontWeight: "bold", fontSize: 20 }}>
            ¡Califícanos!
          </Text>

          <View style={styles.rating}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {stars.map((star, index) => {
                // pintar las estrellas segun la calificación
                const isFilled = rating ? index < rating : false;
                return (
                  <Pressable
                    key={index}
                    onPress={() => handleRating(index + 1)}
                    style={{ marginRight: 2, display: "flex" }}
                  >
                    <IconSymbol
                      size={35}
                      name={isFilled ? "star.fill" : "star"}
                      color={"#FFD700"}
                    />
                  </Pressable>
                );
              })}
            </View>
          </View>
          {/* Fin instalaciones y equipamiento */}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    marginTop: 0, // Sin márgenes
    flex: 1, // Usar flex en lugar de altura fija
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
    marginBottom: 40,
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
