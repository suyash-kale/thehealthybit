import { useCallback } from 'react';
import { useIntl } from 'react-intl';
import { useSetRecoilState } from 'recoil';

import { NotificationType } from '../types/notification';
import { NotificationState } from '../state/notification';
import { generateRandomNumber } from '../utility/generate-random-number';

interface UseNotificationReturn {
  addNotification: (
    data: Omit<NotificationType, 'Id'>,
  ) => NotificationType['Id'];
  removeNotification: (Id: NotificationType['Id']) => void;
}

// handling application notification.
export const useNotification = (): UseNotificationReturn => {
  const { formatMessage } = useIntl();

  const setNotification = useSetRecoilState(NotificationState);

  // add notification.
  const addNotification = useCallback(
    (data: Omit<NotificationType, 'Id'>): number => {
      const Id = generateRandomNumber();
      setNotification((prev) => {
        return [
          ...prev,
          {
            ...data,
            Id,
            message: formatMessage({ id: data.message }, data.variables),
          },
        ];
      });
      return Id;
    },
    [],
  );

  // remove notification.
  const removeNotification = useCallback((Id: NotificationType['Id']) => {
    setNotification((prev) => prev.filter((item) => item.Id !== Id));
  }, []);

  return { addNotification, removeNotification };
};
