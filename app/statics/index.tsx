import { BackButton } from "@/components/BackButton";
import { Text, View } from "react-native";

export default function StaticsScreen() {
  return (
    <>
      <BackButton />
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Estadísticas</Text>
      </View>
    </>
  );
}
