import { API_URL } from "@/constants/config";
import api from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Pressable, ScrollView, Text, View } from "react-native";

const daysMap = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
];

// Función para obtener los próximos 7 días empezando desde hoy
function getNext7Days() {
  const today = new Date();
  const days = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    days.push({
      date: date,
      dayOfWeek: date.getDay() + 1, // +1 porque tu sistema usa 1=Domingo
      label: i === 0 ? "Hoy" : daysMap[date.getDay()],
      fullDate: date.toLocaleDateString(),
    });
  }
  return days;
}

interface Reservation {
  _id: string;
  fieldId: string;
  userId: string;
  complexId: string;
  startTime: string; // "2025-08-05T10:00"
  duration: string;
  price: number;
  createdAt: string;
  __v?: number;
}

interface Availability {
  dayOfWeek: number;
  from: string;
  to: string;
  prices?: any[];
}

interface Field {
  _id: string;
  name: string;
  type: string;
  complexId: string;
  availability: Availability[];
  __v?: number;
}

interface FieldsListProps {
  fields: Field[];
  reservations?: Reservation[]; // Agregar reservations como prop opcional
}

function getTimeSlots(from?: string, to?: string) {
  if (typeof from !== "string" || typeof to !== "string") return [];
  const start = Number(from.split(":")[0]);
  const end = Number(to.split(":")[0]);
  return Array.from({ length: end - start }, (_, i) => `${start + i}:00`);
}

// Componente de ícono animado para el acordeón
const AnimatedIcon: React.FC<{ isExpanded: boolean }> = ({ isExpanded }) => {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(rotateAnim, {
      toValue: isExpanded ? 1 : 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [isExpanded, rotateAnim]);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "45deg"], // Rotación suave del símbolo +
  });

  return (
    <Animated.Text
      style={{
        fontSize: 20,
        color: "#007AFF",
        fontWeight: "600",
        transform: [{ rotate: rotation }],
      }}
    >
      +
    </Animated.Text>
  );
};

// Componente de acordeón animado con altura dinámica
const AnimatedAccordion: React.FC<{
  isExpanded: boolean;
  children: React.ReactNode;
}> = ({ isExpanded, children }) => {
  const animatedHeight = useRef(new Animated.Value(0)).current;
  const animatedOpacity = useRef(new Animated.Value(0)).current;
  const [contentHeight, setContentHeight] = useState(0);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (isExpanded) {
      setShowContent(true);
      Animated.parallel([
        Animated.timing(animatedHeight, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(animatedOpacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: false,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(animatedHeight, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(animatedOpacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: false,
        }),
      ]).start(({ finished }) => {
        if (finished) {
          setShowContent(false);
        }
      });
    }
  }, [isExpanded, animatedHeight, animatedOpacity]);

  // Altura máxima dinámica basada en el contenido real
  const maxHeight = animatedHeight.interpolate({
    inputRange: [0, 1],
    outputRange: [0, Math.max(contentHeight, 200)], // Altura mínima de 200px
  });

  if (!showContent && !isExpanded) {
    return null;
  }

  return (
    <Animated.View
      style={{
        maxHeight,
        opacity: animatedOpacity,
        overflow: "hidden",
      }}
    >
      <View
        style={{
          paddingHorizontal: 18,
          paddingBottom: 18,
          backgroundColor: "#fafafa",
          borderTopWidth: 1,
          borderTopColor: "#f0f0f0",
        }}
        onLayout={(event) => {
          const { height } = event.nativeEvent.layout;
          if (height > 0 && height !== contentHeight) {
            setContentHeight(height);
          }
        }}
      >
        {children}
      </View>
    </Animated.View>
  );
};

export const FieldsList: React.FC<FieldsListProps> = ({
  fields,
  reservations: propReservations = [],
}) => {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [expandedField, setExpandedField] = useState<string | null>(null);
  const [reservations, setReservations] =
    useState<Reservation[]>(propReservations);

  const next7Days = getNext7Days();

  // Función para verificar si un slot está reservado
  const isSlotReserved = (
    fieldId: string,
    selectedDate: Date,
    slot: string
  ) => {
    const [hour] = slot.split(":");
    const slotDateTime = new Date(selectedDate);
    slotDateTime.setHours(parseInt(hour), 0, 0, 0);

    // Formatear la fecha y hora para comparar con startTime
    const year = slotDateTime.getFullYear();
    const month = String(slotDateTime.getMonth() + 1).padStart(2, "0");
    const day = String(slotDateTime.getDate()).padStart(2, "0");
    const hourStr = String(slotDateTime.getHours()).padStart(2, "0");
    const slotTimeString = `${year}-${month}-${day}T${hourStr}:00`; // "2025-08-14T10:00"

    const isReserved = reservations.some(
      (reservation) =>
        reservation.fieldId === fieldId &&
        reservation.startTime === slotTimeString
    );

    return isReserved;
  };

  // Obtener la fecha del día seleccionado
  const getSelectedDate = (dayOfWeek: number) => {
    return (
      next7Days.find((day) => day.dayOfWeek === dayOfWeek)?.date || new Date()
    );
  };
  const { user } = useAuthStore();

  // Establecer el primer día disponible al cargar los campos
  useEffect(() => {
    if (fields.length > 0 && selectedDay === null) {
      // Encontrar el primer día disponible
      let firstAvailableDay = null;
      for (const day of next7Days) {
        const hasAvailability = fields.some((field) =>
          field.availability?.some((avail) => avail.dayOfWeek === day.dayOfWeek)
        );
        if (hasAvailability) {
          firstAvailableDay = day.dayOfWeek;
          break;
        }
      }
      setSelectedDay(firstAvailableDay || next7Days[0]?.dayOfWeek || null);
    }
  }, [fields, selectedDay, next7Days]);

  // Cerrar acordeones cuando cambie el día seleccionado
  useEffect(() => {
    setExpandedField(null);
  }, [selectedDay]);

  const toggleField = (fieldId: string) => {
    setExpandedField((prev) => (prev === fieldId ? null : fieldId));
  };

  const getFieldsForDay = (dayOfWeek: number) => {
    // Siempre devolver todas las canchas
    return fields;
  };

  const getAvailabilityForDay = (field: Field, dayOfWeek: number) => {
    // Buscar disponibilidad para el día específico directamente en availability
    const availability = field.availability?.find(
      (a) => a.dayOfWeek === dayOfWeek
    );
    return availability;
  };

  return (
    <View style={{ marginTop: 24, marginBottom: 20 }}>
      <Text
        style={{
          fontWeight: "bold",
          fontSize: 20,
          marginBottom: 16,
          color: "#333",
        }}
      >
        Reservar Canchas
      </Text>

      {/* Selector de días */}
      <Text
        style={{
          fontWeight: "600",
          fontSize: 16,
          marginBottom: 12,
          color: "#555",
        }}
      >
        Selecciona un día:
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginBottom: 24 }}
        contentContainerStyle={{ paddingRight: 20 }}
      >
        {next7Days.map((day, index) => (
          <Pressable
            key={index}
            onPress={() => {
              setSelectedDay(day.dayOfWeek);
            }}
            style={{
              backgroundColor:
                selectedDay === day.dayOfWeek ? "#007AFF" : "#f8f9fa",
              paddingVertical: 14,
              paddingHorizontal: 18,
              borderRadius: 12,
              marginRight: 10,
              minWidth: 85,
              alignItems: "center",
              borderWidth: 1,
              borderColor:
                selectedDay === day.dayOfWeek ? "#007AFF" : "#e0e0e0",
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 1,
              },
              shadowOpacity: 0.1,
              shadowRadius: 2,
              elevation: 2,
            }}
          >
            <Text
              style={{
                color: selectedDay === day.dayOfWeek ? "white" : "#333",
                fontWeight: "600",
                fontSize: 14,
              }}
            >
              {day.label}
            </Text>
            <Text
              style={{
                color: selectedDay === day.dayOfWeek ? "white" : "#666",
                fontSize: 12,
              }}
            >
              {day.fullDate}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Mostrar canchas disponibles para el día seleccionado */}
      {selectedDay ? (
        <View>
          <Text
            style={{
              fontWeight: "600",
              fontSize: 16,
              marginBottom: 12,
              color: "#333",
            }}
          >
            Canchas para {daysMap[selectedDay - 1]}:
          </Text>
          {getFieldsForDay(selectedDay).map((field) => {
            const isExpanded = expandedField === field._id;
            const availability = getAvailabilityForDay(field, selectedDay);
            const slots = getTimeSlots(availability?.from, availability?.to);

            return (
              <View
                key={field._id}
                style={{
                  marginBottom: 16,
                  borderWidth: 1,
                  borderColor: "#e0e0e0",
                  borderRadius: 16,
                  backgroundColor: "#ffffff",
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.08,
                  shadowRadius: 4,
                  elevation: 3,
                  overflow: "hidden",
                }}
              >
                <Pressable
                  onPress={async () => {
                    toggleField(field._id);
                    try {
                      const response = await api.get(
                        `${API_URL}/reservations/${field._id}`
                      );
                      const data = response.data;
                      setReservations(data);
                    } catch (error) {
                      console.error("Error fetching reservations:", error);
                    }
                  }}
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: 18,
                  }}
                >
                  <Text
                    style={{
                      fontWeight: "600",
                      fontSize: 16,
                      color: "#333",
                    }}
                  >
                    {field.name}
                  </Text>
                  <AnimatedIcon isExpanded={isExpanded} />
                </Pressable>

                <AnimatedAccordion isExpanded={isExpanded}>
                  {availability && slots.length > 0 ? (
                    <View>
                      <Text
                        style={{
                          marginBlock: 14,
                          color: "#666",
                          fontSize: 15,
                          fontWeight: "500",
                        }}
                      >
                        Horarios disponibles:
                      </Text>
                      <View
                        style={{
                          flexDirection: "row",
                          flexWrap: "wrap",
                          gap: 10,
                        }}
                      >
                        {slots.map((slot, idx) => {
                          const selectedDate = getSelectedDate(selectedDay);
                          const isReserved = isSlotReserved(
                            field._id,
                            selectedDate,
                            slot
                          );

                          return (
                            <Pressable
                              onPress={
                                isReserved
                                  ? undefined // No acción si está reservado
                                  : user
                                  ? () => alert(`Reservar ${slot}`)
                                  : () => alert("Inicia sesión para reservar")
                              }
                              key={idx}
                              disabled={isReserved}
                              style={{
                                backgroundColor: isReserved
                                  ? "#e9ecef"
                                  : "#28a745",
                                paddingVertical: 12,
                                paddingHorizontal: 18,
                                borderRadius: 10,
                                opacity: isReserved ? 0.8 : 1,
                                minWidth: 95,
                                alignItems: "center",
                                borderWidth: 1,
                                borderColor: isReserved ? "#dee2e6" : "#28a745",
                              }}
                            >
                              <Text
                                style={{
                                  color: isReserved ? "#6c757d" : "white",
                                  fontWeight: "600",
                                  fontSize: 14,
                                  textAlign: "center",
                                }}
                              >
                                {slot}
                              </Text>
                            </Pressable>
                          );
                        })}
                      </View>
                    </View>
                  ) : (
                    <View
                      style={{
                        backgroundColor: "#fff3cd",
                        padding: 16,
                        borderRadius: 12,
                        borderLeftWidth: 4,
                        borderLeftColor: "#ffc107",
                      }}
                    >
                      <Text
                        style={{
                          color: "#856404",
                          fontStyle: "italic",
                          textAlign: "center",
                          fontSize: 14,
                          fontWeight: "500",
                        }}
                      >
                        No hay horarios disponibles para este día
                      </Text>
                    </View>
                  )}
                </AnimatedAccordion>
              </View>
            );
          })}
        </View>
      ) : (
        <Text style={{ color: "#666", textAlign: "center", marginTop: 20 }}>
          Selecciona un día para ver las canchas disponibles
        </Text>
      )}

      {/* Depuración visual de los datos recibidos */}
      {/* <Text style={{ fontSize: 10, color: "#aaa", marginTop: 20 }}>
        {JSON.stringify(fields, null, 2)}
      </Text> */}
    </View>
  );
};
