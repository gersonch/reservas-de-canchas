import { IComplejo } from "@/app/common/types/compejo";
import { create } from "zustand";

interface ComplexState {
  complejos: IComplejo[];
  ratings: number[];
  setComplejos: (complejos: IComplejo[]) => void;
  setRatings: (ratings: number[]) => void;
}

export const useComplexStore = create<ComplexState>((set) => ({
  complejos: [],
  ratings: [],
  setRatings: (ratings) => set({ ratings }),
  setComplejos: (complejos) => set({ complejos }),
}));
