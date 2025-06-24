import { ScrollView, StyleSheet, Text, View } from "react-native";

const torneosFake = [
  {
    id: "1",
    nombre: "Torneo de Invierno",
    fecha: "2025-07-10",
    estado: "En curso",
    ubicacion: "Chillán",
    equipos: 8,
    formato: "Todos contra todos",
  },
  {
    id: "2",
    nombre: "Copa Ñuble",
    fecha: "2025-08-05",
    estado: "Inscripción abierta",
    ubicacion: "San Carlos",
    equipos: 12,
    formato: "Eliminación directa",
  },
];

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
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>
        <Text>¡Mis torneos!</Text> <Text style={{ color: "#1976D2" }}>🏆</Text>
      </Text>
      {torneosFake.length === 0 ? (
        <Text style={styles.emptyText}>Aún no tienes torneos.</Text>
      ) : (
        torneosFake.map((torneo) => (
          <View key={torneo.id} style={styles.card}>
            <View style={styles.headerRow}>
              <Text style={[styles.torneoNombre, { color: "#1976D2" }]}>
                {torneo.nombre}{" "}
                {estadoEmoji[torneo.estado as keyof typeof estadoEmoji]}
              </Text>
            </View>
            <Text style={styles.detalle}>
              <Text style={{ color: "#FF9800" }}>📅</Text> Fecha:{" "}
              <Text style={styles.torneoDatoValor}>{torneo.fecha}</Text>
            </Text>
            <Text style={styles.detalle}>
              <Text style={{ color: "#1976D2" }}>📍</Text> Ubicación:{" "}
              <Text style={styles.torneoDatoValor}>{torneo.ubicacion}</Text>
            </Text>
            <Text style={styles.detalle}>
              <Text style={{ color: "#4CAF50" }}>👥</Text> Equipos:{" "}
              <Text style={styles.torneoDatoValor}>{torneo.equipos}</Text>
            </Text>
            <Text style={styles.detalle}>
              <Text style={{ color: "#f44336" }}>🎲</Text> Formato:{" "}
              <Text style={styles.torneoDatoValor}>{torneo.formato}</Text>
            </Text>
            <Text
              style={[
                styles.estado,
                { backgroundColor: estadoColor[torneo.estado] || "#1976D2" },
              ]}
            >
              {torneo.estado.toUpperCase()}
            </Text>
          </View>
        ))
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
