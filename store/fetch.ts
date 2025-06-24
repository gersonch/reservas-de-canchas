import { API_URL } from "@/constants/api-url";
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
    console.error("Failed to fetch complejos:", error);
    return null;
  }
};
