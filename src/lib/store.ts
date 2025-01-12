import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name: string;
  username: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, username: string) => void;
  register: (userData: Omit<User, 'id'> & { password: string }) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (email, password, username) => {
        const user = { id: '1', email, name: email.split('@')[0], username };
        set({ user, isAuthenticated: true });
      },
      register: (userData) => {
        const user = { id: '1', email: userData.email, name: userData.name, username: userData.username };
        set({ user, isAuthenticated: true });
      },
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
    }
  )
);

interface ChatState {
  isOpen: boolean;
  messages: Array<{ id: string; text: string; sender: 'user' | 'doctor' | 'system'; timestamp: Date }>;
  toggleChat: () => void;
  addMessage: (message: { text: string; sender: 'user' | 'doctor' | 'system' }) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  isOpen: false,
  messages: [],
  toggleChat: () => set((state) => ({ isOpen: !state.isOpen })),
  addMessage: (message) =>
    set((state) => ({
      messages: [
        ...state.messages,
        { id: crypto.randomUUID(), timestamp: new Date(), ...message },
      ],
    })),
}));