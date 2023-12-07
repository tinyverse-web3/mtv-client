import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import account from '@/lib/account/account';
interface AccountInfo {
  publicKey: string;
  avatar: string;
  name: string;
  address: string;
  messageKey: string;
  passwordPrivateData: string;
  textPrivateData: string;
  customPrivateData: string;
  safeLevel: number;
  isDefaultPwd: boolean;
  bindStatus: boolean;
  hasGoogleAccount: boolean;
  maintainPhrase: boolean;
  maintainProtector: boolean;
  maintainQuestion: boolean;
  hasFeatureData: boolean;
  isBackupMnemonic: boolean;
  hasGuardian: boolean;
  hasPrivacy: boolean;
  hasPrivacyByVault: boolean;
  hasGuardianByVault: boolean;
  isBackupQuestion: boolean;
  privacyInfo: any;
  note_ipfs: string;
  pointAccount: any;
  subAccount: any[];
  guardians: any[];
}
interface AccountState {
  // account: Account;
  accountInfo: AccountInfo;
  web3AccountSelect: string;
  setWeb3Select: (v: string) => void;
  getLocalAccountInfo: () => void;
  delAccount: () => void;
  setAccountInfo: (v: any) => void;
}

export const useAccountStore = create<AccountState>()(
  devtools(
    persist(
      (set, get) => ({
        
        accountInfo: {
          publicKey: '',
          avatar: '',
          name: '',
          address: '',
          messageKey: '',
          passwordPrivateData: '',
          textPrivateData: '',
          customPrivateData: '',
          safeLevel: 0,
          isDefaultPwd: true,
          bindStatus: false,
          hasGoogleAccount: false,
          maintainPhrase: false,
          maintainProtector: false,
          maintainQuestion: false,
          hasFeatureData: false,
          isBackupMnemonic: false,
          hasGuardian: false,
          hasPrivacy: false,
          hasPrivacyByVault: false,
          hasGuardianByVault: false,
          isBackupQuestion: false,
          privacyInfo: {},
          note_ipfs: '',
          subAccount: [],
          guardians: [],
          pointAccount: {},
        },
        web3AccountSelect: '',
        setWeb3Select: (v: string) => set({ web3AccountSelect: v }),
        getLocalAccountInfo: async () => {
          const localInfo = await account.getAccountInfo();
          let { accountInfo } = get();
          accountInfo = Object.assign(accountInfo, {
            publicKey: localInfo.PublicKey,
            name: localInfo.Name,
            address: localInfo.Address,
            messageKey: localInfo.MessageKey,
            passwordPrivateData: localInfo.PasswordPrivateData || '',
            textPrivateData: localInfo.TextPrivateData || '',
            customPrivateData: localInfo.CustomPrivateData || '',
            hasFeatureData: localInfo.IsSetVault || false,
            isBackupMnemonic: !!localInfo?.IsGenerateMnemonic || false,
            isBackupQuestion:
              !!localInfo?.CustomQuestionSets?.length ||
              !!localInfo?.StandardQuestionSets?.length ||
              false,
            hasGuardian: !!localInfo.HasGuardian || false,
            hasGoogleAccount: !!localInfo.HasGoogleAccount || false,
            hasGuardianByVault: !!localInfo.HasGuardianByVault || false,
            hasPrivacy: !!localInfo.HasPrivacy || false,
            hasPrivacyByVault: !!localInfo.HasPrivacyByVault || false,
            guardians: localInfo.Guardians || [],
            bindStatus: !!localInfo.Guardians?.length,
            avatar: localInfo.Avatar,
            isDefaultPwd: !localInfo.IsChangedPassword,
            safeLevel: localInfo.SafeLevel || 0,
          });
          set({ accountInfo });
        },
        setAccountInfo: (data: any) => {
          let { accountInfo } = get();
          set({ accountInfo: { ...accountInfo, ...data } });
        },
        delAccount: async () => {
          set({
            accountInfo: {
              publicKey: '',
              avatar: '',
              name: '',
              address: '',
              messageKey: '',
              passwordPrivateData: '',
              textPrivateData: '',
              customPrivateData: '',
              safeLevel: 0,
              isDefaultPwd: true,
              bindStatus: false,
              hasGoogleAccount: false,
              maintainPhrase: false,
              maintainProtector: false,
              maintainQuestion: false,
              hasFeatureData: false,
              isBackupMnemonic: false,
              isBackupQuestion: false,
              hasGuardian: false,
              hasPrivacy: false,
              hasPrivacyByVault: false,
              hasGuardianByVault: false,
              privacyInfo: {},
              note_ipfs: '',
              subAccount: [],
              guardians: [],
              pointAccount: {},
            },
          });
        },
      }),
      {
        name: 'account-store',
        partialize: (state) =>
          Object.fromEntries(
            Object.entries(state).filter(([key]) =>
              ['web3AccountSelect'].includes(key),
            ),
          ),
      },
    ),
  ),
);
