import { create } from "zustand";

type ToastState = {
  message: string;
  title: string;
  open: boolean;
  setTitle: (title: string) => void;
  setMessage: (message: string) => void;
  setOpen: (open: boolean) => void;
};

export const useToastStore = create<ToastState>((set) => ({
  message: "",
  title: "",
  open: false,
  setTitle: (title) => set(() => ({ title })),
  setMessage: (message) => set(() => ({ message })),
  setOpen: (open) => set(() => ({ open })),
}));
