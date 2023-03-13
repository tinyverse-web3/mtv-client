import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface ImState {
  webSocketUrl: string;
  initWebSocketUrl: (url:string) => void;
}

export const useImStore = create<ImState>()(
  devtools(
    persist(
      (set, get) => ({ 
        webSocketUrl:"",
        initWebSocketUrl: async (url) => {
          set({webSocketUrl:url})
          console.log(url)
        }
      }),
      {
        name: 'im-store',
        partialize: (state) =>
          Object.fromEntries(
            Object.entries(state).filter(
              ([key]) => !['none'].includes(key),
            ),
          ),
      },
    ),
  ),
);
