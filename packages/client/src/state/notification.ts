import { atom } from 'recoil';

import { NotificationType } from '../types/notification';

export const NotificationState = atom<Array<NotificationType>>({
  key: 'NotificationState',
  default: [],
});
