import { RestrictedAccess } from "@/components/RestrictedAcces";
import { useAuthStore } from "@/store/useAuthStore";
import { Slot } from "expo-router";

export default function ReservasLayout() {
  const { user } = useAuthStore();
  if (!user) {
    // Si no hay sesión, redirige al login
    return <RestrictedAccess />;
  }
  return <Slot />;
}
