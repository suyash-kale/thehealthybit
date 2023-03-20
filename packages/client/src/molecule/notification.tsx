import { FC, useCallback } from 'react';
import { useRecoilValue } from 'recoil';
import { Stack, Snackbar, Alert } from '@mui/material';

import { NotificationType } from '../types/notification';
import { NotificationState } from '../state/notification';
import { useNotification } from '../hooks/use-notification';

export const Notification: FC = () => {
  const notifications = useRecoilValue(NotificationState);

  const { removeNotification } = useNotification();

  const onClose = useCallback(
    (notification: NotificationType, reason?: string) => {
      if (reason === 'clickaway') {
        return;
      }
      // removing notification from store.
      removeNotification(notification.Id);
    },
    [removeNotification],
  );

  return (
    <Stack>
      {notifications.map((notification) => (
        <Snackbar
          key={notification.Id}
          autoHideDuration={4000}
          onClose={(_e, reason) => onClose(notification, reason)}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          open
        >
          <Alert severity={notification.severity}>{notification.message}</Alert>
        </Snackbar>
      ))}
    </Stack>
  );
};
