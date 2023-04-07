import { atom } from 'recoil';

import { UserType } from '../types/user';

export const UserState = atom<null | UserType>({
  key: 'UserState',
  default: null,
});
