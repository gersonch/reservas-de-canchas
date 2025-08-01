import { useAuthStore } from "@/store/useAuthStore";
import { Slot } from "expo-router";

export default function ReservasLayout() {
  const { user } = useAuthStore();
  if (!user) {
    return null;
  }
  return <Slot />;
}
