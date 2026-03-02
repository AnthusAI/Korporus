import { create } from "zustand";

interface HelloStore {
  language: string;
  setLanguage: (lang: string) => void;
}

export const useHelloStore = create<HelloStore>((set) => ({
  language: "en",
  setLanguage: (lang) => set({ language: lang }),
}));
