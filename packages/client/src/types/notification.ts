import { AlertColor } from '@mui/material';

export interface NotificationType {
  Id: number;
  severity: AlertColor;
  message: string;
}
