import api from "@/lib/api";

export async function fetchRatings(complexId: string) {
  const response = await api.get(`/rating/${complexId}`);
  if (!response || !response.data) {
    throw new Error("Failed to fetch ratings");
  }
  return response.data;
}
