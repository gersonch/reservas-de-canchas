import { IUserProfile } from "@/common/types/user-profile";
import { BackButton } from "@/components/BackButton";
import api from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";
import { useProfileStore } from "@/store/useProfileStore";
import { FontAwesome5 } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

export default function ProfileConfiguration() {
  const uriIfNoProfileImage =
    "https://res.cloudinary.com/dsm9c4emg/image/upload/v1751077004/icono-perfil-usuario-estilo-plano-ilustracion-vector-avatar-miembro-sobre-fondo-aislado-concepto-negocio-signo-permiso-humano_157943-15752_ewx5pm.avif";
  // ------------------- ESTADOS PRINCIPALES -------------------
  const { profile } = useProfileStore();
  const { user } = useAuthStore();
  const [isSubmittingImage, setIsSubmittingImage] = useState(false);
  const [localImageUri, setLocalImageUri] = useState<string | null>(null);
  const [editingImage, setEditingImage] = useState(false);
  const [isSubmittingData, setIsSubmittingData] = useState(false);
  const [profileData, setProfileData] = useState<IUserProfile>({
    name: profile?.name || "",
    email: profile?.email || "",
    image_url: profile?.image_url || uriIfNoProfileImage,
    phone: profile?.phone || "",
    country: profile?.country || "",
    city: profile?.city || "",
    address: profile?.address || "",
  });
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
    profile?.image_url || uriIfNoProfileImage
  );
  // ------------------- HANDLERS -------------------
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
  };

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };
  const handlePasswordChange = (field: string, value: string) => {
    setPasswordForm((prev) => ({ ...prev, [field]: value }));
  };

  const showToast = (type: "success" | "error" | "info", message: string) => {
    Toast.show({
      type,
      text1: message,
    });
  };

  async function handleSubmitData() {
    if (!user?.id) return;
    // Validar si hay cambios
    const phoneValue = form.phone ? Number(form.phone) : undefined;
    const noChanges =
      (form.phone?.trim() || "") ===
        (profileData.phone?.toString().trim() || "") &&
      (form.country?.trim() || "") === (profileData.country?.trim() || "") &&
      (form.city?.trim() || "") === (profileData.city?.trim() || "") &&
      (form.address?.trim() || "") === (profileData.address?.trim() || "");

    if (noChanges) {
      showToast("error", "Asegurate de cambiar datos.");
      return;
    }
    try {
      setIsSubmittingData(true);
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
        showToast("success", "Datos actualizados correctamente.");
        // Fuerza el ActivityIndicator a mostrarse al menos 1 segundo
        setTimeout(() => setIsSubmittingData(false), 1000);
      } else {
        showToast("error", "Error al actualizar perfil");
        setIsSubmittingData(false);
      }
    } catch {
      showToast("error", "Error al actualizar perfil");
      setIsSubmittingData(false);
    }
  }

  async function handleSubmitImage() {
    setIsSubmittingImage(true);

    if (!localImageUri) {
      showToast("error", "Primero selecciona una imagen.");
      setIsSubmittingImage(false);
      return;
    }
    try {
      if (!user?.id) {
        showToast("error", "Usuario no encontrado.");
        setIsSubmittingImage(false);
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
      if (response.status === 200 && response.data?.image_url) {
        setProfileData((prev) => ({
          ...prev,
          image_url: response.data.image_url,
        }));
        // Eliminar la imagen anterior solo si actualImageUrl es válida y no es la default ni la nueva
        // Eliminación de imagen anterior deshabilitada por solicitud
        setImageUrl(response.data.image_url); // Actualizar la url global
        setLocalImageUri(null); // Limpiar la uri local
        showToast("success", "Imagen actualizada");
      } else {
        showToast("error", "Error al actualizar la imagen");
      }
      setEditingImage(false);
      setIsSubmittingImage(false);
    } catch {
      showToast("error", "Error al actualizar la imagen");
      setIsSubmittingImage(false);
    }
  }

  const getIos = Platform.OS === "ios";
  return (
    <SafeAreaProvider style={{ flex: 1, backgroundColor: "#fff" }}>
      <KeyboardAvoidingView
        behavior={getIos ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scroll}>
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
                disabled={editingImage && isSubmittingImage}
              >
                {editingImage ? (
                  isSubmittingImage ? (
                    <ActivityIndicator size={24} color="#1976D2" />
                  ) : (
                    <FontAwesome5 name="check" size={24} color="green" />
                  )
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
                <Text style={styles.saveButtonText}>
                  {isSubmittingData ? (
                    <ActivityIndicator size={24} color="#fff" />
                  ) : (
                    "Guardar cambios"
                  )}
                </Text>
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
    paddingBottom: 24,
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
