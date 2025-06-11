import { IComplejo } from "@/app/common/types/compejo";
import { create } from "zustand";

interface ComplexState {
  complejos: IComplejo[];
  setComplejos: (complejos: IComplejo[]) => void;
}

export const useComplexStore = create<ComplexState>((set) => ({
  complejos: [],
  setComplejos: (complejos) => set({ complejos }),
}));
