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

interface RestoreState {
  questionList: QuestionList[];
  type: number;
  mnemonic: string;
  setQuestionList: (list: QuestionList[]) => void;
  setMnemonic: (e: string) => void;
  setType: (e: number) => void;
}

export const useRestoreStore = create<RestoreState>()(
  devtools((set) => ({
    questionList: [],
    type: 1,
    mnemonic: '',
    setQuestionList: (list) => {
      set({ questionList: list });
    },
    setMnemonic: (mnemonic) => {
      set({ mnemonic });
    },
    setType: (type) => {
      set({ type });
    },
  })),
);
