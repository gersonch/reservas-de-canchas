import { IconSymbol } from "@/components/ui/IconSymbol";
import { useAuthStore } from "@/store/useAuthStore";
import Profile from "../../profile/Profile";

import { useEffect, useState } from "react";
import {
  Image,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [msg, setMsg] = useState<string>("");

  const { user, loading, login, message } = useAuthStore();

  useEffect(() => {
    if (message) {
      setMsg(message);
    }
  }, [message]);

  async function handleLogin() {
    try {
      if (!email || !password) {
        setMsg("Por favor, completa todos los campos");
        return;
      }
      if (!email.includes("@")) {
        setMsg("Por favor, ingresa un correo electrónico válido");
        return;
      }
      if (password.length < 6) {
        setMsg("Por favor, ingresa una contraseña válida");
        return;
      }
      await login(email, password);
      setEmail("");
      setPassword("");
    } catch {
      setMsg("Error al iniciar sesión");
    }
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Cargando...</Text>
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      {user ? (
        <Profile />
      ) : (
        <View style={styles.container}>
          <Text style={styles.title}>Inicia sesión</Text>
          <Text style={styles.message}>{msg}</Text>

          <TextInput
            style={styles.input}
            inputMode="email"
            textContentType="emailAddress"
            autoCapitalize="none"
            placeholder="Ingresa tu correo"
            keyboardType="email-address"
            onChangeText={setEmail}
            value={email}
            placeholderTextColor="#888"
          />
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              textContentType="password"
              autoCapitalize="none"
              placeholder="Ingresa tu contraseña"
              secureTextEntry={!showPassword}
              onChangeText={setPassword}
              value={password}
              placeholderTextColor="#888"
            />
            <Pressable
              onPress={() => setShowPassword((prev) => !prev)}
              style={styles.eyeButton}
              hitSlop={10}
            >
              <IconSymbol
                name={showPassword ? "eye" : "eye.slash"}
                size={22}
                color={"black"}
              />
            </Pressable>
          </View>
          <Pressable style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Iniciar sesión</Text>
          </Pressable>

          <Pressable style={styles.googleButton} onPress={() => {}}>
            <View style={styles.googleContent}>
              <Image
                source={{
                  uri: "https://www.gstatic.com/marketing-cms/assets/images/d5/dc/cfe9ce8b4425b410b49b7f2dd3f3/g.webp=s48-fcrop64=1,00000000ffffffff-rw",
                }}
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 12,
                  marginRight: 10,
                }}
                resizeMode="contain"
              />
              <Text style={styles.googleButtonText}>
                Iniciar sesión con Google
              </Text>
            </View>
          </Pressable>
        </View>
      )}
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 120,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 32,
    color: "#222",
  },
  message: {
    fontSize: 16,
    color: "red",
    marginBottom: 24,
    textAlign: "center",
  },
  input: {
    width: 300,
    height: 48,
    marginBottom: 18,
    backgroundColor: "#f4f4f4",
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#222",
    borderWidth: 0,
  },
  passwordContainer: {
    width: 300,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f4f4f4",
    borderRadius: 8,
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  passwordInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: "#222",
    backgroundColor: "transparent",
    paddingHorizontal: 8,
  },
  eyeButton: {
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#4CAF50",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: 300,
    alignItems: "center",
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  googleButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    width: 300,
    alignItems: "center",
    marginTop: 14,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 2,
    elevation: 1,
  },
  googleContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  googleIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  googleIcon: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#EA4335",
  },
  googleButtonText: {
    fontSize: 16,
    color: "#222",
    fontWeight: "bold",
    letterSpacing: 0.2,
  },
});
