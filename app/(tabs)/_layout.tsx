import { IconSymbol } from "@/components/ui/IconSymbol";
import { useNavigation } from "@react-navigation/native";
import { Tabs } from "expo-router";

export default function TabLayout() {
  const navigation = useNavigation();
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
        name="(reservas)/index"
        options={{
          title: "Reservas",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="calendar" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(login)/index"
        options={{
          title: "Iniciar sesión",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="person.fill" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
