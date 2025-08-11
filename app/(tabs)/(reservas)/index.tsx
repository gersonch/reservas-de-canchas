import { API_URL } from "@/constants/config";
import api from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Reservar() {
  const [reservas, setReservas] = useState<any[]>([]);
  const { user } = useAuthStore();
  const [refresh, setRefresh] = useState(false);
  const daysMap = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];

  const fetchReservas = async () => {
    if (!user) return;

    const response = await api.get(`${API_URL}/reservations/user/${user.id}`);
    setReservas(response.data);
  };

  useEffect(() => {
    fetchReservas();
  }, [user]);

  function handleRefresh() {
    setRefresh(true);

    fetchReservas();
    setTimeout(() => {
      setRefresh(false);
    }, 1000); // Simula un delay para la actualización
  }
  return (
    <SafeAreaView style={{ height: "100%" }}>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={refresh} onRefresh={handleRefresh} />
        }
      >
        <Text style={styles.title}>Mis Reservas</Text>
        {reservas.length === 0 ? (
          <Text style={styles.emptyText}>Aún no tienes reservas.</Text>
        ) : (
          reservas.map((reserva) => {
            const dia = reserva.startTime;
            const day = new Date(dia).getDay();
            return (
              <View key={reserva._id} style={styles.card}>
                <Text style={styles.complejo}>{reserva.complexName}</Text>
                <Text style={styles.detalle}>{reserva.fieldName}</Text>
                <Text style={styles.dia}>{`${daysMap[day]}`}</Text>
                <Text style={styles.fecha}>
                  {format(new Date(reserva.startTime), "dd/MM/yyyy HH:mm")} |
                  Duración: {reserva.duration} hs
                </Text>
                <Text style={styles.precio}>Precio: ${reserva.price}</Text>
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
    marginBottom: 20,
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
  },
  complejo: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4CAF50",
    marginBottom: 4,
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
});
