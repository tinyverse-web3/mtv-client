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
  mnemonicType: 'file' | 'text';
  mnemonicFile?: File;
  textPrivateData: string;
  passwordPrivateData: string;
  customPrivateData: string;
  setQuestionList: (list: QuestionList[]) => void;
  setMnemonic: (e: string) => void;
  setMnemonicFile: (e: File) => void;
  setType: (e: number) => void;
  setTextPrivateData: (e: string) => void;
  setCustomPrivateData: (e: string) => void;
  setPasswordPrivateData: (e: string) => void;
  reset: () => void;
}

export const useRestoreStore = create<RestoreState>()(
  devtools((set) => ({
    questionList: [],
    type: 1,
    mnemonic: '',
    textPrivateData: '',
    mnemonicFile: undefined,
    mnemonicType: 'file',
    passwordPrivateData: '',
    customPrivateData: '',
    setQuestionList: (list) => {
      set({ questionList: list });
    },
    setMnemonic: (mnemonic) => {
      set({ mnemonic, mnemonicType: 'text' });
    },
    setMnemonicFile: (file) => {
      set({ mnemonicFile: file, mnemonicType: 'file' });
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
    setCustomPrivateData: (e) => {
      set({ customPrivateData: e });
    },
    reset: () => {
      set({
        questionList: [],
        type: 1,
        mnemonic: '',
        mnemonicFile: undefined,
        mnemonicType: 'file',
        textPrivateData: '',
        passwordPrivateData: '',
        customPrivateData: '',
      });
    },
  })),
);
