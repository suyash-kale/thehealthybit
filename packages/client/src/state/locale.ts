import { atom } from 'recoil';

import { Locale } from '../types/locale';

export let locale = Locale.English;

export const LocaleState = atom<Locale>({
  key: 'LocaleState',
  default: locale,
  effects: [
    ({ onSet }) => {
      onSet((l) => {
        locale = l;
      });
    },
  ],
});
