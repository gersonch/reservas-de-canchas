import { useState } from "react";
import {
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
  const session = false;

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      {!session ? (
        <View style={styles.container}>
          <Text style={styles.title}>Inicia sesión</Text>

          <TextInput
            style={styles.input}
            textContentType="emailAddress"
            autoCapitalize="none"
            placeholder="Ingresa tu correo"
            keyboardType="email-address"
            onChangeText={setEmail}
            value={email}
          />
          <Pressable style={styles.button}>
            <Text style={styles.buttonText}>Iniciar sesión</Text>
          </Pressable>
        </View>
      ) : (
        <Text>View</Text>
      )}
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 150,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
  },
  input: {
    width: 300,
    height: 50,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 15,
    borderRadius: 8,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: "black",
    fontSize: 16,
  },
});
