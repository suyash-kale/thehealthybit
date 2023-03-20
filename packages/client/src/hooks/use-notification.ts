import { useCallback } from 'react';
import { useSetRecoilState } from 'recoil';

import { NotificationType } from '../types/notification';
import { NotificationState } from '../state/notification';
import generateRandomNumber from '../utility/generate-random-number';

interface UseNotificationReturn {
  addNotification: (
    data: Omit<NotificationType, 'Id'>,
  ) => NotificationType['Id'];
  removeNotification: (Id: NotificationType['Id']) => void;
}

export const useNotification = (): UseNotificationReturn => {
  const setNotification = useSetRecoilState(NotificationState);

  const addNotification = useCallback(
    (data: Omit<NotificationType, 'Id'>): number => {
      const Id = generateRandomNumber();
      setNotification((prev) => {
        return [...prev, { Id, ...data }];
      });
      return Id;
    },
    [],
  );

  const removeNotification = useCallback((Id: NotificationType['Id']) => {
    setNotification((prev) => prev.filter((item) => item.Id !== Id));
  }, []);

  return { addNotification, removeNotification };
};
