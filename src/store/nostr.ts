import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { remove, cloneDeep } from 'lodash';

interface NostrList {
  pk: string;
  time: Date | number;
}
interface Recipient {
  pk: string;
  // email: string;
  // sk: string;
}
interface Relay {
  wss: string;
}
interface GlobalState {
  list: NostrList[];
  relayList: Relay[];
  add: (friend: { pk: string }) => void;
  remove: (pk: string) => void;
  initRelayList: (list: Relay[]) => void;
  recipient?: Recipient;
  setRecipient: (r: Recipient) => void;
  reset: () => void;
}

export const useNostrStore = create<GlobalState>()(
  devtools(
    persist(
      (set, get) => ({
        list: [],
        recipient: undefined,
        relayList: [],
        initRelayList: async (list) => {
          set({ relayList: list });
        },
        add: async (n) => {
          const list = cloneDeep(get().list);
          if (!list.find((s) => s.pk === n.pk)) {
            list.push({ ...n, time: +new Date() });
            set({ list });
          }
        },
        remove: async (pk) => {
          const list = cloneDeep(get().list);
          remove(list, (i) => i.pk === pk);
          set({ list });
        },
        setRecipient: async (n) => {
          set({ recipient: n });
        },
        reset: () => {
          set({
            list: [],
            recipient: undefined,
            relayList: [],
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
// useNostrStore.subscribe((state) => {
//   console.log(state.list.length);
// });
