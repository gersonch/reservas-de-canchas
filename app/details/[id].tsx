import { BackButton } from "@/components/BackButton";
import { complejos } from "@/mockups/complejos";
import { useLocalSearchParams } from "expo-router/build/hooks";
import { Text, View } from "react-native";

export default function DetailsPage() {
  const { id } = useLocalSearchParams();

  const complejoItem = complejos[parseInt(id as string, 10)];
  return (
    <>
      <BackButton />
      <View>
        <Text>{complejoItem.name}</Text>
      </View>
    </>
  );
}
