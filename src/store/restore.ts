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
  textPrivateData: string;
  passwordPrivateData: string;
  setQuestionList: (list: QuestionList[]) => void;
  setMnemonic: (e: string) => void;
  setType: (e: number) => void;
  setTextPrivateData: (e: string) => void;
  setPasswordPrivateData: (e: string) => void;
}

export const useRestoreStore = create<RestoreState>()(
  devtools((set) => ({
    questionList: [],
    type: 1,
    mnemonic: '',
    textPrivateData: '',
    passwordPrivateData: '',
    setQuestionList: (list) => {
      set({ questionList: list });
    },
    setMnemonic: (mnemonic) => {
      set({ mnemonic });
    },
    setType: (type) => {
      set({ type });
    },
    setTextPrivateData: (e) => {
      set({ textPrivateData: e });
    },
    setPasswordPrivateData: (e) => {
      set({ passwordPrivateData: e });
    },
  })),
);
