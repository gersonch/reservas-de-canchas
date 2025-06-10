import { BackButton } from "@/components/BackButton";
import { complejos } from "@/mockups/complejos";
import { useLocalSearchParams } from "expo-router/build/hooks";
import { ScrollView, Text } from "react-native";
import { CardDetalles } from "./CardDetalles";

export default function DetailsPage() {
  const { id } = useLocalSearchParams();

  // Busca el complejo por su id
  const complejoItem = complejos.find((c) => String(c.id) === String(id));

  if (!complejoItem) {
    return <Text>Complejo no encontrado</Text>;
  }

  return (
    <>
      <BackButton />
      <ScrollView>
        <CardDetalles item={complejoItem} />
      </ScrollView>
    </>
  );
}
