import ReservasSkeleton from "@/components/skeletons/ReservasSkeleton";
import { API_URL } from "@/constants/config";
import api from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";
import { Entypo, FontAwesome } from "@expo/vector-icons";
import { format } from "date-fns";
import { Link } from "expo-router";
import { useEffect, useState } from "react";

import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Reservar() {
  const [reservas, setReservas] = useState<any[]>([]);
  const { user, token } = useAuthStore();
  const [refresh, setRefresh] = useState(false);
  const [showDropdown, setShowDropdown] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [initialLoading, setInitialLoading] = useState(true); // Cambiado de 'loading' a 'initialLoading'
  const daysMap = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];

  const fetchReservas = async (isRefresh = false) => {
    if (!user) return;

    try {
      // Solo mostrar skeleton en carga inicial, no en refresh
      if (!isRefresh) {
        setInitialLoading(true);
      }
      const response = await api.get(`${API_URL}/reservations/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setReservas(response.data);
    } catch (error) {
      throw new Error("Error al obtener reservas");
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchReservas(); // Carga inicial
  }, [user]);

  function handleRefresh() {
    setRefresh(true);
    fetchReservas(true); // Pasamos true para indicar que es refresh
    setTimeout(() => {
      setRefresh(false);
    }, 1000);
  }

  async function handleCancelReservation(reservaId: string) {
    setCancellingId(reservaId);
    try {
      await api.patch(`${API_URL}/reservations/${reservaId}/cancel`);

      await fetchReservas();
      console.log("Reserva cancelada exitosamente");
    } catch (error: any) {
      alert(error.response?.data?.message || "Error al cancelar la reserva");
    } finally {
      setCancellingId(null);
    }
  }

  function toggleDropdown(reservaId: string) {
    setShowDropdown(showDropdown === reservaId ? null : reservaId);
  }

  function getStatusText(status: string) {
    switch (status) {
      case "confirmed":
        return "Confirmada";
      case "canceled":
        return "Cancelada";
      default:
        return status;
    }
  }

  function getStatusStyle(status: string) {
    switch (status) {
      case "confirmed":
        return { color: "#4CAF50" }; // Verde
      case "canceled":
        return { color: "#f44336" }; // Rojo
      default:
        return { color: "#666" }; // Gris
    }
  }

  const reservasSorted = reservas.sort((a, b) => {
    return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
  });

  if (initialLoading) {
    return (
      <SafeAreaView style={{ height: "100%" }}>
        <ReservasSkeleton />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={{ height: "100%", flex: 1 }}
      edges={["top", "left", "right"]}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={refresh} onRefresh={handleRefresh} />
        }
      >
        <View
          style={{
            flex: 1,
            justifyContent: "space-between",
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <Text style={styles.title}>Mis Reservas</Text>
          <Link href="/history">
            <FontAwesome name="history" size={20} color="blue" />
          </Link>
        </View>
        {reservas.length === 0 ? (
          <Text style={styles.emptyText}>Aún no tienes reservas.</Text>
        ) : (
          reservasSorted.map((reserva, index) => {
            const dia = reserva.startTime;
            const day = new Date(dia).getDay();
            return (
              <View key={reserva._id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.complejo}>{reserva.complexName}</Text>
                  <Pressable
                    style={styles.menuButton}
                    onPress={() => toggleDropdown(reserva._id)}
                  >
                    {cancellingId === reserva._id ? (
                      <ActivityIndicator size="small" color="#0000ff" />
                    ) : (
                      <Entypo
                        name="dots-three-vertical"
                        size={18}
                        color="black"
                      />
                    )}
                  </Pressable>
                </View>

                {showDropdown === reserva._id &&
                reserva.status === "confirmed" ? (
                  <View style={styles.dropdown}>
                    <Pressable
                      style={styles.dropdownItem}
                      onPress={() => {
                        handleCancelReservation(reserva._id);
                        setShowDropdown(null);
                      }}
                    >
                      <Text style={styles.cancelText}>Cancelar reserva</Text>
                    </Pressable>
                  </View>
                ) : null}

                <Text style={styles.detalle}>{reserva.fieldName}</Text>
                <Text style={styles.dia}>{`${daysMap[day]}`}</Text>
                <Text style={styles.fecha}>
                  {format(new Date(reserva.startTime), "dd/MM/yyyy HH:mm")} |
                  Duración: {reserva.duration} hs
                </Text>
                <Text style={styles.precio}>Precio: ${reserva.price}</Text>
                <Text style={[styles.status, getStatusStyle(reserva.status)]}>
                  Estado: {getStatusText(reserva.status)}
                </Text>
              </View>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  emptyText: {
    fontSize: 16,
    color: "#777",
    textAlign: "center",
    marginTop: 50,
  },
  card: {
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
    position: "relative",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  complejo: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4CAF50",
    flex: 1,
  },
  menuButton: {
    padding: 8,
    borderRadius: 20,
  },
  menuDots: {
    fontSize: 20,
    color: "#666",
    transform: [{ rotate: "90deg" }],
  },
  dropdown: {
    position: "absolute",
    top: 50,
    right: 16,
    backgroundColor: "white",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    zIndex: 1000,
  },
  dropdownItem: {
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderRadius: 8,
  },
  cancelText: {
    color: "#f44336",
    fontSize: 14,
    fontWeight: "500",
  },
  detalle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#444",
    marginBottom: 4,
  },
  fecha: {
    fontSize: 13,
    color: "#666",
    marginBottom: 6,
  },
  precio: {
    fontSize: 14,
    color: "#1976D2",
    fontWeight: "bold",
    marginBottom: 4,
  },
  dia: {
    fontSize: 14,
    color: "#555",
    fontWeight: "500",
    marginBottom: 4,
  },
  status: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
  },
});
