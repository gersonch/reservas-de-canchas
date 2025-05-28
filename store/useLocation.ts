import { create } from "zustand";

interface LocationState {
  city: string | null;
  setCity: (city: string | null) => void;
}

export const useLocationStore = create<LocationState>((set) => ({
  city: null,
  setCity: (city) => set({ city }),
}));
