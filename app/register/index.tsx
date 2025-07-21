import { BackButton } from "@/components/BackButton";
import api from "@/lib/api";
import { validateRut } from "@fdograph/rut-utilities";
import { Redirect } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
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

const fields = [
  {
    key: "name",
    label: "Nombre",
    placeholder: "Ej: Juan Pérez",
    secure: false,
    keyboardType: "default",
    autoCapitalize: "words",
  },
  {
    key: "email",
    label: "Email",
    placeholder: "Ej: juan@mail.com",
    secure: false,
    keyboardType: "email-address",
    autoCapitalize: "none",
  },
  {
    key: "password",
    label: "Contraseña",
    placeholder: "Ej: TuContraseña123",
    secure: true,
    keyboardType: "default",
    autoCapitalize: "none",
  },
  {
    key: "confirmPassword",
    label: "Confirmar contraseña",
    placeholder: "Repite tu contraseña",
    secure: true,
    keyboardType: "default",
    autoCapitalize: "none",
  },
  {
    key: "rut",
    label: "RUT",
    placeholder: "Ej: 12345678K",
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
    confirmPassword: "",
    rut: "",
  });
  const [redirect, setRedirect] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (key: string, value: string) => {
    // Si es RUT, solo permitir números y K/k, sin puntos ni guion
    let newValue = value;
    if (key === "rut") {
      // Elimina todo excepto números y k/K
      newValue = value.replace(/[^0-9kK]/g, "");
    }
    setForm({ ...form, [key]: newValue });
  };

  const showToast = (type: string, message: string) => {
    Toast.show({
      type: type,
      text1: type === "success" ? "Éxito" : "Error",
      text2: message,
      position: "bottom",
      visibilityTime: 3000,
    });
  };
  const handleRegister = async () => {
    if (Object.values(form).some((v) => !v)) {
      showToast("error", "Por favor completa todos los campos.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      showToast("error", "Las contraseñas no coinciden.");
      return;
    }

    const formToSend = {
      name: form.name,
      email: form.email,
      password: form.password,
      rut: form.rut,
    };

    try {
      //valiudate RUT
      setLoading(true);
      if (!validateRut(form.rut)) {
        showToast("error", "RUT inválido");
        return;
      }
      const response = await api.post("/auth/register", formToSend);
      if (response.status !== 201) {
        showToast("error", response.data.message || "Error al registrar");
        return;
      }
      showToast("success", "Registro exitoso");
      setRedirect(true);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message;

      if (errorMessage === "User already exists") {
        showToast("error", "El usuario ya existe");
        return;
      }
      showToast("error", error.response?.data?.message || "Error al registrar");
    } finally {
      setLoading(false);
    }
  };

  if (redirect) {
    return <Redirect href="/(tabs)/(login)" />;
  }
  const getIos = Platform.OS === "ios";

  return (
    <SafeAreaProvider>
      <BackButton />
      <KeyboardAvoidingView
        behavior={getIos ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView style={styles.container}>
          <Text style={styles.title}>Registro</Text>
          {fields.map((f) => (
            <View key={f.key} style={{ marginBottom: 12 }}>
              <Text
                style={{
                  fontWeight: "bold",
                  color: "#1976D2",
                  marginBottom: 4,
                }}
              >
                {f.label}
              </Text>
              <TextInput
                style={styles.input}
                placeholder={f.placeholder}
                value={form[f.key as keyof typeof form]}
                onChangeText={(text) => handleChange(f.key, text)}
                secureTextEntry={f.secure}
                keyboardType={
                  f.key === "rut" ? "default" : (f.keyboardType as any)
                }
                autoCapitalize={f.autoCapitalize as any}
              />
              {f.key === "rut" && (
                <Text
                  style={{
                    color: "#888",
                    fontSize: 13,
                    marginTop: -8,
                    marginBottom: 4,
                  }}
                >
                  Sin puntos ni guion. Ejemplo: 12345678K
                </Text>
              )}
            </View>
          ))}
          <Pressable style={styles.button} onPress={handleRegister}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Registrarse</Text>
            )}
          </Pressable>
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              marginTop: 20,
              flexDirection: "row",
              flexWrap: "wrap",
            }}
          >
            <Text style={{ textAlign: "center", fontSize: 15 }}>
              ¿Ya tienes una cuenta?
            </Text>
            <Pressable
              style={{ marginLeft: 6 }}
              onPress={() => setRedirect(true)}
            >
              <Text
                style={{
                  color: "#1976D2",
                  textDecorationLine: "underline",
                  fontWeight: "bold",
                  fontSize: 15,
                }}
              >
                Inicia sesión aquí
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#fff",
    paddingTop: 100,
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
