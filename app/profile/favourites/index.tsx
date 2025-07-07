import { BackButton } from "@/components/BackButton";
import { ComplejoCard } from "@/components/home/components/ComplejoCard";
import { ScrollView, Text } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function FavouritesPage() {
  // Simula favoritos con la estructura de IComplejo
  const favourites = [
    {
      _id: "1",
      name: "Cancha El Progreso",
      address: "Av. Siempre Viva 123",
      city: "Buenos Aires",
      country: "Argentina",
      region: "Buenos Aires",
      image_url: [
        "https://civideportes.com.co/wp-content/uploads/2019/08/Cancha-de-f%C3%BAtbol-11.jpg",
      ],
      stars: 4.5,
    },
    {
      _id: "2",
      name: "Complejo Los Amigos",
      address: "Calle Falsa 456",
      city: "Córdoba",
      country: "Argentina",
      region: "Córdoba",
      image_url: [
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwASkn-WEMiwNEhTIuKcDB4ta1jkorGGJl7g&s",
      ],
      stars: 4.2,
    },
    {
      _id: "3",
      name: "Fútbol 5 Palermo",
      address: "Av. Libertador 789",
      city: "Rosario",
      country: "Argentina",
      region: "Santa Fe",
      image_url: [
        "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=800&q=80",
      ],
      stars: 4.8,
    },
    {
      _id: "4",
      name: "Club Deportivo Sur",
      address: "Ruta 8 km 12",
      city: "Mendoza",
      country: "Argentina",
      region: "Mendoza",
      image_url: [
        "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80",
      ],
      stars: 4.0,
    },
    {
      _id: "5",
      name: "Polideportivo Norte",
      address: "Calle 9 de Julio 321",
      city: "Salta",
      country: "Argentina",
      region: "Salta",
      image_url: [
        "https://images.unsplash.com/photo-1504470695779-75300268aa0e?auto=format&fit=crop&w=800&q=80",
      ],
      stars: 3.9,
    },
  ];
  return (
    <SafeAreaProvider>
      <BackButton />
      <ScrollView
        contentContainerStyle={{
          alignItems: "center",
          paddingVertical: 24,
          backgroundColor: "#f7f9fa",
          minHeight: "100%",
        }}
        style={{ flex: 1, backgroundColor: "#f7f9fa" }}
        showsVerticalScrollIndicator={false}
      >
        <Text
          style={{
            fontSize: 28,
            fontWeight: "bold",
            color: "#1976D2",
            marginBottom: 18,
            marginTop: 10,
            letterSpacing: 0.5,
          }}
        >
          Mis Favoritos
        </Text>
        {favourites.length > 0 ? (
          <ComplejoCard complejo={favourites as any} isLoading={false} />
        ) : (
          <Text style={{ color: "#888", fontSize: 18, marginTop: 40 }}>
            No tienes favoritos guardados.
          </Text>
        )}
      </ScrollView>
    </SafeAreaProvider>
  );
}
