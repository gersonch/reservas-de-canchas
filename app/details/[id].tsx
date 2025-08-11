import { BackButton } from "@/components/BackButton";
import { useComplexStore } from "@/store/useComplexStore";
import { useLocalSearchParams } from "expo-router";
import { ScrollView, Text } from "react-native";
import { CardDetalles } from "../../components/details/CardDetalles";

export default function DetailsPage() {
  const complejos = useComplexStore((state) => state.complejos);
  const params = useLocalSearchParams();

  const { id } = params;

  if (!complejos || complejos.length === 0) {
    return <Text>Cargando complejo...</Text>;
  }

  const complejoItem = complejos.find((c) => String(c._id) === String(id));

  if (!complejoItem) {
    return <Text>Complejo no encontrado</Text>;
  }

  return (
    <>
      <BackButton />
      <ScrollView showsVerticalScrollIndicator={false}>
        <CardDetalles item={complejoItem} param={id} />
      </ScrollView>
    </>
  );
}
