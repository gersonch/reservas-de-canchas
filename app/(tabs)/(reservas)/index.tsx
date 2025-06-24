import { format } from "date-fns";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function Reservar() {
  const reservas = [
    {
      id: 1,
      fecha: "2023-09-15",
      hora_inicio: "10:00",
      hora_fin: "11:00",
      estado: "confirmada",
      cancha_id: {
        numero: 1,
        deporte: "futbol",
        complejo_id: { nombre: "Complejo Deportivo" },
      },
    },
    {
      id: 2,
      fecha: "2023-09-16",
      hora_inicio: "10:00",
      hora_fin: "11:00",
      estado: "pendiente",
      cancha_id: {
        numero: 1,
        deporte: "futbol",
        complejo_id: { nombre: "Complejo Deportivo" },
      },
    },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Mis Reservas</Text>
      {reservas.length === 0 ? (
        <Text style={styles.emptyText}>Aún no tienes reservas.</Text>
      ) : (
        reservas.map((reserva) => (
          <View key={reserva.id} style={styles.card}>
            <Text style={styles.complejo}>
              {reserva.cancha_id.complejo_id.nombre}
            </Text>
            <Text style={styles.detalle}>
              Cancha #{reserva.cancha_id.numero} -{" "}
              {reserva.cancha_id.deporte.toUpperCase()}
            </Text>
            <Text style={styles.fecha}>
              {format(new Date(reserva.fecha), "dd/MM/yyyy")} |{" "}
              {reserva.hora_inicio.slice(0, 5)} - {reserva.hora_fin.slice(0, 5)}
            </Text>
            <Text
              style={[
                styles.estado,
                {
                  backgroundColor:
                    reserva.estado === "pendiente"
                      ? "#FF9800"
                      : reserva.estado === "confirmada"
                      ? "#4CAF50"
                      : "#f44336",
                },
              ]}
            >
              {reserva.estado.toUpperCase()}
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
  estado: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    color: "#fff",
    fontWeight: "600",
    fontSize: 12,
    overflow: "hidden",
  },
});
