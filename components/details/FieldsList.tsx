import { AnimatedAccordion } from "@/components/ui/AnimatedAccordion";
import { AnimatedIcon } from "@/components/ui/AnimatedIcon";
import { API_URL } from "@/constants/config";
import api from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";
import { useProfileStore } from "@/store/useProfileStore";
import {
  Field,
  FieldsListProps,
  Reservation,
} from "@/types/reservations.interfaces";
import React, { useState } from "react";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";
import Toast from "react-native-toast-message";

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
  // Formatea Date o string ISO a 'YYYY-MM-DDTHH:mm'
  function formatDateToSlotString(dateOrString: Date | string) {
    const date =
      typeof dateOrString === "string" ? new Date(dateOrString) : dateOrString;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hour = String(date.getHours()).padStart(2, "0");
    return `${year}-${month}-${day}T${hour}:00`;
  }
  const next7Days = getNext7Days();
  const [selectedDay, setSelectedDay] = useState<number | null>(
    next7Days[0]?.dayOfWeek || null
  );
  const [loadingSlots, setLoadingSlots] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [expandedField, setExpandedField] = useState<string | null>(null);
  const [reservations, setReservations] =
    useState<Reservation[]>(propReservations);

  // Estados para el modal de confirmación
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingReservation, setPendingReservation] = useState<{
    slot: string;
    selectedDate: Date;
    field: Field;
  } | null>(null);

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
        formatDateToSlotString(reservation.startTime) === slotTimeString
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
    setExpandedField((prev) => {
      if (prev === fieldId) {
        setLoadingSlots((slots) => ({ ...slots, [fieldId]: false }));
        return null;
      }
      setLoadingSlots((slots) => ({ ...slots, [fieldId]: false }));
      return fieldId;
    });
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

  const showToast = (type: "success" | "error" | "info", message: string) => {
    Toast.show({
      type,
      text1: message,
    });
  };

  const handleReservation = async (
    slot: string,
    selectedDate: Date,
    field: Field
  ) => {
    const [hour] = slot.split(":");
    const selectedDateObj = new Date(selectedDate);
    selectedDateObj.setHours(parseInt(hour), 0, 0, 0);

    // Enviar el objeto Date directamente
    const reservationData = {
      fieldId: field._id,
      userId: user?.id,
      startTime: selectedDateObj, // <-- aquí va como Date
      complexId: field.complexId,
      price: 12000,
      duration: "01:00",
    };

    try {
      const response = await api.post(
        `${API_URL}/reservations`,
        reservationData
      );
      const newReservation = response.data;
      setReservations((prev) => [...prev, newReservation]);
      showToast("success", "Reserva exitosa");
    } catch (error) {
      console.error("Error al reservar:", error);
      showToast("error", "Error al reservar");
    }
  };

  const { profile } = useProfileStore();

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

            // Resetea el loading si el acordeón está cerrado y el loading sigue activo
            if (!isExpanded && loadingSlots[field._id]) {
              setLoadingSlots((slots) => ({ ...slots, [field._id]: false }));
            }

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
                    setLoadingSlots((slots) => ({
                      ...slots,
                      [field._id]: true,
                    }));
                    try {
                      const response = await api.get(
                        `${API_URL}/reservations/${field._id}`
                      );
                      const data = response.data;
                      setReservations(data);

                      setLoadingSlots((slots) => ({
                        ...slots,
                        [field._id]: false,
                      }));
                    } catch (error) {
                      console.error("Error fetching reservations:", error);
                      setLoadingSlots((slots) => ({
                        ...slots,
                        [field._id]: false,
                      }));
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
                  {loadingSlots[field._id] ? (
                    <View>
                      <View
                        style={{
                          height: 20,
                          backgroundColor: "#f0f0f0",
                          padding: 20,
                          paddingHorizontal: 40,
                          marginBlock: 10,
                          marginHorizontal: 10,
                          width: 100,
                          borderRadius: 8,
                        }}
                      ></View>
                      <View
                        style={{
                          width: "100%",
                          flexDirection: "row",
                          gap: 8,
                          padding: 8,
                          flexWrap: "wrap",
                        }}
                      >
                        {new Array(9).fill(null).map((_, i) => (
                          <View
                            key={i}
                            style={{
                              height: 20,
                              backgroundColor: "#f0f0f0",
                              padding: 20,
                              width: 100,
                              borderRadius: 8,
                            }}
                          />
                        ))}
                      </View>
                    </View>
                  ) : availability && slots.length > 0 ? (
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
                          // Lógica para deshabilitar slots pasados en el día actual
                          const now = new Date();
                          const isToday =
                            selectedDate.toDateString() === now.toDateString();
                          const slotDateTime = new Date(selectedDate);
                          slotDateTime.setHours(
                            parseInt(slot.split(":")[0]),
                            0,
                            0,
                            0
                          );
                          const isPast = isToday && slotDateTime < now;

                          return (
                            <Pressable
                              onPress={
                                isReserved || isPast
                                  ? undefined
                                  : user && profile && profile.rut !== undefined
                                  ? () => {
                                      setPendingReservation({
                                        slot,
                                        selectedDate,
                                        field,
                                      });
                                      setShowConfirmModal(true);
                                    }
                                  : () => {
                                      if (
                                        profile?.rut === undefined ||
                                        profile.rut === "" ||
                                        profile.rut === null
                                      ) {
                                        alert(
                                          "Completa tu perfil para reservar"
                                        );
                                      } else
                                        alert("Inicia sesión para reservar");
                                    }
                              }
                              key={idx}
                              disabled={isReserved || isPast}
                              style={{
                                backgroundColor:
                                  isReserved || isPast ? "#e9ecef" : "#28a745",
                                paddingVertical: 12,
                                paddingHorizontal: 18,
                                borderRadius: 10,
                                opacity: isReserved || isPast ? 0.8 : 1,
                                minWidth: 95,
                                alignItems: "center",
                                borderWidth: 1,
                                borderColor:
                                  isReserved || isPast ? "#dee2e6" : "#28a745",
                              }}
                            >
                              <Text
                                style={{
                                  color:
                                    isReserved || isPast ? "#6c757d" : "white",
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

      {/* Modal de confirmación de reserva */}
      <Modal
        visible={showConfirmModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowConfirmModal(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              padding: 24,
              borderRadius: 16,
              width: "85%",
              maxWidth: 320,
              alignItems: "center",
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              elevation: 5,
            }}
          >
            <Text
              style={{
                fontWeight: "700",
                fontSize: 18,
                marginBottom: 8,
                color: "#333",
              }}
            >
              ¿Confirmar reserva?
            </Text>
            {pendingReservation && (
              <Text
                style={{
                  fontSize: 14,
                  marginBottom: 18,
                  textAlign: "center",
                  color: "#666",
                }}
              >
                {pendingReservation.field.name} -{" "}
                {Number(pendingReservation.slot.split(":")[0]) > 9
                  ? pendingReservation.slot
                  : `0${pendingReservation.slot}`}
              </Text>
            )}
            <Text
              style={{
                fontSize: 15,
                marginBottom: 24,
                textAlign: "center",
                color: "#555",
              }}
            >
              ¿Estás seguro que deseas reservar este horario? {"\n"} Para
              deshacer esta acción tienes hasta{" "}
              <Text style={{ fontWeight: "bold", color: "red" }}>6 horas</Text>{" "}
              antes de la hora de inicio.
            </Text>
            <View style={{ flexDirection: "row", gap: 16 }}>
              <Pressable
                style={{
                  backgroundColor: "#28a745",
                  paddingVertical: 12,
                  paddingHorizontal: 24,
                  borderRadius: 8,
                  minWidth: 100,
                  alignItems: "center",
                }}
                onPress={async () => {
                  if (pendingReservation) {
                    await handleReservation(
                      pendingReservation.slot,
                      pendingReservation.selectedDate,
                      pendingReservation.field
                    );
                  }
                  setShowConfirmModal(false);
                  setPendingReservation(null);
                }}
              >
                <Text style={{ color: "white", fontWeight: "600" }}>
                  Confirmar
                </Text>
              </Pressable>
              <Pressable
                style={{
                  backgroundColor: "#6c757d",
                  paddingVertical: 12,
                  paddingHorizontal: 24,
                  borderRadius: 8,
                  minWidth: 100,
                  alignItems: "center",
                }}
                onPress={() => {
                  setShowConfirmModal(false);
                  setPendingReservation(null);
                }}
              >
                <Text style={{ color: "white", fontWeight: "600" }}>
                  Cancelar
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
