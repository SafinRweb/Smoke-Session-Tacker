import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { brands } from "../constants/brands";

export const useStore = create((set, get) => ({
  users: [],
  sessions: [],
  currentSession: null,

  addUser: (name) =>
    set((state) => ({
      users: [...state.users, { name, counts: {} }],
    })),

  removeUser: (index) =>
    set((state) => ({
      users: state.users.filter((_, i) => i !== index),
    })),

  addCig: (userIndex, brand) =>
    set((state) => {
      const users = [...state.users];
      const counts = users[userIndex].counts;

      counts[brand] = (counts[brand] || 0) + 1;

      return { users };
    }),

  removeCig: (userIndex, brand) =>
    set((state) => {
      const users = [...state.users];
      const counts = users[userIndex].counts;

      if (counts[brand] > 0) counts[brand] -= 1;

      return { users };
    }),

  getUserTotal: (counts) =>
    Object.entries(counts).reduce(
      (sum, [brand, qty]) => sum + brands[brand] * qty,
      0
    ),

  getSessionTotal: () => {
    const { users, getUserTotal } = get();
    return users.reduce(
      (total, user) => total + getUserTotal(user.counts),
      0
    );
  },

  saveSession: async () => {
    const { users, sessions } = get();

    const newSession = {
      id: Date.now(),
      users,
      total: get().getSessionTotal(),
      date: new Date().toLocaleString(),
    };

    const updated = [newSession, ...sessions];

    await AsyncStorage.setItem("sessions", JSON.stringify(updated));

    set({ sessions: updated, users: [] });
  },

  loadSessions: async () => {
    const data = await AsyncStorage.getItem("sessions");
    if (data) set({ sessions: JSON.parse(data) });
  },
}));