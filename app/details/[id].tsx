import { BackButton } from "@/components/BackButton";
import { useComplexStore } from "@/store/useComplexStore";
import { useLocalSearchParams } from "expo-router";
import { ScrollView, Text } from "react-native";
import { CardDetalles } from "./CardDetalles";

export default function DetailsPage() {
  const complejos = useComplexStore((state) => state.complejos);
  const params = useLocalSearchParams();

  const { _id } = params;

  if (!complejos || complejos.length === 0) {
    return <Text>Cargando complejo...</Text>;
  }

  const complejoItem = complejos.find((c) => String(c._id) === String(_id));

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
