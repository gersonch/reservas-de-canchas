import { AnimatedAccordion } from "@/components/ui/AnimatedAccordion";
import { AnimatedIcon } from "@/components/ui/AnimatedIcon";
import { API_URL } from "@/constants/config";
import api from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";
import {
  Field,
  FieldsListProps,
  Reservation,
} from "@/types/reservations.interfaces";
import React, { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

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

function getTimeSlots(from?: string, to?: string) {
  if (typeof from !== "string" || typeof to !== "string") return [];
  const start = Number(from.split(":")[0]);
  const end = Number(to.split(":")[0]);
  return Array.from({ length: end - start }, (_, i) => `${start + i}:00`);
}

export function FieldsList({
  fields,
  reservations: propReservations = [],
}: FieldsListProps) {
  const next7Days = getNext7Days();
  const [selectedDay, setSelectedDay] = useState<number | null>(
    next7Days[0]?.dayOfWeek || null
  );
  const [expandedField, setExpandedField] = useState<string | null>(null);
  const [reservations, setReservations] =
    useState<Reservation[]>(propReservations);

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
    <View style={{ marginBottom: 20 }}>
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
              marginBlock: 2,
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
                                {Number(slot.split(":")[0]) > 9
                                  ? slot
                                  : `0${slot}`}
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
                        marginTop: 12,
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
    </View>
  );
}
