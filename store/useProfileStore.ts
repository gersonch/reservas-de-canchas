import { IUserProfile } from "@/common/types/user-profile";
import api from "@/lib/api";
import { create } from "zustand";

interface ProfileState {
  profile: IUserProfile | null;
  loadingProfile: boolean;
  setProfile: (userId: string) => void;
}

export const useProfileStore = create<ProfileState>((set) => ({
  profile: null,
  loadingProfile: true,

  setProfile: async (userId) => {
    try {
      const response = await api.get(`/users/${userId}`);
      if (response.status !== 200) {
        throw new Error("Error al obtener el perfil");
      }
      set({ profile: response.data, loadingProfile: false });
    } catch {
      set({ loadingProfile: false });
      throw new Error("Error al obtener el perfil");
    }
  },
}));
