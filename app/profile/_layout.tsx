import { RestrictedAccess } from "@/components/RestrictedAcces";
import { useAuthStore } from "@/store/useAuthStore";
import { Slot } from "expo-router";

export default function ReservasLayout() {
  const { user } = useAuthStore();
  if (!user) {
    return <RestrictedAccess />;
  }
  return <Slot />;
}
