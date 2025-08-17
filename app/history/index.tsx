import { BackButton } from "@/components/BackButton";
import { API_URL } from "@/constants/config";
import api from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";
import { format } from "date-fns";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

function ReservationHistory() {
  const { token } = useAuthStore();
  const [reservas, setReservas] = useState<any[]>([]);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const daysMap = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];

  const getReservas = useCallback(
    async (isLoadMore = false) => {
      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      try {
        const response = await api.get(
          `${API_URL}/reservations/user/history?limit=${limit}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setReservas(response.data);
      } catch (error) {
        throw new Error("Error al obtener historial");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [limit, token]
  );

  useEffect(() => {
    getReservas();
  }, []);

  useEffect(() => {
    if (limit > 10) {
      getReservas(true);
    }
  }, [limit]);

  function getStatusText(status: string) {
    switch (status) {
      case "confirmed":
        return "Confirmada";
      case "canceled":
        return "Cancelada";
      case "completed":
        return "Completada";
      default:
        return status;
    }
  }

  function getStatusStyle(status: string) {
    switch (status) {
      case "confirmed":
        return { color: "#4CAF50" };
      case "canceled":
        return { color: "#f44336" };
      case "completed":
        return { color: "#2196F3" };
      default:
        return { color: "#666" };
    }
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <BackButton />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Cargando historial...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <BackButton />
      <Text style={styles.title}>Historial de Reservas</Text>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {reservas.length === 0 ? (
          <Text style={styles.emptyText}>
            No tienes reservas en tu historial.
          </Text>
        ) : (
          <>
            {(() => {
              // Agrupar reservas por fecha
              const reservasSorted = reservas.sort(
                (a, b) =>
                  new Date(b.startTime).getTime() -
                  new Date(a.startTime).getTime()
              );

              const groupedByDate = reservasSorted.reduce((groups, reserva) => {
                const date = format(new Date(reserva.startTime), "dd/MM/yyyy");
                if (!groups[date]) {
                  groups[date] = [];
                }
                groups[date].push(reserva);
                return groups;
              }, {} as Record<string, any[]>);

              const dates = Object.keys(groupedByDate);

              return dates.map((date, dateIndex) => (
                <View key={date} style={styles.dateGroup}>
                  {/* Dot principal para la fecha */}
                  <View style={styles.timelineDot} />
                  {dateIndex < dates.length && (
                    <View style={styles.timelineLine} />
                  )}

                  {/* Contenido de la fecha */}
                  <View style={styles.dateContent}>
                    <Text style={styles.dateHeader}>{date}</Text>

                    {groupedByDate[date].map((reserva, index) => {
                      const day = new Date(reserva.startTime).getDay();

                      return (
                        <View key={reserva._id} style={styles.reservaItem}>
                          <Text style={styles.timelineTime}>
                            {format(new Date(reserva.startTime), "HH:mm")} -{" "}
                            {daysMap[day]}
                          </Text>

                          <View style={styles.reservaInfo}>
                            <Text style={styles.complejo}>
                              {reserva.complexName}
                            </Text>
                            <Text style={styles.detalle}>
                              {reserva.fieldName}
                            </Text>
                            <View style={styles.bottomRow}>
                              <Text style={styles.precio}>
                                ${reserva.price}
                              </Text>
                              <Text
                                style={[
                                  styles.status,
                                  getStatusStyle(reserva.status),
                                ]}
                              >
                                {getStatusText(reserva.status)}
                              </Text>
                            </View>
                          </View>
                        </View>
                      );
                    })}
                  </View>
                </View>
              ));
            })()}

            <Pressable
              style={styles.loadMoreButton}
              onPress={() => {
                setLimit(limit + 10);
                getReservas(true);
              }}
              disabled={loadingMore}
            >
              {loadingMore ? (
                <ActivityIndicator size="small" color="#007AFF" />
              ) : (
                <Text style={styles.loadMoreText}>Cargar más...</Text>
              )}
            </Pressable>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 60,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  title: {
    paddingBlock: 20,
    paddingHorizontal: 20,
    fontSize: 24,
    fontWeight: "bold",
    alignSelf: "center",
    color: "#333",
  },
  emptyText: {
    fontSize: 16,
    color: "#777",
    textAlign: "center",
    marginTop: 50,
  },
  dateGroup: {
    position: "relative",
    paddingLeft: 20,
    marginBottom: 30,
  },
  dateContent: {
    marginLeft: 8,
  },
  dateHeader: {
    color: "#60a5fa",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
  reservaItem: {
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: "#60a5fa",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  timelineDot: {
    position: "absolute",
    left: 0,
    top: 8,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#60a5fa",
    zIndex: 2,
  },
  timelineLine: {
    position: "absolute",
    left: 5.5,
    top: 20,
    bottom: -30,
    width: 1,
    backgroundColor: "#374151",
    zIndex: 1,
  },
  timelineTime: {
    color: "#666",
    fontSize: 14,
    marginBottom: 12,
  },
  reservaInfo: {
    gap: 6,
  },
  complejo: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  detalle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#444",
    marginBottom: 4,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  precio: {
    fontSize: 16,
    color: "#10b981",
    fontWeight: "600",
  },
  status: {
    fontSize: 14,
    fontWeight: "500",
  },
  loadMoreButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",

    minHeight: 48,
    justifyContent: "center",
  },
  loadMoreText: {
    color: "#007AFF",
    fontWeight: "600",
    fontSize: 16,
  },
});
export default ReservationHistory;
