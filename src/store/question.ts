import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface QuestionItem {
  q: string;
  a: string;
  l: number;
}
interface QuestionList {
  list: QuestionItem[];
  title?: string;
}

interface QuestionState {
  sssData: string;
  list: QuestionList[];
  type: number;
  publicKey: string;
  setList: (list: QuestionList[]) => void;
  setPublicKey: (e: string) => void;
  setType: (e: number) => void;
  setSssData: (e: string) => void;
}

export const useQuestionStore = create<QuestionState>()(
  devtools((set) => ({
    list: [],
    sssData: '',
    type: 1,
    publicKey: '',
    setList: (list) => {
      set({ list });
    },
    setPublicKey: (publicKey) => {
      set({ publicKey });
    },
    setType: (type) => {
      set({ type });
    },
    setSssData: (sssData) => {
      set({ sssData });
    },
  })),
);
