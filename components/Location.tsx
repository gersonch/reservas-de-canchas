import { useLocationStore } from "@/store/useLocation";
import * as Location from "expo-location";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

export default function LocationComponent() {
  const city = useLocationStore((state) => state.city);
  const setCity = useLocationStore((state) => state.setCity);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      const address = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (address.length > 0) {
        const locationInfo = address[0];
        // Si city está vacío o es muy específico, usa region
        let ciudad = locationInfo.district;
        if (!ciudad || ciudad.length < 3 || ciudad === locationInfo.district) {
          ciudad = locationInfo.region;
        }
        setCity(ciudad);
      } else {
        setErrorMsg("No se pudo obtener la ciudad");
      }
    })();
  }, []);

  return (
    <View>
      {errorMsg ? (
        <Text>{errorMsg}</Text>
      ) : (
        <Text style={{ textAlign: "center" }}>
          Estas en{" "}
          <Text style={{ color: "#FF6B00" }}>{city ? city : "La app"}</Text>
        </Text>
      )}
      <Text style={{ fontSize: 10, fontWeight: "thin", paddingBottom: 10 }}>
        Buscaremos un complejo segun tu ubicación
      </Text>
    </View>
  );
}
