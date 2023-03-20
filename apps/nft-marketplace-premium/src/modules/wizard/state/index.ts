import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { AppCollection } from '../../../types/config';

export const collectionAtom = atom<AppCollection | undefined>(undefined);

export const isFirstVisitOnEditWizardAtom = atomWithStorage<boolean>('isFirstVisitOnEditWizard', true);

export interface CustomThemeInterface {
  typography?: any;
  palette?: {
    mode?: 'dark' | 'light';
    background?: {
      default: string
    };
    text?: {
      primary: string
    };
    primary?: {
      main: string
    };
    secondary?: {
      main: string
    }
  }
}


export const customThemeAtom = atom<CustomThemeInterface | undefined>({
  typography: {},
  palette: {
    mode: 'light',
    background: {
      default: '#fff',
    },
    text: {
      primary: '#000',
    },
    primary: {
      main: '#bfc500',
    },
    secondary: {
      main: '#f44336',
    },
  }
});
