import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { remove, cloneDeep } from 'lodash';
import account from '@/lib/account/account';

interface Contact {
  Alias: string;
  Address: string;
  CreateTime: number;
  DAuthKey: string;
  GUNName: string;
  LastMessage: string;
  LastMsgTime: number;
  MessageKey: string;
}

interface Recipinet {
  Alias?: string;
  Address?: string;
  GUNName?: string;
  CreateTime?: number;
  DAuthKey?: string;
  LastMessage?: string;
  LastMsgTime?: number;
  MessageKey?: string;
}
interface ChatState {
  contacts: Contact[];
  recipient?: Recipinet;
  getContacts: () => void;
  remove: (MessageKey: string) => void;
  setRecipient: (r: Recipinet) => void;
  reset: () => void;
}

export const useChatStore = create<ChatState>()(
  devtools(
    persist(
      (set, get) => ({
        contacts: [],
        recipient: undefined,
        remove: async (MessageKey) => {
          const list = cloneDeep(get().contacts);
          remove(list, (i) => i.MessageKey === MessageKey);
          set({ contacts: list });
        },
        getContacts: async () => {
          const { code, data } = await account.getContacts();
          if (code === '000000') {
            set({ contacts: data || [] });
          }
        },
        setRecipient: async (n) => {
          set({ recipient: n });
        },

        reset: () => {
          set({
            contacts: [],
            recipient: undefined,
          });
        },
      }),
      {
        name: 'chat-storage',
      },
    ),
  ),
);
