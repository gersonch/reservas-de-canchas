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
      API_URL: "http://192.168.1.3:3000",
      DEBUG: true,
      APP_ENV: "development",
    };
  } else if (isExpo || Constants.executionEnvironment === "standalone") {
    // Aplicación empaquetada (APK/IPA)
    return {
      API_URL: "https://my-court-api.onrender.com", // Cambia esta URL por tu API real
      DEBUG: false,
      APP_ENV: "production",
    };
  } else {
    // Staging o preview
    return {
      API_URL: "https://my-court-api.onrender.com", // Cambia esta URL por tu API de staging
      DEBUG: true,
      APP_ENV: "staging",
    };
  }
};

export const config = getConfig();
export const { API_URL, DEBUG, APP_ENV } = config;
