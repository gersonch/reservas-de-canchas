import api from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

const estadoEmoji = {
  "En curso": "⚽",
  "Inscripción abierta": "📝",
  Finalizado: "🏆",
};

const estadoColor: Record<string, string> = {
  "En curso": "#4CAF50",
  "Inscripción abierta": "#FF9800",
  Finalizado: "#f44336",
};

export default function MisTorneosScreen() {
  const [tournaments, setTournaments] = useState([]);
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchTournaments = async () => {
      const response = await api.get(`/tournaments/user/${user?.id}`);
      if (response.status !== 200) {
        console.error("Error fetching tournaments:", response.data);
        return;
      }
      setTournaments(response.data);
    };
    fetchTournaments();
  }, [user?.id]);
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>
        <Text>¡Mis torneos!</Text> <Text style={{ color: "#1976D2" }}>🏆</Text>
      </Text>
      {tournaments.length === 0 ? (
        <Text style={styles.emptyText}>Aún no tienes torneos.</Text>
      ) : (
        tournaments.map((torneo: any) => (
          <View key={torneo._id} style={styles.card}>
            <View style={styles.headerRow}>
              <Text style={[styles.torneoNombre, { color: "#1976D2" }]}>
                {torneo.name}{" "}
                {
                  estadoEmoji[
                    (torneo.state === "open"
                      ? "Inscripción abierta"
                      : torneo.state === "finished"
                      ? "Finalizado"
                      : "En curso") as keyof typeof estadoEmoji
                  ]
                }
              </Text>
            </View>
            <Text style={styles.detalle}>
              <Text style={{ color: "#FF9800" }}>📅</Text> Fecha inicio:{" "}
              <Text style={styles.torneoDatoValor}>
                {torneo.startDate
                  ? new Date(torneo.startDate).toLocaleDateString()
                  : "-"}
              </Text>
            </Text>
            <Text style={styles.detalle}>
              <Text style={{ color: "#FF9800" }}>📅</Text> Fecha término:{" "}
              <Text style={styles.torneoDatoValor}>
                {torneo.endDate
                  ? new Date(torneo.endDate).toLocaleDateString()
                  : "-"}
              </Text>
            </Text>
            <Text style={styles.detalle}>
              <Text style={{ color: "#1976D2" }}>🏟️</Text> Categoría:{" "}
              <Text style={styles.torneoDatoValor}>{torneo.category}</Text>
            </Text>
            <Text style={styles.detalle}>
              <Text style={{ color: "#4CAF50" }}>👥</Text> Equipos:{" "}
              <Text style={styles.torneoDatoValor}>
                {Array.isArray(torneo.teams) ? torneo.teams.length : "-"}
              </Text>
            </Text>
            <Text style={styles.detalle}>
              <Text style={{ color: "#f44336" }}>🎲</Text> Deporte:{" "}
              <Text style={styles.torneoDatoValor}>{torneo.sport}</Text>
            </Text>
            <Text
              style={[
                styles.estado,
                {
                  backgroundColor:
                    estadoColor[
                      (torneo.state === "open"
                        ? "Inscripción abierta"
                        : torneo.state === "finished"
                        ? "Finalizado"
                        : "En curso") as keyof typeof estadoColor
                    ] || "#1976D2",
                },
              ]}
            >
              {torneo.state === "open"
                ? "INSCRIPCIÓN ABIERTA"
                : torneo.state === "finished"
                ? "FINALIZADO"
                : "EN CURSO"}
            </Text>
          </View>
        ))
      )}
      {tournaments.length > 0 && (
        <Text style={styles.emptyText}>
          {tournaments.length} torneos encontrados.
        </Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: "#fff",
    minHeight: "100%",
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
    borderWidth: 1.5,
    borderColor: "#1976D2",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
    justifyContent: "space-between",
  },
  torneoNombre: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4CAF50",
    marginBottom: 4,
    flex: 1,
  },
  emoji: {
    fontSize: 22,
    marginLeft: 8,
  },
  detalle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#444",
    marginBottom: 4,
  },
  torneoDatoValor: {
    fontWeight: "600",
    color: "#222",
  },
  estado: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    color: "#fff",
    fontWeight: "600",
    fontSize: 12,
    overflow: "hidden",
    marginTop: 8,
  },
});
