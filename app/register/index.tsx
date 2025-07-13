import api from "@/lib/api";
import React, { useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

const fields = [
  {
    key: "name",
    placeholder: "Nombre",
    secure: false,
    keyboardType: "default",
    autoCapitalize: "words",
  },
  {
    key: "email",
    placeholder: "Email",
    secure: false,
    keyboardType: "email-address",
    autoCapitalize: "none",
  },
  {
    key: "password",
    placeholder: "Contraseña",
    secure: true,
    keyboardType: "default",
    autoCapitalize: "none",
  },
  {
    key: "rut",
    placeholder: "RUT",
    secure: false,
    keyboardType: "default",
    autoCapitalize: "characters",
  },
];

export default function RegisterScreen() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    rut: "",
  });

  const handleChange = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const showToast = (type: string, message: string) => {
    Toast.show({
      type: type,
      text1: "Éxito",
      text2: message,
      position: "bottom",
      visibilityTime: 3000,
    });
  };
  const handleRegister = async () => {
    if (Object.values(form).some((v) => !v)) {
      Alert.alert("error", "Por favor completa todos los campos.");
      return;
    }

    try {
      const response = await api.post("/auth/register", form);
      if (response.status !== 201) {
        showToast("error", response.data.message || "Error al registrar");
        return;
      }
      showToast("success", "Registro exitoso");
    } catch (error) {
      showToast("error", error.response?.data?.message || "Error al registrar");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registro</Text>
      {fields.map((f) => (
        <TextInput
          key={f.key}
          style={styles.input}
          placeholder={f.placeholder}
          value={form[f.key as keyof typeof form]}
          onChangeText={(text) => handleChange(f.key, text)}
          secureTextEntry={f.secure}
          keyboardType={f.keyboardType as any}
          autoCapitalize={f.autoCapitalize as any}
        />
      ))}
      <Pressable style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Registrarse</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  button: {
    backgroundColor: "#1976D2",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
