import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface QuestionList {
  content: string;
  a: string;
}

interface QuestionState {
  list: QuestionList[];
  setList: (list: QuestionList[]) => void;
}

export const useQuestionStore = create<QuestionState>()(
  devtools((set, get) => ({
    list: [],
    setList: async (list) => {
      set({ list });
    },
  })),
);
