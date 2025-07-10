import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export const facilitiesConfig = [
  {
    key: "bar",
    label: "Bar",
    icon: FontAwesome,
    iconProps: { name: "glass", size: 24 },
    color: "#4CAF50",
  },
  {
    key: "changingRooms",
    label: "Camarines",
    icon: MaterialIcons,
    iconProps: { name: "checkroom", size: 24 },
    color: "#4CAF50",
  },
  {
    key: "parking",
    label: "Estacionamiento",
    icon: FontAwesome,
    iconProps: { name: "car", size: 24 },
    color: "#4CAF50",
  },
  {
    key: "restaurant",
    label: "Restaurante",
    icon: MaterialIcons,
    iconProps: { name: "restaurant", size: 24 },
    color: "#4CAF50",
  },
  {
    key: "showers",
    label: "Duchas",
    icon: FontAwesome,
    iconProps: { name: "shower", size: 24 },
    color: "#4CAF50",
  },
];

// Configuración de equipamiento (fuera del return)
export const equipmentConfig = [
  {
    key: "futbol",
    label: "Fútbol",
    icon: FontAwesome,
    iconProps: { name: "soccer-ball-o", size: 24 },
    color: "black",
  },
  {
    key: "tenis",
    label: "Tenis",
    icon: MaterialIcons,
    iconProps: { name: "sports-tennis", size: 24 },
    color: "#4CAF50",
  },
  {
    key: "padel",
    label: "Padel",
    icon: Ionicons,
    iconProps: { name: "tennisball", size: 24 },
    color: "#4CAF50",
  },
];
