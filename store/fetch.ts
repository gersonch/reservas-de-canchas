import { API_URL } from "@/constants/api-url";
import { DEBUG } from "@/constants/config";
import api from "@/lib/api";

export const fetchData = async (route: string) => {
  try {
    const response = await api.get(`${API_URL}/${route}`);
    if (!response) {
      throw new Error("Network response was not ok");
    }
    const data = await response;
    return data;
  } catch (error) {
    if (DEBUG) {
      console.warn("Failed to fetch data from route:", route, error);
    }
    // Retornar estructura vacía en lugar de null para evitar crashes
    return { data: [] };
  }
};
