import { useAuthStore } from "@/store/useAuthStore";
import { useProfileStore } from "@/store/useProfileStore";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import Toast, {
  BaseToast,
  ErrorToast,
  InfoToast,
} from "react-native-toast-message";

const baseToastProps = {
  minHeight: 90,
  borderRadius: 16,
  paddingVertical: 16,
  backgroundColor: "#fff",
  contentContainerStyle: { paddingHorizontal: 20, paddingVertical: 16 },
  text1Style: { color: "#000", fontWeight: "bold", fontSize: 16 },
  text2Style: { color: "#000", fontSize: 12 },
};

const toastConfig = {
  success: (props: any) => (
    <BaseToast
      {...props}
      style={{ ...baseToastProps, borderLeftColor: "#4CAF50" }}
      contentContainerStyle={baseToastProps.contentContainerStyle}
      text1Style={baseToastProps.text1Style}
      text2Style={baseToastProps.text2Style}
    />
  ),
  error: (props: any) => (
    <ErrorToast
      {...props}
      style={{ ...baseToastProps, borderLeftColor: "#F44336" }}
      contentContainerStyle={baseToastProps.contentContainerStyle}
      text1Style={baseToastProps.text1Style}
      text2Style={baseToastProps.text2Style}
    />
  ),
  info: (props: any) => (
    <InfoToast
      {...props}
      style={{ ...baseToastProps, borderLeftColor: "#1976D2" }}
      contentContainerStyle={baseToastProps.contentContainerStyle}
      text1Style={baseToastProps.text1Style}
      text2Style={baseToastProps.text2Style}
    />
  ),
};

export default function RootLayout() {
  const { checkAuth, loading, user } = useAuthStore();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  const { setProfile } = useProfileStore();

  useEffect(() => {
    checkAuth();
    if (user?.id) {
      setProfile(user.id);
    }
  }, [checkAuth, user?.id]);

  if (!loaded || loading) {
    return null;
  }

  return (
    <ThemeProvider value={DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }} />
      <Toast config={toastConfig} position="bottom" />
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
