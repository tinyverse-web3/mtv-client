import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { remove, cloneDeep } from 'lodash';
interface Friend {
  Id: number;
  publicKey: string;
  name: string;
  avatar: string;
  time?: Date | number;
}

interface Recipinet {
  publicKey: string;
}
interface ChatState {
  list: Friend[];
  recipient?: Recipinet;
  add: (friend: Friend) => void;
  remove: (publicKey: string) => void;
  setRecipient: (r: Recipinet) => void;
  reset: () => void;
}

export const useChatStore = create<ChatState>()(
  devtools(
    persist(
      (set, get) => ({
        list: [],
        recipient: undefined,
        add: async (n) => {
          const list = cloneDeep(get().list);
          if (!list.find((s) => s.publicKey === n.publicKey)) {
            list.push({ ...n, time: +new Date() });
            set({ list });
          }
        },
        remove: async (publicKey) => {
          const list = cloneDeep(get().list);
          remove(list, (i) => i.publicKey === publicKey);
          set({ list });
        },
        setRecipient: async (n) => {
          set({ recipient: n });
        },
        reset: () => {
          set({
            list: [],
            recipient: undefined,
          });
        },
      }),
      {
        name: 'nostr-store',
        partialize: (state) =>
          Object.fromEntries(
            Object.entries(state).filter(
              ([key]) => !['relayList'].includes(key),
            ),
          ),
      },
    ),
  ),
);
