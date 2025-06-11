import { API_URL } from "@/constants/api-url";

export const fetchData = async ({ route }: { route: string }) => {
  try {
    const response = await fetch(`${API_URL}/${route}`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch complejos:", error);
    return null;
  }
};
