import { BackButton } from "@/components/BackButton";
import { Text, View } from "react-native";

export default function RecoverPasswordScreen() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f0f0f0",
      }}
    >
      <BackButton />
      <Text>Recuperar Contraseña</Text>
    </View>
  );
}
