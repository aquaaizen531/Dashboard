import { create } from "zustand";

export const useUserStateStore = create((set) => ({
  users: [],
  userModalOpen: false,
  isEdit: false,
  editId: null,
  formValue: {
    name: "",
    email: "",
    phone: "",
    password: "",
    location: "",
    role: "",
  },
  setUsers: (users) => set({ users }),
  setUserModalOpen: (value) => set({ userModalOpen: value }),
  setIsEdit: (value) => set({ isEdit: value }),
  setEditId: (id) => set({ editId: id }),
  setFormValue: (form) => set({ formValue: form }),
}));
