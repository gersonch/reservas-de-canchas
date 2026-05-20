import Constants from "expo-constants";

interface Config {
  API_URL: string;
  DEBUG: boolean;
  APP_ENV: "development" | "staging" | "production";
}

const getConfig = (): Config => {
  // Detectar el entorno
  const isDev = __DEV__;
  const isExpo = Constants.executionEnvironment === "storeClient";

  if (isDev && !isExpo) {
    // Desarrollo local
    return {
      API_URL: "http://192.168.1.11:3000",
      DEBUG: true,
      APP_ENV: "development",
    };
  } else if (isExpo || Constants.executionEnvironment === "standalone") {
    // Aplicación empaquetada (APK/IPA)
    return {
      API_URL: "http://192.168.1.11:3000", // Cambia esta URL por tu API real
      DEBUG: false,
      APP_ENV: "production",
    };
  }

  // Fallback para otros casos
  return {
    API_URL: "http://192.168.1.11:3000",
    DEBUG: false,
    APP_ENV: "production",
  };
};

export const config = getConfig();
export const { API_URL, DEBUG, APP_ENV } = config;
