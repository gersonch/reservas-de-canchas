import { IUserProfile } from "@/common/types/user-profile";
import { BackButton } from "@/components/BackButton";
import api from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";
import { useProfileStore } from "@/store/useProfileStore";
import { FontAwesome5 } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function ProfileConfiguration() {
  const { profile } = useProfileStore();
  const { user } = useAuthStore();
  // Simulación de datos de perfil, reemplazar por datos reales si es necesario
  // Estado para la uri local de la imagen seleccionada
  const [localImageUri, setLocalImageUri] = useState<string | null>(null);

  const handlePickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Se necesitan permisos para acceder a la galería de imágenes.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.1,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setLocalImageUri(result.assets[0].uri); // Guardar la uri local
      setEditingImage(true);
    }
    console.log("Imagen seleccionada:", result);
  };

  const [profileData, setProfileData] = useState<IUserProfile>({
    name: profile?.name || "",
    email: profile?.email || "",
    image_url:
      profile?.image_url ||
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbit7igAlvfCrt2T_8_uh5kzAXgseW_SEfqw&s",
    phone: profile?.phone || "",
    country: profile?.country || "",
    city: profile?.city || "",
    address: profile?.address || "",
  });
  const [editingImage, setEditingImage] = useState(false);
  const [form, setForm] = useState({
    name: profile?.name,
    phone: profile?.phone?.toString() || "",
    country: profile?.country || "",
    city: profile?.city || "",
    address: profile?.address || "",
  });
  const [passwordForm, setPasswordForm] = useState({
    current: "",
    new1: "",
    new2: "",
  });
  const [imageUrl, setImageUrl] = useState(
    profile?.image_url ||
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbit7igAlvfCrt2T_8_uh5kzAXgseW_SEfqw&s"
  );

  // Handlers para inputs
  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };
  const handlePasswordChange = (field: string, value: string) => {
    setPasswordForm((prev) => ({ ...prev, [field]: value }));
  };

  async function handleSubmitData() {
    if (!user?.id) return;
    // Validar si hay cambios
    const phoneValue = form.phone ? Number(form.phone) : undefined;
    if (
      phoneValue === profile?.phone &&
      form.country === profile?.country &&
      form.city === profile?.city &&
      form.address === profile?.address
    ) {
      alert("No hay cambios en los datos del perfil.");
      return;
    }
    try {
      const response = await api.patch(`/users/${user.id}`, {
        phone: phoneValue || undefined,
        country: form.country || "",
        city: form.city || "",
        address: form.address || "",
      });
      if (response.status === 200) {
        setProfileData((prev) => ({
          ...prev,
          phone: form.phone || "",
          country: form.country,
          city: form.city,
          address: form.address,
        }));
        alert("Datos actualizados correctamente.");
      } else {
        alert("Error al actualizar los datos del perfil.");
      }
    } catch (error) {
      alert(
        "Error al actualizar los datos del perfil: " + (error as any)?.message
      );
    }
  }

  const uriIfNoProfileImage =
    "https://res.cloudinary.com/dsm9c4emg/image/upload/v1751077004/icono-perfil-usuario-estilo-plano-ilustracion-vector-avatar-miembro-sobre-fondo-aislado-concepto-negocio-signo-permiso-humano_157943-15752_ewx5pm.avif";

  async function handleSubmitImage() {
    const actualImageUrl = profileData.image_url;
    if (!actualImageUrl || actualImageUrl !== uriIfNoProfileImage) {
      alert("No se puede actualizar la imagen de perfil más de una vez.");
      return;
    }

    if (!localImageUri) {
      alert("Primero selecciona una imagen.");
      return;
    }
    try {
      if (!user?.id) {
        alert("Usuario no encontrado.");
        return;
      }

      const formData = new FormData();
      // Extraer el nombre del archivo de la uri local
      const fileName = localImageUri.split("/").pop() || "profile.jpg";
      formData.append("file", {
        uri: localImageUri,
        name: fileName,
        type: "image/jpeg",
      } as any);
      const response = await api.patch(`/users/${user?.id}/image`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Respuesta backend imagen:", response);
      if (response.status === 200 && response.data?.image_url) {
        setProfileData((prev) => ({
          ...prev,
          image_url: response.data.image_url,
        }));
        setImageUrl(response.data.image_url); // Actualizar la url global
        setLocalImageUri(null); // Limpiar la uri local
        alert("Imagen de perfil actualizada correctamente.");
      } else {
        alert("Error al actualizar la imagen de perfil.\n");
        console.error("Error al actualizar la imagen:", response);
      }
      setEditingImage(false);
    } catch (error) {
      alert(
        "Error al actualizar la imagen de perfil: " + (error as any)?.message
      );
    }
  }
  const [refresh, setRefresh] = useState(false);
  const handleRefresh = () => {
    setRefresh(true);
    // Aquí puedes agregar la lógica para refrescar los datos
    setTimeout(() => {
      setRefresh(false);
    }, 1000); // Simula un delay para la actualización
  };

  const getIos = Platform.OS === "ios";
  return (
    <SafeAreaProvider>
      <KeyboardAvoidingView
        behavior={getIos ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          refreshControl={
            <RefreshControl refreshing={refresh} onRefresh={handleRefresh} />
          }
        >
          <BackButton />

          <View style={styles.container}>
            {/* Imagen de perfil con lápiz */}
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: localImageUri || imageUrl }}
                style={styles.profileImage}
              />
              <Pressable
                style={styles.editIcon}
                onPress={editingImage ? handleSubmitImage : handlePickImage}
              >
                {editingImage ? (
                  <FontAwesome5 name="check" size={24} color="green" />
                ) : (
                  <FontAwesome5 name="pencil-alt" size={20} color="#1976D2" />
                )}
              </Pressable>
            </View>
            {/* Formulario de datos personales */}
            <View style={styles.formSection}>
              <Text style={styles.label}>Nombre</Text>
              <TextInput
                style={[
                  styles.input,
                  { color: "rgba(0,0,0,0.5)", backgroundColor: "#f1f1f1" },
                ]}
                value={form.name}
                onChangeText={(v) => handleChange("name", v)}
                placeholder="Nombre completo"
                editable={false}
              />
              <Text style={styles.label}>Número de celular</Text>
              <TextInput
                style={styles.input}
                value={form.phone}
                onChangeText={(v) => handleChange("phone", v)}
                placeholder="Ej: +54 9 11 1234-5678"
                keyboardType="phone-pad"
              />
              <Text style={styles.label}>País</Text>
              <TextInput
                style={styles.input}
                value={form.country}
                onChangeText={(v) => handleChange("country", v)}
                placeholder="País"
              />
              <Text style={styles.label}>Ciudad</Text>
              <TextInput
                style={styles.input}
                value={form.city}
                onChangeText={(v) => handleChange("city", v)}
                placeholder="Ciudad"
              />
              <Text style={styles.label}>Dirección</Text>
              <TextInput
                style={styles.input}
                value={form.address}
                onChangeText={(v) => handleChange("address", v)}
                placeholder="Dirección"
              />
              <Pressable style={styles.saveButton} onPress={handleSubmitData}>
                <Text style={styles.saveButtonText}>Guardar cambios</Text>
              </Pressable>
            </View>
            {/* Formulario de contraseña */}
            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Cambiar contraseña</Text>
              <Text style={styles.label}>Contraseña actual</Text>
              <TextInput
                style={styles.input}
                value={passwordForm.current}
                onChangeText={(v) => handlePasswordChange("current", v)}
                placeholder="Contraseña actual"
                secureTextEntry
              />
              <Text style={styles.label}>Nueva contraseña</Text>
              <TextInput
                style={styles.input}
                value={passwordForm.new1}
                onChangeText={(v) => handlePasswordChange("new1", v)}
                placeholder="Nueva contraseña"
                secureTextEntry
              />
              <Text style={styles.label}>Confirmar nueva contraseña</Text>
              <TextInput
                style={styles.input}
                value={passwordForm.new2}
                onChangeText={(v) => handlePasswordChange("new2", v)}
                placeholder="Confirmar nueva contraseña"
                secureTextEntry
              />
              <Pressable style={styles.saveButton} onPress={() => {}}>
                <Text style={styles.saveButtonText}>Guardar cambios</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    alignItems: "center",
    padding: 24,
    backgroundColor: "#fff",
  },
  imageContainer: {
    position: "relative",
    marginBottom: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#e0e0e0",
    marginTop: 30,
  },
  editIcon: {
    position: "absolute",
    right: 0,
    bottom: 0,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 6,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
  },
  formSection: {
    width: "100%",
    maxWidth: 400,
    marginBottom: 28,
  },
  label: {
    fontSize: 15,
    color: "#1976D2",
    marginBottom: 4,
    marginTop: 12,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    backgroundColor: "#fafafa",
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 8,
    marginTop: 8,
  },
  saveButton: {
    backgroundColor: "#1976D2",
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 18,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    letterSpacing: 0.5,
  },
});
