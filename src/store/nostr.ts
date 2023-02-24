import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { remove, cloneDeep } from 'lodash';

interface NostrList {
  pk: string;
  email: string;
}
interface Recipient {
  pk: string;
  email: string;
  // sk: string;
}
interface Relay {
  wss: string;
}
interface GlobalState {
  list: NostrList[];
  relayList: Relay[];
  add: (friend: NostrList) => void;
  initRelayList: (list: Relay[]) => void;
  recipient?: Recipient;
  setRecipient: (r: Recipient) => void;
}

export const useNostrStore = create<GlobalState>()(
  devtools(
    persist(
      (set, get) => ({
        list: [],
        Recipient: undefined,
        relayList: [],
        initRelayList: async (list) => {
          set({ relayList: list });
        },
        add: async (n) => {
          const list = get().list;
          list.push(n);
          set({ list });
        },
        setRecipient: async (n) => {
          set({ recipient: n });
        },
      }),
      {
        name: 'nostr-store',
      },
    ),
  ),
);
// useNostrStore.subscribe((state) => {
//   console.log(state.list.length);
// });
