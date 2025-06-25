import { IconSymbol } from "@/components/ui/IconSymbol";
import { useAuthStore } from "@/store/useAuthStore";
import { Tabs } from "expo-router";

export default function TabLayout() {
  const { user } = useAuthStore();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="(home)/index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="(reservas)"
        options={{
          title: "Reservas",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="calendar" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(mis-torneos)"
        options={{
          title: "Mis Torneos",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="trophy.fill" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="(login)/index"
        options={
          !user
            ? {
                title: "Iniciar sesión",
                tabBarIcon: ({ color }) => (
                  <IconSymbol size={28} name="person" color={color} />
                ),
              }
            : {
                title: "Mi perfil",
                tabBarIcon: ({ color }) => (
                  <IconSymbol size={28} name="person.fill" color={color} />
                ),
              }
        }
      />
    </Tabs>
  );
}
