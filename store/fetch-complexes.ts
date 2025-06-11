import { fetchData } from "./fetch";
import { useComplexStore } from "./useComplexStore";

export function useFetchComplexes() {
  const setComplejos = useComplexStore((state) => state.setComplejos);

  async function getData() {
    const data = await fetchData({ route: "complexes" });
    if (data) {
      setComplejos(data);
    }
  }

  getData();
}
